"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var typescriptLoader = "\nimport fs from 'fs'\nimport path from 'path'\nimport { factory, config, Specification } from '@bluesh55/factory'\n\nconfig.load()\n\nfs.readdirSync(config.modelsDir)\n  .filter((file: string) => {\n    const extension = file.slice(-3)\n    return file.indexOf('.') !== 0 && ['.js', '.ts'].includes(extension)\n  })\n  .forEach((file: string) => {\n    let model: {\n      name?: string\n      specification?: Specification\n      creator?: Function\n    } = {}\n\n    const modelFilePath = path.join(config.modelsDir, file)\n    model = require(modelFilePath)\n    factory.addModel(model.name!, model.specification!, model.creator!)\n  })\n";
var javascriptLoader = "\nconst fs = require('fs')\nconst path = require('path')\nconst { factory, config } = require('@bluesh55/factory')\n\nconfig.load()\n\nfs.readdirSync(config.modelsDir)\n  .filter(file => {\n    const extension = file.slice(-3)\n    return file.indexOf('.') !== 0 && ['.js'].includes(extension)\n  })\n  .forEach(file => {\n    let model = {}\n    const modelFilePath = path.join(config.modelsDir, file)\n    model = require(modelFilePath)\n    factory.addModel(model.name, model.specification, model.creator)\n  })\n";
var Configuration = /** @class */ (function () {
    function Configuration() {
        this.configFileName = '.factoryrc.json';
        this.configTemplate = "{\n  \"modelsDir\": \"./tests/factories/\"\n}";
        this.modelsDir = '';
    }
    Configuration.prototype.initializeConfigFile = function () {
        var filePath = path_1.default.resolve('.', this.configFileName);
        var absoluteDir = path_1.default.dirname(filePath);
        fs_1.default.writeFileSync(filePath, this.configTemplate, 'utf8');
        return absoluteDir;
    };
    Configuration.prototype.initializeLoader = function (isTypescript) {
        var absoluteDir = '';
        return absoluteDir;
    };
    Configuration.prototype.load = function () {
        var isModelsDirLoaded = this.loadModelsDir();
        if (!isModelsDirLoaded) {
            throw new Error('Models directory does not exist');
        }
        return true;
    };
    Configuration.prototype.loadModelsDir = function (basePath) {
        if (basePath === void 0) { basePath = ['.']; }
        var filePath = path_1.default.resolve.apply(path_1.default, __spreadArrays(basePath, [this.configFileName]));
        if (fs_1.default.existsSync(filePath)) {
            var config_1 = JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
            var modelsDir = path_1.default.resolve.apply(path_1.default, __spreadArrays(basePath, [config_1.modelsDir]));
            this.modelsDir = modelsDir;
            return true;
        }
        else {
            if (filePath === path_1.default.resolve('/', this.configFileName)) {
                return false;
            }
            else {
                this.loadModelsDir(__spreadArrays(basePath, ['..']));
            }
        }
    };
    return Configuration;
}());
exports.config = new Configuration();
