"use strict";

const md: any = require("markdown").markdown;
import ChangeDescription from "./changeDescription";
import { GeneratedFile } from "./generatedFile";

export default class Changelog {

  private _changes: ChangeDescription[];

  public constructor() {
    this._changes = [];
  }

  public parse(mdText: string): void {
    let version: string;
    let changes: string[];
    let author: string;
    let date: string;
    const tree: any = md.parse(mdText);


    tree.forEach(function(elem: any, i: number, a: any): void {
      if ((i === 0 && elem === "markdown")
        || (elem.length === 3 && elem[0] === "header" && elem[1].level !== undefined && elem[1].level === 1)) {
        version = "";
      }
      else if (elem.length === 3 && elem[0] === "header" && elem[1].level !== undefined && elem[1].level === 2) {
        version = elem[2];
      }
      else if (elem.length > 1 && elem[0] === "bulletlist") {
        changes = [];
        elem.forEach(function(e: any, i: number, a: any): void {
          if (i !== 0 && (e.length !== 2 || e[0] !== "listitem")) {
            throw new Error("Invalid changelog file format: " + e[0]);
          }
          else if (i !== 0) {
            changes.push(e[1]);
          }
        });
      }
      else if (elem.length === 2 && elem[0] === "para" && elem[1].length === 2 && elem[1][0] === "em") {
        const line: string[] = elem[1][1].split(", ");
        if (line.length !== 2) {
          throw new Error("Invalid changelog file format: " + elem[1][1]);
        }
        author = line[0];
        date = line[1];
        this._changes.push(new ChangeDescription(version, changes, author, date));
      }
      else if (elem.length !== 1 && elem[0] !== "hr") {
        throw new Error("Invalid changelog file format: " + elem);
      }
    }, this);
  }

  get changes(): ChangeDescription[] {
    return this._changes;
  }

  public generateVersionFile(): GeneratedFile {

    let fileContent: any[] = [];

    this._changes.forEach(function(elem: ChangeDescription): void {
      fileContent.push({ version: elem.version, author: elem.author, date: elem.date, changes: elem.changes });
    });

    return new GeneratedFile("/.version.json", JSON.stringify(fileContent, undefined, 2));
  }
}
