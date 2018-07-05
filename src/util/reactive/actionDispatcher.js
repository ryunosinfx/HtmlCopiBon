import {ActionDispatcherImple} from './actionDispatcherImple'
export class ActionDispatcher {
  constructor() {
  }
  static create(view){
    return new ActionDispatcherImple(view);
  }
  static createStandAlon(){
    return new ActionDispatcherImple(false);
  }
}
