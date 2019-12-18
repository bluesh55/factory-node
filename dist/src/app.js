"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var factory_1 = __importDefault(require("./factory"));
var config_1 = __importDefault(require("./config"));
config_1.default.load();
exports.factory = new factory_1.default();
fs_1.default.readdirSync(config_1.default.modelsDir)
    .filter(function (file) {
    var extension = file.slice(-3);
    return file.indexOf('.') !== 0 && ['.js', '.ts'].includes(extension);
})
    .forEach(function (file) {
    var model = {};
    var modelFilePath = path_1.default.join(config_1.default.modelsDir, file);
    model = require(modelFilePath);
    exports.factory.addModel(model.name, model.specification, model.creator);
});
