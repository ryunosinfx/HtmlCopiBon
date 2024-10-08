import { ViewUtil } from '../ViewUtil.js';
import { ElementSelector } from './elementSelector.js';
import { ActionCreator } from './actionCreator.js';
import { ViewAttachQueue } from './viewAttachQueue.js';
import { ActionDispatcher } from './actionDispatcher.js';
import { Store } from './store.js';
import { a, div, li, ul, img, span, input, label } from './base/vtags.js';
const viewAttachQueue = new ViewAttachQueue();
const nodeFrame = {
	rootVnode: null,
	ms: null,
};
export class BaseView {
	constructor(id, className, isNotRenderWrap = false) {
		this.dispatcher = ActionDispatcher.create(this);
		this.id = id;
		this.className = className;
		this.isNotRenderWrap = isNotRenderWrap;
		this.ms = nodeFrame.ms;
		this.es = new ElementSelector();
		const store = Store.getStore();
		this.onViewLoad(store);
		//this.preRender(id, className);
		this.currentVnode = null;
		this.onViewLoaded(store);
		this.updateReactiveCallCount = 0;
		this.updateReactiveCallTimer = {};
		this.updateReactivePromise = new Map();
		this.updateCount = 0;
	}
	static ModalWindowClass() {
		return 'ModalWindow';
	}
	static setRootVnode(rootVnode) {
		nodeFrame.rootVnode = rootVnode;
	}
	static setMainService(ms) {
		if (ms) nodeFrame.ms = ms;
	}
	patch(selector, newVnode) {
		return this.patchFromOtherVnode(nodeFrame.rootVnode, selector, newVnode);
	}
	initialPatch() {
		let elements = document.getElementsByTagName('body');
		elements[0].innerHTML = '<div id="rootNodeA"><p>ｘ</p></div>';
		let currentVnode = document.getElementById('rootNodeA');
		if (this.updateCount < 1) {
			this.patchFromOtherVnode(currentVnode, null, this.render());
			this.updateReactiveTheTargetView({ oldVnode: this.currentVnode, selector: null, isOrverride: true }).catch(
				(e) => console.error(e)
			);
		}
	}
	patchFromOtherVnode(currentVnode, selector, newVnode) {
		const currentRootNode =
			selector !== null //for firstTime
				? nodeFrame.rootVnode
				: currentVnode;
		const result = this.es.patch(currentRootNode, selector, newVnode);
		result.data['name'] = this.name + Date.now();
		nodeFrame.rootVnode = result;
		// console.error(this.currentVnode);
		this.currentVnode = this.es.getElements(result, '#' + this.id)[0];
		// console.error(newVnode);
		// console.warn("-----------patchFromOtherVnode:"+selector+'/#' + this.id+"/this.currentVnode:"+this.currentVnode);
		//  console.log(nodeFrame.rootVnode);
		// console.log('C01 this.id:' + this.id);
		// console.log('C01 --baseView.patchFromOtherVnode currentVnode;' + currentVnode + '/selector:' + selector + '/currentSelector:' + currentSelector + '/this:' + this.currentVnode + '/' + this.es.getElements(result, selector));
		return result;
	}
	prePatch(selector, newVnode, isShowLog) {
		if (!this.currentVnode) this.currentVnode = this.es.getElements(nodeFrame.rootVnode, '#' + this.id)[0];
		if (!this.currentVnode)
			console.error('!!!!prePatch nodeFrame.rootVnode: ' + JSON.stringify(nodeFrame.rootVnode));
		// console.log('!!A!!prePatch ' + JSON.stringify(this.currentVnode) + '/this.id:' + this.id + "/selector:" + selector + "/" + this.es.getElements(this.currentVnode, selector)[0]);
		this.currentVnode.data['name'] = this.name + Date.now();
		// console.log('!!B!!prePatch newVnode,' + JSON.stringify(this.currentVnode) + '/this.id:' + this.id);
		this.es.isShowLog = isShowLog;
		this.currentVnode = this.es.prePatch(this.currentVnode, selector, newVnode);
		this.es.isShowLog = null;
		// console.log('!!C!!prePatch ' + JSON.stringify(this.currentVnode) + '/this.id:' + this.id);
		return this.currentVnode;
	}
	async updateReactiveTheTargetView(store, actionData, action) {
		const oldVnode = store.oldVnode;
		const selector = store.selector;
		const isOrverride = store.isOrverride;
		// console.log('A00 update --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/this.currentVnode:' + this.currentVnode + "/" + typeof this.currentVnode);
		if (isOrverride) {
			// console.warn("isOrverride:"+isOrverride+"/this.currentVnode:"+this.currentVnode+"/selector:"+selector);
			this.onPreViewBuild(oldVnode, store);
			this.currentVnode = !this.currentVnode ? this.renderWrap(store) : this.currentVnode;
			// console.warn(this.currentVnode);
		} else {
			this.currentVnode = this.es.getElements(nodeFrame.rootVnode, '#' + this.id)[0];
		}
		// console.log("XXXXXXXXXXXX01 selector:"+selector+"/this.updateCount:"+this.updateCount);
		await this.onViewShow(store, actionData).catch((e) => console.error(e));
		// console.log("XXXXXXXXXXXX02 selector:"+selector+"/isOrverride:"+isOrverride+"/oldVnode:"+oldVnode);
		if (isOrverride) {
			if (oldVnode)
				// console.warn("patchFromOtherVnode");
				this.patchFromOtherVnode(oldVnode, selector, this.currentVnode);
			// console.warn("patchFromOtherVnode selector:"+selector+"/"+ this.id+"/isOrverride:"+isOrverride+"/oldVnode:"+oldVnode);
			else this.patchFromOtherVnode(null, '#' + this.id, this.currentVnode);
		} else this.patch('#' + this.id, this.currentVnode);
		this.updateCount++;
		// console.log("XXXXXXXXXXXX04 this.id:" + this.id+"/this.updateCount:"+this.updateCount);
		// console.log(action);
		if (this.updateCount <= 2 && (!action || action.type === 'Attach')) {
			this.updateCount++;
			await this.onAfterAttachWrap(store, actionData);
		} else {
			setTimeout(() => {
				this.updateCount = 0;
			}, 2000);
		}
		await this.onViewShown(store, actionData).catch((e) => console.error(e));
	}
	updateReactive(store, actionData) {
		const s = actionData.selector;
		const clearTimer = this.updateReactiveCallTimer[s];
		return new Promise((resolve, reject) => {
			// this.updateReactiveCallCount++;
			// const storePagesKey ="pagesData"
			//       console.error("updateReactive:"+(store[storePagesKey]?store[storePagesKey].length:null));
			const clearTimer = this.updateReactiveCallTimer[s];
			const pre = this.updateReactivePromise.get(clearTimer);
			if (pre) {
				clearTimeout(clearTimer);
				pre.resolve();
				setTimeout(() => this.updateReactivePromise.delete(clearTimer));
			}
			this.updateReactiveCallTimer[s] = setTimeout(() => {
				const oldVnode = store.oldVnode;
				const selector = store.selector;
				const isOrverride = store.isOrverride;
				this.currentVnode = this.es.getElements(nodeFrame.rootVnode, '#' + this.id)[0];
				// console.log(nodeFrame.rootVnode);
				// console.error(this.currentVnode);
				// console.log('A0101 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/id:' + this.id);
				const promiseOnViewShow = this.onViewShow(store, actionData);
				// console.log('A102 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + this.currentVnode);
				promiseOnViewShow.then(
					() => {
						this.patch('#' + this.id, this.currentVnode);
						// console.log('A103 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + this.currentVnode);
						//this.onAfterAttach(store);
						// console.log('A104 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + this.currentVnode);
						const promiseOnViewShown = this.onViewShown(store, actionData);
						promiseOnViewShown.then(
							() => resolve(),
							(e) => reject(e, console.error(e))
						);
					},
					(e) => reject(e, console.error(e))
				);
				// console.log('A105 --oldVnode:' + oldVnode + '/isOrverride=' + isOrverride + '/selector=' + selector + '/currentVnode:' + this.currentVnode);
			});
			this.updateReactivePromise.set(clearTimer, { resolve, reject });
		});
	}
	init() {}
	// attache to
	async attach(parentView = this.parentView, selector, data) {
		this.parentView = parentView;
		let taregetSelecotor = selector;
		if (!selector)
			// console.warn("★attach selector is null :" + selector + "/this.id:" + this.id);
			taregetSelecotor = this.id;

		if (this.isAttached()) return alert('attached!!!');
		//
		const store = Store.getStore();
		this.onPreViewBuild(store);
		this.activeViewTree = viewAttachQueue.addActiveView(parentView, this, this.activeViewTree);
		// console.log('A08---attach ==selector:' + taregetSelecotor + '/parentView:' + parentView.id + "/this.id:" + this.id);
		const action = ActionCreator.creatAttachAction(parentView, this, data);
		await this.dispatch(action);
	}
	isAttached() {
		const currentVnode = this.es.getElements(nodeFrame.rootVnode, '#' + this.id)[0];
		if (currentVnode === this.currentVnode) {
			return true;
		}
		return false;
	}
	async dispatch(action) {
		await this.dispatcher.dispatch(action);
		// console.log("dispatchered /this.id:" + this.id);
	}
	getElementById(id) {
		const elements = this.es.getElements(this.currentVnode, '#' + id);
		return elements && elements.length > 0 ? elements[0] : null;
	}
	async onAfterAttachWrap(store, actionData) {
		if (this.updateCount > 2) return;
		// console.log("XXXXXXXXXXXX03 id:"+this.id+"/this.updateCount:"+this.updateCount);
		// console.log(nodeFrame.rootVnode);
		// console.error(this.currentVnode);
		await this.onAfterAttach(store, actionData);
	}
	async onAfterAttach(store, actionData) {
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
		// console.log('m001 baseView.onViewLoad name:' + name + '/actionData:' + actionData+"/this.id:"+ this.id);
	}
	onViewLoaded(store, actionData) {
		// console.log('m002 baseView.onViewLoaded name:' + name + '/actionData:' + actionData+"/this.id:"+ this.id);
	}
	onPreViewBuild(store, actionData) {
		// console.log('m003a baseView.onPreViewBuild store:' + store + '/actionData:' + actionData+"/this.id:"+ this.id);
	}
	async onViewShow(store, actionData) {
		// console.log('m003-- baseView.onViewShow newNode:' + '/store:' + store+"/this.id:"+ this.id);
	}
	async onViewShown(store, actionData) {
		// console.log('m004-- baseView.onViewShown newNode:' + '/store:' + store+"/this.id:"+ this.id);
		//console.log(JSON.stringify(this.currentVnode));
	}
	async onViewHide(nextView, store, actionData) {
		// console.log('m005 baseView.onViewHide nextView:' + nextView + '/actionData:' + actionData+"/this.id:"+ this.id);
		//console.log(JSON.stringify(this.currentVnode));
		return true;
	}
	async onViewHidden(nextView, store, actionData) {
		// console.log('m006 baseView.onViewHidden nextView:' + nextView + '/actionData:' + actionData+"/this.id:"+ this.id);
	}
	render() {
		return ViewUtil.create('BaseView', 'BaseView');
	}
	renderWrap(store, data) {
		// console.log('renderWrap'+" id:"+this.id+"/this.isNotRenderWrap:"+this.isNotRenderWrap);
		const classNames = this.className ? (Array.isArray(this.className) ? this.className : [this.className]) : [];
		const newVnode = this.isNotRenderWrap
			? this.render(store, data)
			: div(this.id, classNames, {}, [this.render(store, data)]);
		// console.log(newVnode)
		return newVnode;
	}
	getAnker() {
		return this.elm;
	}

	show() {
		this.currentVnode.elm.style.display = '';
	}

	close() {
		this.currentVnode.elm.style.display = 'none';
	}
	setStyleToCurrent(style = {}) {
		const es = this.currentVnode.elm.style;
		for (const key in style) es[key] = style[key];
	}
	setStyleToCurrentChild(query, style = {}) {
		const es = this.currentVnode.elm.querySelector(query);
		if (es) for (const key in style) es.style[key] = style[key];
	}
}
