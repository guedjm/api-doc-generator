"use strict";
const md = require("markdown").markdown;
const changeDescription_1 = require("./changeDescription");
const generatedFile_1 = require("./generatedFile");
class Changelog {
    constructor() {
        this._changes = [];
    }
    parse(mdText) {
        let version;
        let changes;
        let author;
        let date;
        const tree = md.parse(mdText);
        tree.forEach(function (elem, i, a) {
            if ((i === 0 && elem === "markdown")
                || (elem.length === 3 && elem[0] === "header" && elem[1].level !== undefined && elem[1].level === 1)) {
                version = "";
            }
            else if (elem.length === 3 && elem[0] === "header" && elem[1].level !== undefined && elem[1].level === 2) {
                version = elem[2];
            }
            else if (elem.length > 1 && elem[0] === "bulletlist") {
                changes = [];
                elem.forEach(function (e, i, a) {
                    if (i !== 0 && (e.length !== 2 || e[0] !== "listitem")) {
                        throw new Error("Invalid changelog file format: " + e[0]);
                    }
                    else if (i !== 0) {
                        changes.push(e[1]);
                    }
                });
            }
            else if (elem.length === 2 && elem[0] === "para" && elem[1].length === 2 && elem[1][0] === "em") {
                const line = elem[1][1].split(", ");
                if (line.length !== 2) {
                    throw new Error("Invalid changelog file format: " + elem[1][1]);
                }
                author = line[0];
                date = line[1];
                this._changes.push(new changeDescription_1.default(version, changes, author, date));
            }
            else if (elem.length !== 1 && elem[0] !== "hr") {
                throw new Error("Invalid changelog file format: " + elem);
            }
        }, this);
    }
    get changes() {
        return this._changes;
    }
    generateVersionFile() {
        let fileContent = [];
        this._changes.forEach(function (elem) {
            fileContent.push({ version: elem.version, author: elem.author, date: elem.date, changes: elem.changes });
        });
        return new generatedFile_1.GeneratedFile("/.version.json", JSON.stringify(fileContent, undefined, 2));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Changelog;
