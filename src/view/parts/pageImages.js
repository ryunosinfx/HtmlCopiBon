import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
export class PageImages  extends BaseView {
  constructor(parent) {
    super(parent,"PageImages", "PageImages");
  }
  render() {
    return this.elm;
  }
}
