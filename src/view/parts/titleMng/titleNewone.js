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
export class TitleNewone extends BaseView {
  constructor() {
    super("TitleNewone", "TitleNewone");
      this.storeKey = TitleActionCreator.getStoreKey();
      this.storeCurrentKey = TitleActionCreator.getStoreCurrentKey();
  }

  render(store, actionData) {
    const name = div("", ["TitleNewone"], "TitleNewone");
    return div("", [this.id + "Frame"], [name, div(this.TitleNewoneId, ["TitleNewone"], this.id + "aaaaa")]);
  }
  async onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {
    if(store[this.storeKey]){
      alert('aaaaa');
    }else if(store[this.storeCurrentKey]){
      alert('bbbbbb');
    }
  }
  onClisck(){
      return (event) => {
        const elm = event.target;
        if(!elm.classList || !elm.classList.contains(this.thumbnail_block)){
          return
        }
        event.preventDefault(); // Necessary. Allows us to drop.
        event.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
        return false;
      }
  }
}
