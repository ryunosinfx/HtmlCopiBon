import vu from "../../util/viewUtil";
import BaseView from "../baseView";
export default class ProgressBar  {
  constructor() {
    this.elm = this.render();
  }
  render() {
    const elm = vu.create("ProgressBar", "ProgressBar");
    return elm;
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
