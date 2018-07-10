import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../../util/reactive/base/vtags";
import {
  SettingViewReducer
} from '../../reduxy/reducer/settingViewReducer'
import {SettingActionCreator} from '../../reduxy/action/settingActionCreator'
export class TitleSettings extends BaseView {
  constructor() {
    super("TitleSettings", "TitleSettings");
    this.text = "TitleSettings";
    this.storeKey = SettingActionCreator.getStoreKey();
  }
  render() {
    this.setting = div(this.id + "child", "TitleSettings", this.text);
    return div(this.id, "TitleSettings", [this.setting]);
  }
  onAfterAttach(store, data) {
    SettingViewReducer.register();
    const action = SettingActionCreator.creatLoadAction(this, {});
    this.dispatch(action);
  }
  async onViewShow(store, actionData) {
    if (store[this.storeKey]) {
      console.log("TitleSettings onViewShow");
      await this.showSettings(store[this.storeKey], store[this.getStoreKeyOpm]);
    }
  }
  showSettings(setting, outputProfiles) {
    console.log(setting);
    console.log(outputProfiles);

  }

}
