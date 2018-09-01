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
export class StorageMeter extends BaseView {
  constructor() {
    super("StorageMeter", "StorageMeter");
  }

  render(store, actionData) {
    const name = div("", ["StorageMeter"], "StorageMeter");
    return div("", [this.id + "Frame"], [name, div(this.StorageMeterId, ["StorageMeter"], this.id + "")]);
  }
  async onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {}
}
