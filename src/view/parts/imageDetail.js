import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
export class ImageDetail  extends BaseView {
  constructor(parent) {
    super(parent,"ImageDetail", "ImageDetail");
  }
  render() {
    return this.elm;
  }
}
