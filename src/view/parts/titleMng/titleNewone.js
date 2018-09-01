import {
  BaseView
} from "../../../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../../../util/reactive/base/vtags";
export class TitleNewone extends BaseView {
  constructor() {
    super("TitleNewone", "TitleNewone");
  }

  render(store, actionData) {
    const name = div("", ["TitleNewone"], "TitleNewone");
    return div("", [this.id + "Frame"], [name, div(this.TitleNewoneId, ["TitleNewone"], this.id + "aaaaa")]);
  }
  async onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {}
}
