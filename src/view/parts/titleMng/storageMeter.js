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
import { TitleActionCreator } from '../../../reduxy/action/titleActionCreator'
import { SplashActionCreator } from '../../../reduxy/action/splashActionCreator'
import { Dialog } from "../dialog/dialog";
export class StorageMeter extends BaseView {
	constructor() {
		super("StorageMeter", "StorageMeter");
		this.storeKey = TitleActionCreator.getStoreKey();
		this.storeCurrentKey = TitleActionCreator.getStoreCurrentKey();
	}

	render(store, actionData) {
		const name = div("", ["StorageMeter"], "Storage now usage:");
		const counter = span('', ["StorageMeterCounter"], "0");
		const unit = span('', ["StorageMeterUnit"], " byte");
		const button = span('', ["StorageMeterUnit", "button"], {
			on: {
				click: this.onReculc()
			}
		}, "reculc!");
		const dataFrame = div('', ["StorageMeter"], [counter, unit, button]);
		return div("", [this.id + "Frame"], [name, dataFrame]);
	}
	async onAfterAttach(store, data) {}

	async onViewShow(store, actionData) {
		if (store[this.storeKey]) {
			const { list, totalSize } = store[this.storeKey];
			// alert('totalSize:'+totalSize);
			const counter = span('', ["StorageMeterCounter"], totalSize + "");
			this.prePatch(".StorageMeterCounter", counter);
			const action = SplashActionCreator.creatRemoveAction(this);
			this.dispatch(action);
		} else if (store[this.storeCurrentKey]) {
			alert('bbbbbb');
		}
	}
	onReculc() {
		return (event) => {
			Dialog.opneAlert("onReculc!", "Taking several time...");
			const action = TitleActionCreator.creatLoadAction(this);
			this.dispatch(action);
			event.preventDefault(); // Necessary. Allows us to drop.
			return false;
		}
	}
}