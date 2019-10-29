class Factory {
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

    // Remove empty attributes
    Object.keys(attributes).forEach((key) => attributes[key] === undefined && delete attributes[key]);

    for (const attributeName of Object.keys(model.attributesSpec)) {
      const spec = model.attributesSpec[attributeName];
      const input = attributes[attributeName];
      let generatedValue = null;
      let newAttributeName = null;

      if (!spec) {
        continue;
      }

      if (spec.attributeName) {
        newAttributeName = spec.attributeName;
      }

      if (input !== undefined) {
        if (spec.creator) {
          generatedValue = await spec.creator(input);
        } else {
          generatedValue = input;
        }
      } else {
        if (spec.defaultValue === undefined || spec.defaultValue === null) {
          continue;
        }

        if (spec.defaultValue.constructor.name === 'AsyncFunction') {
          if (model.sequences[attributeName] === undefined) {
            model.sequences[attributeName] = 0;
          }

          const sequenceNumber = model.sequences[attributeName];
          generatedValue = await spec.defaultValue(sequenceNumber);
          model.sequences[attributeName] += 1;
        } else {
          generatedValue = spec.defaultValue;
        }

        if (spec.creator) {
          generatedValue = await spec.creator(generatedValue);
        }
      }

      if (generatedValue) {
        if (newAttributeName) {
          attributes[newAttributeName] = generatedValue;
        } else {
          attributes[attributeName] = generatedValue;
        }
      }
    }

    return await this.models[modelName].creator(attributes);
  }
}

module.exports = Factory;
