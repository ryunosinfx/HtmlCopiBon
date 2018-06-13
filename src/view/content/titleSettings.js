import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class TitleSettings  extends BaseView {
  constructor() {
    super("TitleSettings", "TitleSettings");
    this.text="TitleSettings";
  }
  render() {
    const settings = vu.create("TitleSettingsA", "TitleSettingsA", this.text);
    vu.append(this.elm, settings);
    return this.elm;
  }
}
