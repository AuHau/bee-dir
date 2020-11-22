/* eslint-disable dot-notation */
import chai from 'chai'
import * as path from 'path'
import { Collection } from '@ethersphere/bee-js'

import cmd from '../src/index'

const expect = chai.expect
const TEST_DIR_PATH = path.join(__dirname, 'test-directory')
const BEE_URL = process.env.BEE_URL || 'http://localhost:8080'

describe('index.ts', function () {
  it('should run', async () => {
    const reference = await cmd.run([TEST_DIR_PATH])

    const file1 = await Collection.download(BEE_URL, reference, 'file1.txt')
    expect(file1.toString()).to.equal('Hello world\n')

    const file2 = await Collection.download(BEE_URL, reference, 'file2.txt')
    expect(file2.toString()).to.equal('Good bye world!\n')

    const image = await Collection.download(BEE_URL, reference, 'big-image.jpg')
    expect(image.length).to.equal(534159)

    try {
      await Collection.download(BEE_URL, reference, 'nested-dir/file3.txt')
      expect.fail('Nested Dir should be ignored without --recursive!')
    } catch (e) {
      if (e.status === 404) {
        // all good, does not exist
      } else {
        throw e
      }
    }
  })
  it('should run with --recursive', async () => {
    const reference = await cmd.run(['--recursive', TEST_DIR_PATH])

    const file1 = await Collection.download(BEE_URL, reference, 'file1.txt')
    expect(file1.toString()).to.equal('Hello world\n')

    const file2 = await Collection.download(BEE_URL, reference, 'file2.txt')
    expect(file2.toString()).to.equal('Good bye world!\n')

    const image = await Collection.download(BEE_URL, reference, 'big-image.jpg')
    expect(image.length).to.equal(534159)

    const file3 = await Collection.download(BEE_URL, reference, 'nested-dir/file3.txt')
    expect(file3.toString()).to.equal('Well no, I am back!\n')
  })

  it('should fail when verification fails', async () => {
    // TODO: Write this, would have to mock the Collection in order to return different files.
  })
})
