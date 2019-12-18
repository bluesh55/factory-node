import fs from 'fs'
import path from 'path'
import Factory from './factory'
import config from './config'
import { Specification } from './model'

config.load()

export const factory = new Factory()

fs.readdirSync(config.modelsDir)
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

    const modelFilePath = path.join(config.modelsDir, file)
    model = require(modelFilePath)
    factory.addModel(model.name!, model.specification!, model.creator!)
  })
