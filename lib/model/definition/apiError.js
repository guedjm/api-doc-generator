"use strict";
const textFromatter_1 = require("../../preprocessing/textFromatter");
class APIError {
    constructor(error) {
        this.parse(error);
    }
    get name() {
        return this._name;
    }
    get status() {
        return this._status;
    }
    get code() {
        return this._code;
    }
    get subcode() {
        return this._subcode;
    }
    get message() {
        return this._message;
    }
    get fix() {
        return this._fix;
    }
    get id() {
        return this._id;
    }
    buildId() {
        this._id = `error-${this._name}`.replace(/ /g, "-").toLowerCase();
    }
    getDeclaredSymbol() {
        return [this._id];
    }
    getDependencySymbol(stack) {
        return [];
    }
    formatText() {
        this._message = textFromatter_1.default.format(this._message);
        if (this._fix !== undefined) {
            this._fix = textFromatter_1.default.format(this._fix);
        }
    }
    parse(error) {
        let done = false;
        for (let e in error) {
            if (error.hasOwnProperty(e)) {
                if (done) {
                    throw new Error("Invalid Error: " + error);
                }
                this._name = e;
                error = error[this._name];
                if (error.status === undefined || error.code === undefined || error.message === undefined) {
                    throw new Error("Invalid Error: " + error);
                }
                this._status = parseInt(error.status, 10);
                this._code = parseInt(error.code, 10);
                this._message = error.message;
                this._fix = error.fix;
                if (error.subcode) {
                    this._subcode = parseInt(error.subcode, 10);
                }
                done = true;
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = APIError;
