"use strict";
class Symbol {
    constructor(name, stack) {
        this._name = name;
        this._stack = stack;
    }
    get name() {
        return this._name;
    }
    get stack() {
        return this._stack;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Symbol;
