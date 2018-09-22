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
import { ProgressViewReducer } from '../../../reduxy/reducer/progressViewReducer'
export class ProgressBar extends BaseView {
	constructor() {
		super("ProgressBar", ["ProgressBar", BaseView.ModalWindowClass()]);
		this.storeKey = "progress";
		this.initPoint = '0%';
		this.title = "ProgressBar";
	}

	async onAfterAttach(store, data) {
		ProgressViewReducer.register();
	}
	render() {
		return div("" ["ProgressBarView"], {
			style: {
				display: "none"
			}
		}, [
			div('', ['progeressTitle'], ""),
			div('', ['progeressFrame'], [div('', ['progeress'], {
				style: {
					width: this.initPoint
				}
			})]),
			div('', ['progeressInfo'], [
				div('', ['progeressPoints'], this.initPoint),
				div('', ['progeressMessage'], "")
			])
		]);
	}
	async onViewShow(store, actionData) {
		if (store[this.storeKey]) {
			//alert("onViewShow");
			this.showProgress(store[this.storeKey]);
			//console.log("ProgressBar onViewShow");
		}
	}
	showProgress(data) {
		const { isVisible, progress, isComple, msg, title } = data;
		if (title) {
			this.title = title;
		}
		if (isVisible) {
			this.currentVnode.elm.style.display = 'block';
			this.prePatch(".progeress", div("", ["progeress"], {
				style: {
					width: progress + "%"
				}
			}, ));
			this.prePatch(".progeressTitle", div("", ["progeressTitle"], {}, this.title));
			this.prePatch(".progeressPoints", div("", ["progeressPoints"], {}, progress + "%"));
			this.prePatch(".progeressMessage", div("", ["progeressMessage"], {}, msg));
			if (isComple) {
				this.currentVnode.elm.style.display = 'none';
			}
		} else {
			this.currentVnode.elm.style.display = 'none';
			this.prePatch(".progeress", div("", ["progeress"], {
				style: {
					width: "0%"
				}
			}));
			this.prePatch(".progeressPoints", div("", ["progeressPoints"], {}, this.initPoint));
		}
	}
}