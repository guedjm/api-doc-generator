"use strict";
const method_1 = require("./method");
class Url {
    constructor(url) {
        this._availableMethod = ["get", "post", "patch", "put", "delete"];
        this.parse(url);
    }
    get id() {
        return this._id;
    }
    buildId(base) {
        if (base === undefined || base === "") {
            base = "routes";
        }
        this._id = `${base}${this.url.toLowerCase().replace(/\//g, "-")}`;
        if (this._get !== undefined) {
            this._get.buildId(this._id);
        }
        if (this._post !== undefined) {
            this._post.buildId(this._id);
        }
        if (this._patch !== undefined) {
            this._patch.buildId(this._id);
        }
        if (this._put !== undefined) {
            this._put.buildId(this._id);
        }
        if (this._delete !== undefined) {
            this._delete.buildId(this._id);
        }
    }
    getDeclaredSymbol() {
        let symbols = [];
        if (this._get !== undefined) {
            symbols.push(...this._get.getDeclaredSymbol());
        }
        if (this._post !== undefined) {
            symbols.push(...this._post.getDeclaredSymbol());
        }
        if (this._patch !== undefined) {
            symbols.push(...this._patch.getDeclaredSymbol());
        }
        if (this._put !== undefined) {
            symbols.push(...this._put.getDeclaredSymbol());
        }
        if (this._delete !== undefined) {
            symbols.push(...this._delete.getDeclaredSymbol());
        }
        symbols.push(this._id);
        return symbols;
    }
    getDependencySymbol(stack) {
        let symbols = [];
        let nStack = [];
        nStack.push(...stack);
        nStack.push(this._url);
        if (this._get !== undefined) {
            symbols.push(...this._get.getDependencySymbol(nStack));
        }
        if (this._post !== undefined) {
            symbols.push(...this._post.getDependencySymbol(nStack));
        }
        if (this._patch !== undefined) {
            symbols.push(...this._patch.getDependencySymbol(nStack));
        }
        if (this._put !== undefined) {
            symbols.push(...this._put.getDependencySymbol(nStack));
        }
        if (this._delete !== undefined) {
            symbols.push(...this._delete.getDependencySymbol(nStack));
        }
        return symbols;
    }
    formatText() {
        if (this._get !== undefined) {
            this._get.formatText();
        }
        if (this._post !== undefined) {
            this._post.formatText();
        }
        if (this._patch !== undefined) {
            this._patch.formatText();
        }
        if (this._put !== undefined) {
            this._put.formatText();
        }
        if (this._delete !== undefined) {
            this._delete.formatText();
        }
    }
    get url() {
        return this._url;
    }
    get get() {
        return this._get;
    }
    get post() {
        return this._post;
    }
    get patch() {
        return this._patch;
    }
    get put() {
        return this._put;
    }
    get delete() {
        return this._delete;
    }
    parse(url) {
        let done = false;
        for (let u in url) {
            if (url.hasOwnProperty(u)) {
                if (done) {
                    throw new Error("Invalid Url: " + url);
                }
                this._url = u;
                url = url[this._url];
                for (let m in url) {
                    if (url.hasOwnProperty(m)) {
                        if (this._availableMethod.indexOf(m) === -1) {
                            throw new Error("Invalid method name: " + m);
                        }
                        switch (m) {
                            case "get":
                                this._get = new method_1.default("get", url[m]);
                                break;
                            case "post":
                                this._post = new method_1.default("post", url[m]);
                                break;
                            case "patch":
                                this._patch = new method_1.default("patch", url[m]);
                                break;
                            case "put":
                                this._put = new method_1.default("put", url[m]);
                                break;
                            case "delete":
                                this._delete = new method_1.default("delete", url[m]);
                                break;
                            default:
                                throw new Error("Invalid method: " + m);
                        }
                    }
                }
                done = true;
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Url;
