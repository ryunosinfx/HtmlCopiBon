import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class PageImage  extends BaseView {
  constructor(listing) {
    super("PageImage"+listing, "PageImage");
  }
  render() {
    this.button = div(this.id+"child", "PageImageA", this.id);
    return div( [this.button]);
  }
}
