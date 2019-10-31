const fs = require('fs');
const path = require('path');
const Factory = require('./factory');
const Config = require('./config');
Config.load();

const factory = new Factory();
exports.factory = factory;

fs.
  readdirSync(Config.modelsDir).
  filter((file) => {
    return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js')
  }).
  forEach((file) => {
    const { name, specification, creator } = require(path.join(Config.modelsDir, file));

    factory.addModel(name, specification, creator);
  });

