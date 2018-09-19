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
			this.showProgress(store[this.storeKey]);
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
	showProgress(data) {
		const { isVisible, isConfirm, isComple, msg, title } = data;
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
			if (isComple) {
				this.currentVnode.elm.style.display = 'none';
			}
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
