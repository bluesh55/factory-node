#!/usr/bin/env node

const initCommand = require('../src/cli/init');

function help() {
  console.log('Usage: factory [command]\n');
  console.log('Commands');
  console.log('  - init: initialize factory config file');
}
const command = process.argv[2];

switch(command) {
  case 'init':
    initCommand();
    break;
  default:
    help();
}
