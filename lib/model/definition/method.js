"use strict";
const parameter_1 = require("./parameter");
const response_1 = require("./response");
const symbol_1 = require("../../preprocessing/symbol");
const textFromatter_1 = require("../../preprocessing/textFromatter");
class Method {
    constructor(meth, method) {
        this._meth = meth;
        this._parameters = [];
        this._responses = [];
        this._errors = [];
        this._tags = [];
        this.parse(method);
    }
    get summary() {
        return this._summary;
    }
    get description() {
        return this._description;
    }
    get meth() {
        return this._meth;
    }
    get parameters() {
        return this._parameters;
    }
    get responses() {
        return this._responses;
    }
    get errors() {
        return this._errors;
    }
    get tags() {
        return this._tags;
    }
    get id() {
        return this._id;
    }
    buildId(base) {
        this._id = `${base}-${this._meth}`.toLowerCase();
        this._parameters.forEach(function (elem) {
            elem.buildId(this._id);
        }, this);
        this._responses.forEach(function (elem) {
            elem.buildId(this._id);
        }, this);
    }
    getDeclaredSymbol() {
        let symbols = [];
        this._parameters.forEach(function (elem) {
            symbols.push(...elem.getDeclaredSymbol());
        });
        this._responses.forEach(function (elem) {
            symbols.push(...elem.getDeclaredSymbol());
        });
        symbols.push(this._id);
        return symbols;
    }
    ;
    getDependencySymbol(stack) {
        let symbols = [];
        let nStack = [];
        nStack.push(...stack);
        nStack.push(this._meth);
        this._parameters.forEach(function (elem) {
            symbols.push(...elem.getDependencySymbol(nStack));
        });
        this._responses.forEach(function (elem) {
            symbols.push(...elem.getDependencySymbol(nStack));
        });
        this._errors.forEach(function (elem) {
            symbols.push(new symbol_1.default(elem, nStack));
        });
        this._tags.forEach(function (elem) {
            symbols.push(new symbol_1.default(elem.toLowerCase().replace(/ /g, "-"), nStack));
        });
        return symbols;
    }
    ;
    formatText() {
        this._summary = textFromatter_1.default.format(this._summary);
        if (this._description !== undefined) {
            this._description = textFromatter_1.default.format(this._description);
        }
        this._parameters.forEach(function (elem) {
            elem.formatText();
        });
        this._responses.forEach(function (elem) {
            elem.formatText();
        });
    }
    parse(method) {
        if (method.summary === undefined) {
            throw new Error("Invalid method (Missing summary): " + method);
        }
        this._summary = method.summary;
        this._description = method.description;
        if (method.parameters !== undefined) {
            method.parameters.forEach(function (elem) {
                this._parameters.push(new parameter_1.default(elem));
            }, this);
        }
        if (method.responses !== undefined) {
            method.responses.forEach(function (elem) {
                this._responses.push(new response_1.default(elem));
            }, this);
        }
        if (method.errors !== undefined) {
            method.errors.forEach(function (elem) {
                this._errors.push("error-" + elem.toLowerCase().replace(/ /g, "-"));
            }, this);
        }
        if (method.tags !== undefined) {
            method.tags.forEach(function (elem) {
                this._tags.push(elem);
            }, this);
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Method;
;
