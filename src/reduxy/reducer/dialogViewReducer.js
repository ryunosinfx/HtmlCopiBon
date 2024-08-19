import { DialogActionCreator } from '../action/dialogActionCreator.js';
import { BaseReducer } from '../../util/reactive/baseReducer.js';
let dialogViewReducer = null;
export class DialogViewReducer extends BaseReducer {
	constructor() {
		super();
		this.dialogOpenAction = DialogActionCreator.creatOpenAction();
		this.dialogAlertAction = DialogActionCreator.creatAlertAction();
		this.dialogConfirmAction = DialogActionCreator.creatConfirmAction();
		this.dialogCloseAction = DialogActionCreator.creatCloseAction();
		this.atatch(this.dialogOpenAction);
		this.atatch(this.dialogAlertAction);
		this.atatch(this.dialogConfirmAction);
		this.atatch(this.dialogCloseAction);
		this.storeKey = DialogActionCreator.getStoreKey();
		this.addInitializeKey(this.storeKey);
	}
	static register() {
		if (!dialogViewReducer) dialogViewReducer = new DialogViewReducer();
	}
	async reduce(store, action) {
		if (this.dialogOpenAction.type === action.type)
			store[this.storeKey] = this.createDialog(
				true,
				action.type,
				action.data.msg,
				action.data.title,
				action.data.nextActions
			);
		else if (this.dialogAlertAction.type === action.type)
			store[this.storeKey] = this.createDialog(true, action.type, action.data.msg, action.data.title);
		else if (this.dialogConfirmAction.type === action.type)
			store[this.storeKey] = this.createDialog(true, action.type, action.data.msg, action.data.title);
		else if (this.dialogCloseAction.type === action.type)
			store[this.storeKey] = this.createDialog(false, action.type);
		return store;
	}
	createDialog(isVisible, type, msg, title, nextActions) {
		return {
			isVisible: isVisible,
			type: type,
			msg: msg,
			title: title,
			nextActions,
		};
	}
}
