import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class TitleSettings  extends BaseView {
  constructor() {
    super("TitleSettings", "TitleSettings");
    this.text="TitleSettings";
  }
  render() {
    this.setting = div(this.id+"child", "TitleSettings", this.text);
    return div(this.id, "TitleSettings", [this.setting]);
  }
}
