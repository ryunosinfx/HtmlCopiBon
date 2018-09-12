import vu from "../util/viewUtil";
import {
  BaseView
} from "../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../util/reactive/base/vtags";
export class Header extends BaseView {
  constructor(titleText) {
    super("header", "header");
    this.titleText = titleText;
    this.Version = "v0.02alpha";
  }
  render() {
    const title = span("",["MainTitle"],this.titleText);
    const version = span("",["Version"],this.Version);
    const newVnode = div("aaa",{
      style: {
        color: '#000'
      }
    }, [div("title", ["title"], [title,version])]);
    return newVnode;
  }
}
