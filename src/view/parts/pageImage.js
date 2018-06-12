import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class PageImage  extends BaseView {
  constructor(parent,listing) {
    super(parent,"PageImage"+listing, "PageImage");
  }
  render() {
    const button = vu.create(null, "PageImageA", this.id);
    vu.append(this.elm, button);
    return this.elm;
  }
}
