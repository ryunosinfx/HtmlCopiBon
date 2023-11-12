import { ActionCreator } from '../../util/reactive/actionCreator.js';
export class PreviewActionCreator {
	constructor() {}
	static creatOpenAction(targetView, data, storeKey = null) {
		return ActionCreator.createBaseAction('openPreview', targetView, data, storeKey);
	}
	static creatCloseAction(targetView, data, storeKey = null) {
		return ActionCreator.createBaseAction('closePreview', targetView, data, storeKey);
	}
	static creatNextAction(targetView, data, storeKey = null) {
		return ActionCreator.createBaseAction('nextPreview', targetView, data, storeKey);
	}
	static creatBackAction(targetView, data, storeKey = null) {
		return ActionCreator.createBaseAction('backPreview', targetView, data, storeKey);
	}
	static creatUpdateAction(targetView, data, storeKey = null) {
		return ActionCreator.createBaseAction('updateOnPreview', targetView, data, storeKey);
	}
	static getStorePreviewKey() {
		return 'previewCommand';
	}
	static getStoreUpdatePreviewKey() {
		return 'previewUpdateCommand';
	}
}
