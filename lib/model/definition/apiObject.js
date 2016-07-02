"use strict";
const textFromatter_1 = require("../../preprocessing/textFromatter");
class APIObject {
    constructor(object) {
        this.parse(object);
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get obj() {
        return this._obj;
    }
    get id() {
        return this._id;
    }
    buildId() {
        this._id = `object-${this._name}`.replace(/ /g, "-").toLowerCase();
    }
    getDeclaredSymbol() {
        return [this._id];
    }
    getDependencySymbol(stack) {
        return [];
    }
    formatText() {
        this._description = textFromatter_1.default.format(this._description);
    }
    getPrettyPrintedObj() {
        var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
        return JSON.stringify(this.obj, null, 2)
            .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(jsonLine, this.replacer);
    }
    replacer(match, pIndent, pKey, pVal, pEnd) {
        var key = '<span class=json-key>';
        var val = '<span class=json-value>';
        var str = '<span class=json-string>';
        var r = pIndent || '';
        if (pKey)
            r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
        if (pVal)
            r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
        return r + (pEnd || '');
    }
    parse(object) {
        let done = false;
        for (let o in object) {
            if (object.hasOwnProperty(o)) {
                if (done) {
                    throw new Error("Invalid object: " + object);
                }
                this._name = o;
                object = object[this._name];
                if (object.description === undefined || object.obj === undefined) {
                    throw new Error("Invalid object: " + object);
                }
                this._description = object.description;
                this._obj = object.obj;
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = APIObject;
