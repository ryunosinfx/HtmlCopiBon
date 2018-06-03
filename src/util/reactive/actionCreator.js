const baseActions ={
    Attach: {type:"Attach"}
};
export class ActionCreator {

  constructor() {}
  static getBaseActions(){
    return baseActions;
  }
  static createAction(key, data, storeKey = null) {
    return  {
      type: key,
      data: data,
      storeKey: storeKey
    };
  }
  static creatAttachAction(parentView, newView, data, storeKey = null) {
    return {
      type: "Attach",
      data: data,
      parentView: parentView,
      selector: newView.id,
      storeKey: storeKey
    };
  }
  static createShowViewAction(key, oldVnode, selector, data, storeKey = null) {
    return ActionCreator.createGoOtherViewAction(key, null, oldVnode, selector, data, storeKey);
  }
  static createGoOtherViewAction(key, view, oldVnode, selector, data, storeKey = null) {
    let addData = data;
    if (!view && !oldVnode) {
      console.log('createGoOtherViewAction is null!');
      return {
        type: key,
        data: addData,
        storeKey: storeKey
      };
    }
    if (!data) {
      addData = {};
    }
    addData.view = view;
    addData.oldVnode = oldVnode;
    addData.selector = selector;
    return  {
      type: key,
      data: addData,
      storeKey: storeKey
    };
  }
  static isEquals(a, b) {
    if (a && b && a.type === b.type) {
      return true;
    }
    return false;
  }
}
