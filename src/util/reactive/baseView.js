import vu from "../viewUtil";
import {ActionCreator} from './actionCreator'
import {ViewAttachQueue} from './viewAttachQueue'
import {ActionDispatcher} from './actionDispatcher'
import {Store} from './store'
const viewAttachQueue = new ViewAttachQueue();
export class BaseView {
  constructor(parent, id, className) {
    this.ms = parent && parent.ms
      ? parent.ms
      : null;
    this.dispatcher = ActionDispatcher.create(this);
    this.id = id;
    this.parent = parent;
    this.preRender(id, className);
  }
  init() {}
  preRender(id, className) {
    console.log("preRender");
    const store = Store.getStore();
    this.onViewLoad(store)
    this.elm = vu.create(id, className);
    if (this.paren && this.paren.elm) {
      vu.append(this.parent.elm, this.elm);
    }
    this.onViewLoaded(store)
  }
  updateReactive(store, actionData) {
    console.log("BaseView★updateReactive START this.id:"+this.id);
    console.log(store);
    console.log(actionData);
      console.log("BaseView★updateReactive END this.id:"+this.id);
  }
  updateAsAttachExecute(store, actionData) {
    const current = this.render(store, actionData);
    console.log("BaseView★updateAsAttachExecute this.id:"+this.id+"/this.parentView.elm:"+this.parentView.elm);
    console.log(current.parentNode);
    if(current.parentNode){
      console.log("BaseView★updateAsAttachExecute END!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      return;
    }
      console.log("BaseView★updateAsAttachExecute START!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    vu.append(this.parentView.elm,current);
    this.elm = current;
    console.log(store);
    console.log(actionData);
  }
  updateAsAttach(store, actionData) {
    this.updateAsAttachExecute(store, actionData);
  }
  update(store, actionData) {
    console.log("BaseView★update this.id:"+this.id);
    console.log(store);
    console.log(actionData);
  }
  // attache to
  attach(parentView = this.parentView , selector, data) {
    this.parentView = parentView;
    this.selector = selector;
    if (!selector) {
      console.log("★attach selector is null :" + selector);
    }
    const store = Store.getStore();
    this.onPreViewBuild(store)
    this.activeViewTree = viewAttachQueue.addActiveView(parentView, this, this.activeViewTree);
    console.log('---show selector:' + selector + '/parentView:'+parentView.id+"/this.id:"+this.id);
    const action = ActionCreator.creatAttachAction(parentView, this, data);
    this.dispatcher.dispatch(action);
  }
  changeAnotherView(parentView, selector, nextView) {
    this.onViewHide(nextView, store, actionData);
    const action = ActionCreator.creatAttachAction(parentView, this, data);
    this.dispatcher.dispatch(action);
    this.onViewHidden(nextView, store, actionData);
  }
  // Event listener
  onViewLoad(store, actionData) {
    console.log('m001 baseView.onViewLoad name:' + name + '/actionData:' + actionData);
  }
  onViewLoaded(store, actionData) {
    console.log('m002 baseView.onViewLoaded name:' + name + '/actionData:' + actionData);
  }
  onPreViewBuild(store, actionData) {
    console.log('m003a baseView.onPreViewBuild store:' + store + '/actionData:' + actionData);
  }
  onViewShow(store, actionData) {
    console.log('m003 baseView.onViewShow newNode:' + '/store:' + store);
  }
  onViewShown(store, actionData) {
    console.log('m004 baseView.onViewShown newNode:' + '/store:' + store);
    //console.log(JSON.stringify(this.currentVnode));
  }
  onViewHide(nextView, store, actionData) {
    console.log('m005 baseView.onViewHide nextView:' + nextView + '/actionData:' + actionData);
    //console.log(JSON.stringify(this.currentVnode));
    return true;
  }
  onViewHidden(nextView, store, actionData) {
    console.log('m006 baseView.onViewHidden nextView:' + nextView + '/actionData:' + actionData);
  }
  render() {
    const elm = vu.create("BaseView", "BaseView");
    return elm;
  }
  getAnker() {
    return this.elm;
  }
}
