
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
import {ExportActionCreator} from '../../../reduxy/action/exportActionCreator'
import {
  ExportOrderRow
} from './exportOrderRow'
export class ExportOrderList extends BaseView {
  constructor() {
    super("ExportOrdrList", "ExportOrdrList");
    this.exportOrderRow = new ExportOrderRow(this);
    this.storeSelectedOrderKey = ExportActionCreator.getStoreSelectedOrderKey();
    this.listId = this.id + "ListFrame";
  }

  render(store, actionData) {
    const name = div("", ["ExportOrdersListTitle"], "Export Orders List");
    const list = this.buildRows()
    return div(this.listId , [this.id + "Frame"], [name, div(this.imageAreaID, ["ExportOrdrs"], list)]);
  }
  onAfterAttach(store, data) {
  }

  async onViewShow(store, actionData) {
    if (store[this.storeSelectedOrderKey]) {
      const selectOrder =store[this.storeSelectedOrderKey];
      const name = div("", ["ExportOrdersListTitle"], "Export Orders List");
      const list = this.buildRows(selectOrder);
      const listVnode = div(this.listId , [this.id + "Frame"], [name, div(this.imageAreaID, ["ExportOrdrs"], list)]);
      this.prePatch("#" + this.listId, listVnode);
    }
  }

  buildRows(selectOrder= null){
    return this.exportOrderRow.buildRows(selectOrder)
  }
}
