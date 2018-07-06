import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class ExportButton  extends BaseView {
  constructor() {
    super("ExportButton", "ExportButton");
    this.text="ExportButton";
  }
  render() {
    const button = div(this.id, "ExportButton", this.text);
    return button;
  }
}
