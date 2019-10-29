const Config = require('../config');

module.exports = function() {
  const initializedDir = Config.initialize();
  console.log(`Configuration file was created at ${initializedDir}! 😎`);
}
