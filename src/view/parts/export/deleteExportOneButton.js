
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
export class DeleteExportOneButton extends BaseView {
  constructor() {
    super("DeleteExportOneButton", "DeleteExportOneButton",true);
    this.storeKey = ExportActionCreator.getStoreKey();
  }

  render(store, actionData) {
    return div(this.id, [this.id + "Frame"],{
      on:{
        click:this.click()
      }
    }, [ div("", ["button"], "delete Exports!")]);
  }
  onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {
      if (store[this.storeKey]) {
        alert("OK");
      }
  }
    click(){
      return (event)=>{
        const action= ExportActionCreator.creatRemoveAction();
        this.dispatch(action);
        event.stopPropagation();
        return false;
      }
    }
}
