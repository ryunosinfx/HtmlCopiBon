import { Dialog } from '../view/parts/dialog/dialog.js';
export class DialogCall {
	static async opneAlert(title, msg, style = {}) {
		return await Dialog.opneAlert(title, msg, style);
	}
	static async opneConfirm(title, msg, style = {}) {
		return await Dialog.opneConfirm(title, msg, style);
	}
}
