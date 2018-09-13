import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class PrefMng  extends BaseView {
  constructor() {
    super("prefMng", "prefMng");
    this.text="prefMng";
  }
  async onAfterAttach(store, data) {
  }
  render() {
    return div(this.id, "TitleMng", this.text);
  }
  // loadTitleList
  // newTitle
  // deleteTitle
  // next Button
}
