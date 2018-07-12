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

    // this.name = "";
    // this.pageNum = 0;
    // this.startPage = 0;
    // this.outputProfile = null;
    // this.createDate = Date.now();
    // this.updateDate = Date.now();
    const nameLabel = span("",[this.id +"Label"],'name:');
    const nameInput = input("",[this.id +"Label"],{porp:{value:setting.name}});
    const nameRow = div("",[this.id +"Row"],[nameLabel,nameInput]);
    const pageNumLabel = span("",[this.id +"Label"],'pageNum:');
    const pageNumInput = input("",[this.id +"Label"],{porp:{value:setting.pageNum}});
    const pageNumRow = div("",[this.id +"Row"],[pageNumLabel,pageNumInput]);
    const startPageLabel = span("",[this.id +"Label"],'startPage:');
    const startPageInput = input("",[this.id +"Label"],{porp:{value:setting.startPage}});
    const startPageRow = div("",[this.id +"Row"],[startPageLabel,startPageInput]);
    const outputProfileLabel = span("",[this.id +"Label"],'outputProfile:');
    const outputProfileInput = input("",[this.id +"Label"],{porp:{value:setting.outputProfile}});
    const outputProfileRow = div("",[this.id +"Row"],[outputProfileLabel,outputProfileInput]);
    const frameL = div("",[this.id +"FrameL"],[nameRow,pageNumRow]);
    const frameR = div("",[this.id +"FrameR"],[startPageRow,outputProfileRow]);
    const frame = div("",[this.id +"Frame"],[frameL,frameR]);
    const button = div("",[this.id +"Update"],{on:{click:this.update()}},"Save! LastUpdae:"+this.updateDate);
    const childlen = [title,frame,button];
    this.prePatch("#"+this.bodyId, div(this.bodyId,["TitleSettings"], childlen));
  }

}
