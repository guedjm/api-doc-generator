"use strict";
const YAML = require("yamljs");
class YamlParser {
    static parse(yaml) {
        return YAML.parse(yaml);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = YamlParser;
