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
    this.storeKey = ExportActionCreator.getStoreKey();
    this.storePdfDLKey = ExportActionCreator.getStorePdfDLKey();
    this.storeZipDLKey = ExportActionCreator.getStoreZipDLKey();
    this.storeRemoveResultKey = ExportActionCreator.getStoreRemoveResultKey();
    this.storeExportResultKey = ExportActionCreator.getStoreExportResultKey();
    this.stateId = "exportedStateZip";
    this.isExported = false;
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
    if (store[this.storeKey]) {
      const data = store[this.storeKey];
      const zip = data.zip;
      if (zip) {
        const exportString = zip.name + " / " + zip.orderName + " / " + unixTimeToDateFormat(zip.updateDate);
        this.prePatch("#" + this.stateId, div(this.stateId, ["exportedState"], exportString));
      } else {
        this.prePatch("#" + this.stateId, div(this.stateId, ["exportedStateNone"], "no export"));
      }
    } else if (store[this.storeExportResultKey]) {
      // console.log(data);
      alert("OK download zip file!");
    }
  }

  click() {
    return(event) => {
      if (!this.isExported || this.isExported && window.confirm("is export orverride ok?")) {
        const action = ExportActionCreator.createExecuteAction();
        this.dispatch(action);
      }
      event.stopPropagation();
      return false;
    }
  }
}
