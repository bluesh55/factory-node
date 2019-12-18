#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var init_1 = __importDefault(require("../src/cli/init"));
function help() {
    console.log('Usage: factory [command]\n');
    console.log('Commands');
    console.log('  - init: initialize factory config file');
}
var command = process.argv[2];
switch (command) {
    case 'init':
        init_1.default();
        break;
    default:
        help();
}
