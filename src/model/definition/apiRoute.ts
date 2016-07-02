"use strict";

import { IDefinition } from "./IDefinition";
import Group from "./group";
import Url from "./url";
import Symbol from "../../preprocessing/symbol";

export default class APIRoute implements IDefinition {

  private _groups: Group[];
  private _url: Url[];

  constructor(routes: any[]) {
    this._groups = [];
    this._url = [];
    this.parse(routes);
  }

  get id(): string {
    return "";
  }

  get groups(): Group[] {
    return this._groups;
  }

  get urls(): Url[] {
    return this._url;
  }

  public buildId(base?: string): void {
    this._groups.forEach(function (group: Group) {
      group.buildId("routes");
    });

    this._url.forEach(function (url: Url) {
      url.buildId("routes");
    });
  }

  public getDeclaredSymbol(): string[] {
    let declaredSymbols: string[] = [];
    this._groups.forEach(function (group: Group) {
      declaredSymbols.push(...group.getDeclaredSymbol());
    });

    this._url.forEach(function (url: Url) {
      declaredSymbols.push(...url.getDeclaredSymbol());
    });
    return declaredSymbols;
  }

  public getDependencySymbol(stack: string[]): Symbol[] {
    let dependencySymbol: Symbol[] = [];
    this._groups.forEach(function (group: Group) {
      dependencySymbol.push(...group.getDependencySymbol(stack));
    });

    this._url.forEach(function (url: Url) {
      dependencySymbol.push(...url.getDependencySymbol(stack));
    });
    return dependencySymbol;
  }

  public formatText(): void {
    this._groups.forEach(function (group: Group) {
      group.formatText();
    });

    this._url.forEach(function (url: Url) {
      url.formatText();
    });
  }

  private parse(routes: any[]): void {
    const apiRoute: APIRoute = this;
    routes.forEach(function (route: any) {
      for (let r in route) {
        if (route.hasOwnProperty(r)) {
          if (r.startsWith("/")) {
            apiRoute._url.push(new Url(route));
          }
          else {
            apiRoute._groups.push(new Group(route));
          }
        }
      }
    });
  }
}