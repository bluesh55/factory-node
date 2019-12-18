"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var factory_1 = __importDefault(require("./factory"));
var config_1 = __importDefault(require("./config"));
var loadResult = config_1.default.load();
if (!loadResult) {
    throw new Error('Models directory does not exist');
}
exports.factory = new factory_1.default();
fs_1.default.readdirSync(config_1.default.modelsDir)
    .filter(function (file) {
    return file.indexOf('.') !== 0 && file.slice(-3) === '.js';
})
    .forEach(function (file) {
    var _a = require(path_1.default.join(config_1.default.modelsDir, file)), name = _a.name, specification = _a.specification, creator = _a.creator;
    exports.factory.addModel(name, specification, creator);
});
