const fs = require('fs');
const path = require('path');

module.exports = {
  fileName: '.factoryrc.json',
  configTemplate: `{
  "modelsDir": "./tests/factories/"
}`,
  initialize: function() {
    const filePath = path.resolve('.', this.fileName);
    const absoluteDir = path.dirname(filePath);
    fs.writeFileSync(filePath, this.configTemplate, 'utf8');
    return absoluteDir;
  },
  load: function(basePath = ['.']) {
    const filePath = path.resolve(...basePath, this.fileName);
    if (fs.existsSync(filePath)) {
      const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const modelsDir = path.resolve(...basePath, config.modelsDir);
      this.modelsDir = modelsDir;
      return true;
    } else {
      if (filePath === path.resolve('/', this.fileName)) {
        return false;
      } else {
        this.load([...basePath, '..'])
      }
    }
  }
}
