"use strict";

export default class ChangeDescription {

  private _version: string;
  private _changes: string[];
  private _author: string;
  private _date: string;

  public constructor(version: string, changes: string[], author: string, date: string) {
    this._author = author;
    this._version = version;
    this._changes = changes;
    this._date = date;
  }

  get version(): string {
    return this._version;
  }

  get changes(): string[] {
    return this._changes;
  }

  get author(): string {
    return this._author;
  }

  get date(): string {
    return this._date;
  }
}
