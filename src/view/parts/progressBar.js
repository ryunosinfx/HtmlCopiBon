import vu from "../../util/viewUtil";
import BaseView from "../baseView";
export default class ProgressBar extends BaseView{
  constructor(ancker) {
    super(ancker);
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
  }
}
