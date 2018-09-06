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
import {TitleViewReducer} from '../../../reduxy/reducer/titleViewReducer'
import {TitleActionCreator} from '../../../reduxy/action/titleActionCreator'
export class StorageInitializer extends BaseView {
  constructor() {
    this.storeKey = TitleActionCreator.getStoreKey();
    this.storeCurrentKey = TitleActionCreator.getStoreCurrentKey();
    super("StorageInitializer", "StorageInitializer");
  }

  render(store, actionData) {
    const name = div("", ["StorageInitializer"], "StorageInitializer");
    return div("", [this.id + "Frame"], [name, div(this.StorageInitializerId, ["StorageInitializerA"], this.id + "aaaaa")]);
  }
  async onAfterAttach(store, data) {
      TitleViewReducer.register();
      const action = TitleActionCreator.creatLoadAction(this);
      this.dispatch(action);
  }

  async onViewShow(store, actionData) {
    if(store[this.storeKey]){
      alert('aaaaa');
      const {list,totalSize}=store[this.storeKey];

    }else if(store[this.storeCurrentKey]){
      alert('bbbbbb');
    }
  }
  onClearAll(){
    return (event)=>{
      if(confirm('is Clear All Data? This Exection is Not recoverable. ')){
        const actionReload = TitleActionCreator.creatClearAllAction(this, {});
        this.dispatch(actionReload);
        event.stopPropagation();
        return false;
      }
    }
  }
}
