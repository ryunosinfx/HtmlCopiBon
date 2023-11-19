import { ActionCreator } from '../../util/reactive/actionCreator.js';
export class MenuSelectActionCreator {
	constructor() {}
	static creatSelectAction = (targetView, data, storeKey = null) =>
		ActionCreator.createBaseAction('selectMenu', targetView, data, storeKey);
	static getStoreKey = () => 'menuSelect';
}
