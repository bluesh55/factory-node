"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var factory_1 = __importDefault(require("./factory"));
var config_1 = __importDefault(require("./config"));
var ts = __importStar(require("typescript"));
var _eval = require('node-eval');
var loadResult = config_1.default.load();
if (!loadResult) {
    throw new Error('Models directory does not exist');
}
exports.factory = new factory_1.default();
fs_1.default.readdirSync(config_1.default.modelsDir)
    .filter(function (file) {
    var extension = file.slice(-3);
    return file.indexOf('.') !== 0 && ['.js', '.ts'].includes(extension);
})
    .forEach(function (file) {
    var extension = file.slice(-3);
    var model = {};
    var modelFilePath = path_1.default.join(config_1.default.modelsDir, file);
    if (extension === '.js') {
        model = require(modelFilePath);
    }
    else if (extension === '.ts') {
        var tsFileContent = fs_1.default.readFileSync(modelFilePath, { encoding: 'utf8' });
        var jsFileContent = ts.transpileModule(tsFileContent, {
            compilerOptions: { module: ts.ModuleKind.CommonJS },
        });
        var modelModule = _eval(jsFileContent.outputText);
        model = modelModule.default;
    }
    exports.factory.addModel(model.name, model.specification, model.creator);
});
