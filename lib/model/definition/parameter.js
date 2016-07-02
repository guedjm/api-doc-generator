"use strict";
const symbol_1 = require("../../preprocessing/symbol");
const textFromatter_1 = require("../../preprocessing/textFromatter");
class Parameter {
    constructor(param) {
        this.parse(param);
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get required() {
        return this._required;
    }
    get in() {
        return this._in;
    }
    get type() {
        return this._type;
    }
    get id() {
        return this._id;
    }
    buildId(base) {
        this._id = `${base}-${this._name}`.toLowerCase();
    }
    getDeclaredSymbol() {
        return [this._id];
    }
    getDependencySymbol(stack) {
        const basicType = ["int", "string"];
        if (basicType.indexOf(this._type) === -1) {
            return [new symbol_1.default("object-" + this._type.toLowerCase().replace(/ /g, "-"), stack)];
        }
        return [];
    }
    formatText() {
        this._description = textFromatter_1.default.format(this._description);
    }
    parse(param) {
        let done = false;
        for (let p in param) {
            if (param.hasOwnProperty(p)) {
                if (done) {
                    throw new Error("Invalid parameter: " + param);
                }
                this._name = p;
                param = param[this._name];
                if (param.description === undefined || param.required === undefined
                    || param.in === undefined || param.type === undefined) {
                    throw new Error("Invalid parameter: " + param);
                }
                this._description = param.description;
                this._required = param.required;
                this._in = param.in;
                this._type = param.type;
                done = true;
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Parameter;
