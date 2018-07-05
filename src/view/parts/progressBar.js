import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class ProgressBar  extends BaseView {
  constructor() {
    super("ProgressBar", "ProgressBar");
    this.storeKey = "progress";
  }

  render() {
    return div(this.id, ["ProgressBar"],[dev('',['progeressFrame'],[dev('',['progeress'])]),dev('',['progeressPoints'])]);
  }
  async onViewShow(store, actionData) {
    if (store.progress) {
      await this.showProgress(store.progress);
      console.log("ProgressBar onViewShow");
    }
  }
  showProgress(data){
    const {isVisible, progress, isComple} = data;
    if(isVisible){

    }else{
      this.currentVnode.elm.style.display = 'none';
      this.prePatch(".progeress", div("", ["progeress"], {
        style: {
          width:0%
        }
      }));
      this.prePatch(".progeressPoints", div("", ["progeressPoints"], {
      },"0%"));
    }
  }
  ProgressBar() {
    this.elm.style.width = '0%';
    this.elm.textContent = '0%';
  }
  progress(percent) {
    this.elm.style.width = percent + '%';
    this.elm.textContent = percent + '%';
  }
  compliet() {
    this.elm.style.width = '100%';
    this.elm.textContent = '100%';
    setTimeout(()=>{this.elm.className='';}, 2000);
  }
  start() {
    this.elm  .className = 'loading';
  }
}
