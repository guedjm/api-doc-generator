"use strict";

import * as fs from "fs";
import * as path from "path";
const validator: any = require("is-my-json-valid");

export default class DefinitionValidator {

  public static validate(defintion: any): void {


    try {
      const validatorFile: any = JSON.parse(fs.readFileSync(path.join(__dirname, "/../../resources/schema.json"), { encoding: "utf8" }));
      const validateFunc: any = validator(validatorFile, { verbose: true, greedy: true });
      const result: boolean = validateFunc(defintion);

      if (!result) {
        throw new Error("Invalid API definition: " + JSON.stringify(validateFunc.errors, undefined, 2));
      }
    }
    catch (e) {
      throw e;
    }
  }
}
