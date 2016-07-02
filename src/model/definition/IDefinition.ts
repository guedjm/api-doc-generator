"use strict";

import Url from "./url";
import Group from "./group";
import Symbol from "../../preprocessing/symbol";

export interface IDefinition {

  id: string;

  buildId(base?: string): void;
  getDeclaredSymbol(): string[];
  getDependencySymbol(stack: string[]): Symbol[];

  formatText(): void;
}

export function buildRoute(route: any): IDefinition {

  for (let r in route) {
    if (r.startsWith("/")) {
      return new Url(route);
    }
    else {
      return new Group(route);
    }
  }

  throw new Error("Invalid route: " + route);
}
