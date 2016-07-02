"use strict";
const group_1 = require("./group");
const url_1 = require("./url");
class APIRoute {
    constructor(routes) {
        this._groups = [];
        this._url = [];
        this.parse(routes);
    }
    get id() {
        return "";
    }
    get groups() {
        return this._groups;
    }
    get urls() {
        return this._url;
    }
    buildId(base) {
        this._groups.forEach(function (group) {
            group.buildId("routes");
        });
        this._url.forEach(function (url) {
            url.buildId("routes");
        });
    }
    getDeclaredSymbol() {
        let declaredSymbols = [];
        this._groups.forEach(function (group) {
            declaredSymbols.push(...group.getDeclaredSymbol());
        });
        this._url.forEach(function (url) {
            declaredSymbols.push(...url.getDeclaredSymbol());
        });
        return declaredSymbols;
    }
    getDependencySymbol(stack) {
        let dependencySymbol = [];
        this._groups.forEach(function (group) {
            dependencySymbol.push(...group.getDependencySymbol(stack));
        });
        this._url.forEach(function (url) {
            dependencySymbol.push(...url.getDependencySymbol(stack));
        });
        return dependencySymbol;
    }
    formatText() {
        this._groups.forEach(function (group) {
            group.formatText();
        });
        this._url.forEach(function (url) {
            url.formatText();
        });
    }
    parse(routes) {
        const apiRoute = this;
        routes.forEach(function (route) {
            for (let r in route) {
                if (route.hasOwnProperty(r)) {
                    if (r.startsWith("/")) {
                        apiRoute._url.push(new url_1.default(route));
                    }
                    else {
                        apiRoute._groups.push(new group_1.default(route));
                    }
                }
            }
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = APIRoute;
