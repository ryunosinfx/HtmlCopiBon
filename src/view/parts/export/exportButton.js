
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
import {
  ExportImgZipButton
} from "./exportImgZipButton";
export class ExportButton extends BaseView {
  constructor() {
    super("ExportButton", "ExportButton");
  }

  render(store, actionData) {
    return div("", ["ExportButton"], "Export!!");
  }
  onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {}

  buildRows(){

  }
}
