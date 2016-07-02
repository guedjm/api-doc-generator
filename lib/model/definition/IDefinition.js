"use strict";
const url_1 = require("./url");
const group_1 = require("./group");
function buildRoute(route) {
    for (let r in route) {
        if (r.startsWith("/")) {
            return new url_1.default(route);
        }
        else {
            return new group_1.default(route);
        }
    }
    throw new Error("Invalid route: " + route);
}
exports.buildRoute = buildRoute;
