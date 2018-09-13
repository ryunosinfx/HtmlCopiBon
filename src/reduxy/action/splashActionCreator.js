import {ActionCreator} from '../../util/reactive/actionCreator'
export class SplashActionCreator {
  constructor() {}
  static creatAddAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("addSplashr", targetView, data, storeKey);
  }
  static creatRemoveAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("removeSplash", targetView, data, storeKey);
  }
  static getStoreKey(){
    return "splash";
  }
}
