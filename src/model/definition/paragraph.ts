"use strict";

import { IDefinition } from "./IDefinition";
import Symbol from "../../preprocessing/symbol";
import TextFormatter from "../../preprocessing/textFromatter";

export default class Paragraph implements IDefinition {

  private _title: string;
  private _text: string;
  private _sub: Paragraph[];
  private _id: string;

  constructor(paragraph: any) {
    this._sub = [];
    this.parse(paragraph);
  }

  get title(): string {
    return this._title;
  }

  get text(): string {
    return this._text;
  }

  get sub(): Paragraph[] {
    return this._sub;
  }

  get id(): string {
    return this._id;
  }

  public buildId(base?: string): void {
    if (base === undefined || base === "") {
      base = "paragraph";
    }
    this._id = `${base}-${this._title.toLowerCase().replace(/ /g, "-")}`;

    this._sub.forEach(function(elem: Paragraph): void {
      elem.buildId(this._id);
    }, this);
  }

  public getDeclaredSymbol(): string[] {
    let symbols: string[] = [];

    this._sub.forEach(function(elem: Paragraph): void {
      symbols.push(...elem.getDeclaredSymbol());
    });

    symbols.push(this._id);

    return symbols;
  }

  public getDependencySymbol(stack: string[]): Symbol[] {
    return [];
  }

  public formatText(): void {

    this._text = TextFormatter.format(this._text);

    this._sub.forEach(function(elem: Paragraph): void {
      elem.formatText();
    });
  }

  private parse(paragraph: any): void {
    let done: boolean = false;

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
          paragraph.sub.forEach(function(elem: any): void {
            this._sub.push(new Paragraph(elem));
          }, this);
        }

        done = true;
      }
    }
  }
}
