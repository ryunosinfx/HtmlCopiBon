import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class Thumbnails  extends BaseView {
  constructor() {
    super("Thumnails", "Thumnails");
  }
  // renderA(store, actionData) {
  //   console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
  //   const button = vu.create("ImageDetailA", "ImageDetailA", this.id);
  //   vu.append(this.elm, button);
  //   return this.elm;
  // }
  render(store, actionData) {
    return div(this.id, "Thumnails");
  }
}
