import {Store} from './store';
import {ViewAttachQueue} from './viewAttachQueue';
import {ActionDispatcher} from './actionDispatcher'
const viewAttachQueue = new ViewAttachQueue();
const actionMap = new Map();
export class ActionDispatcherImple {
  constructor(view) {
    this.view = view;
    this.updateMap = new Map();
    this.updateQueue = [];
  }
  static add(action, reducer) {
    // console.log('ActionDispatcherImple add00:' + action);
    if (!action) {
      return false;
    }
    // console.log('ActionDispatcherImple add01:' + action.type);
    const type = action.type;
    if (!type) {
      return false;
    }
    if (actionMap.has(type)) {
      const reducers = actionMap.get(type);
      if (!reducers.includes(reducer)) {
        reducers.push(reducer);
      } else {
        return false;
      }
    } else {
      actionMap.set(type, [reducer]);
    }
    return true;
  }
  static remove(action) {
    const type = action.type;
    if (!type) {
      return false;
    }
    if (actionMap.has(type)) {
      const reducers = actionMap.get(type);
      if (!reducers.includes(reducer)) {
        const index = reducers.indexof(reducer);
        reducers.splice(index, 1)
      } else {
        return false;
      }
    }
    return true;
  }
  async dispatch(action) {
    const type = action.type;
    if (!type) {
      return false;
    }
    const data = action.data;
    const storeKey = action.storeKey;
    let store = Store.getStore(storeKey);
    let targetView = this.view;
    if (actionMap.has(type)) {
      const reducers = actionMap.get(type);
      for (let reducer of reducers) {
        //console.log("A01 dispatch type:"+type+"/reducer.reduce:"+reducer.reduce)
        await reducer.preReduce(store, action).catch((e)=>{console.log(e)});
        await reducer.reduce(store, action).catch((e)=>{console.log(e)});
        await reducer.postReduce(store, action).catch((e)=>{console.log(e)});
      }
      //console.log("A01 dispatch type:"+type+"/"+reducers[0])
      //console.log(reducers[0])
      Store.setStore(store);
    }

    let storeB = Store.getStore(storeKey);
    //console.log("A01 dispatch ")
    //console.log(storeB)
    // console.log('dispatch02');
    if (store.isOrverride && action.data.view) {
      targetView = action.data.views;
      if (this.view.onViewHide(targetView, data) === false) {
        return;
      }
      this.callUpdate(targetView, data, storeKey);
      this.view.onViewHidden(targetView, data);
    } else {
      this.callUpdate(targetView, data, storeKey);
    }
    //store = Store.getStore(storeKey);
    return true;
  }
  callUpdate(targetView, actionData, storeKey) {
    const activViews = viewAttachQueue.getActiveViewList();
    for (let activeView of activViews) {
      const store = Store.getStore(storeKey);
      if (targetView === activeView) {
        //console.log('A0 callUpdate update id:' + activeView.id);
        const promise = targetView.updateReactiveTheTargetView(store, actionData);
        if(promise){
          if(!promise.then){
            alert("your view has override method name 'updateReactiveTheTargetView'! activeView.id):"+activeView.id);
            return ;
          }
          promise.then(()=>{},(e)=>{console.log(e)});
        }else{
          console.log(activeView);
        }
      } else {
         //console.log('A0 callUpdate updateReactive id:' + activeView.id);
        const promise = activeView.updateReactive(store, actionData);
        if(promise){
          if(!promise.then){
            alert("your view has override method name 'updateReactive'! activeView.id):"+activeView.id);
            return ;
          }
          promise.then(()=>{},(e)=>{console.log(e)});
        }else{
          //console.log(activeView);
        }
      }
    }
    // console.log('callUpdate END----------------');
  }
}
