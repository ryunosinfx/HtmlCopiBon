import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class TitleMng  extends BaseView {
  constructor() {
    super("TitleMng", "TitleMng");
    this.text="TitleMng";
  }
  render() {
    return div(this.id, "TitleMng", this.text);
  }
  // loadTitleList
  // newTitle
  // deleteTitle
  // next Button
}
