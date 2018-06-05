import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
export class TitleSettings  extends BaseView {
  constructor(parent) {
    super(parent,"TitleSettings", "TitleSettings");
    this.text="TitleSettings";
  }
  render() {
    const settings = vu.create("TitleSettingsA", "TitleSettingsA", this.text);
    vu.append(this.elm, settings);
    return this.elm;
  }
}
