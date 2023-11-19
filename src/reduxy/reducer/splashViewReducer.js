import { SplashActionCreator } from '../action/splashActionCreator.js';
import { BaseReducer } from '../../util/reactive/baseReducer.js';
let splashViewReducer = null;
export class SplashViewReducer extends BaseReducer {
	constructor() {
		super();
		this.splashAddAction = SplashActionCreator.creatAddAction();
		this.splashRemoveAction = SplashActionCreator.creatRemoveAction();
		this.atatch(this.splashAddAction);
		this.atatch(this.splashRemoveAction);
		this.storeKey = SplashActionCreator.getStoreKey();
		this.addInitializeKey(this.storeKey);
	}
	static register() {
		if (!splashViewReducer) splashViewReducer = new SplashViewReducer();
	}
	async reduce(store, action) {
		if (this.splashAddAction.type === action.type)
			store[this.storeKey] = this.createSplash(true, 0, false, action.data.msg, action.data.title);
		else if (this.splashRemoveAction.type === action.type)
			store[this.storeKey] = this.createSplash(false, 0, false);
		return store;
	}
	createSplash(isVisible, progress, isComple, msg, title) {
		return { isVisible, progress, msg, isComple, title };
	}
}
