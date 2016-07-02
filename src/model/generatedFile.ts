"use strict";

export class GeneratedFile {

  private _path: string;
  private _content: string;

  constructor(path: string, content: string) {
    this._path = path;
    this._content = content;
  }

  get path(): string {
    return this._path;
  }

  get content(): string {
    return this._content;
  }
}
