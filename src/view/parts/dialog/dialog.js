import vu from "../../../util/viewUtil";
import { BaseView } from "../../../util/reactive/baseView";
import {
	a,
	div,
	li,
	ul,
	img,
	span,
	input,
	label
} from "../../../util/reactive/base/vtags";
import { DialogActionCreator } from '../../../reduxy/action/dialogActionCreator'
import { DialogViewReducer } from '../../../reduxy/reducer/dialogViewReducer'
let dialogInstance = null;
export class Dialog extends BaseView {
	constructor() {
		super("Dialog", "Dialog");
		this.storeKey = DialogActionCreator.getStoreKey();
		this.dialogOpenAction = DialogActionCreator.creatOpenAction();
		this.dialogAlertAction = DialogActionCreator.creatAlertAction();
		this.dialogConfirmAction = DialogActionCreator.creatConfirmAction();
		this.title = "Dialog";
		dialogInstance = this;
		this.resolv = null;
		this.reject = null;
	}

	async onAfterAttach(store, data) {
		this.close();
		DialogViewReducer.register();
	}
	static async opneAlert(title, msg) {
		return new Promise(
			(resolv, reject) => {
				dialogInstance.showAlertDialog(title, msg);
				dialogInstance.resolv = resolv;
				dialogInstance.reject = reject;
			}
		);
	}
	static async opneConfirm(title, msg) {
		return new Promise(
			(resolv, reject) => {
				dialogInstance.showConfirmDialog(title, msg);
				dialogInstance.resolv = resolv;
				dialogInstance.reject = reject;
			}
		);
	}
	showAlertDialog(title, msg) {
		const action = DialogActionCreator.creatAlertAction(this, { title: title, msg: msg });
		this.dispatch(action);
	}
	showConfirmDialog(title, msg) {
		const action = DialogActionCreator.creatConfirmAction(this, { title: title, msg: msg });
		this.dispatch(action);
	}
	render() {
		return div("" ["DialogView"], {
			style: {
				display: "none"
			}
		}, [
			div('', ['dialogTitle'], this.title),
			div('', ['dialogFrame'], [div('', ['dialog'], {
				style: {
					width: this.initPoint
				}
			})]),
			div('', ['dialogInfo'], [
				div('', ['dialogMessage'], "")
			]),
			div('', ['dialogDeside'], [
				div('', ['dialogOk'], { on: { click: this.onOK() } }, "OK"),
				div('', ['dialogCancel'], { on: { click: this.onCancel() } }, "Cancel")
			])
		]);
	}
	async onViewShow(store, actionData) {
		if (store[this.storeKey]) {
			//alert("onViewShow");
			this.showDialog(store[this.storeKey]);
			//console.log("Dialog onViewShow");
		}
	}
	onOK() {
		return (event) => {
			const action = DialogActionCreator.creatCloseAction(this, {});
			if (this.resolv) {
				this.resolv(true);
				this.resolv = null;
				this.reject = null;
			}
			this.dispatch(action);
			event.stopPropagation();
			return false;
		}
	}
	onCancel() {
		return (event) => {
			const action = DialogActionCreator.creatCloseAction(this, {});
			if (this.resolv) {
				this.resolv(false);
				this.resolv = null;
				this.reject = null;
			}
			this.dispatch(action);
			event.stopPropagation();
			return false;
		}
	}
	showDialog(data) {
		const { isVisible, type, msg, title } = data;
		if (title) {
			this.title = title;
		}
		if (isVisible) {
			this.show();
			this.prePatch(".dialog", div("", ["dialog"], {
				style: {}
			}, ));
			this.prePatch(".dialogTitle", div("", ["dialogTitle"], {}, this.title));
			this.prePatch(".dialogMessage", div("", ["dialogMessage"], {}, msg));
			const buttons = [];
			buttons.push(div('', ['dialogOk'], { on: { click: this.onOK() } }, "OK"));
			if (this.dialogConfirmAction.type === type) {
				buttons.push(div('', ['dialogCancel'], { on: { click: this.onCancel() } }, "Cancel"));
			}
			this.prePatch(".dialogDeside", div('', ['dialogDeside'], buttons));
		} else {
			this.close();
			this.prePatch(".dialog", div("", ["dialog"], {
				style: {
					width: "0%"
				}
			}));
			this.prePatch(".dialogPoints", div("", ["dialogPoints"], {}, this.initPoint));
		}
	}
}