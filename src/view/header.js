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

  renderA() {
    let newVnode = h('div', {
      style: {
        color: '#000'
      }
    }, [
      h('h1', 'i am header'),
      h('div', [
        h('span', 'login:'),
        h('span', 'activate:')
      ])
    ]);;
    return newVnode;
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
  renderB() {
    const title = vu.create("title", "title");
    vu.text(title, this.titleText)
    vu.append(this.elm, title);
    return this.elm;
  }
}
