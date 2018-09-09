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
import {TitleActionCreator} from '../../../reduxy/action/titleActionCreator'
export class StorageMeter extends BaseView {
  constructor() {
    super("StorageMeter", "StorageMeter");
    this.storeKey = TitleActionCreator.getStoreKey();
    this.storeCurrentKey = TitleActionCreator.getStoreCurrentKey();
  }

  render(store, actionData) {
    const name = div("", ["StorageMeter"], "Storage now usage:");
    const counter = span('', ["StorageMeterCounter"], "0");
    const unit = span('', ["StorageMeterUnit"], " byte");
    const button = span('', ["StorageMeterUnit"],{
      on:{
        click:this.ocReculc()
      }
    }, "reculc!");
    const dataFrame = div('', ["StorageMeter"], [counter, unit, button]);
    return div("", [this.id + "Frame"], [name, dataFrame]);
  }
  async onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {
    if (store[this.storeKey]) {
      const {list, totalSize} = store[this.storeKey];
      // alert('totalSize:'+totalSize);
      const counter = span('', ["StorageMeterCounter"], totalSize + "");
      this.prePatch(".StorageMeterCounter", counter);
    } else if (store[this.storeCurrentKey]) {
      alert('bbbbbb');
    }
  }
  ocReculc() {
    return(event) => {
      const action = TitleActionCreator.creatLoadAction(this);
      this.dispatch(action);
      event.preventDefault(); // Necessary. Allows us to drop.
      return false;
    }
  }
}
