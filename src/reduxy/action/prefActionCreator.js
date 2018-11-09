import {ActionCreator} from '../../util/reactive/actionCreator'
export class PrefActionCreator {
  constructor() {}
  static creatAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("creatPrefarence", targetView, data, storeKey);
  }
  static creatRemoveAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("removePrefarence", targetView, data, storeKey);
  }
  static creatLoadAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("loadPrefarence", targetView, data, storeKey);
  }
  static creatUpdateAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("updatePrefarence", targetView, data, storeKey);
  }
  static getStoreKey(){
    return "Prefarence";
  }
  static getStoreKeyOpm(){
    return "PrefarenceOpm";
  }
}
