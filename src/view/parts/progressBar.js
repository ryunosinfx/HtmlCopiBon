import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class ProgressBar  extends BaseView {
  constructor() {
    super("ProgressBar", "ProgressBar");
  }

  render() {
    return div(this.id, ["ProgressBar"],[dev('',['progeress']),dev('',['progeressPoints'])]);
  }
  init() {
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
