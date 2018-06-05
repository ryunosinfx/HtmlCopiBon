import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
export class PageImage  extends BaseView {
  constructor(parent,listing) {
    super(parent,"PageImage"+listing, "PageImage");
  }
  render() {
    return this.elm;
  }
}
