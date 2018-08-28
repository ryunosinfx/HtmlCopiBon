import {BaseView} from "../../../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  createSelectVnode,
  span,
  label,
  checkbox
} from "../../../util/reactive/base/vtags";
import {ExportActionCreator} from '../../../reduxy/action/exportActionCreator'
import {ExportOrderRow} from './exportOrderRow'
import {dpis, ExportOrders} from "../../../settings/exportSettings";
export class ExportOrderList extends BaseView {
  constructor() {
    super("ExportOrdrList", "ExportOrdrList");
    this.exportOrderRow = new ExportOrderRow(this);
    this.storeSelectedOrderKey = ExportActionCreator.getStoreSelectedOrderKey();
    this.listId = this.id + "ListFrame";
    this.checkboxIsGrascale = "checkboxIsGrascaleAt" + this.Id;
    this.selectBoxDpiName = "selectBoxDpiNameAt" + this.Id;
    this.checkboxIsMaxSize10M = "checkboxIsMaxSize10MAt" + this.Id;
  }

  render(store, actionData) {
    const inputFrameClass = "ExportOrdrs";
    const name = div("", [inputFrameClass], "Export Orders List");
    ////
    const inputClass = "ExportOrdersOptions";
    const checkboxIsGrascale = label("",[inputClass],[checkbox(this.checkboxIsGrascale, [""],"" ),"isGrascale?"]);
    const dpiList = {};
    let firstKey = "";
    for (let dpiName in dpis) {
      firstKey = dpis[dpiName];
      break;
    }
    console.error(dpiList)

    const selectBoxDpiName = label("",[inputClass],[" ",createSelectVnode(this.selectBoxDpiName, [], "", dpis, dpiList[firstKey]),"dpi"]);
    const checkboxIsMaxSize10M =  label("",[inputClass],[checkbox(this.checkboxIsMaxSize10M, [""], ""),"isMaxSize10?"]);
    const exportOptions = div("", [inputFrameClass], ["Options:",selectBoxDpiName, checkboxIsGrascale, checkboxIsMaxSize10M]);
    ////
    const list = div(this.imageAreaID, [inputFrameClass], this.buildRows());
    return div(this.listId, [this.id + "Frame"], [name, list, exportOptions]);
  }
  onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {
    if (store[this.storeSelectedOrderKey]) {
      const selectOrder = store[this.storeSelectedOrderKey];
      const name = div("", ["ExportOrdersListTitle"], "Export Orders List");
      const list = this.buildRows(selectOrder);
      const listVnode = div(this.listId, [this.id + "Frame"], [
        name,
        div(this.imageAreaID, ["ExportOrdrs"], list)
      ]);
      this.prePatch("#" + this.listId, listVnode);
    }
  }
  getCurrentOptions() {
    const result = {
      isGrascale: document.getElementById(this.checkboxIsGrascale).checked,
      dpiName: document.getElementById(this.selectBoxDpiName).value,
      isMaxSize10M: document.getElementById(this.checkboxIsMaxSize10M).checked
    };
    return result;

  }

  buildRows(selectOrder = null) {
    return this.exportOrderRow.buildRows(selectOrder)
  }
}
