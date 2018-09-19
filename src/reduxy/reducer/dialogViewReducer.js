import {
  DialogActionCreator
} from '../action/dialogActionCreator'
import {
  MainService
} from "../../service/mainService"
import {
  BaseReducer
} from '../../util/reactive/baseReducer'
let dialogViewReducer = null;
export class DialogViewReducer extends BaseReducer {
  constructor() {
    super();
    this.dialogOpenAction = DialogActionCreator.creatOpenAction();
    this.dialogCloseAction = DialogActionCreator.creatCloseAction();
    this.atatch(this.dialogOpenAction);
    this.atatch(this.dialogCloseAction);
    this.storeKey = DialogActionCreator.getStoreKey();
    this.addInitializeKey(this.storeKey);
  }
  static register() {
    if (!dialogViewReducer) {
      dialogViewReducer = new DialogViewReducer();
    }
  }
  async reduce(store, action) {
    if (this.dialogOpenAction.type === action.type) {
      store[this.storeKey] = this.createDialog(true, 0, false, action.data.msg, action.data.title, action.data.nextActions);
    } else if (this.dialogCloseAction.type === action.type) {
      store[this.storeKey] = this.createDialog(false, 0, false);
    }
    return store;
  }
  createDialog(isVisible, progress, isComple, msg, title, nextActions) {
    return {
      isVisible: isVisible,
      progress: progress,
      msg: msg,
      isComple: isComple,
      title: title,
      nextActions
    }
  }
}
