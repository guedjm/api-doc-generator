"use strict";
const md = require("markdown-it")();
class TextFormatter {
    static format(text) {
        text = md.render(text);
        text = text.replace(/;;;/g, "<br/>");
        const links = text.match(/{{[a-zA-Z1-9 -_\/:]*![a-zA-Z1-9 -_\/:]*}}/g);
        if (links) {
            links.forEach(function (elem) {
                const sp = elem.split("!");
                const linkTxt = sp[0].replace(/{{/g, "");
                let linkValue = sp[1].replace(/}}/g, "");
                if (linkValue.indexOf("http://") !== 0 && linkValue.indexOf("https://") !== 0) {
                    linkValue = `#${linkValue}`;
                }
                const htmlLink = `<a href="${linkValue}">${linkTxt}</a>`;
                text = text.replace(elem, htmlLink);
            });
        }
        return text;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextFormatter;
