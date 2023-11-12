import { ActionCreator } from '../../util/reactive/actionCreator.js';
const baseActions = ['addImage', 'removeImage', 'sortImages', 'loadImages'];
export class PageActionCreator {
	constructor() {}
	static creatAddPageAction(targetView, data, storeKey = null) {
		return ActionCreator.createBaseAction('addPage', targetView, data, storeKey);
	}
	static creatRemovePageAction(targetView, data, storeKey = null) {
		return ActionCreator.createBaseAction('removePage', targetView, data, storeKey);
	}
	static creatResetPagesAction(targetView, data, storeKey = null) {
		return ActionCreator.createBaseAction('resetPages', targetView, data, storeKey);
	}
	static creatSortPagesAction(targetView, data, storeKey = null) {
		return ActionCreator.createBaseAction('sortPages', targetView, data, storeKey);
	}
	static getStorePagesKey() {
		return 'pagesData';
	}
}
