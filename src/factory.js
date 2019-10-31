class Factory {
  static get ASYNC_FUNCTION_NAME() {
    return 'AsyncFunction';
  }

  static get PLAIN_FUNCTION_NAME() {
    return 'Function';
  }

  constructor() {
    this.models = {};
  }

  addModel(name, specification, creator) {
    this.models[name] = {
      specification,
      creator
    };
  }

  async create(modelName, inputAttributes = {}) {
    const model = this.models[modelName];

    if (!model) {
      return;
    }

    if (model.sequences === undefined) {
      model.sequences = {};
    }

    // Remove all empty inputAttributes
    Object.keys(inputAttributes).forEach((key) => inputAttributes[key] === undefined && delete inputAttributes[key]);

    for (const attributeKey of Object.keys(model.specification)) {
      const attributeSpec = model.specification[attributeKey];
      const input = inputAttributes[attributeKey];
      let generatedValue = null;
      let newAttributeName = null;

      // Guards
      if (!attributeSpec) { continue; }
      if (
        input === undefined &&
        (attributeSpec.defaultValue === undefined || attributeSpec.defaultValue === null)
      ) { continue; }

      if (attributeSpec.attributeName) {
        newAttributeName = attributeSpec.attributeName;
      }

      if (input) {
        generatedValue = input;
      }

      // 1. Assign defaultValue to generatedValue when input is not given and defaultValue is given
      if (input === undefined) {
        if (this._isFunction(attributeSpec.defaultValue)) {
          model.sequences[attributeKey] = model.sequences[attributeKey] || 0;
          generatedValue = await this._doAsyncOrPlainFunction(attributeSpec.defaultValue, model.sequences[attributeKey]);
          model.sequences[attributeKey] += 1;
        } else {
          generatedValue = attributeSpec.defaultValue;
        }
      }

      // 2. Transform generatedValue if transform function is exists
      if (attributeSpec.transform) {
        generatedValue = await this._doAsyncOrPlainFunction(attributeSpec.transform, generatedValue);
      }

      // 3. Assign generatedValue that is result of above to `inputAttributes`
      if (generatedValue) {
        if (newAttributeName) {
          inputAttributes[newAttributeName] = generatedValue;
        } else {
          inputAttributes[attributeKey] = generatedValue;
        }
      }
    }

    // Now call creator function with inputAttributes as parameter and return it
    return await this._doAsyncOrPlainFunction(this.models[modelName].creator, inputAttributes);
  }

  async _doAsyncOrPlainFunction(func, ...params) {
    switch(func.constructor.name) {
      case Factory.ASYNC_FUNCTION_NAME:
        return await func(...params);
      case Factory.PLAIN_FUNCTION_NAME:
        return func(...params);
      default:
        return undefined;
    }
  }

  _isFunction(param) {
    return param.constructor.name === Factory.ASYNC_FUNCTION_NAME ||
      param.constructor.name === Factory.PLAIN_FUNCTION_NAME;
  }
}

module.exports = Factory;