import vu from "../../util/viewUtil";
import {unixTimeToDateFormat} from "../../util/timeUtil";
import {BaseView} from "../../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label,
  select,
  option,
  createSelectVnode
} from "../../util/reactive/base/vtags";
import {SettingViewReducer} from '../../reduxy/reducer/settingViewReducer'
import {SettingData} from '../../settings/exportSettings'
import {SettingActionCreator} from '../../reduxy/action/settingActionCreator'
export class TitleSettings extends BaseView {
  constructor() {
    super("TitleSettings", "TitleSettings");
    this.text = "TitleSettingsAAA";
    this.bodyId = this.id + "Child";
    this.storeKey = SettingActionCreator.getStoreKey();
    this.getStoreKeyOpm = SettingActionCreator.getStoreKeyOpm();
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
    console.log("TitleSettings onViewShow 01 this.storeKey:" + this.storeKey + '/' + store[this.storeKey]);
    if (store[this.storeKey]) {
      await this.showSettings(store[this.storeKey], store[this.getStoreKeyOpm]);
    }
  }
  update() {
    return(event) => {
      const nameInput = document.getElementById(this.id + "NameInput").value;
      const pageNumInput = document.getElementById(this.id + "PageNumInput").value;
      const startPageInput = document.getElementById(this.id + "StartPageInput").value;
      const pageDirectionInput = document.getElementById(this.id + "PageDirectionInput").value;
      const outputProfileInput = document.getElementById(this.id + "OutputProfileInput").value;

      //alert("update NameInput:" + nameInput + "/" + pageNumInput + "/" + startPageInput + "/" + pageDirectionInput + "/" + outputProfileInput)
      //data.name, data.pageNum, data.startPage,, data.startPage, data.outputProfile, data.listing);
      const action = SettingActionCreator.creatUpdateAction(this, {
        name: nameInput,
        pageNum: pageNumInput,
        startPage: startPageInput,
        pageDirection: pageDirectionInput,
        outputProfile: outputProfileInput,
        listing: 0
      });
      this.dispatch(action);
    }
  }
  async showSettings(setting, outputProfiles) {
    console.log(setting);
    console.log(outputProfiles);
    const labelClass = this.id + "Label";
    const inputClass = this.id + "Input";
    const title = div("", [this.id + "Title"], "Setting for Output");
    const nameLabel = span("", [labelClass], 'name:');
    const nameInput = input(this.id + "NameInput", [this.id + "NameInput"], {
      props: {
        name: this.id + "NameInput"
      }
    }, "text", setting.name);
    const nameRow = div("", [this.id + "Row"], [nameLabel, nameInput]);
    const pageNumLabel = span("", [labelClass], 'pageNum:');
    const idpageNumInput = this.id + "PageNumInput";
    const pageNumInput = createSelectVnode(idpageNumInput, [
      inputClass, idpageNumInput
    ], idpageNumInput, SettingData.pageNums, setting.pageNum);
    const pageNumRow = div("", [this.id + "Row"], [pageNumLabel, pageNumInput]);

    const startPageLabel = span("", [labelClass], 'startPage:');
    const idStartPageInput = this.id + "StartPageInput";
    const startPageInput = createSelectVnode(idStartPageInput, [
      inputClass, idStartPageInput
    ], idStartPageInput, SettingData.pageStart, setting.startPage);
    const startPageRow = div("", [this.id + "Row"], [startPageLabel, startPageInput]);

    const pageDirectionLabel = span("", [labelClass], 'pageDirection:');
    const idPageDirectionInput = this.id + "PageDirectionInput";
    const pageDirectionInput = createSelectVnode(idPageDirectionInput, [
      inputClass, idPageDirectionInput
    ], idPageDirectionInput, SettingData.pageDirection, setting.pageDirection);
    const pageDirectionRow = div("", [this.id + "Row"], [pageDirectionLabel, pageDirectionInput]);

    const outputProfileLabel = span("", [labelClass], 'outputProfile:');
    const idOutputProfileInput = this.id + "OutputProfileInput";
    const outputProfileInput = input(idOutputProfileInput, [
      inputClass, idOutputProfileInput
    ], {
      props: {
        name: idOutputProfileInput
      }
    }, "text", setting.outputProfile);
    const outputProfileRow = div("", [this.id + "Row"], [outputProfileLabel, outputProfileInput]);
    const frameL = div("", [this.id + "FrameL"], [nameRow, pageNumRow]);
    const frameR = div("", [this.id + "FrameR"], [startPageRow, pageDirectionRow, outputProfileRow]);
    const frame = div("", [this.id + "Frame"], [frameL, frameR]);
    const button = div("", [this.id + "Update"], {
      on: {
        click: this.update()
      }
    }, "Save! LastUpdae:" + unixTimeToDateFormat(setting.updateDate));
    const childlen = [title, frame, button];
    this.prePatch("#" + this.bodyId, div(this.bodyId, ["TitleSettings"], childlen));
  }
}
