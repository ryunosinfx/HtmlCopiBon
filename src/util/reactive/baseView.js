import vu from "../viewUtil";
import {patch} from './base/preLoader'
import {ElementSelector} from './elementSelector'
import {ActionCreator} from './actionCreator'
import {ViewAttachQueue} from './viewAttachQueue'
import {ActionDispatcher} from './actionDispatcher'
import {Store} from './store'
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "./base/vtags";
import {ViewBaseReducer} from './viewBaseReducer'
const viewAttachQueue = new ViewAttachQueue();
const nodeFrame = {
  rootVnode: null,
  ms: null
};
export class BaseView {
  constructor(id, className,isNotRenderWrap=false) {
    this.dispatcher = ActionDispatcher.create(this);
    this.id = id;
    this.className = className;
    this.isNotRenderWrap = isNotRenderWrap;
    this.ms = nodeFrame.ms;
    this.es = new ElementSelector();
    const store = Store.getStore();
    this.onViewLoad(store)
    //this.preRender(id, className);
    this.currentVnode = null;
    this.onViewLoaded(store)
    this.updateReactiveCallCount = 0;
    this.updateReactiveCallTimer = null;
    this.updateCount = 0;
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
  initialPatch() {
    let elements = document.getElementsByTagName("body");
    elements[0].innerHTML = '<div id="rootNodeA"><p>ｘ</p></div>';
    let currentVnode = document.getElementById('rootNodeA');
    this.patchFromOtherVnode(currentVnode, null, this.render());
    this.updateReactiveTheTargetView({oldVnode: this.currentVnode, selector: null, isOrverride: true}).catch((e)=>{console.log(e)});
  }
  patchFromOtherVnode(currentVnode, selector, newVnode) {
    let currentRootNode = selector !== null
      ? //for firstTime
      nodeFrame.rootVnode
      : currentVnode;
    let currentSelector = selector;
    let currentNewNode = newVnode;
    const result = this.es.patch(currentRootNode, currentSelector, currentNewNode);
    result.data['name'] = this.name + Date.now();
    nodeFrame.rootVnode = result;
    this.currentVnode = this.es.getElements(result, '#' + this.id)[0];

    // console.log(selector+'/#' + this.id);
    // console.log(result);
    // console.log('C01 this.id:' + this.id);
    // console.log('C01 --baseView.patchFromOtherVnode currentVnode;' + currentVnode + '/selector:' + selector + '/currentSelector:' + currentSelector + '/this:' + this.currentVnode + '/' + this.es.getElements(result, selector));
    return result;
  }
  prePatch(selector, newVnode) {
    if (!this.currentVnode) {
      this.currentVnode = this.es.getElements(nodeFrame.rootVnode, '#' + this.id)[0];
    }
    if (!this.currentVnode) {
      console.log('!!!!prePatch nodeFrame.rootVnode: ' + JSON.stringify(nodeFrame.rootVnode));
    }
    //console.log('!!A!!prePatch ' +  JSON.stringify(this.currentVnode) + '/this.id:' + this.id+"/selector:"+selector+"/"+this.es.getElements(this.currentVnode , selector)[0]);
    this.currentVnode.data['name'] = this.name + Date.now();
    // console.log('!!B!!prePatch ' + this.currentVnode + '/this.id:' + this.id);
    this.currentVnode = this.es.prePatch(this.currentVnode, selector, newVnode);
    return this.currentVnode;
  }
  async updateReactiveTheTargetView(store, actionData) {
    const oldVnode = store.oldVnode;
    const selector = store.selector;
    const isOrverride = store.isOrverride;
    console.log('A00 update --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/this.currentVnode:' + this.currentVnode + "/" + typeof this.currentVnode);
    if (isOrverride) {
      this.onPreViewBuild(oldVnode, store);
      this.currentVnode = !this.currentVnode
        ? this.renderWrap(store)
        : this.currentVnode;
    } else if (!this.currentVnode) {
      this.currentVnode = this.es.getElements(result, '#' + this.id)[0];
    }
    await this.onViewShow(store, actionData).catch((e)=>{console.log(e)});
    if (isOrverride) {
      if (oldVnode) {
        this.patchFromOtherVnode(oldVnode, selector, this.currentVnode);
      } else {
        this.patchFromOtherVnode(null , '#' + this.id, this.currentVnode);
      }
    } else {
      this.patch('#'+this.id, this.currentVnode);
    }
    this.updateCount++;
    console.log("this.id:"+this.id);
    if (this.updateCount <= 2) {
      this.onAfterAttachWrap(store, actionData);
    }else{
      setTimeout(() => {
        this.updateCount = 0
      });
    }
    await this.onViewShown(store, actionData).catch((e)=>{console.log(e)});
  }
  async updateReactive(store, actionData) {
    // this.updateReactiveCallCount++;
    if (this.updateReactiveCallTimer) {
      clearTimeout(this.updateReactiveCallTimer);
    }
    this.updateReactiveCallTimer = setTimeout(async() => {
      const oldVnode = store.oldVnode;
      const selector = store.selector;
      const isOrverride = store.isOrverride;
      this.currentVnode = this.currentVnode = this.es.getElements(nodeFrame.rootVnode, '#' + this.id)[0];;
      // console.log('A0101 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + this.currentVnode);
      await this.onViewShow(store, actionData).catch((e)=>{console.log(e)});
      // console.log('A102 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + this.currentVnode);
      this.patch("#" + this.id, this.currentVnode);
      // console.log('A103 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + this.currentVnode);
      //this.onAfterAttach(store);
      // console.log('A104 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + this.currentVnode);
      await this.onViewShown(store, actionData).catch((e)=>{console.log(e)});
      // console.log('A105 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + this.currentVnode);
    });
}
init() {}
// attache to
attach(parentView = this.parentView, selector, data) {
  this.parentView = parentView;
  let taregetSelecotor = selector;
  if (!selector) {
    console.log("★attach selector is null :" + selector+"/this.id:"+this.id);
    taregetSelecotor = this.id;
  }
  if (this.isAttached()) {
    alert('attached!!!');
    return;
  }
  //
  const store = Store.getStore();
  this.onPreViewBuild(store)
  this.activeViewTree = viewAttachQueue.addActiveView(parentView, this, this.activeViewTree);
  // console.log('A08---show selector:' + taregetSelecotor + '/parentView:' + parentView.id + "/this.id:" + this.id);
  const action = ActionCreator.creatAttachAction(parentView, this, data);
  this.dispatch(action);
}
isAttached() {
  const currentVnode = this.es.getElements(nodeFrame.rootVnode, '#' + this.id)[0];
  if (currentVnode === this.currentVnode) {
    return true;
  }
  return false;
}
dispatch(action) {
  this.dispatcher.dispatch(action);
  console.log("dispatchered /this.id:"+this.id);
}
getElementById(id) {
  const elements = this.es.getElements(this.currentVnode, '#' + id);
  return elements && elements.length > 0
    ? elements[0]
    : null;
}
onAfterAttachWrap(store, actionData) {
  this.updateCount++;
  if (this.updateCount > 2) {
    return;
  }
  this.onAfterAttach(store, actionData);
}
onAfterAttach(store, actionData) {
  const currentVnode = this.currentVnode;
  // while (viewAttachQueue.hasItem()) {
  //   let item = viewAttachQueue.poll();
  //   item.view.currentVnode = this.es.getElements(currentVnode, item.selector);
  // }
}
changeAnotherView(parentView, selector, nextView) {
  this.onViewHide(nextView, store, actionData);
  const action = ActionCreator.creatAttachAction(parentView, this, data);
  this.dispatch(action);
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
async onViewShow(store, actionData) {
  console.log('m003 baseView.onViewShow newNode:' + '/store:' + store);
}
async onViewShown(store, actionData) {
  console.log('m004 baseView.onViewShown newNode:' + '/store:' + store);
  //console.log(JSON.stringify(this.currentVnode));
}
async onViewHide(nextView, store, actionData) {
  console.log('m005 baseView.onViewHide nextView:' + nextView + '/actionData:' + actionData);
  //console.log(JSON.stringify(this.currentVnode));
  return true;
}
async onViewHidden(nextView, store, actionData) {
  console.log('m006 baseView.onViewHidden nextView:' + nextView + '/actionData:' + actionData);
}
render() {
  const elm = vu.create("BaseView", "BaseView");
  return elm;
}
renderWrap(store, data) {
  // console.log('renderWrap');

  const newVnode = this.isNotRenderWrap? this.render(store, data): div(this.id, [this.className], {}, [this.render(store, data)]);
  // console.log(newVnode)
  return newVnode;
}
getAnker() {
  return this.elm;
}
}
