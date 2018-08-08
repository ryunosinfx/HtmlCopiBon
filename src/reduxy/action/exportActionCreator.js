import {ActionCreator} from '../../util/reactive/actionCreator'
export class ExportActionCreator {
  constructor() {}
  static createExecuteAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("executeExport", targetView, data, storeKey);
  }
  static creatExecuteAllAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("executeExportAll", targetView, data, storeKey);
  }
  static creatRemoveAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("removeExported", targetView, data, storeKey);
  }
  static creatLoadAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("loadExported", targetView, data, storeKey);
  }
  static createDownloadAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("downloadExport", targetView, data, storeKey);
  }
  static createExecutePdfAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("executePdfExport", targetView, data, storeKey);
  }
  static createDownloadPdfAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("edownloadPdfExport", targetView, data, storeKey);
  }
  static getStoreKey(){
    return "exports";
  }
}
