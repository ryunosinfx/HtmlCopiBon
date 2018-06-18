import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class PageImages  extends BaseView {
  constructor() {
    super("PageImages", "PageImages");
  }
  // renderA(store, actionData) {
  //   const button = vu.create("PageImagesA", "PageImagesA", this.id);
  //   vu.append(this.elm, button);
  //   return this.elm;
  // }
  render() {
    this.setting = div(this.id+"child", "PageImagesA", this.id);
    return div(this.id, "PageImages", [this.setting]);
  }
}
