
import {ActionCreator} from './actionCreator'
import {ActionDispatcherImple} from './actionDispatcherImple'
export class BaseReducer {
  constructor(isBaseUse) {
    this.isBaseUse = isBaseUse;
    if(isBaseUse){
      const baseActions = ActionCreator.getBaseActions();
      for(let index in baseActions){
        const type = baseActions[index];
        this.atatch({type:type});
      }
    }
  }
  atatch(action) {
    ActionDispatcherImple.add(action, this);
  }
  detach(action) {
    ActionDispatcherImple.delete(action, this);
  }
  async preReduce(store, action) {
    store.isOrverride = false;
    return store;
  }
  async reduce(store, action) {
    
    return store;
  }
  async postReduce(store, action) {
    return store;
  }
}
new BaseReducer(true);
