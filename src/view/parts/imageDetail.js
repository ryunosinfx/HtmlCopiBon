import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
export class ImageDetail  extends BaseView {
  constructor(parent) {
    super(parent,"ImageDetail", "ImageDetail");
  }
  render() {
    const button = vu.create("ImageDetailA", "ImageDetailA", this.id);
    vu.append(this.elm, button);
    return this.elm;
  }
}
