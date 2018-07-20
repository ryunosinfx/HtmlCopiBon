
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
export class ExportPdfButton extends BaseView {
  constructor() {
    super("ExportPdfButton", "ExportPdfButton");
  }

  render(store, actionData) {
    const name = div("", ["TitleName"], "TitleName");
    return div("", [this.id + "Frame"], [name, div(this.imageAreaID, ["ImageDetailA"], this.id + "aaaaa")]);
  }
  onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {}

  buildRows(){

  }
}
