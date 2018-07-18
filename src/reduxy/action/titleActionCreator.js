import {ActionCreator} from '../../util/reactive/actionCreator'
export class TitleActionCreator {
  constructor() {}
  static creatAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("creatTitle", targetView, data, storeKey);
  }
  static creatRemoveAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("removeTitle", targetView, data, storeKey);
  }
  static creatLoadAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("loadTitle", targetView, data, storeKey);
  }
  static creatUpdateAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("updateTitle", targetView, data, storeKey);
  }
  static getStoreKey(){
    return "titles";
  }
}
