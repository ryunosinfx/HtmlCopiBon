import { ProgressActionCreator } from '../action/progressActionCreator.js';
import { BaseReducer } from '../../util/reactive/baseReducer.js';
let progressViewReducer = null;
export class ProgressViewReducer extends BaseReducer {
	constructor() {
		super();
		this.progressBarAddAction = ProgressActionCreator.creatAddAction();
		this.progressBarRemoveAction = ProgressActionCreator.creatRemoveAction();
		this.progressBarUpdateAction = ProgressActionCreator.creatUpdateAction();
		this.progressBarCompleatSortAction = ProgressActionCreator.creatCompleatAction();
		this.atatch(this.progressBarAddAction);
		this.atatch(this.progressBarRemoveAction);
		this.atatch(this.progressBarUpdateAction);
		this.atatch(this.progressBarCompleatSortAction);
		this.storeKey = 'progress';
		this.addInitializeKey(this.storeKey);
	}
	static register() {
		if (!progressViewReducer) {
			progressViewReducer = new ProgressViewReducer();
		}
	}
	async reduce(store, action) {
		if (this.progressBarAddAction.type === action.type) {
			store[this.storeKey] = this.createProgress(true, 0, false, action.data.msg, action.data.title);
		} else if (this.progressBarRemoveAction.type === action.type) {
			store[this.storeKey] = this.createProgress(false, 0, false);
		} else if (this.progressBarUpdateAction.type === action.type) {
			store[this.storeKey] = this.createProgress(true, action.data.progress, false, action.data.msg);
		} else if (this.progressBarCompleatSortAction.type === action.type) {
			store[this.storeKey] = this.createProgress(true, 100, true, action.data.msg);
		}
		return store;
	}
	createProgress(isVisible, progress, isComple, msg, title) {
		return { isVisible: isVisible, progress: progress, msg: msg, isComple: isComple, title: title };
	}
}
