import vu from "../viewUtil";
import {
  patch
} from './base/preLoader'
import {
  ElementSelector
} from './elementSelector'
import {
  ActionCreator
} from './actionCreator'
import {
  ViewAttachQueue
} from './viewAttachQueue'
import {
  ActionDispatcher
} from './actionDispatcher'
import {
  Store
} from './store'
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../base/vtags";
const viewAttachQueue = new ViewAttachQueue();
const nodeFrame = {
  rootVnode: null,
  ms: null
};
export class BaseView {
  constructor(id, className) {
    this.dispatcher = ActionDispatcher.create(this);
    this.id = id;
    this.className = className;
    this.ms = nodeFrame.ms;
    this.es = new ElementSelector();
    const store = Store.getStore();
    this.onViewLoad(store)
    this.preRender(id, className);
    this.currentVnode = null;
    this.onViewLoaded(store)
  }
  static setRootVnode(rootVnode) {
    nodeFrame.rootVnode = rootVnode;
  }
  static setMainService(ms) {
    if (ms) {

      nodeFrame.ms = ms;
    }
  }
  patch(selector, newVnode) {
    return this.patchFromOtherVnode(nodeFrame.rootVnode, selector, newVnode);
  }
  patchFromOtherVnode(currentVnode, selector, newVnode) {
    let currentRootNode = selector !== null ?
      nodeFrame.rootVnode :
      currentVnode;
    let currentSelector = selector;
    let currentNewNode = newVnode;
    if (selector !== null && !!newVnode === false) {
      currentSelector = this.id;
      currentNewNode = selector;
    }
    const result = this.es.patch(currentRootNode, currentSelector, currentNewNode);
    result.data['name'] = this.name + Date.now();
    nodeFrame.rootVnode = result;
    this.currentVnode = this.es.getElements(result, '#' + this.id)[0];
    console.log('C01 this.id:' + this.id);
    console.log('C01 --baseView.patchFromOtherVnode currentVnode;' + currentVnode + '/selector:' + selector + '/currentSelector:' + currentSelector + '/this:' + this.currentVnode + '/' + this.es.getElements(result, selector));
    return result;
  }
  prePatch(selector, newVnode) {
    if (!this.currentVnode) {
      this.currentVnode = this.es.getElements(nodeFrame.rootVnode, '#' + this.id)[0];
    }
    if (!this.currentVnode) {
      console.log('!!!!prePatch nodeFrame.rootVnode: ' + JSON.stringify(nodeFrame.rootVnode));
    }
    console.log('!!A!!prePatch ' + this.currentVnode + '/this.id:' + this.id);
    this.currentVnode.data['name'] = this.name + Date.now();
    console.log('!!B!!prePatch ' + this.currentVnode + '/this.id:' + this.id);
    this.currentVnode = this.es.prePatch(this.currentVnode, selector, newVnode);
    return this.currentVnode;
  }
  update(store, actionData) {
    const viewState = this.viewState;
    const oldVnode = store.oldVnode;
    const selector = store.selector;
    const isOrverride = store.isOrverride;
    const currentVnode = oldVnode ?
      oldVnode :
      this.currentVnode;
    console.log('A00 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + currentVnode);
    if (isOrverride) {
      this.onPreViewBuild(oldVnode, store);
      console.log('A01 --baseView.goAnotherView view;' + this.className);
      this.currentVnode = !this.currentVnode ?
        this.renderWrap(store) :
        this.currentVnode;
    }
    this.onViewShow(viewState, store);
    if (isOrverride) {
      console.log('A02 --baseView.goAnotherView selector;' + selector);
      if (oldVnode) {
        console.log('A02a --baseView.goAnotherView selector;' + selector);
        this.patchFromOtherVnode(oldVnode, selector, this.currentVnode);
      } else {
        console.log('A02b --baseView.goAnotherView selector;' + selector);
        this.patchFromOtherVnode(this.currentVnode, this.currentVnode);
      }
    } else {
      this.patch(selector, this.currentVnode);
    }
    this.onAfterAttach(store);
    this.onViewShown(viewState, store);
    this.viewState = viewState;
  }
  updateReactive(store, actionData) {
    const viewState = this.viewState;
    const oldVnode = store.oldVnode;
    const selector = store.selector;
    const isOrverride = store.isOrverride;
    const currentVnode = oldVnode ?
      oldVnode :
      this.currentVnode;
    this.currentVnode = !this.currentVnode ?
      this.renderWrap(store) :
      this.currentVnode;
    //console.log('A101 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + currentVnode);
    this.onViewShow(viewState, store);
    //console.log('A102 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + currentVnode);
    this.patch("#" + this.id, this.currentVnode);
    //console.log('A103 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + currentVnode);
    this.onAfterAttach(store);
    //console.log('A104 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + currentVnode);
    this.onViewShown(viewState, store);
    //console.log('A105 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + currentVnode);
    this.viewState = viewState;
  }
  init() {}
  preRender(id, className) {
    console.log("preRender");
  }
  // attache to
  attach(parentView = this.parentView, selector, data) {
    this.parentView = parentView;
    this.selector = selector;
    if (!selector) {
      console.log("★attach selector is null :" + selector);
    }
    const store = Store.getStore();
    this.onPreViewBuild(store)
    this.activeViewTree = viewAttachQueue.addActiveView(parentView, this, this.activeViewTree);
    console.log('---show selector:' + selector + '/parentView:' + parentView.id + "/this.id:" + this.id);
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
  renderWrap(store, data) {
    let newVnode = de(this.id,[this.className] , {
    }, [this.render(store, data)]);
    return newVnode;
  }
  getAnker() {
    return this.elm;
  }
}
