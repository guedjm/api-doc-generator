"use strict";
const symbol_1 = require("../../preprocessing/symbol");
const textFromatter_1 = require("../../preprocessing/textFromatter");
class Response {
    constructor(response) {
        this.parse(response);
    }
    get code() {
        return this._code;
    }
    get description() {
        return this._description;
    }
    get type() {
        return this._type;
    }
    get id() {
        return this._id;
    }
    buildId(base) {
        this._id = `${base}-${this._code}`.toLowerCase();
    }
    getDeclaredSymbol() {
        return [this._id];
    }
    getDependencySymbol(stack) {
        const basicType = ["int", "string", "none"];
        if (basicType.indexOf(this._type) === -1) {
            return [new symbol_1.default("object-" + this._type.toLowerCase().replace(/ /g, "-"), stack)];
        }
        return [];
    }
    formatText() {
        this._description = textFromatter_1.default.format(this._description);
    }
    parse(response) {
        let done = false;
        for (let r in response) {
            if (response.hasOwnProperty(r)) {
                if (done) {
                    throw new Error("Invalid response: " + response);
                }
                this._code = parseInt(r, 10);
                response = response[this._code];
                if (response.description === undefined || response.type === undefined) {
                    throw new Error("Invalid response: " + response);
                }
                this._description = response.description;
                this._type = response.type;
                done = true;
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Response;
