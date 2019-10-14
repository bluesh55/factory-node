const fs = require('fs');
const path = require('path');
const fileName = '.factoryrc.json';
const configTemplate = `{
  "factoriesDir": "./tests/factories/"
}`;

module.exports = function() {
  const filePath = path.resolve('.', fileName);
  const absoluteDir = path.dirname(filePath);
  fs.writeFileSync(filePath, configTemplate, 'utf8');

  console.log(`Configuration file was created at ${absoluteDir}! 😎`);
}
