import vu from "../util/viewUtil";
import {BaseView} from "../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class Footer extends BaseView {
  constructor(parent) {
    super(parent, "footer", "footer");
    this.copyright = "ryunosinfx";
  }
  render() {
    const copyright = vu.create("copyright", "copyright", this.copyright);
    vu.append(this.elm, copyright);
    return this.elm;
  }
}
