"use strict";

const md: any = require("markdown-it")();

export default class TextFormatter {

  public static format(text: string): string {

    text = md.render(text);

    text = text.replace(/;;;/g, "<br/>");

    const links: string[] = text.match(/{{[a-zA-Z1-9 -_\/:]*![a-zA-Z1-9 -_\/:]*}}/g);

    if (links) {

      links.forEach(function(elem: string): void {
        const sp: string[] = elem.split("!");
        const linkTxt: string = sp[0].replace(/{{/g, "");
        let linkValue: string = sp[1].replace(/}}/g, "");

        if (linkValue.indexOf("http://") !== 0 && linkValue.indexOf("https://") !== 0) {
          linkValue = `#${linkValue}`;
        }

        const htmlLink: string = `<a href="${linkValue}">${linkTxt}</a>`;
        text = text.replace(elem, htmlLink);
      });
    }

    return text;
  }
}
