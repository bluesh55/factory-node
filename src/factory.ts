import { ModelStorage, Model, Specification, Attribute } from './model'

type AnyObject = {
  [index: string]: any
}

export class Factory {
  static get ASYNC_FUNCTION_NAME() {
    return 'AsyncFunction'
  }

  static get PLAIN_FUNCTION_NAME() {
    return 'Function'
  }

  public models: ModelStorage

  constructor() {
    this.models = {}
  }

  addModel(name: string, specification: Specification, creator: Function) {
    this.models[name] = {
      specification,
      creator,
    }
  }

  async create(modelName: string, attrs?: AnyObject) {
    const model = this.models[modelName]
    const inputAttributes = attrs || {}

    if (!model) {
      return
    }

    if (model.sequences === undefined) {
      model.sequences = {}
    }

    // Remove all empty inputAttributes
    Object.keys(inputAttributes).forEach(
      key => inputAttributes[key] === undefined && delete inputAttributes[key]
    )

    for (const attributeKey of Object.keys(model.specification)) {
      const attributeSpec: Attribute = model.specification[attributeKey]
      const hasInput = Object.keys(inputAttributes).includes(attributeKey)
      const input = inputAttributes[attributeKey]
      let generatedValue: any | null = null
      let newAttributeName: string | null = null

      // Guards
      if (!attributeSpec) {
        continue
      }

      if (attributeSpec.attributeName) {
        newAttributeName = attributeSpec.attributeName
      }

      // 1. Assign input or defaultValue to generatedValue
      if (hasInput) {
        // when input is given
        generatedValue = input
      } else {
        // when input is not given
        if (this._isFunction(attributeSpec.defaultValue)) {
          model.sequences[attributeKey] = model.sequences[attributeKey] || 0
          generatedValue = await this._doAsyncOrPlainFunction(
            attributeSpec.defaultValue,
            model.sequences[attributeKey]
          )
          model.sequences[attributeKey] += 1
        } else {
          generatedValue = attributeSpec.defaultValue
        }
      }

      // 2. Transform generatedValue if transform function is exists
      if (attributeSpec.transform) {
        generatedValue = await this._doAsyncOrPlainFunction(
          attributeSpec.transform,
          generatedValue
        )
      }

      // 3. Assign generatedValue that is result of above to `inputAttributes`
      if (newAttributeName) {
        inputAttributes[newAttributeName] = generatedValue
      } else {
        inputAttributes[attributeKey] = generatedValue
      }
    }

    // Now call creator function with inputAttributes as parameter and return it
    return await this._doAsyncOrPlainFunction(
      this.models[modelName].creator,
      inputAttributes
    )
  }

  async _doAsyncOrPlainFunction(func: Function, ...params: any[]) {
    switch (func.constructor.name) {
      case Factory.ASYNC_FUNCTION_NAME:
        return await func(...params)
      case Factory.PLAIN_FUNCTION_NAME:
        return func(...params)
      default:
        return undefined
    }
  }

  _isFunction(param: any) {
    if (param === undefined || param === null) {
      return false
    }

    return (
      param.constructor.name === Factory.ASYNC_FUNCTION_NAME ||
      param.constructor.name === Factory.PLAIN_FUNCTION_NAME
    )
  }
}

export const factory = new Factory()
