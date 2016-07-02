"use strict";
class ChangeDescription {
    constructor(version, changes, author, date) {
        this._author = author;
        this._version = version;
        this._changes = changes;
        this._date = date;
    }
    get version() {
        return this._version;
    }
    get changes() {
        return this._changes;
    }
    get author() {
        return this._author;
    }
    get date() {
        return this._date;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChangeDescription;
