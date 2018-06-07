import {
  patch,
  h
} from 'encrypt-indexeddb-entity-manager/src/view/preLoader'

import ElementSelector from './elementSelector'
import ViewAttachQueue from './viewAttachQueue'
import ActionDispatcher from '../action/actionDispatcher'
import ViewBaseReducer from '../reducer/viewBaseReducer'
import ViewBaseActions from '../action/viewBaseActions'
import ActionCreator from '../util/actionCreator'
const viewAttachQueue = new ViewAttachQueue();
const nodeFrame = {
  rootVnode: null
};
const avtiveViews = new Map();
export default class BaseView {
  constructor(service, name, key) {
    this.dispatcher = ActionDispatcher.create(this);
    this.onViewLoad(service, name, key);
    this.name = name;
    this.key = key;
    this.es = new ElementSelector();
    this.activeViewTree = null;
    this.filter = (state) => {
      return true
    }
    this.service = service;
    this.router = this.service.getRouter();
    this.viewState = null;
    this.currentVnode = null; //this.render(this.viewState, null);
    //console.log('name=' + name + '/key:' + key);
    this.onViewLoaded(service, name, key);
  }
  static setRootVnode(rootVnode) {
    nodeFrame.rootVnode = rootVnode;
  }
  isAccessable(state) {
    return true;
  }
  patch(selector, newVnode) {
    return this.patchFromOtherVnode(nodeFrame.rootVnode, selector, newVnode);
  }
  patchFromOtherVnode(currentVnode, selector, newVnode) {
    let currentRootNode = selector !== null ? nodeFrame.rootVnode : currentVnode;
    let currentSelector = selector;
    let currentNewNode = newVnode;
    if (selector !== null && !!newVnode === false) {
      currentSelector = this.key;
      currentNewNode = selector;
    }
    const result = this.es.patch(currentRootNode, currentSelector, currentNewNode);
    result.data['name'] = this.name + Date.now();
    nodeFrame.rootVnode = result;
    // this.currentVnode = this.key && newVnode ? this.es.getElements(result, currentSelector)[0] : result;
    // if(!this.currentVnode){
    this.currentVnode = this.es.getElements(result, '#' + this.key)[0];
    // }
    console.log('C01 this.key:'+this.key);
    console.log('C01 --baseView.patchFromOtherVnode currentVnode;' + currentVnode + '/selector:' + selector + '/currentSelector:' + currentSelector + '/this:' + this.currentVnode + '/' + this.es.getElements(result, selector));
    return result;
  }
  prePatch(selector, newVnode) {
    if (!this.currentVnode) {
      this.currentVnode = this.es.getElements(nodeFrame.rootVnode, '#' + this.key)[0];
    }
    if (!this.currentVnode) {
      console.log('!!!!prePatch nodeFrame.rootVnode: ' + JSON.stringify(nodeFrame.rootVnode));
    }
    console.log('!!A!!prePatch ' + this.currentVnode + '/this.key:' + this.key);
    //alert('aAAaaaaaaa this.key:'+this.key+"\n"+ this.currentVnode+'/selector:'+selector );
    this.currentVnode.data['name'] = this.name + Date.now();
    //alert('aABaaaaaaa this.key:'+this.key);
    console.log('!!B!!prePatch ' + this.currentVnode + '/this.key:' + this.key);
    this.currentVnode = this.es.prePatch(this.currentVnode, selector, newVnode);
    return this.currentVnode;
  }
  update(store) {
    const viewState = this.viewState;
    const oldVnode = store.oldVnode;
    const selector = store.selector;
    const isOrverride = store.isOrverride;
    const currentVnode = oldVnode ? oldVnode : this.currentVnode;

    console.log('A00 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + currentVnode);
    if (isOrverride) {
      this.onPreViewBuild(oldVnode, store);
      console.log('A01 --baseView.goAnotherView view;' + this.getName());
      this.currentVnode = !this.currentVnode ? this.renderWrap(store) : this.currentVnode;
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
  updateReactive(store) {
    const viewState = this.viewState;
    const oldVnode = store.oldVnode;
    const selector = store.selector;
    const isOrverride = store.isOrverride;
    const currentVnode = oldVnode ? oldVnode : this.currentVnode;
    this.currentVnode = !this.currentVnode ? this.renderWrap(store) : this.currentVnode;

    //console.log('A101 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + currentVnode);
    this.onViewShow(viewState, store);
    //console.log('A102 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + currentVnode);
    this.patch("#"+this.key, this.currentVnode);
    //console.log('A103 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + currentVnode);
    this.onAfterAttach(store);
    //console.log('A104 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + currentVnode);
    this.onViewShown(viewState, store);
    //console.log('A105 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + currentVnode);
    this.viewState = viewState;
  }
  static getActiveViews() {
    return avtiveViews;
  }
  show(oldVnode, selector, store) {
    avtiveViews.set(this.key, this);
    console.log('---show selector:' + selector + '/oldVnode');
    //console.log(oldVnode);
    let action = ViewBaseActions.getShowViewAction(oldVnode, selector, store);
    //console.log(action);
    this.dispatcher.dispatch(action);
  }
  //
  goAnotherView(nextView, data) {
    // TODO dispatchaction
    if (this.onViewHide(nextView, data) === false) {
      return;
    };
    this.activeViewTree = viewAttachQueue.changeActiveView(this, nextView, nextView.activeViewTree);
    //console.log('A00 baseView.goAnotherView view;' + view.getName() + '/this.name:' + this.name + '/current:' + this.currentVnode);
    console.log('A02 baseView.goAnotherView from ' + this.getName() + ' to nextView;' + (nextView.getName ? nextView.getName() : 'none'));
    nextView.show(this.currentVnode, '#' + this.key, data);
    this.onViewHidden(nextView, data);
  }
  // attache to
  attach(parentView, selector, data) {
    if (!selector) {
      console.log("attach selector is null :" + selector);
    }
    this.activeViewTree = viewAttachQueue.addActiveView(parentView, this, this.activeViewTree);
    this.show(parentView.currentVnode, selector, data);
  }
  onAfterAttach(store) {
    const currentVnode = this.currentVnode;
    while (viewAttachQueue.hasItem()) {
      let item = viewAttachQueue.poll();
      item.view.currentVnode = this.es.getElements(currentVnode, item.selector);
    }
  }
  detach(vnode, selector) {

  }
  // Event listener
  onViewLoad(service, name, key) {
    console.log('m001 baseView.onViewLoad service:' + service + '/name:' + name + '/key:' + key);
  }
  onViewLoaded(service, name, key) {
    console.log('m002 baseView.onViewLoaded service:' + service + '/name:' + name + '/key:' + key);

  }
  onPreViewBuild(oldNode, data) {
    console.log('m003a baseView.onPreViewBuild oldNode:' + oldNode + '/data:' + data);
  }
  onViewShow(viewState, store) {
    console.log('m003 baseView.onViewShow newNode:' + '/store:' + store);
  }
  onViewShown(viewState, store) {
    console.log('m004 baseView.onViewShown newNode:' + '/store:' + store);
    //console.log(JSON.stringify(this.currentVnode));
  }
  onViewHide(nextView, data) {
    console.log('m005 baseView.onViewHide nextView:' + nextView + '/data:' + data);
    //console.log(JSON.stringify(this.currentVnode));
    return true;
  }
  onViewHidden(nextView, data) {
    console.log('m006 baseView.onViewHidden nextView:' + nextView + '/data:' + data);
  }
  render(viewStatev, data) {
    let newVnode = h('div', {
      style: {
        color: '#099'
      }
    }, [h('h1', 'i am ' + this.name + '!')]);
    return newVnode;
  }
  renderWrap(viewStatev, data) {
    let newVnode = h('div#' + this.key, {
      style: {
        margin: 0,
        padding: 0
      }
    }, [this.render(viewStatev, data)]);
    return newVnode;
  }
  isEquals(baseView) {
    return baseView, name === this, name;
  }
  getKey() {
    return this.key;
  }
  getFilter() {
    return this.filter;
  }
  getName() {
    return this.name;
  }
  getHref() {
    let href = location.href.split(/\?/)[0] + '?' + this.key;
    console.log('href=' + href);
    return href;
  }
  async goToAnotherView(key, data) {
    console.log('A03 baseView.goToAnotherView key;' + key);
    return await this.service.goToAnotherView(key, data);
  }
  async goBack(data) {
    return await this.service.goToAnotherView(key, data);
  }
  getCurrentState() {
    return this.service.store.get('state');
  }
}
