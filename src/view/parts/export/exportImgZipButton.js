import {BaseView} from "../../../util/reactive/baseView";
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

import {unixTimeToDateFormat} from "../../../util/timeUtil";
import {ExportActionCreator} from '../../../reduxy/action/exportActionCreator'
import {FileDownloader} from "../../../util/fileDownloader";
export class ExportImgZipButton extends BaseView {
  constructor() {
    super("ExportImgZipButton", "ExportImgZipButton", true);
    this.storeSelectedOrderKey = ExportActionCreator.getStoreSelectedOrderKey();
    this.storeKey = ExportActionCreator.getStoreKey();
    this.storePdfDLKey = ExportActionCreator.getStorePdfDLKey();
    this.storeZipDLKey = ExportActionCreator.getStoreZipDLKey();
    this.storeRemoveResultKey = ExportActionCreator.getStoreRemoveResultKey();
    this.storeExportResultKey = ExportActionCreator.getStoreExportResultKey();
    this.stateId = "exportedStateZip";
    this.isExported = false;
    this.exportOrderData = null;
  }

  render(store, actionData) {
    const buttonName = div("", ["buttonName"], "make zip!");
    const exportedState = div(this.stateId, ["exportedStateNone"], "no export");
    return div(this.id, [this.id + "Frame"], {
      on: {
        click: this.click()
      }
    }, [div("", ["button"], [buttonName, exportedState])]);
  }
  onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {
    if (store[this.storeExportResultKey]) {
      const isSuccess = this.buildButton(store[this.storeExportResultKey]);
      if (isSuccess) {
        alert("OK download zip file!:" + JSON.stringify(store[this.storeExportResultKey]) + "/this.isExported:" + this.isExported);
      }
    } else if (store[this.storeKey]) {
      //alert(JSON.stringify(store[this.storeKey]));
      this.buildButton(store[this.storeKey]);
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
  buildButton(exports) {
    if (exports && exports.zip) {
      const zip = exports.zip
      const exportString = "*Last Exported One* " +zip.name + " / " + zip.orderName + " /size: "+ zip.size+"byte / " + unixTimeToDateFormat(zip.updateDate);
      this.prePatch("#" + this.stateId, div(this.stateId, ["exportedState"], exportString));
      this.isExported = true;
      return true;
      // console.log(data);
      //alert("OK download zip file!:" + JSON.stringify(exports) + "/this.isExported:" + this.isExported);

    } else {
      this.isExported = false;
      this.prePatch("#" + this.stateId, div(this.stateId, ["exportedStateNone"], "no export"));
      return false;
      // console.log(data);
      //alert("OK download zip file!:" + JSON.stringify(exports) + "/this.isExported:" + this.isExported);
    }
  }

  click() {
    return(event) => {
      if(!this.exportOrderData){
        alert("Export Order is not Selected!");
        return
      }
      if (!this.isExported || this.isExported && window.confirm("is export orverride ok?")) {
        const action = ExportActionCreator.createExecuteAction(this, {exportOrders:[this.exportOrderData]});
        this.dispatch(action);
      }
      event.stopPropagation();
      return false;
    }
  }
}
