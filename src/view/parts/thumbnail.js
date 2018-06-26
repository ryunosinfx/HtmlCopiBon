import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
import {ImageActionCreator} from '../../reduxy/action/imageActionCreator'
export class Thumnail  extends BaseView {
  constructor(index) {
    super("Thumnail"+index, "Thumnail");
    this.index= index ;
  }
  render(store, actionData) {
    this.dataLine = div(this.id+"_dataLine_"+this.index);
    this.delButton = span(this.id+"_delButton_"+this.index, "delButton", "☓");
    return div(this.id, "Thumnails");
  }
  remove(pk) {
    return (event)=>{
      if (window.confirm("delete ok?")) {
        const action = ImageActionCreator.creatRemoveAction(this, {imagePKforDelete:pk});
        this.dispatch(action);
      }
    }
  }
}
