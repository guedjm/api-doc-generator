"use strict";

import { IDefinition } from "./IDefinition";
import Symbol from "../../preprocessing/symbol";
import TextFormatter from "../../preprocessing/textFromatter";

export default class Parameter implements IDefinition {

  private _name: string;
  private _description: string;
  private _required: boolean;
  private _in: string;
  private _type: string;
  private _id: string;

  constructor(param: any) {
    this.parse(param);
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get required(): boolean {
    return this._required;
  }

  get in(): string {
    return this._in;
  }

  get type(): string {
    return this._type;
  }

  get id(): string {
    return this._id;
  }

  public buildId(base: string): void {
    this._id = `${base}-${this._name}`.toLowerCase();
  }

  public getDeclaredSymbol(): string[] {
    return [this._id];
  }

  public getDependencySymbol(stack: string[]): Symbol[] {
    const basicType: string[] = ["int", "string"];

    if (basicType.indexOf(this._type) === -1) {
      return [new Symbol("object-" + this._type.toLowerCase().replace(/ /g, "-"), stack)];
    }
    return [];
  }

  public formatText(): void {
    this._description = TextFormatter.format(this._description);
  }



  private parse(param: any): void {
    let done: boolean = false;

    for (let p in param) {
      if (param.hasOwnProperty(p)) {

        if (done) {
          throw new Error("Invalid parameter: " + param);
        }

        this._name = p;
        param = param[this._name];

        if (param.description === undefined || param.required === undefined
          || param.in === undefined || param.type === undefined) {
          throw new Error("Invalid parameter: " + param);
        }
        this._description = param.description;
        this._required = param.required;
        this._in = param.in;
        this._type = param.type;

        done = true;
      }
    }
  }
}
