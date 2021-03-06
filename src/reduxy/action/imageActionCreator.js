import {ActionCreator} from '../../util/reactive/actionCreator'
const baseActions = ["addImage", "removeImage", "sortImages", 'loadImages'];
export class ImageActionCreator {
  constructor() {}
  static creatAddAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("addImage", targetView, data, storeKey);
  }
  static creatRemoveAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("removeImage", targetView, data, storeKey);
  }
  static creatLoadImagesAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("loadImages", targetView, data, storeKey);
  }
  static creatSortImagesAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("sortImages", targetView, data, storeKey);
  }
  static creatChangeTitleImagesAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("changeTitle", targetView, data, storeKey);
  }
  static creatDetailAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("detail", targetView, data, storeKey);
  }
  static getStoreImagesKey(){
    return "imagesData";
  }
}
