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
export class ExportAllButton extends BaseView {
  constructor() {
    super("ExportAllButton", "ExportAllButton", true);
    this.storeKey = ExportActionCreator.getStoreKey();
    this.storePdfDLKey = ExportActionCreator.getStorePdfDLKey();
    this.storeZipDLKey = ExportActionCreator.getStoreZipDLKey();
    this.storeRemoveResultKey = ExportActionCreator.getStoreRemoveResultKey();
    this.storeExportResultKey = ExportActionCreator.getStoreExportResultKey();
  }

  render(store, actionData) {
    return div(this.id, [this.id + "Frame"], {
      on: {
        click: this.click()
      }
    }, [div("", ["button"], "make zip and pdf!")]);
  }
  onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {
    if (store[this.storeKey]) {
      const result = store[this.storeKey];
      if (result.pdf && result.zip) {
        alert("OK All Exported!");
      }
    }
  }
  click() {
    return(event) => {
      const action = ExportActionCreator.creatExecuteAllAction();
      this.dispatch(action);
      event.stopPropagation();
      return false;
    }
  }
}
