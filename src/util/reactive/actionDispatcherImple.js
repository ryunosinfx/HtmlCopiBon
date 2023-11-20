import { Store } from './store.js';
import { ViewAttachQueue } from './viewAttachQueue.js';
import { ActionDispatcher } from './actionDispatcher.js';
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
		if (!action) return false;
		// console.log('ActionDispatcherImple add01:' + action.type);
		const type = action.type;
		if (!type) return false;
		if (actionMap.has(type)) {
			const reducers = actionMap.get(type);
			if (!reducers.includes(reducer)) {
				reducers.push(reducer);
			} else return false;
		} else {
			actionMap.set(type, [reducer]);
		}
		return true;
	}
	static remove(action, reducer = null) {
		const type = action.type;
		if (!type) return false;
		if (actionMap.has(type)) {
			const reducers = actionMap.get(type);
			if (!reducers.includes(reducer)) {
				const index = reducers.indexof(reducer);
				reducers.splice(index, 1);
			} else return false;
		}
		return true;
	}
	static getE = () => (e) => console.error(e);
	dispatch(action) {
		// console.warn('dispatch:action.type:' + action.type);
		return new Promise((resolve, reject) => {
			setTimeout(() =>
				this.dispatchExecute(action).then(
					(data) => resolve(data),
					(e) => reject(e)
				)
			);
		});
	}
	async dispatchExecute(action) {
		const type = action.type;
		if (!type) return false;
		const data = action.data;
		const storeKey = action.storeKey;
		const actionClass = data.constructor;
		const store = Store.getStore(storeKey, actionClass);
		// console.warn(
		// 	'A00 dispatchExecute:action.type:' + type + '/storeKey:' + storeKey + '/actionClass:' + actionClass
		// );
		let targetView = this.view;
		if (actionMap.has(type)) {
			const reducers = actionMap.get(type);
			for (const reducer of reducers) {
				const initializeStoreKeys = reducer.getInitializeKeys();
				for (const initializeStoreKey of initializeStoreKeys) store[initializeStoreKey] = null;
				break;
			}
			for (const reducer of reducers) {
				// console.log('A01 dispatch type:' + type + '/reducer.reduce:' + reducer.reduce);
				await reducer.preReduce(store, action).catch(ActionDispatcherImple.getE());
				await reducer.reduce(store, action).catch(ActionDispatcherImple.getE());
				await reducer.postReduce(store, action).catch(ActionDispatcherImple.getE());
			}
			// console.log('A02 dispatch type:' + type + '/', reducers[0]);
		}
		const storeAsClones = Store.cloneStore(store, action);
		let storeB = Store.getStore(storeKey, actionClass);
		// console.log('A03 dispatch store:', store);
		// console.log(storeB);
		// console.log('A04 dispatch action:', action);
		let result = null;
		if (store.isOrverride && action.data.view) {
			const targetView = action.data.views;
			// console.log('A05 dispatch store.isOrverride:' + store.isOrverride + '/targetView:', targetView);
			if (this.view.onViewHide(targetView, data) === false) return;
			result = await this.callUpdate(targetView, data, storeKey, action).catch(ActionDispatcherImple.getE());
			await this.view.onViewHidden(targetView, data);
		} else result = await this.callUpdate(targetView, data, storeKey, action).catch(ActionDispatcherImple.getE());
		//store = Store.getStore(storeKey);
		Store.setStore(storeAsClones, storeKey, actionClass);
		// console.error(storeAsClones);
		// console.error(action.type);
		// console.error(result);

		return true;
	}
	callUpdate(targetView, actionData, storeKey, action) {
		return new Promise((resolve, reject) => {
			const promises = [];
			const activViews = viewAttachQueue.getActiveViewList();
			// console.log('A0 callUpdate targetView:' + targetView.id + '/targetView:', targetView);
			for (const activeView of activViews) {
				const store = Store.getTemp(storeKey, action);
				// console.log('A1 callUpdate update activeView.id:' + activeView.id + '/storeKey:' + storeKey, store);
				if (targetView === activeView) {
					// console.log('A2 callUpdate update activeView.id:' + activeView.id + '/storeKey:' + storeKey, store);
					// console.log("activeView.updateReactiveTheTargetView:"+action.type+"/"+targetView.id);
					const promise = targetView.updateReactiveTheTargetView(store, actionData, action);
					if (promise) {
						if (!promise.then) {
							alert(
								"your view has override method name 'updateReactiveTheTargetView'! activeView.id):" +
									activeView.id
							);
							reject(promise);
							return;
						}
						promises.push(promise.then(() => {}, ActionDispatcherImple.getE()));
					} else {
						// console.log(activeView);
					}
				} else {
					// console.log('A3 callUpdate updateReactive id:' + activeView.id);
					// console.log("activeView.updateReactive:" + action.type + "/" + targetView.id);
					const promise = activeView.updateReactive(store, actionData);
					if (promise) {
						if (!promise.then) {
							alert(
								"your view has override method name 'updateReactive'! activeView.id):" + activeView.id
							);
							reject(promise);
							return;
						}
						promises.push(promise.then(() => {}, ActionDispatcherImple.getE()));
					} else {
						//console.log(activeView);
					}
				}
			}
			if (promises.length > 0) {
				Promise.all(promises).then(resolve, reject);
			} else resolve(targetView);
		});

		// console.log('callUpdate END----------------');
	}
}
