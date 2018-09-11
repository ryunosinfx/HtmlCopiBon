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
    super("StorageInitializer", "StorageInitializer");
    this.storeKey = TitleActionCreator.getStoreKey();
    this.storeCurrentKey = TitleActionCreator.getStoreCurrentKey();
  }

  render(store, actionData) {
    const name = div("", ["StorageInitializer"], "StorageInitializer");
    const button =  div('', ["StorageInitializerButton button"],{
        on:{
          click:this.onClearAll()
        }
      }, "Init!");
    return div("", [this.id + "Frame"], [name,button]);
  }
  async onAfterAttach(store, data) {
      TitleViewReducer.register();
      const action = TitleActionCreator.creatLoadAction(this);
      this.dispatch(action);
  }

  async onViewShow(store, actionData) {
    if(store[this.storeKey]){
      const {list,totalSize}=store[this.storeKey];

    }else if(store[this.storeCurrentKey]){
      alert('bbbbbb');
    }
  }
  onClearAll(){
    return (event)=>{
      alert("onClearAll!");
      if(confirm('is Clear All Data? This Exection is Not recoverable. ')){
        const actionReload = TitleActionCreator.creatClearAllAction(this, {});
        this.dispatch(actionReload);
        event.stopPropagation();
        return false;
      }
    }
  }
}
