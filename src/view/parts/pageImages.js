import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
export class PageImages  extends BaseView {
  constructor(parent) {
    super(parent,"PageImages", "PageImages");
  }
  render(store, actionData) {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAA");
    const button = vu.create("PageImagesA", "PageImagesA", this.id);
    vu.append(this.elm, button);
    return this.elm;
  }
}
