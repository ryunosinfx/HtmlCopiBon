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
export class PrefList extends BaseView {
  constructor() {
    super("PrefList", "PrefList");
  }

  render(store, actionData) {
    const name = div("", ["PrefList"], "TitleName");
    return div("", [this.id + "Frame"], [name, div(this.imageAreaID, ["ImageDetailA"], this.id + "aaaaa")]);
  }
  async onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {}

  buildRows(){

  }
}
