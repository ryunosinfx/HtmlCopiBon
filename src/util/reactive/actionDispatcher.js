import {ActionDispatcherImple} from './actionDispatcherImple'
export class ActionDispatcher {
  constructor() {
  }
  static create(view){
    return new ActionDispatcherImple(view);
  }
}
