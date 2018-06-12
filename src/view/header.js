import vu from "../util/viewUtil";
import {BaseView} from "../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class Header extends BaseView{
  constructor(parent,titleText) {
    super(parent,"header","header");
    this.titleText = titleText;
  }

  render() {
    const title = vu.create("title", "title");
    vu.text(title, this.titleText)
    vu.append(this.elm, title);
    return this.elm;
  }
}
