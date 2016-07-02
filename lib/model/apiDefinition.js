"use strict";
const html = require("html");
const jade = require("jade");
const tag_1 = require("./definition/tag");
const paragraph_1 = require("./definition/paragraph");
const apiError_1 = require("./definition/apiError");
const apiObject_1 = require("./definition/apiObject");
const textFromatter_1 = require("../preprocessing/textFromatter");
const generatedFile_1 = require("./generatedFile");
const apiRoute_1 = require("./definition/apiRoute");
class APIDefintion {
    constructor() {
        this._tags = [];
        this._paragraphs = [];
        this._errors = [];
        this._objects = [];
    }
    parse(definition) {
        if (definition.api === undefined || definition.api.name === undefined
            || definition.api.description === undefined) {
            throw new Error("Invalid definition: Missing api information");
        }
        this._name = definition.api.name;
        this._description = definition.api.description;
        if (definition.api.paragraphs === undefined) {
            throw new Error("Invalid definition: Missing paragraphs definition");
        }
        definition.api.paragraphs.forEach(function (elem) {
            this._paragraphs.push(new paragraph_1.default(elem));
        }, this);
        if (definition.api.tags !== undefined) {
            definition.api.tags.forEach(function (elem) {
                this._tags.push(new tag_1.default(elem));
            }, this);
        }
        if (definition.api.routes === undefined) {
            throw new Error("Invalid definition: Missing route defintion");
        }
        this._routes = new apiRoute_1.default(definition.api.routes);
        if (definition.api.errors !== undefined) {
            definition.api.errors.forEach(function (elem) {
                this._errors.push(new apiError_1.default(elem));
            }, this);
        }
        if (definition.api.objects !== undefined) {
            definition.api.objects.forEach(function (elem) {
                this._objects.push(new apiObject_1.default(elem));
            }, this);
        }
    }
    preprocess() {
        const declaredSymbol = this.getDeclaredSymbols();
        const dependencySymbol = this.getDependencySymbol();
        dependencySymbol.forEach(function (elem) {
            if (declaredSymbol.indexOf(elem.name) === -1) {
                throw new Error(`Unresolved symbol: ${elem.name} from ${elem.stack}`);
            }
        });
        this._description = textFromatter_1.default.format(this._description);
        this._paragraphs.forEach(function (elem) {
            elem.formatText();
        });
        this._routes.formatText();
        this._errors.forEach(function (elem) {
            elem.formatText();
        });
        this._objects.forEach(function (elem) {
            elem.formatText();
        });
    }
    generateRootFile(changelog) {
        return new generatedFile_1.GeneratedFile("/index.html", html.prettyPrint(jade.renderFile(__dirname + "/../../resources/view/root.jade", {
            name: this.name,
            description: this.description,
            versions: changelog.changes
        })));
    }
    generateDefinitionFile(changelog, version) {
        return new generatedFile_1.GeneratedFile(`/${version}/index.html`, html.prettyPrint(jade.renderFile(__dirname + "/../../resources/view/index.jade", {
            version: version,
            changelog: changelog,
            api: this
        })));
    }
    getTagInfo(tag) {
        let ret = {};
        const labelType = ["label-info", "label-warning", "label-primary", "label-success", "label-danger"];
        this._tags.forEach(function (elem, i) {
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
    getObjectInfo(object) {
        let ret = {};
        this._objects.forEach(function (elem) {
            if (elem.id === "object-" + object.toLowerCase().replace(/ /g, "-")) {
                ret = {
                    name: elem.name,
                    link: elem.id
                };
            }
        });
        return ret;
    }
    getErrorInfo(error) {
        let ret = undefined;
        this._errors.forEach(function (elem) {
            if (elem.id === error) {
                ret = elem;
            }
        });
        return ret;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get paragraphs() {
        return this._paragraphs;
    }
    get tags() {
        return this._tags;
    }
    get routes() {
        return this._routes;
    }
    get objects() {
        return this._objects;
    }
    get errors() {
        return this._errors;
    }
    getDeclaredSymbols() {
        let symbols = [];
        this._paragraphs.forEach(function (elem) {
            elem.buildId();
            symbols.push(...elem.getDeclaredSymbol());
        });
        this._tags.forEach(function (elem) {
            elem.buildId();
            symbols.push(...elem.getDeclaredSymbol());
        });
        this._routes.buildId();
        symbols.push(...this._routes.getDeclaredSymbol());
        this._errors.forEach(function (elem) {
            elem.buildId();
            symbols.push(...elem.getDeclaredSymbol());
        });
        this._objects.forEach(function (elem) {
            elem.buildId();
            symbols.push(...elem.getDeclaredSymbol());
        });
        return symbols;
    }
    getDependencySymbol() {
        let symbols = [];
        this._paragraphs.forEach(function (elem) {
            symbols.push(...elem.getDependencySymbol(["api", "paragraph"]));
        });
        symbols.push(...this._routes.getDependencySymbol(["api", "routes"]));
        this._errors.forEach(function (elem) {
            symbols.push(...elem.getDependencySymbol(["api", "errors"]));
        });
        this._objects.forEach(function (elem) {
            symbols.push(...elem.getDependencySymbol(["api", "objects"]));
        });
        this._tags.forEach(function (elem) {
            symbols.push(...elem.getDependencySymbol(["api", "tags"]));
        });
        return symbols;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = APIDefintion;
