import { ActionCreator } from './actionCreator.js';
import { ActionDispatcherImple } from './actionDispatcherImple.js';
const initializeStoreKeys = [];
export class BaseReducer {
	constructor(isBaseUse) {
		this.isBaseUse = isBaseUse;
		// console.log('BaseReducer constructor:' + isBaseUse);
		if (isBaseUse) {
			const baseActions = ActionCreator.getBaseActions();
			for (const index in baseActions) {
				const type = baseActions[index];
				this.atatch({ type: type });
			}
		}
	}
	addInitializeKey(targetKey) {
		initializeStoreKeys.push(targetKey);
	}
	getInitializeKeys() {
		const retList = [];
		for (const value of initializeStoreKeys) {
			retList.push(value);
		}
		return retList;
	}
	atatch(action) {
		// console.log('A0 BaseReducer atatch action:' + action);
		// console.log(this);
		ActionDispatcherImple.add(action, this);
	}
	detach(action) {
		ActionDispatcherImple.delete(action, this);
	}
	async preReduce(store, action) {
		// console.log('A0 BaseReducer preReduce:' + action);
		store.isOrverride = false;
		return store;
	}
	async reduce(store, action) {
		// console.log('A0 BaseReducer reduce:' + action);
		store.isOrverride = true;

		store.oldVnode = action.data.oldVnode;
		store.selector = '#' + action.data.selector;
		//alert(store);
		return store;
	}
	async postReduce(store, action) {
		// console.log('A0 BaseReducer postReduce:' + action);
		return store;
	}
}
new BaseReducer(true);
