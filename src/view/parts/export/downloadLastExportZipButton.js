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
export class DownloadLastExportZipButton extends BaseView {
  constructor() {
    super("DownloadLastExportZipButton", "DownloadLastExportZipButton", true);
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
    ], "-no export Zip-");
    return div(this.id, [this.id + "Frame"], {
    }, [text]);
  }
  onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {
    if (store[this.storeZipDLKey]) {
      const output = store[this.storeZipDLKey];
      if (output.ab) {
        FileDownloader.download(output.name, output.ab, "application/zip");
      } else {
        alert("not exported!");
      }
    } else if (store[this.storeKey]) {
      const data = store[this.storeKey];
      const zip = data.zip;;
      if (zip) {
        const exportString = zip.name + " / " + zip.orderName + " / " + unixTimeToDateFormat(zip.updateDate);
        const text = div(this.stateId, [
          "button", "enable"
        ],{
          on: {
            click: this.click()
          }
        }, "download Zip!");
        this.prePatch("#" + this.stateId, text);
        this.isExported = true;
      } else {
        const text = div(this.stateId, [
          "button", "disable"
        ], "no export Zip");
        this.prePatch("#" + this.stateId, text);
        this.isExported = false;
      }
    }
  }
  click() {
    return(event) => {
      if (this.isExported) {
        const action = ExportActionCreator.createDownloadAction(); //createDownloadPdfAction
        this.dispatch(action);
      }
      event.stopPropagation();
      return false;
    }
  }
}
