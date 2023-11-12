import { ActionCreator } from '../../util/reactive/actionCreator.js';
export class ProgressActionCreator {
	constructor() {}
	static creatAddAction(targetView, data, storeKey = null) {
		return ActionCreator.createBaseAction('addProgressBar', targetView, data, storeKey);
	}
	static creatRemoveAction(targetView, data, storeKey = null) {
		return ActionCreator.createBaseAction('removeProgressBar', targetView, data, storeKey);
	}
	static creatUpdateAction(targetView, data, storeKey = null) {
		return ActionCreator.createBaseAction('updateProgressBar', targetView, data, storeKey);
	}
	static creatCompleatAction(targetView, data, storeKey = null) {
		return ActionCreator.createBaseAction('compleatProgressBar', targetView, data, storeKey);
	}
}
