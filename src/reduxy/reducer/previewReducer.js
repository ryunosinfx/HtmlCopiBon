import {
  PreviewActionCreator
} from '../action/previewActionCreator'
import {
  SettingActionCreator
} from '../action/settingActionCreator'
import {
  MainService
} from "../../service/mainService"
import {
  BaseReducer
} from '../../util/reactive/baseReducer'
import {PreviewProcessor} from '../processor/previewProcessor'
let previewReducer = null;
export class PreviewReducer extends BaseReducer {
  constructor() {
    super();
    this.pvp = new PreviewProcessor();
    this.previewOpenAction = PreviewActionCreator.creatOpenAction();
    this.previewCloseAction = PreviewActionCreator.creatCloseAction();
    this.previewNextAction = PreviewActionCreator.creatNextAction();
    this.previewBackAction = PreviewActionCreator.creatBackAction();
    this.atatch(this.previewOpenAction);
    this.atatch(this.previewCloseAction);
    this.atatch(this.previewNextAction);
    this.atatch(this.previewBackAction);
    this.storeKey = PreviewActionCreator.getStorePreviewKey();
    this.storeSettingKey = SettingActionCreator.getStoreKey();
  }
  static register() {
    if (!previewReducer) {
      previewReducer = new PreviewReducer();
    }
  }
  async reduce(store, action) {
    if (this.previewOpenAction.type === action.type) {
      store[this.storeKey] = {isSingle:this.previewOpenAction.data.isSingle,list:await this.loadPreviews()};
      store[this.storeSettingKey] = await this.load().catch((e)=>{console.log(e)}) ;
    } else if (this.previewCloseAction.type === action.type) {
      store[this.storeKey] = {type:this.previewOpenAction.type};
    } else if (this.previewNextAction.type === action.type) {
      store[this.storeKey] = {isSingle:this.previewOpenAction.data.isSingle,nowSetNum:this.previewOpenAction.data.isSingle,type:this.previewOpenAction.type};
    } else if (this.previewBackAction.type === action.type) {
      store[this.storeKey] = {isSingle:this.previewOpenAction.data.isSingle,nowSetNum:this.previewOpenAction.data.isSingle,type:this.previewOpenAction.type};
    }
    return store;
  }
  async loadPreviews() {
    return await this.pvp.loadPreviews();
  }
  async load() {
    return this.tm.loadSettings();
  }
}
