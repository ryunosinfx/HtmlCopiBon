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
  ExportActionCreator
} from '../../../reduxy/action/exportActionCreator'
export class ExportPdfButton extends BaseView {
  constructor() {
    super("ExportPdfButton", "ExportPdfButton", true);
    this.storeSelectedOrderKey = ExportActionCreator.getStoreSelectedOrderKey();
    this.storeKey = ExportActionCreator.getStoreKey();
    this.storePdfDLKey = ExportActionCreator.getStorePdfDLKey();
    this.storeZipDLKey = ExportActionCreator.getStoreZipDLKey();
    this.storeRemoveResultKey = ExportActionCreator.getStoreRemoveResultKey();
    this.storeExportResultKey = ExportActionCreator.getStoreExportResultKey();
    this.stateId = "exportedStatePdf";
    this.isExported = false;
    this.exportOrderData = null;
  }

  render(store, actionData) {
    const buttonName = div("", ["buttonName"], "make pdf!");
    const exportedState = div(this.stateId, ["exportedStateNone"], "no export");
    return div(this.id, [this.id + "Frame"], {
      on: {
        click: this.click()
      }
    }, [div("", ["button"], [buttonName, exportedState])]);
  }
  async onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {
    if (store[this.storeKey]) {
      const data = store[this.storeKey];
      const pdf = data.pdf;
      if (pdf) {
        const exportString = pdf.name + " / " + pdf.orderName + " / " + unixTimeToDateFormat(pdf.updateDate);
        this.prePatch("#" + this.stateId, div(this.stateId, ["exportedState"], exportString));
        this.isExported = true;
      } else {
        this.prePatch("#" + this.stateId, div(this.stateId, ["exportedStateNone"], "no export"));
        this.isExported = false;;
      }
    } else if (store[this.storeExportResultKey]) {
      // console.log(data);
      alert("OK download zip file!");
    }

    if (store[this.storeSelectedOrderKey]) {
      const orderData = store[this.storeSelectedOrderKey];
      const selectOptions = orderData.selectOptions;
      const selectOrder = orderData.selectOrder;
      this.exportOrderData ={
        basePaper:selectOrder.basePaper,
        orderName:selectOrder.orderName,
        dpiName:selectOptions.dpiName,
        isGrascale:selectOptions.isGrascale,
        isMaxSize10M:selectOptions.isMaxSize10M
      }
    }
  }

  click() {
    return (event) => {
      if (!this.isExported || this.isExported && window.confirm("is export orverride ok?")) {
        const action = ExportActionCreator.createExecutePdfAction(this, {exportOrders:[this.exportOrderData]});
        this.dispatch(action);
      }
      event.stopPropagation();
      return false;
    }
  }
}
