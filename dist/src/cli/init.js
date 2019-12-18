"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../config"));
function default_1() {
    var initializedDir = config_1.default.initialize();
    console.log("Configuration file was created at " + initializedDir + "! \uD83D\uDE0E");
}
exports.default = default_1;
