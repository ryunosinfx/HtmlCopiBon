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
import {DialogActionCreator} from '../../../reduxy/action/dialogActionCreator'
import { DialogViewReducer } from '../../../reduxy/reducer/dialogViewReducer'
export class Dialog extends BaseView {
	constructor() {
		super("Dialog", "Dialog");
		this.storeKey = DialogActionCreator.getStoreKey();
    this.dialogOpenAction = DialogActionCreator.creatOpenAction();
    this.dialogAlertAction = DialogActionCreator.creatAlertAction();
    this.dialogConfirmAction = DialogActionCreator.creatConfirmAction();
		this.title = "Dialog";
	}

	async onAfterAttach(store, data) {
		DialogViewReducer.register();
	}
	render() {
		return div("" ["DialogView"], {
			style: {
				display: "none"
			}
		}, [
			div('', ['dialogTitle'], ""),
			div('', ['dialogFrame'], [div('', ['dialog'], {
				style: {
					width: this.initPoint
				}
			})]),
			div('', ['dialogInfo'], [
				div('', ['dialogMessage'], "")
			]),
			div('', ['dialogDeside'], [
				div('', ['dialogOk'], {on:{click:this.onOK()}},"OK"),
				div('', ['dialogCancel'], {on:{click: this.onCancel()}},"Cancel")
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
	onOK(){
		return ()=>{
			alert("ok!")
		}
	}
	onCancel(){
		return ()=>{
			alert("cancel!")
		}
	}
	showDialog(data) {
		const { isVisible, type, isComple, msg, title } = data;
		if (title) {
			this.title = title;
		}
		if (isVisible) {
			this.currentVnode.elm.style.display = 'block';
			this.prePatch(".dialog", div("", ["dialog"], {
				style: {
					width: progress + "%"
				}
			}, ));
			this.prePatch(".dialogTitle", div("", ["dialogTitle"], {}, this.title));
			this.prePatch(".dialogMessage", div("", ["dialogMessage"], {}, msg));
			const buttons = [];
			buttons.pssh(div('', ['dialogOk'], {on:{click:this.onOK()}},"OK"));
			if(this.dialogConfirmAction.type === type){
				buttons.pssh(div('', ['dialogCancel'], {on:{click: this.onCancel()}},"Cancel"));
			}
			this.prePatch(".dialogDeside", 	div('', ['dialogDeside'], buttons));
		} else {
			this.currentVnode.elm.style.display = 'none';
			this.prePatch(".dialog", div("", ["dialog"], {
				style: {
					width: "0%"
				}
			}));
			this.prePatch(".dialogPoints", div("", ["dialogPoints"], {}, this.initPoint));
		}
	}
}
