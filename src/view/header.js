import vu from "../util/viewUtil";
export default class Header {
  constructor() {}

  render(titleText) {
    const header = vu.create("header", "header");
    const title = vu.create("title", "title");
    vu.text(title, titleText)
    vu.append(header, title);
    return header;
  }
}
