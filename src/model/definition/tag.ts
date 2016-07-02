"use strict";

import Symbol from "../../preprocessing/symbol";

export default class Tag {

  private _id: string;
  private _name: string;
  private _link: string;

  constructor(tag: any) {
    this.parse(tag);
  }

  public buildId(): void {
    this._id = this._name.toLocaleLowerCase().replace(/ /g, "-");
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get link(): string {
    return this._link;
  }

  public getDependencySymbol(stack: string[]): Symbol[] {
    return [new Symbol(this._link, stack)];
  }

  public getDeclaredSymbol(): string[] {
    return [this._id];
  }

  private parse(tag: any): void {
    let done: boolean = false;

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
