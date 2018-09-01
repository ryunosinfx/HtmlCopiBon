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
  dispatch(action) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.dispatchExecute(action).then((data) => {
          resolve(data)
        }, (e) => {
          reject(e)
        })
      })
    })
  }
  async dispatchExecute(action) {
    const type = action.type;
    if (!type) {
      return false;
    }
    const data = action.data;
    const storeKey = action.storeKey;
    const actionClass = action.constructor;
    let store = Store.getStore(storeKey, actionClass);
    let targetView = this.view;
    if (actionMap.has(type)) {
      const reducers = actionMap.get(type);
      for (let reducer of reducers) {
        const initializeStoreKeys = reducer.getInitializeKeys();
        for (let initializeStoreKey of initializeStoreKeys) {
          store[initializeStoreKey] = null;
        }
        break;
      }
      for (let reducer of reducers) {
        //console.log("A01 dispatch type:"+type+"/reducer.reduce:"+reducer.reduce)
        await reducer.preReduce(store, action).catch((e) => {
          console.error(e)
        });
        await reducer.reduce(store, action).catch((e) => {
          console.error(e)
        });
        await reducer.postReduce(store, action).catch((e) => {
          console.error(e)
        });
      }
      //console.log("A01 dispatch type:"+type+"/"+reducers[0])
      //console.log(reducers[0])
    }
    const storeAsClones = Store.cloneStore(store, action);
    // let storeB = Store.getStore(storeKey,actionClass);
    //console.log("A01 dispatch ")
    //console.log(storeB)
    // console.log('dispatch02');
    let result = null;
    if (store.isOrverride && action.data.view) {
      targetView = action.data.views;
      if (this.view.onViewHide(targetView, data) === false) {
        return;
      }
      result = await this.callUpdate(targetView, data, storeKey, action).catch((e) => {
        console.error(e)
      });
      await this.view.onViewHidden(targetView, data);
    } else {
      result = await this.callUpdate(targetView, data, storeKey, action).catch((e) => {
        console.error(e)
      });
    }
    //store = Store.getStore(storeKey);
    Store.setStore(storeAsClones, storeKey, actionClass);
    // console.error(storeAsClones);
    // console.error(result);

    return true;
  }
  callUpdate(targetView, actionData, storeKey, action) {
    return new Promise((resolve, reject) => {
      const promises = [];
      const activViews = viewAttachQueue.getActiveViewList();
      for (let activeView of activViews) {
        const store = Store.getTemp(storeKey, action);
        if (targetView === activeView) {
          //console.log('A0 callUpdate update id:' + activeView.id);
          // console.log("activeView.updateReactiveTheTargetView:"+action.type+"/"+targetView.id);
          const promise = targetView.updateReactiveTheTargetView(store, actionData);
          if (promise) {
            if (!promise.then) {
              alert("your view has override method name 'updateReactiveTheTargetView'! activeView.id):" + activeView.id);
              reject(promise);
              return;
            }
            promises.push(promise.then(() => {}, (e) => {
              console.error(e)
            }));
          } else {
            // console.log(activeView);
          }
        } else {
          //console.log('A0 callUpdate updateReactive id:' + activeView.id);
          console.log("activeView.updateReactive:" + action.type + "/" + targetView.id);
          const promise = activeView.updateReactive(store, actionData);
          if (promise) {
            if (!promise.then) {
              alert("your view has override method name 'updateReactive'! activeView.id):" + activeView.id);
              reject(promise);
              return;
            }
            promises.push(promise.then(() => {}, (e) => {
              console.error(e)
            }));
          } else {
            //console.log(activeView);
          }
        }
      }
      if (promises.length > 0) {
        Promise.all(promises).then(resolve, reject);
      } else {
        resolve(targetView);
      }
    })

    // console.log('callUpdate END----------------');
  }
}
