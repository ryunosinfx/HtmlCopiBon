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
export class DeleteExportOneButton extends BaseView {
  constructor() {
    super("DeleteExportOneButton", "DeleteExportOneButton", true);
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
    }, [div("", ["button"], "delete Exports!")]);
  }
  async onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {
    if (store[this.storeRemoveResultKey]) {
      alert("delete exports!");
      const action = ExportActionCreator.creatLoadAction(this);
      this.dispatch(action);
    }
  }
  click() {
    return(event) => {
      const action = ExportActionCreator.creatRemoveAction();
      this.dispatch(action);
      event.stopPropagation();
      return false;
    }
  }
}
