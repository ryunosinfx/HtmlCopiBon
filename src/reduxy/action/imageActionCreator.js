const baseActions = ["addImage","removeImage","sortImages"];
export class ImageActionCreator {
  constructor() {}
  static getBaseActions() {
    return baseActions;
  }
  static createAction(key, data, storeKey = null) {
    return {type: key, data: data, storeKey: storeKey};
  }
  static creatAddAction(data, storeKey = null) {
    // console.log("creatAttachAction");
    // console.log(newView);
    const addData = data && typeof data === "object"
      ? data
      : {};
    //alert(newView);
    addData.parentView = parentView;
    addData.selector = newView.id;
    addData.storeKey = storeKey;
    return {type: "addImage", data: addData};
  }

}
