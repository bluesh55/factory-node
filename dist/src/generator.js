"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var configuration_1 = require("./configuration");
var typescriptLoader = "\nimport fs from 'fs'\nimport path from 'path'\nimport { factory, configuration, Specification } from '@bluesh55/factory'\n\nconfiguration.load()\n\nfs.readdirSync(configuration.modelsDir)\n  .filter((file: string) => {\n    const extension = file.slice(-3)\n    return file.indexOf('.') !== 0 && ['.js', '.ts'].includes(extension)\n  })\n  .forEach((file: string) => {\n    let model: {\n      name?: string\n      specification?: Specification\n      creator?: Function\n    } = {}\n\n    const modelFilePath = path.join(configuration.modelsDir, file)\n    model = require(modelFilePath)\n    factory.addModel(model.name!, model.specification!, model.creator!)\n  })\n";
var javascriptLoader = "\nconst fs = require('fs')\nconst path = require('path')\nconst { factory, configuration } = require('@bluesh55/factory')\n\nconfiguration.load()\n\nfs.readdirSync(configuration.modelsDir)\n  .filter(file => {\n    const extension = file.slice(-3)\n    return file.indexOf('.') !== 0 && ['.js'].includes(extension)\n  })\n  .forEach(file => {\n    let model = {}\n    const modelFilePath = path.join(configuration.modelsDir, file)\n    model = require(modelFilePath)\n    factory.addModel(model.name, model.specification, model.creator)\n  })\n";
var Generator = /** @class */ (function () {
    function Generator() {
        this.loaderFileNameWithoutExtension = 'factoryLoader';
    }
    Generator.prototype.createConfigFile = function () {
        var filePath = path_1.default.resolve('.', configuration_1.configuration.configFileName);
        var absoluteDir = path_1.default.dirname(filePath);
        var template = JSON.stringify(configuration_1.configuration.defaultConfig, null, 2);
        fs_1.default.writeFileSync(filePath, template, 'utf8');
        return absoluteDir;
    };
    Generator.prototype.createLoaderFile = function (loaderDir, isTypescript) {
        var filePath = path_1.default.resolve(loaderDir, this.getLoaderFileName(isTypescript));
        var absoluteDir = path_1.default.dirname(filePath);
        var template = isTypescript ? typescriptLoader : javascriptLoader;
        if (!fs_1.default.existsSync(absoluteDir)) {
            fs_1.default.mkdirSync(absoluteDir);
        }
        fs_1.default.writeFileSync(filePath, template, 'utf8');
        return absoluteDir;
    };
    Generator.prototype.getLoaderFileName = function (isTypescript) {
        return isTypescript
            ? this.loaderFileNameWithoutExtension + ".ts"
            : this.loaderFileNameWithoutExtension + ".js";
    };
    return Generator;
}());
exports.generator = new Generator();
