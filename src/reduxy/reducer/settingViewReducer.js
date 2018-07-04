import {
  SettingActionCreator
} from '../action/settingActionCreator'

import {
  Sorter
} from "../../util/sorter";
import {
  MainService
} from "../../service/mainService"
import {
  BaseReducer
} from '../../util/reactive/baseReducer'
let imageViewReducer = null;
const loadedImageMap = new Map();
export class SettingViewReducer extends BaseReducer {
  constructor() {
    super();
    this.ms = MainService.getInstance();
    this.vpl = this.ms.getViewPartsLoader();
    this.em = this.ms.em;
    this.tm = this.ms.tm;
    this.creatAction = SettingActionCreator.creatAction();
    this.creatRemoveAction = SettingActionCreator.creatRemoveAction();
    this.creatLoadAction = SettingActionCreator.creatLoadAction();
    this.creatUpdateAction = SettingActionCreator.creatUpdateAction();
    this.atatch(this.creatAction);
    this.atatch(this.creatRemoveAction);
    this.atatch(this.creatLoadAction);
    this.atatch(this.creatUpdateAction);
    this.storeKey = "settings";
  }
  static register() {
    if (!imageViewReducer) {
      imageViewReducer = new ImageViewReducer();
    }
  }
  async reduce(store, action) {
    if (this.creatAction.type === action.type) {
      store[this.storeKey] = this.createProgress(true, 0, false);
    } else if (this.creatRemoveAction.type === action.type) {
      store[this.storeKey] = this.createProgress(false, 0, false);
    } else if (this.creatLoadAction.type === action.type) {
      store[this.storeKey] = this.createProgress(true, action.data.progress, false);
    } else if (this.creatUpdateAction.type === action.type) {
      store[this.storeKey] = this.createProgress(true, 100, true);
    }
    return store;
  }
  createSetting(isVisible, progress, isComple) {
    return {
      isVisible: isVisible,
      progress: progress,
      isComple: isComple
    }
  }
  async load() {
    const title = await this.tm.load();
    const pk = title.setting;
    if(!pk){
      const settingEntity = new Setting();
      return settingEntity;
    }
    const settingEntity = await this.em.get(pk);
    const size = binaryEntity._ab.byteLength;
    const imageText = escape(imageEntity.name) + ' (' + (
    imageEntity.type || 'n/a') + ') - ' + size + 'bytes, last modified: ' + imageEntity.modifyDate + ' size:' + imageEntity.width + 'x' + imageEntity.height

    return {imageEntity:imageEntity,binaryEntity:binaryEntity,imageText:imageText}
  }
}
