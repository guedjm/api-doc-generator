"use strict";

import * as YAML from "yamljs";

export default class YamlParser {

  public static parse(yaml: string): any {

    return YAML.parse(yaml);
  }
}
