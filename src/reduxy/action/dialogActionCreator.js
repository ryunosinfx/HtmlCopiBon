import {ActionCreator} from '../../util/reactive/actionCreator'
export class DialogActionCreator {
  constructor() {}
  static creatOpenAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("openDialog", targetView, data, storeKey);
  }
  static creatAlertAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("openAlertDialog", targetView, data, storeKey);
  }
  static creatConfirmAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("openConfirmDialog", targetView, data, storeKey);
  }
  static creatCloseAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("closeDialog", targetView, data, storeKey);
  }
  static getStoreKey(){
    return "dialog";
  }
}
