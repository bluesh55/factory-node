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
var Configuration = /** @class */ (function () {
    function Configuration() {
        this.configFileName = '.factoryrc.json';
        this.defaultConfig = {
            modelsDir: './tests/factories/',
            loaderDir: './tests/helpers',
        };
        this.modelsDir = '';
        this.loaderDir = '';
    }
    Configuration.prototype.load = function () {
        var isConfigFileLoaded = this.loadConfigFileRecursively();
        if (!isConfigFileLoaded) {
            throw new Error('Configuration file does not exist');
        }
        return true;
    };
    Configuration.prototype.loadConfigFileRecursively = function (basePath) {
        if (basePath === void 0) { basePath = ['.']; }
        var filePath = path_1.default.resolve.apply(path_1.default, __spreadArrays(basePath, [this.configFileName]));
        if (fs_1.default.existsSync(filePath)) {
            var config = JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
            var modelsDir = path_1.default.resolve.apply(path_1.default, __spreadArrays(basePath, [config.modelsDir]));
            var loaderDir = path_1.default.resolve.apply(path_1.default, __spreadArrays(basePath, [config.loaderDir]));
            this.modelsDir = modelsDir;
            this.loaderDir = loaderDir;
            return true;
        }
        else {
            if (filePath === path_1.default.resolve('/', this.configFileName)) {
                return false;
            }
            else {
                return this.loadConfigFileRecursively(__spreadArrays(basePath, ['..']));
            }
        }
    };
    return Configuration;
}());
exports.configuration = new Configuration();
