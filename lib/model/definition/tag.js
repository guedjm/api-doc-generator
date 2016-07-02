"use strict";
const symbol_1 = require("../../preprocessing/symbol");
class Tag {
    constructor(tag) {
        this.parse(tag);
    }
    buildId() {
        this._id = this._name.toLocaleLowerCase().replace(/ /g, "-");
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get link() {
        return this._link;
    }
    getDependencySymbol(stack) {
        return [new symbol_1.default(this._link, stack)];
    }
    getDeclaredSymbol() {
        return [this._id];
    }
    parse(tag) {
        let done = false;
        for (let t in tag) {
            if (tag.hasOwnProperty(t)) {
                if (done) {
                    throw new Error("Invalid tag: " + tag);
                }
                this._name = t;
                tag = tag[this._name];
                if (tag.link === undefined) {
                    throw new Error("Invalid tag: " + tag);
                }
                this._link = tag.link;
                done = true;
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Tag;
