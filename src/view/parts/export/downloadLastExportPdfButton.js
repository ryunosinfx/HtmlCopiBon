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
export class DownloadLastExportPdfButton extends BaseView {
  constructor() {
    super("DownloadLastExportPdfButton", "DownloadLastExportPdfButton", true);
    this.storeKey = ExportActionCreator.getStoreKey();
    this.storePdfDLKey = ExportActionCreator.getStorePdfDLKey();
    this.storeZipDLKey = ExportActionCreator.getStoreZipDLKey();
    this.storeRemoveResultKey = ExportActionCreator.getStoreRemoveResultKey();
    this.storeExportResultKey = ExportActionCreator.getStoreExportResultKey();
    this.stateId = this.id + "Button";
    this.isExported = false;
  }

  render(store, actionData) {
    const text = div(this.stateId, [
      "button", "disable"
    ], "-no export PDF-");
    const result = div(this.id, [
      this.id + "Frame"
    ], {
      on: {
        click: this.click()
      }
    }, [text]);
    return result;
  }
  async onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {
    if (store[this.storePdfDLKey]) {
      const output = store[this.storePdfDLKey];
      if (output.ab) {
        FileDownloader.download(output.name, output.ab, "application/pdf");
      } else {
        alert("not exported!");
      }
    } else if (store[this.storeKey]) {
      const data = store[this.storeKey];
      const pdf = data.pdf;
      if (pdf) {
        const exportString = pdf.name + " / " + pdf.orderName + " / " + unixTimeToDateFormat(pdf.updateDate);
        const text = div(this.stateId, [
          "button", "enable"
        ], "download PDF!");
        this.prePatch("#" + this.id, div(this.id, [
          this.id + "Frame",
          "enable"
        ], {
          on: {
            click: this.click()
          }
        }, [text]));
        this.isExported = true;
      } else {
        const text = div(this.stateId, [
          "button", "disable"
        ], "no export PDF");
        this.prePatch("#" + this.id, div(this.id, [
          this.id + "Frame",
          "disable"
        ], {
          on: {
            click: this.click()
          }
        }, [text]));
        this.isExported = false;
      }
    }
  }
  click() {
    return(event) => {
      if (this.isExported) {
        const action = ExportActionCreator.createDownloadPdfAction(); //createDownloadPdfAction
        this.dispatch(action);
      }
      event.stopPropagation();
      return false;
    }
  }
}
