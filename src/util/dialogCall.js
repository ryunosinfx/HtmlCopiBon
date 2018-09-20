import { Dialog } from "../view/parts/dialog/dialog";
export class DialogCall {
	static async opneAlert(title, msg) {
		return await Dialog.opneAlert(title, msg);
	}
	static async opneConfirm(title, msg) {
		return await Dialog.opneConfirm(title, msg);
	}
}