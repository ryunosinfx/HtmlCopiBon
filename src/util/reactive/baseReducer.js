import {ActionDispatcherImple} from '../action/actionDispatcherImple'
export class BaseReducer {
  constructor() {
  }
  atatch(action) {
    ActionDispatcherImple.add(action,this);
  }
  detach(action) {
    ActionDispatcherImple.delete(action,this);
  }
  async preReduce(store,action) {
    store.isOrverride = false;
    return store;
  }
  async reduce(store,action) {
    return store;
  }
  async postReduce(store,action) {
    return store;
  }
}
