"use strict";

import Parameter from "./parameter";
import Response from "./response";
import { IDefinition } from "./IDefinition";
import Symbol from "../../preprocessing/symbol";
import TextFormatter from "../../preprocessing/textFromatter";

export default class Method implements IDefinition {

  private _meth: string;
  private _summary: string;
  private _description: string;
  private _parameters: Parameter[];
  private _responses: Response[];
  private _tags: string[];
  private _errors: string[];
  private _id: string;

  constructor(meth: string, method: any) {
    this._meth = meth;
    this._parameters = [];
    this._responses = [];
    this._errors = [];
    this._tags = [];
    this.parse(method);
  }

  get summary(): string {
    return this._summary;
  }

  get description(): string {
    return this._description;
  }

  get meth(): string {
    return this._meth;
  }

  get parameters(): Parameter[] {
    return this._parameters;
  }

  get responses(): Response[] {
    return this._responses;
  }

  get errors(): string[] {
    return this._errors;
  }

  get tags(): string[] {
    return this._tags;
  }

  get id(): string {
    return this._id;
  }

  public buildId(base: string): void {
    this._id = `${base}-${this._meth}`.toLowerCase();

    this._parameters.forEach(function(elem: Parameter): void {
      elem.buildId(this._id);
    }, this);

    this._responses.forEach(function(elem: Response): void {
      elem.buildId(this._id);
    }, this);
  }

  public getDeclaredSymbol(): string[] {
    let symbols: string[] = [];

    this._parameters.forEach(function(elem: Parameter): void {
      symbols.push(...elem.getDeclaredSymbol());
    });

    this._responses.forEach(function(elem: Response): void {
      symbols.push(...elem.getDeclaredSymbol());
    });

    symbols.push(this._id);
    return symbols;
  };

  public getDependencySymbol(stack: string[]): Symbol[] {
    let symbols: Symbol[] = [];
    let nStack: string[] = [];
    nStack.push(...stack);
    nStack.push(this._meth);


    this._parameters.forEach(function(elem: Parameter): void {
      symbols.push(...elem.getDependencySymbol(nStack));
    });

    this._responses.forEach(function(elem: Response): void {
      symbols.push(...elem.getDependencySymbol(nStack));
    });

    this._errors.forEach(function(elem: string): void {
      symbols.push(new Symbol(elem, nStack));
    });

    this._tags.forEach(function(elem: string): void {
      symbols.push(new Symbol(elem.toLowerCase().replace(/ /g, "-"), nStack));
    });

    return symbols;
  };

  public formatText(): void {
    this._summary = TextFormatter.format(this._summary);
    if (this._description !== undefined) {
      this._description = TextFormatter.format(this._description);
    }
    this._parameters.forEach(function(elem: Parameter): void {
      elem.formatText();
    });

    this._responses.forEach(function(elem: Response): void {
      elem.formatText();
    });
  }

  private parse(method: any): void {

    if (method.summary === undefined) {
      throw new Error("Invalid method (Missing summary): " + method);
    }

    this._summary = method.summary;
    this._description = method.description;

    if (method.parameters !== undefined) {
      method.parameters.forEach(function(elem: any): void {
        this._parameters.push(new Parameter(elem));
      }, this);
    }

    if (method.responses !== undefined) {
      method.responses.forEach(function(elem: any): void {
        this._responses.push(new Response(elem));
      }, this);
    }

    if (method.errors !== undefined) {
      method.errors.forEach(function(elem: string): void {
        this._errors.push("error-" + elem.toLowerCase().replace(/ /g, "-"));
      }, this);
    }

    if (method.tags !== undefined) {
      method.tags.forEach(function(elem: string): void {
        this._tags.push(elem);
      }, this);
    }
  }

};
