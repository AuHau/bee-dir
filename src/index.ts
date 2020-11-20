import { Command, flags } from '@oclif/command'
import type { Input, OutputFlags } from '@oclif/parser'
import path from 'path'

export default class BeeDirCommand extends Command {
  static description = ``
  static examples = ['rif-pinning --offerId 0x123456789 --provider \'ws://localhost:8546\' --ipfs \'/ip4/127.0.0.1/tcp/5001\' --network testnet']

  static flags = {
  }

  async run () {
  }
}
