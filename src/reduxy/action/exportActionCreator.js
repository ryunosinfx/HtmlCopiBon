import {ActionCreator} from '../../util/reactive/actionCreator'
export class TitleActionCreator {
  constructor() {}
  static createExecuteAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("executeExport", targetView, data, storeKey);
  }
  static creatRemoveAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("removeExported", targetView, data, storeKey);
  }
  static creatLoadAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("loadExported", targetView, data, storeKey);
  }
  static createExecutePdfAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("executePdfExport", targetView, data, storeKey);
  }
  static createExecutePdfAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("executeImgZipExport", targetView, data, storeKey);
  }
  static getStoreKey(){
    return "exports";
  }
}
