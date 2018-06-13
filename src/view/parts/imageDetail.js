import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class ImageDetail  extends BaseView {
  constructor() {
    super("ImageDetail", "ImageDetail");
  }
  render(store, actionData) {
    console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
    const button = vu.create("ImageDetailA", "ImageDetailA", this.id);
    vu.append(this.elm, button);
    return this.elm;
  }
}
