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
        this.fileName = '.factoryrc.json';
        this.configTemplate = "{\n  \"modelsDir\": \"./tests/factories/\"\n}";
        this.modelsDir = '';
    }
    Configuration.prototype.initialize = function () {
        var filePath = path_1.default.resolve('.', this.fileName);
        var absoluteDir = path_1.default.dirname(filePath);
        fs_1.default.writeFileSync(filePath, this.configTemplate, 'utf8');
        return absoluteDir;
    };
    Configuration.prototype.load = function (basePath) {
        if (basePath === void 0) { basePath = ['.']; }
        var filePath = path_1.default.resolve.apply(path_1.default, __spreadArrays(basePath, [this.fileName]));
        if (fs_1.default.existsSync(filePath)) {
            var config_1 = JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
            var modelsDir = path_1.default.resolve.apply(path_1.default, __spreadArrays(basePath, [config_1.modelsDir]));
            this.modelsDir = modelsDir;
            return true;
        }
        else {
            if (filePath === path_1.default.resolve('/', this.fileName)) {
                return false;
            }
            else {
                this.load(__spreadArrays(basePath, ['..']));
            }
        }
    };
    return Configuration;
}());
var config = new Configuration();
exports.default = config;
