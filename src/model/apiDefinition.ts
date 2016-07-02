"use strict";

const html: any = require("html");
import * as jade from "jade";

import Tag from "./definition/tag";
import Paragraph from "./definition/paragraph";
import APIError from "./definition/apiError";
import APIObject from "./definition/apiObject";
import { IDefinition, buildRoute } from "./definition/IDefinition";
import Symbol from "../preprocessing/symbol";
import TextFormatter from "../preprocessing/textFromatter";
import Changelog from "./changelog";
import { GeneratedFile } from "./generatedFile";
import APIRoute from "./definition/apiRoute";

export default class APIDefintion {

  private _name: string;
  private _description: string;
  private _paragraphs: Paragraph[];
  private _tags: Tag[];
  private _routes: APIRoute;
  private _errors: APIError[];
  private _objects: APIObject[];

  constructor() {
    this._tags = [];
    this._paragraphs = [];
    this._errors = [];
    this._objects = [];
  }

  public parse(definition: any): void {
    if (definition.api === undefined || definition.api.name === undefined
      || definition.api.description === undefined) {
      throw new Error("Invalid definition: Missing api information");
    }
    this._name = definition.api.name;
    this._description = definition.api.description;

    if (definition.api.paragraphs === undefined) {
      throw new Error("Invalid definition: Missing paragraphs definition");
    }
    definition.api.paragraphs.forEach(function(elem: any): void {
      this._paragraphs.push(new Paragraph(elem));
    }, this);


    if (definition.api.tags !== undefined) {
      definition.api.tags.forEach(function(elem: any): void {
        this._tags.push(new Tag(elem));
      }, this);
    }


    if (definition.api.routes === undefined) {
      throw new Error("Invalid definition: Missing route defintion");
    }
    this._routes = new APIRoute(definition.api.routes);

    if (definition.api.errors !== undefined) {
      definition.api.errors.forEach(function(elem: any): void {
        this._errors.push(new APIError(elem));
      }, this);
    }

    if (definition.api.objects !== undefined) {
      definition.api.objects.forEach(function(elem: any): void {
        this._objects.push(new APIObject(elem));
      }, this);
    }
  }

  public preprocess(): void {

    const declaredSymbol: string[] = this.getDeclaredSymbols();
    const dependencySymbol: Symbol[] = this.getDependencySymbol();

    dependencySymbol.forEach(function(elem: Symbol): void {
      if (declaredSymbol.indexOf(elem.name) === -1) {
        throw new Error(`Unresolved symbol: ${elem.name} from ${elem.stack}`);
      }
    });

    this._description = TextFormatter.format(this._description);

    this._paragraphs.forEach(function(elem: Paragraph): void {
      elem.formatText();
    });

    this._routes.formatText();

    this._errors.forEach(function(elem: APIError): void {
      elem.formatText();
    });

    this._objects.forEach(function(elem: APIObject): void {
      elem.formatText();
    });

  }

  public generateRootFile(changelog: Changelog): GeneratedFile {

    return new GeneratedFile("/index.html",
      html.prettyPrint(jade.renderFile(__dirname + "/../../resources/view/root.jade", {
        name: this.name,
        description: this.description,
        versions: changelog.changes
      })));
  }

  public generateDefinitionFile(changelog: Changelog, version: string): GeneratedFile {

    return new GeneratedFile(`/${version}/index.html`,
      html.prettyPrint(jade.renderFile(__dirname + "/../../resources/view/index.jade", {
        version: version,
        changelog: changelog,
        api: this
      })));
  }

  public getTagInfo(tag: string): any {
    let ret: any = {};
    const labelType: string[] = ["label-info", "label-warning", "label-primary", "label-success", "label-danger"];

    this._tags.forEach(function(elem: Tag, i: number): void {
      if (elem.id === tag.toLowerCase().replace(/ /g, "-")) {
        ret = {
          label: labelType[i],
          name: elem.name,
          value: elem.link
        };
      }
    });
    return ret;
  }

  public getObjectInfo(object: string): any {
    let ret: any = {};

    this._objects.forEach(function(elem: APIObject): void {
      if (elem.id === "object-" + object.toLowerCase().replace(/ /g, "-")) {
        ret = {
          name: elem.name,
          link: elem.id
        };
      }
    });
    return ret;
  }

  public getErrorInfo(error: string): APIError {
    let ret: APIError = undefined;

    this._errors.forEach(function(elem: APIError): void {
      if (elem.id === error) {
        ret = elem;
      }
    });
    return ret;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get paragraphs(): Paragraph[] {
    return this._paragraphs;
  }

  get tags(): Tag[] {
    return this._tags;
  }

  get routes(): APIRoute {
    return this._routes;
  }

  get objects(): APIObject[] {
    return this._objects;
  }

  get errors(): APIError[] {
    return this._errors;
  }

  private getDeclaredSymbols(): string[] {
    let symbols: string[] = [];

    this._paragraphs.forEach(function(elem: Paragraph): void {
      elem.buildId();
      symbols.push(...elem.getDeclaredSymbol());
    });


    this._tags.forEach(function(elem: Tag): void {
      elem.buildId();
      symbols.push(...elem.getDeclaredSymbol());
    });

    this._routes.buildId();
    symbols.push(...this._routes.getDeclaredSymbol());

    this._errors.forEach(function(elem: APIError): void {
      elem.buildId();
      symbols.push(...elem.getDeclaredSymbol());
    });

    this._objects.forEach(function(elem: APIObject): void {
      elem.buildId();
      symbols.push(...elem.getDeclaredSymbol());
    });

    return symbols;
  }

  private getDependencySymbol(): Symbol[] {
    let symbols: Symbol[] = [];

    this._paragraphs.forEach(function(elem: Paragraph): void {
      symbols.push(...elem.getDependencySymbol(["api", "paragraph"]));
    });

    symbols.push(...this._routes.getDependencySymbol(["api", "routes"]));

    this._errors.forEach(function(elem: APIError): void {
      symbols.push(...elem.getDependencySymbol(["api", "errors"]));
    });

    this._objects.forEach(function(elem: APIObject): void {
      symbols.push(...elem.getDependencySymbol(["api", "objects"]));
    });

    this._tags.forEach(function(elem: Tag): void {
      symbols.push(...elem.getDependencySymbol(["api", "tags"]));
    });

    return symbols;
  }
}
