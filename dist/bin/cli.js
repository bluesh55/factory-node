#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_1 = require("../src/configuration");
var generator_1 = require("../src/generator");
function help() {
    console.log('Usage: factory [command] [options]\n');
    console.log('[Commands]');
    console.log('   init            : create factory config file');
    console.log('   init:loader     : create factory loader file');
    console.log('     --typescript  : use the loader written in typescript');
}
var command = process.argv[2];
var options = process.argv.slice(3);
switch (command) {
    case 'init': {
        var createdDir = generator_1.generator.createConfigFile();
        console.log("Configuration file was created at " + createdDir + "! \uD83D\uDE0E");
        break;
    }
    case 'init:loader': {
        var isTypescript = options.includes('--typescript');
        configuration_1.configuration.load();
        var createdDir = generator_1.generator.createLoaderFile(configuration_1.configuration.loaderDir, isTypescript);
        console.log("Loader file was created at " + createdDir + "! \uD83D\uDE0E");
        break;
    }
    default: {
        help();
    }
}
