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
export class TitleList extends BaseView {
  constructor() {
    super("TitleList", "TitleList");
      this.storeKey = TitleActionCreator.getStoreKey();
      this.storeCurrentKey = TitleActionCreator.getStoreCurrentKey();
  }

  render(store, actionData) {
    const name = div("", ["TitleName"], "TitleName");
    return div("", [this.id + "Frame"], [name, div(this.imageAreaID, ["ImageDetailA"], this.id + "aaaaa")]);
  }
  async onAfterAttach(store, data) {

  }

  async onViewShow(store, actionData) {
    if(store[this.storeKey]){
      alert('aaaaa');
    }else if(store[this.storeCurrentKey]){
      alert('bbbbbb');
    }
  }

  buildRows(){

  }
}
