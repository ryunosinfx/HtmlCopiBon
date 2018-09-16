import {ActionCreator} from '../../util/reactive/actionCreator'
export class MenuSelectActionCreator {
  constructor() {}
  static creatSelectAction(targetView, data, storeKey = null) {
    return ActionCreator.createBaseAction("selectMenu", targetView, data, storeKey);
  }
  static getStoreKey(){
    return "menuSelect";
  }
}
