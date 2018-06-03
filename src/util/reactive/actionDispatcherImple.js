import {Store} from './store';
import {ViewAttachQueue} from './viewAttachQueue';
import {ActionDispatcher} from './actionDispatcher'
const viewAttachQueue = new ViewAttachQueue();
const actionMap = new Map();
export class ActionDispatcherImple {
  constructor(view) {
    this.view = view;
  }
  static add(action, reducer) {
    console.log('ActionDispatcherImple add00' + action);
    if (!action) {
      return false;
    }
    console.log('ActionDispatcherImple add01' + action.type);
    const type = action.type;
    if (!type) {
      return false;
    }
    if (actionMap.has(type)) {
      const reducers = actionMap.get(type);
      if (!reducers.includes(reducer)) {
        reducers.push(reducers);
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
    //console.log('dispatch00 type=' + type + '/action=' + JSON.stringify(action));
    if (!type) {
      return false;
    }
    const data = action.data;
    const storeKey = action.storeKey;
    let store = Store.getStore(storeKey);
    let targetView = this.view;
    console.log('dispatch01');
    if (actionMap.has(type)) {
      const reducers = actionMap.get(type);
      for (let reducer of reducers) {
        store = await reducer.preReduce(store, action);
        store = await reducer.reduce(store, action);
        store = await reducer.postReduce(store, action);
      }
      Store.setStore(store);
    }
    console.log('dispatch02');
    if (store.isOrverride && action.data.view) {
      targetView = action.data.views;
      if (this.view.onViewHide(targetView, data) === false) {
        return;
      }
      this.callUpdate(targetView, storeKey);
      this.view.onViewHidden(targetView, data);
    } else {
      this.callUpdate(targetView, storeKey);
    }
    store = Store.getStore(storeKey);

    return true;
  }
  callUpdate(targetView, storeKey) {
    const activViews = viewAttachQueue.getActiveViewList();
    for (let activeView of activViews) {
      const store = Store.getStore(storeKey);
      if (targetView === activeView) {
        console.log('callUpdate update key:' + activeView.key);
        targetView.update(store);
      } else {
        console.log('callUpdate updateReactive key:' + activeView.key);
        activeView.updateReactive(store);
      }
    }
    console.log('callUpdate END----------------');
  }
}
