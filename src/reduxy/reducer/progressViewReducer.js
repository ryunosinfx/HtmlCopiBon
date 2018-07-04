import {
  ActionCreator
} from '../../util/reactive/actionCreator'
import {
  ProgressActionCreator
} from '../action/proggressActionCreator'

import {
  Sorter
} from "../../util/sorter";
import {
  MainService
} from "../../service/mainService"
import {
  BaseReducer
} from '../../util/reactive/baseReducer'
import {
  FileUploadExecuter
} from "../../service/fileUploadExecuter";
let imageViewReducer = null;
const loadedImageMap = new Map();
export class ProgressViewReducer extends BaseReducer {
  constructor() {
    super();
    this.ms = MainService.getInstance();
    this.vpl = this.ms.getViewPartsLoader();
    this.ip = this.ms.ip;
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
  }
  static register() {
    if (!imageViewReducer) {
      imageViewReducer = new ImageViewReducer();
    }
  }
  async reduce(store, action) {
    if (this.progressBarAddAction.type === action.type) {
      store["progress"] = this.createProgress(true, 0, false);
    } else if (this.progressBarRemoveAction.type === action.type) {
      store["progress"] = this.createProgress(false, 0, false);
    } else if (this.progressBarUpdateAction.type === action.type) {
      store["progress"] = this.createProgress(true, action.data.progress, false);
    } else if (this.progressBarCompleatSortAction.type === action.type) {
      store["progress"] = this.createProgress(true, 100, true);
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
