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
    this.text = "TitleSettingsAAA";
    this.bodyId = this.id + "Child";
    this.storeKey = SettingActionCreator.getStoreKey();
  }
  render() {
    return div(this.bodyId, ["TitleSettings"], this.text);
  }
  onAfterAttach(store, data) {
    SettingViewReducer.register();
    const action = SettingActionCreator.creatLoadAction(this, {});
    this.dispatch(action);
  }
  async onViewShow(store, actionData) {
    console.log("TitleSettings onViewShow 01 this.storeKey:"+this.storeKey+'/'+store[this.storeKey]);
    if (store[this.storeKey]) {
      await this.showSettings(store[this.storeKey], store[this.getStoreKeyOpm]);
    }
  }
  update(){
    return (event)=>{alert("update")}
  }
  async showSettings(setting, outputProfiles) {
    console.log(setting);
    console.log(outputProfiles);
    const title = div("",[this.id +"Title"],"Setting for Output");
    const frame = div("",[this.id +"Frame"]);
    const button = div("",[this.id +"Update"],{on:{click:this.update()}},"Save!");
    const childlen = [title,frame,button];
    this.prePatch("#"+this.bodyId, div(this.bodyId,["TitleSettings"], childlen));
      console.log("TitleSettings showSettings");
  }

}
