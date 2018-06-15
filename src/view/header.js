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
  }
  render() {
    const newVnode = div({
      style: {
        color: '#000'
      }
    }, [div("title", ["title"], this.titleText)]);
    alert('header!')
    return newVnode;
  }
}
