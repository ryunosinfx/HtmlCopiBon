import { ActionCreator } from '../../util/reactive/actionCreator.js';
export class SplashActionCreator {
	constructor() {}
	static getStoreKey = () => 'splash';
	static creatAddAction = (targetView, data = {}, storeKey = SplashActionCreator.getStoreKey()) =>
		ActionCreator.createBaseAction('addSplashr', targetView, data, storeKey);
	static creatRemoveAction = (targetView, data = {}, storeKey = SplashActionCreator.getStoreKey()) =>
		ActionCreator.createBaseAction('removeSplash', targetView, data, storeKey);
}
