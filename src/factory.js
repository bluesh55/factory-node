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

  addModel(name, attributesSpec, creator) {
    this.models[name] = {
      attributesSpec,
      creator
    };
  }

  async create(modelName, attributes = {}) {
    const model = this.models[modelName];

    if (!model) {
      return;
    }

    if (model.sequences === undefined) {
      model.sequences = {};
    }

    // Remove all empty attributes
    Object.keys(attributes).forEach((key) => attributes[key] === undefined && delete attributes[key]);

    for (const attributeKey of Object.keys(model.attributesSpec)) {
      const spec = model.attributesSpec[attributeKey];
      const input = attributes[attributeKey];
      let generatedValue = null;
      let newAttributeName = null;

      // Guards
      if (!spec) { continue; }
      if (
        input === undefined &&
        (spec.defaultValue === undefined || spec.defaultValue === null)
      ) { continue; }

      if (spec.attributeName) {
        newAttributeName = spec.attributeName;
      }

      if (input) {
        generatedValue = input;
      }

      // 1. Assign defaultValue to generatedValue when input is not given and defaultValue is given
      if (input === undefined) {
        if (this._isFunction(spec.defaultValue)) {
          model.sequences[attributeKey] = model.sequences[attributeKey] || 0;
          generatedValue = await this._doAsyncOrPlainFunction(spec.defaultValue, model.sequences[attributeKey]);
          model.sequences[attributeKey] += 1;
        } else {
          generatedValue = spec.defaultValue;
        }
      }

      // 2. Transform generatedValue if transform function is exists
      if (spec.transform) {
        generatedValue = await this._doAsyncOrPlainFunction(spec.transform, generatedValue);
      }

      // 3. Assign generatedValue that is result of above to `attributes`
      if (generatedValue) {
        if (newAttributeName) {
          attributes[newAttributeName] = generatedValue;
        } else {
          attributes[attributeKey] = generatedValue;
        }
      }
    }

    // Now call creator function with attributes as parameter and return it
    return await this._doAsyncOrPlainFunction(this.models[modelName].creator, attributes);
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
