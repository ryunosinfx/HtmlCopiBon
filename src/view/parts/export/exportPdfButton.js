
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
    super("ExportPdfButton", "ExportPdfButton",true);
    this.storeKey = ExportActionCreator.getStoreKey();
  }

  render(store, actionData) {
    return div(this.id, [this.id + "Frame"],{
      on:{
        click:this.click()
      }
    }, [ div("", ["button"], "make pdf!")]);
  }
  onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {
    if(store[this.storeKey]){
      alert("OK");
    }
  }

  click(){
    return (event)=>{
      const action= ExportActionCreator.createExecutePdfAction();
      this.dispatch(action);
      event.stopPropagation();
      return false;
    }
  }
}
