import vu from "../util/viewUtil";
import {BaseView} from "../util/reactive/baseView";
export class Header extends BaseView{
  constructor(parent) {
    super(parent,"header","header");
  }

  render(titleText) {
    const title = vu.create("title", "title");
    vu.text(title, titleText)
    vu.append(this.elm, title);
    return this.elm;
  }
}
