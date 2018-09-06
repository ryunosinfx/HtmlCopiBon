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
import {TitleActionCreator} from '../../../reduxy/action/titleActionCreator'
export class StorageMeter extends BaseView {
  constructor() {
    super("StorageMeter", "StorageMeter");
      this.storeKey = TitleActionCreator.getStoreKey();
      this.storeCurrentKey = TitleActionCreator.getStoreCurrentKey();
  }

  render(store, actionData) {
    const name = div("", ["StorageMeter"], "Storage now usage:");
    const counter= span('', ["StorageMeterCounter"], "byte");
    const unit= span('', ["StorageMeterUnit"], "0");
    const dataFrame= div('', ["StorageMeter"], [counter,unit]);
    return div("", [this.id + "Frame"], [name, dataFrame]);
  }
  async onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {
    if(store[this.storeKey]){
      alert('aaaaa');
      const {list,totalSize}=store[this.storeKey];
    }else if(store[this.storeCurrentKey]){
      alert('bbbbbb');
    }}
}
