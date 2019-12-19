#!/usr/bin/env node

import { configuration } from '../src/configuration'
import { generator } from '../src/generator'

function help() {
  console.log('Usage: factory [command] [options]\n')
  console.log('[Commands]')
  console.log('   init            : create factory config file')
  console.log('   init:loader     : create factory loader file')
  console.log('     --typescript  : use the loader written in typescript')
}

const command = process.argv[2]
const options: string[] = process.argv.slice(3)

switch (command) {
  case 'init': {
    const createdDir = generator.createConfigFile()
    console.log(`Configuration file was created at ${createdDir}! 😎`)
    break
  }
  case 'init:loader': {
    const isTypescript = options.includes('--typescript')
    configuration.load()
    const createdDir = generator.createLoaderFile(
      configuration.loaderDir,
      isTypescript
    )
    console.log(`Loader file was created at ${createdDir}! 😎`)
    break
  }
  default: {
    help()
  }
}
