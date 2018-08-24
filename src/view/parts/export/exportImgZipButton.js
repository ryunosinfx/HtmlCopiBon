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
  }

  render(store, actionData) {
    const butonName;
    return div(this.id, [this.id + "Frame"], {
      on: {
        click: this.click()
      }
    }, [div("", ["button"], "make zip!")]);
  }
  onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {
    if (store[this.storeKey]) {
      const data = store[this.storeKey];
      // console.log(data);
      alert("OK download zip file!");
    }
  }

  click() {
    return(event) => {
      const action = ExportActionCreator.createExecuteAction();
      this.dispatch(action);
      event.stopPropagation();
      return false;
    }
  }
}
