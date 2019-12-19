import fs from 'fs'
import path from 'path'
import { configuration } from './configuration'

const typescriptLoader = `
import fs from 'fs'
import path from 'path'
import { factory, configuration, Specification } from '@bluesh55/factory'

configuration.load()

fs.readdirSync(configuration.modelsDir)
  .filter((file: string) => {
    const extension = file.slice(-3)
    return file.indexOf('.') !== 0 && ['.js', '.ts'].includes(extension)
  })
  .forEach((file: string) => {
    let model: {
      name?: string
      specification?: Specification
      creator?: Function
    } = {}

    const modelFilePath = path.join(configuration.modelsDir, file)
    model = require(modelFilePath).default
    factory.addModel(model.name!, model.specification!, model.creator!)
  })
`

const javascriptLoader = `
const fs = require('fs')
const path = require('path')
const { factory, configuration } = require('@bluesh55/factory')

configuration.load()

fs.readdirSync(configuration.modelsDir)
  .filter(file => {
    const extension = file.slice(-3)
    return file.indexOf('.') !== 0 && ['.js'].includes(extension)
  })
  .forEach(file => {
    let model = {}
    const modelFilePath = path.join(configuration.modelsDir, file)
    model = require(modelFilePath)
    factory.addModel(model.name, model.specification, model.creator)
  })
`

class Generator {
  public loaderFileNameWithoutExtension: string

  constructor() {
    this.loaderFileNameWithoutExtension = 'factoryLoader'
  }

  createConfigFile(): string {
    const filePath = path.resolve('.', configuration.configFileName)
    const absoluteDir = path.dirname(filePath)
    const template = JSON.stringify(configuration.defaultConfig, null, 2)
    fs.writeFileSync(filePath, template, 'utf8')
    return absoluteDir
  }

  createLoaderFile(loaderDir: string, isTypescript: boolean): string {
    const filePath = path.resolve(
      loaderDir,
      this.getLoaderFileName(isTypescript)
    )
    const absoluteDir = path.dirname(filePath)
    const template = isTypescript ? typescriptLoader : javascriptLoader

    if (!fs.existsSync(absoluteDir)) {
      fs.mkdirSync(absoluteDir)
    }

    fs.writeFileSync(filePath, template, 'utf8')
    return absoluteDir
  }

  private getLoaderFileName(isTypescript: boolean): string {
    return isTypescript
      ? `${this.loaderFileNameWithoutExtension}.ts`
      : `${this.loaderFileNameWithoutExtension}.js`
  }
}

export const generator = new Generator()
