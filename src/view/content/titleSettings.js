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
  label,
  select,
  option
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
      document.getElementByName()[0]
      alert("update")
    }
  }
  async showSettings(setting, outputProfiles) {
    console.log(setting);
    console.log(outputProfiles);
    const title = div("", [this.id + "Title"], "Setting for Output");
    const nameLabel = span("", [this.id + "Label"], 'name:');
    const nameInput = input("", [this.id + "Input"], {
      props: {
        name: this.id + "NameInput"
      }
    }, "text", setting.name);
    const nameRow = div("", [this.id + "Row"], [nameLabel, nameInput]);
    const pageNumLabel = span("", [this.id + "Label"], 'pageNum:');
    const pageNumInput = input("", [this.id + "Input"], {
      props: {
        name: this.id + "PageNumInput"
      }
    }, "text", setting.pageNum);
    const pageNumRow = div("", [this.id + "Row"], [pageNumLabel, pageNumInput]);
    const startPageLabel = span("", [this.id + "Label"], 'startPage:');

    const startPageInput = this.createSelectVnode("", [], this.id + "StartPageInput", SettingData.pageStart, setting.startPage);
    const startPageRow = div("", [this.id + "Row"], [startPageLabel, startPageInput]);

    const pageDirectionLabel = span("", [this.id + "Label"], 'pageDirection:');
    const pageDirectionInput = this.createSelectVnode("", [], this.id + "pageDirectionInput", SettingData.pageDirection, setting.pageDirection);
    const pageDirectionRow = div("", [this.id + "Row"], [pageDirectionLabel, pageDirectionInput]);

    const outputProfileLabel = span("", [this.id + "Label"], 'outputProfile:');
    const outputProfileInput = input("", [this.id + "Input"], {
      props: {
        name: this.id + "NameInput"
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
    }, "Save! LastUpdae:" + setting.updateDate);
    const childlen = [title, frame, button];
    this.prePatch("#" + this.bodyId, div(this.bodyId, ["TitleSettings"], childlen));
  }
  createSelectVnode(id, classes, name, optionsData, selectedValue) {
    const options = [];
    for (let key in optionsData) {
      const text = optionsData[key];
      for (let key in optionsData) {
        // alert("selectedValue:" + selectedValue + "/key:" + key + "/" + (        selectedValue === key))
        if (key === selectedValue) {
          const optionSelected = option("", [""], {
            attrs: {
              value: key,
              selected: "true"
            }
          }, text);
          options.push(optionSelected);
        } else {
          const optionNode = option("", [""], {
            attrs: {
              value: key
            }
          }, text);
          options.push(optionNode);
        }
      }
      return select("", [this.id + "Input"], {
        props: {
          name: name
        }
      }, options);
    }
  }
}
