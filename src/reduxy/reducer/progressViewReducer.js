import {
  ProgressActionCreator
} from '../action/progressActionCreator'
import {
  MainService
} from "../../service/mainService"
import {
  BaseReducer
} from '../../util/reactive/baseReducer'
let progressViewReducer = null;
export class ProgressViewReducer extends BaseReducer {
  constructor() {
    super();
    this.ms = MainService.getInstance();
    this.vpl = this.ms.getViewPartsLoader();
    this.em = this.ms.em;
    this.tm = this.ms.tm;
    this.progressBarAddAction = ProgressActionCreator.creatAddAction();
    this.progressBarRemoveAction = ProgressActionCreator.creatRemoveAction();
    this.progressBarUpdateAction = ProgressActionCreator.creatUpdateAction();
    this.progressBarCompleatSortAction = ProgressActionCreator.creatCompleatAction();
    this.atatch(this.progressBarAddAction);
    this.atatch(this.progressBarRemoveAction);
    this.atatch(this.progressBarUpdateAction);
    this.atatch(this.progressBarCompleatSortAction);
    this.storeKey = "progress";
  }
  static register() {
    if (!progressViewReducer) {
      progressViewReducer = new ProgressViewReducer();
    }
  }
  async reduce(store, action) {
    if (this.progressBarAddAction.type === action.type) {
      store[this.storeKey] = this.createProgress(true, 0, false);
    } else if (this.progressBarRemoveAction.type === action.type) {
      store[this.storeKey] = this.createProgress(false, 0, false);
    } else if (this.progressBarUpdateAction.type === action.type) {
      store[this.storeKey] = this.createProgress(true, action.data.progress, false);
    } else if (this.progressBarCompleatSortAction.type === action.type) {
      store[this.storeKey] = this.createProgress(true, 100, true);
    }
    return store;
  }
  createProgress(isVisible, progress, isComple) {
    return {
      isVisible: isVisible,
      progress: progress,
      isComple: isComple
    }
  }
}
