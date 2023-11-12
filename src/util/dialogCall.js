import { Dialog } from '../view/parts/dialog/dialog.js';
export class DialogCall {
	static async opneAlert(title, msg) {
		alert('aaaa');
		return await Dialog.opneAlert(title, msg);
	}
	static async opneConfirm(title, msg) {
		return await Dialog.opneConfirm(title, msg);
	}
}
