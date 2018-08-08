
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
  ExportOrderRow
} from './exportOrderRow'
export class ExportOrderList extends BaseView {
  constructor() {
    super("ExportOrdrList", "ExportOrdrList");
    this.exportOrderRow = new ExportOrderRow();
  }

  render(store, actionData) {
    const name = div("", ["ExportOrdersListTitle"], "Export Orders List");
    return div("", [this.id + "Frame"], [name, div(this.imageAreaID, ["ExportOrdrs"], this.id + "aaaaa")]);
  }
  onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {}

  buildRows(){

  }
}
