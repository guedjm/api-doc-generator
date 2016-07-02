"use strict";
const textFromatter_1 = require("../../preprocessing/textFromatter");
class Paragraph {
    constructor(paragraph) {
        this._sub = [];
        this.parse(paragraph);
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
    get id() {
        return this._id;
    }
    buildId(base) {
        if (base === undefined || base === "") {
            base = "paragraph";
        }
        this._id = `${base}-${this._title.toLowerCase().replace(/ /g, "-")}`;
        this._sub.forEach(function (elem) {
            elem.buildId(this._id);
        }, this);
    }
    getDeclaredSymbol() {
        let symbols = [];
        this._sub.forEach(function (elem) {
            symbols.push(...elem.getDeclaredSymbol());
        });
        symbols.push(this._id);
        return symbols;
    }
    getDependencySymbol(stack) {
        return [];
    }
    formatText() {
        this._text = textFromatter_1.default.format(this._text);
        this._sub.forEach(function (elem) {
            elem.formatText();
        });
    }
    parse(paragraph) {
        let done = false;
        for (let p in paragraph) {
            if (paragraph.hasOwnProperty(p)) {
                if (done) {
                    throw new Error("Invalid paragraph: " + JSON.stringify(paragraph));
                }
                this._title = p;
                paragraph = paragraph[this._title];
                if (paragraph.text === undefined) {
                    throw new Error("Invalid paragraph: " + JSON.stringify(paragraph));
                }
                this._text = paragraph.text;
                if (paragraph.sub !== undefined) {
                    paragraph.sub.forEach(function (elem) {
                        this._sub.push(new Paragraph(elem));
                    }, this);
                }
                done = true;
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Paragraph;
