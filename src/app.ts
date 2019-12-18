import fs from 'fs'
import path from 'path'
import Factory from './factory'
import config from './config'
import { Specification } from './model'
import * as ts from 'typescript'
const _eval = require('node-eval')

const loadResult = config.load()

if (!loadResult) {
  throw new Error('Models directory does not exist')
}

export const factory = new Factory()

fs.readdirSync(config.modelsDir)
  .filter(file => {
    const extension = file.slice(-3)
    return file.indexOf('.') !== 0 && ['.js', '.ts'].includes(extension)
  })
  .forEach(async file => {
    const extension = file.slice(-3)

    let model: {
      name?: string
      specification?: Specification
      creator?: Function
    } = {}

    const modelFilePath = path.join(config.modelsDir, file)

    if (extension === '.js') {
      model = require(modelFilePath)
    } else if (extension === '.ts') {
      const tsFileContent = fs.readFileSync(modelFilePath, { encoding: 'utf8' })
      const jsFileContent = ts.transpileModule(tsFileContent, {
        compilerOptions: { module: ts.ModuleKind.CommonJS },
      })
      const modelModule = _eval(jsFileContent.outputText)
      model = modelModule.default
    }

    factory.addModel(model.name!, model.specification!, model.creator!)
  })
