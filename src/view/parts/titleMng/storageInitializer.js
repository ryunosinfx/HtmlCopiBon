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
export class StorageInitializer extends BaseView {
  constructor() {
    super("StorageInitializer", "StorageInitializer");
  }

  render(store, actionData) {
    const name = div("", ["StorageInitializer"], "StorageInitializer");
    return div("", [this.id + "Frame"], [name, div(this.StorageInitializerId, ["StorageInitializerA"], this.id + "aaaaa")]);
  }
  onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {}
}
