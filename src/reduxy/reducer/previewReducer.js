import {PreviewActionCreator} from '../action/previewActionCreator'
import {SettingActionCreator} from '../action/settingActionCreator'
import {MainService} from "../../service/mainService"
import {BaseReducer} from '../../util/reactive/baseReducer'
import {PreviewProcessor} from '../processor/previewProcessor'
let previewReducer = null;
export class PreviewReducer extends BaseReducer {
  constructor() {
    super();
    this.ms = MainService.getInstance();
    this.tm = this.ms.tm;
    this.pvp = new PreviewProcessor();
    this.previewOpenAction = PreviewActionCreator.creatOpenAction();
    this.previewCloseAction = PreviewActionCreator.creatCloseAction();
    this.previewNextAction = PreviewActionCreator.creatNextAction();
    this.previewBackAction = PreviewActionCreator.creatBackAction();
    this.previewUpdateAction = PreviewActionCreator.creatUpdateAction();
    this.atatch(this.previewOpenAction);
    this.atatch(this.previewCloseAction);
    this.atatch(this.previewNextAction);
    this.atatch(this.previewBackAction);
    this.atatch(this.previewUpdateAction);
    this.storeKey = PreviewActionCreator.getStorePreviewKey();
    this.storeUpdateKey = PreviewActionCreator.getStoreUpdatePreviewKey();
    this.storeSettingKey = SettingActionCreator.getStoreKey();
    this.addInitializeKey(this.storeKey);
    this.addInitializeKey(this.storeUpdateKey);
    this.addInitializeKey(this.storeSettingKey);
  }
  static register() {
    if (!previewReducer) {
      previewReducer = new PreviewReducer();
    }
  }
  async reduce(store, action) {
    if (this.previewOpenAction.type === action.type) {
      const isSingle = action.data.isSingle;
      const setting = await this.tm.loadSettings().catch((e) => {
        console.log(e)
      });
      const list = await this.loadPreviews(setting, isSingle);
      store[this.storeKey] = {
        isSingle: isSingle,
        list: list,
        setting: setting
      };
    } else if (this.previewCloseAction.type === action.type) {
      store[this.storeKey] = {
        type: this.previewCloseAction.type
      };
    } else if (this.previewNextAction.type === action.type) {
      store[this.storeKey] = {
        isSingle: action.data.isSingle,
        nowSetNum: action.data.pageNo,
        type: this.previewNextAction.type
      };
    } else if (this.previewBackAction.type === action.type) {
      store[this.storeKey] = {
        isSingle: action.data.isSingle,
        nowSetNum: action.data.pageNo,
        type: this.previewBackAction.type
      };
    } else if (this.previewUpdateAction.type === action.type) {
      store[this.storeUpdateKey] = {
        pk: action.data.pk,
        page:await this.pvp.updatePage(action.data.pk,action.data.key)
      };
    }
    return store;
  }
  async loadPreviews(setting, isSingle) {
    const binaries = await this.pvp.loadPreviews();
    const list = await this.pvp.shapeListBySets(binaries, isSingle, setting);
    return list;
  }
}
