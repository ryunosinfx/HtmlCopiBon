const baseActions = ["Attach"];
export class ActionCreator {
  constructor() {}
  static getBaseActions() {
    return baseActions;
  }
  static createAction(key, data, storeKey = null) {
    return {type: key, data: data, storeKey: storeKey};
  }
  static createBaseAction(type, targetView,data, storeKey = null){
    const addData = data && typeof data === "object"
      ? data
      : {};
    addData.targetView = targetView;
    addData.selector = targetView.id;
    addData.storeKey = storeKey;
    return {type:type , data: addData};
  }
  static creatAttachAction(parentView, newView, data, storeKey = null) {
    // console.log("creatAttachAction");
    // console.log(newView);
    const addData = data && typeof data === "object"
      ? data
      : {};
    //alert(newView);
    addData.parentView = parentView;
    addData.selector = newView.id;
    addData.storeKey = storeKey;
    return {type: "Attach", data: addData};
  }
  static createShowViewAction(key, oldVnode, selector, data, storeKey = null) {
    return ActionCreator.createGoOtherViewAction(key, null, oldVnode, selector, data, storeKey);
  }
  static createGoOtherViewAction(key, view, oldVnode, selector, data, storeKey = null) {
    let addData = data;
    if (!view && !oldVnode) {
      console.log('createGoOtherViewAction is null!');
      return {type: key, data: addData, storeKey: storeKey};
    }
    if (!data) {
      addData = {};
    }
    addData.view = view;
    addData.oldVnode = oldVnode;
    addData.selector = selector;
    return {type: key, data: addData, storeKey: storeKey};
  }
  static isEquals(a, b) {
    if (a && b && a.type === b.type) {
      return true;
    }
    return false;
  }
}
