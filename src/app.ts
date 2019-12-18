import fs from 'fs'
import path from 'path'
import Factory from './factory'
import config from './config'
import { Specification } from './model'

const loadResult = config.load()

if (!loadResult) {
  throw new Error('Models directory does not exist')
}

export const factory = new Factory()

fs.readdirSync(config.modelsDir)
  .filter(file => {
    return file.indexOf('.') !== 0 && file.slice(-3) === '.js'
  })
  .forEach(file => {
    const { name, specification, creator } = require(path.join(
      config.modelsDir,
      file
    ))

    factory.addModel(
      <string>name,
      <Specification>specification,
      <Function>creator
    )
  })
