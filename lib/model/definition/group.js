"use strict";
const url_1 = require("./url");
const textFromatter_1 = require("../../preprocessing/textFromatter");
class Group {
    constructor(group) {
        this._sub = [];
        this._url = [];
        this.parse(group);
    }
    get id() {
        return this._id;
    }
    buildId(base) {
        if (base === undefined || base === "") {
            base = "routes";
        }
        this._id = `${base}-${this._title.toLowerCase()}`;
        this._sub.forEach(function (elem) {
            elem.buildId(this._id);
        }, this);
        this._url.forEach(function (elem) {
            elem.buildId(this._id);
        }, this);
    }
    getDeclaredSymbol() {
        let symbols = [];
        this._sub.forEach(function (elem) {
            symbols.push(...elem.getDeclaredSymbol());
        });
        this._url.forEach(function (elem) {
            symbols.push(...elem.getDeclaredSymbol());
        });
        symbols.push(this._id);
        return symbols;
    }
    getDependencySymbol(stack) {
        let symbols = [];
        let nStack = [];
        nStack.push(...stack);
        nStack.push(this._title);
        this._sub.forEach(function (elem) {
            symbols.push(...elem.getDependencySymbol(nStack));
        });
        this._url.forEach(function (elem) {
            symbols.push(...elem.getDependencySymbol(nStack));
        });
        return symbols;
    }
    formatText() {
        this._text = textFromatter_1.default.format(this._text);
        this._sub.forEach(function (elem) {
            elem.formatText();
        });
        this._url.forEach(function (elem) {
            elem.formatText();
        });
    }
    get title() {
        return this._title;
    }
    get text() {
        return this._text;
    }
    get sub() {
        return this._sub;
    }
    get url() {
        return this._url;
    }
    parse(group) {
        let done = false;
        for (let g in group) {
            if (group.hasOwnProperty(g)) {
                if (done) {
                    throw new Error("Invalid route group: " + group);
                }
                this._title = g;
                group = group[this._title];
                if (group.text === undefined) {
                    throw new Error("Invalid route group (Missing text): " + group);
                }
                this._text = group.text;
                if (group.sub !== undefined) {
                    group.sub.forEach(function (elem) {
                        this._sub.push(new Group(elem));
                    }, this);
                }
                if (group.url !== undefined) {
                    group.url.forEach(function (elem) {
                        this._url.push(new url_1.default(elem));
                    }, this);
                }
                done = true;
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Group;
