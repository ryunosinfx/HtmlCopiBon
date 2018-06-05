import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
export class ExportButton  extends BaseView {
  constructor(parent) {
    super(parent,"ExportButton", "ExportButton");
    this.text="ExportButton";
  }
  render() {
    const button = vu.create("ExportButtonA", "ExportButtonA", this.text);
    vu.append(this.elm, button);
    return this.elm;
  }
}
