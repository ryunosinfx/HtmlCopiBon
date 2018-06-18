import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class PageImage  extends BaseView {
  constructor(listing) {
    super("PageImage"+listing, "PageImage");
  }
  // renderA() {
  //   const button = vu.create(null, "PageImageA", this.id);
  //   vu.append(this.elm, button);
  //   return this.elm;
  // }
  render() {
    this.button = div(this.id+"child", "PageImageA", this.id);
    return div(this.id, "PageImage", [this.button]);
  }
}
