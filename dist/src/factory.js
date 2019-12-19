"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Factory = /** @class */ (function () {
    function Factory() {
        this.models = {};
    }
    Object.defineProperty(Factory, "ASYNC_FUNCTION_NAME", {
        get: function () {
            return 'AsyncFunction';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Factory, "PLAIN_FUNCTION_NAME", {
        get: function () {
            return 'Function';
        },
        enumerable: true,
        configurable: true
    });
    Factory.prototype.addModel = function (name, specification, creator) {
        this.models[name] = {
            specification: specification,
            creator: creator,
        };
    };
    Factory.prototype.create = function (modelName, attrs) {
        return __awaiter(this, void 0, void 0, function () {
            var model, inputAttributes, _i, _a, attributeKey, attributeSpec, input, generatedValue, newAttributeName;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        model = this.models[modelName];
                        inputAttributes = attrs || {};
                        if (!model) {
                            return [2 /*return*/];
                        }
                        if (model.sequences === undefined) {
                            model.sequences = {};
                        }
                        // Remove all empty inputAttributes
                        Object.keys(inputAttributes).forEach(function (key) { return inputAttributes[key] === undefined && delete inputAttributes[key]; });
                        _i = 0, _a = Object.keys(model.specification);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        attributeKey = _a[_i];
                        attributeSpec = model.specification[attributeKey];
                        input = inputAttributes[attributeKey];
                        generatedValue = null;
                        newAttributeName = null;
                        // Guards
                        if (!attributeSpec) {
                            return [3 /*break*/, 7];
                        }
                        if (attributeSpec.attributeName) {
                            newAttributeName = attributeSpec.attributeName;
                        }
                        if (input) {
                            generatedValue = input;
                        }
                        if (!(input === undefined)) return [3 /*break*/, 4];
                        if (!this._isFunction(attributeSpec.defaultValue)) return [3 /*break*/, 3];
                        model.sequences[attributeKey] = model.sequences[attributeKey] || 0;
                        return [4 /*yield*/, this._doAsyncOrPlainFunction(attributeSpec.defaultValue, model.sequences[attributeKey])];
                    case 2:
                        generatedValue = _b.sent();
                        model.sequences[attributeKey] += 1;
                        return [3 /*break*/, 4];
                    case 3:
                        generatedValue = attributeSpec.defaultValue;
                        _b.label = 4;
                    case 4:
                        if (!attributeSpec.transform) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._doAsyncOrPlainFunction(attributeSpec.transform, generatedValue)];
                    case 5:
                        generatedValue = _b.sent();
                        _b.label = 6;
                    case 6:
                        // 3. Assign generatedValue that is result of above to `inputAttributes`
                        if (newAttributeName) {
                            inputAttributes[newAttributeName] = generatedValue;
                        }
                        else {
                            inputAttributes[attributeKey] = generatedValue;
                        }
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8: return [4 /*yield*/, this._doAsyncOrPlainFunction(this.models[modelName].creator, inputAttributes)];
                    case 9: 
                    // Now call creator function with inputAttributes as parameter and return it
                    return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Factory.prototype._doAsyncOrPlainFunction = function (func) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = func.constructor.name;
                        switch (_a) {
                            case Factory.ASYNC_FUNCTION_NAME: return [3 /*break*/, 1];
                            case Factory.PLAIN_FUNCTION_NAME: return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 4];
                    case 1: return [4 /*yield*/, func.apply(void 0, params)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: return [2 /*return*/, func.apply(void 0, params)];
                    case 4: return [2 /*return*/, undefined];
                }
            });
        });
    };
    Factory.prototype._isFunction = function (param) {
        if (param === undefined || param === null) {
            return false;
        }
        return (param.constructor.name === Factory.ASYNC_FUNCTION_NAME ||
            param.constructor.name === Factory.PLAIN_FUNCTION_NAME);
    };
    return Factory;
}());
exports.factory = new Factory();
