import { Command, flags } from '@oclif/command'
import path from 'path'
import * as fs from 'fs'
import { Readable } from 'stream'
import { CollectionContainer, Collection } from '@ethersphere/bee-js'
import { cli } from 'cli-ux'

export default class BeeDirCommand extends Command {
  static description = `Uploads specified directory to Swarm and after that verify the files were correctly uploaded.
Verification is performed using comparing the sizes of the files.`

  static examples = []

  static flags = {
    bee: flags.string({
      char: 'b',
      description: 'URL pointing to running instance of Bee [env: BEE_URL]',
      env: 'BEE_URL',
      default: 'http://localhost:8080',
      required: true
    }),
    verify: flags.boolean({
      char: 'v',
      description: 'After finishing uploading the files all files are re-downloaded and verified',
      default: true
    }),
    recursive: flags.boolean({
      char: 'r',
      description: 'Determines if nested directories should be uploaded as well',
      default: false
    })
  }

  static args = [
    {
      name: 'dir',
      required: true,
      description: 'directory to upload'
    }
  ]

  async run () {
    const { args, flags } = this.parse(BeeDirCommand)
    const dirPath = path.resolve(args.dir)

    const collection = await this.buildCollection(dirPath, flags.recursive)

    // Makes the paths relative, only the first first match is removed
    let totalSize = 0
    let totalFiles = 0
    collection.forEach(entry => {
      entry.path = entry.path.replace(dirPath + '/', '')
      totalSize += entry.size as number // the collection is build with all files having size specified
      totalFiles += 1
    })

    if (!collection.length) {
      this.log('No files to upload. Maybe use --recursive?')
      this.exit(0)
    }

    this.log(`Uploading ${totalFiles} files with total size ${Math.round(totalSize / 1024 / 1024 * 100) / 100} MB`)
    cli.action.start('Uploading')
    const reference = await Collection.upload(flags.bee, collection)
    cli.action.stop(reference)

    if (flags.verify) {
      cli.action.start('Verifying')
      try {
        await this.verify(reference, collection, flags.bee)
      } catch (e) {
        this.error(e)
      }
      cli.action.stop()
    }

    return reference
  }

  /**
   * Iterates over the original collection and downloads every file and compares the sizes to verify the uploaded data.
   *
   * @param reference Uploaded Collection's reference
   * @param collection Original generated Collection
   * @param beeUrl URL of Bee node
   */
  private async verify (reference: string, collection: CollectionContainer<Readable>, beeUrl: string): Promise<void> {
    for (const entry of collection) {
      const buffer = await Collection.download(beeUrl, reference, entry.path)

      if (buffer.length !== entry.size) {
        this.error(`File ${entry.path} was corrupted! Got size ${buffer.length} and expected ${entry.size}`)
      }
    }
  }

  /**
   * Creates array in the format of CollectionContainer with Readable streams prepared for upload.
   *
   * @param dir absolute path to the directory
   * @param recursive flag that specifies if the directory should be recursively walked and get files in those directories.
   */
  private async buildCollection (dir: string, recursive = false): Promise<CollectionContainer<Readable>> {
    // Handles case when the dir is not existing or it is a file ==> throws an error
    const entries = await fs.promises.opendir(dir)
    let collection: CollectionContainer<Readable> = []

    for await (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isFile()) {
        collection.push({
          path: fullPath,
          size: (await fs.promises.stat(fullPath)).size,
          data: fs.createReadStream(fullPath)
        })
      } else if (entry.isDirectory() && recursive) {
        collection = [...await this.buildCollection(fullPath, recursive), ...collection]
      }
    }

    return collection
  }
}
