import {SplashActionCreator} from '../action/splashActionCreator'
import {MainService} from "../../service/mainService"
import {BaseReducer} from '../../util/reactive/baseReducer'
let splashViewReducer = null;
export class SplashViewReducer extends BaseReducer {
  constructor() {
    super();
    this.splashAddAction = SplashActionCreator.creatAddAction();
    this.splashRemoveAction = SplashActionCreator.creatRemoveAction();
    this.atatch(this.splashAddAction);
    this.atatch(this.splashRemoveAction);
    this.storeKey = "progress";
    this.addInitializeKey(this.storeKey);
  }
  static register() {
    if (!splashViewReducer) {
      splashViewReducer = new SplashViewReducer();
    }
  }
  async reduce(store, action) {
    if (this.splashAddAction.type === action.type) {
      store[this.storeKey] = this.createProgress(true, 0, false, action.data.msg, action.data.title);
    } else if (this.splashRemoveAction.type === action.type) {
      store[this.storeKey] = this.createProgress(false, 0, false);
    }
    return store;
  }
  createProgress(isVisible, progress, isComple, msg, title) {
    return {isVisible: isVisible, progress: progress, msg: msg, isComple: isComple, title: title}
  }
}
