import {ActionCreator} from '../../util/reactive/actionCreator'
export class SettingActionCreator {
  constructor() {}
  static creatAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("creatSetting", targetView, data, storeKey);
  }
  static creatRemoveAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("removeSetting", targetView, data, storeKey);
  }
  static creatLoadAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("loadSetting", targetView, data, storeKey);
  }
  static creatUpdateAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("updateSetting", targetView, data, storeKey);
  }
}
