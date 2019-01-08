import vu from "../../util/viewUtil";
import {
	BaseView
} from "../../util/reactive/baseView";
import bc from "../../util/binaryConverter";

import {
	a,
	div,
	li,
	ul,
	img,
	span,
	input,
	label
} from "../../util/reactive/base/vtags";
import {
	ImageActionCreator
} from '../../reduxy/action/imageActionCreator'
const PLANE = 'PLANE';
const WINDOW = 'WINDOW';
const DOUBLE = 'DOUBLE';
const HELF = 'HELF';
const QUAD = 'QUAD';
const FULL = 'FULL';
export class ImageDetail extends BaseView {
	constructor() {
		super("ImageDetail", "ImageDetail");
		this.imageAreaID = this.id + "child";
		this.isOnScroll = false;
		this.startX = 0;
		this.startY = 0;
		this.previewMode = PLANE;
		this.pk = null;
	}
	render(store, actionData) {
		const toNativeSizeButton = div(this.id + "toNativeSizeButton", ["toNativeSizeButton"], {
			on: {
				click: this.toNativeSize()
			}
		}, "1:1");
		const toWindowSizeButton = div(this.id + "toWindowSizeButton", ["toWindowSizeButton"], {
			on: {
				click: this.toWindowSize()
			}
		}, "W");
		const toDoubleWindowSizeButton = div(this.id + "toDoubleWindowSizeButton", ["toDoubleWindowSizeButton"], {
			on: {
				click: this.toDoubleWindowSize()
			}
		}, "Wx2");
		const toQuadWindowSizeButton = div(this.id + "toQuadWindowSizeButton", ["toQuadWindowSizeButton"], {
			on: {
				click: this.toQuadWindowSize()
			}
		}, "Wx4");
		const toHelfWindowSizeButton = div(this.id + "toHelfWindowSizeButton", ["toHelfWindowSizeButton"], {
			on: {
				click: this.toHelfWindowSize()
			}
		}, "W/2");
		const toFullWindowSizeButton = div(this.id + "toFullWindowSizeButton", ["toFullWindowSizeButton"], {
			on: {
				click: this.toFullWindowSize()
			}
		}, "FW");
		const title = span("", ["ImageDetailTitleText"], "ImageDetailTitle");
		const titleBar = div("", ["ImageDetailTitle"], [title, toNativeSizeButton, toWindowSizeButton, toDoubleWindowSizeButton, toQuadWindowSizeButton, toHelfWindowSizeButton, toFullWindowSizeButton]);
		return div("", [""], [titleBar, div(this.imageAreaID, ["ImageDetailA"], "No Image Selected")]);
	}

	async onViewShow(store, actionData) {
		if (store.imagesDetailData) {
			await this.showImage(store.imagesDetailData);
			this.startX = 0;
			this.startY = 0;
			this.offsetX = 0;
			this.offsetY = 0;
			this.isOnScroll = false;
		}
	}
	async onAfterAttach(store, data) {
		this.setSelectStyle("toNativeSizeButton", PLANE)
		this.setSelectStyle("toWindowSizeButton", WINDOW)
		this.setSelectStyle("toDoubleWindowSizeButton", DOUBLE)
		this.setSelectStyle("toQuadWindowSizeButton", QUAD)
		this.setSelectStyle("toHelfWindowSizeButton", HELF)
		this.setSelectStyle("toFullWindowSizeButton", FULL)
	}
	async showImage(imageData) {
		const {
			imageEntity,
			binaryEntity,
			imageText
		} = imageData;
		const pk = imageEntity.getPk();
		if (this.pk !== pk) {
			this.previewMode = PLANE;
		}
		this.setSelectStyle("toNativeSizeButton", PLANE)
		this.setSelectStyle("toWindowSizeButton", WINDOW)
		this.setSelectStyle("toDoubleWindowSizeButton", DOUBLE)
		this.setSelectStyle("toQuadWindowSizeButton", QUAD)
		this.setSelectStyle("toHelfWindowSizeButton", HELF)
		this.setSelectStyle("toFullWindowSizeButton", FULL)
		this.pk = pk;
		const dataUri = bc.arrayBuffer2DataURI(binaryEntity._ab);
		const imgVnode = img(pk + "_image", imageEntity.name, imageEntity.name, dataUri, {});
		const textVnode = span(pk + "_text", ["thumbnail_text"], imageData.imageText);
		const image = [
			div("", [""], [imgVnode]),
			div("", [textVnode])
		]
		this.prePatch("#" + this.imageAreaID, div(this.imageAreaID, ["image_detail_block", this.previewMode], {
			on: {
				mousedown: this.onMouseOn(),
				mousemove: this.onMouseMove(),
				click: this.onClick()
			},
			style: {
				top: 0,
				left: 0
			}
		}, image));
	}
	onClick() {
		return (event) => {
			this.toNativeSize()(event);
		}
	}
	setSelectStyle(id, className) {
		const active = "active";
		const button = document.getElementById(this.id + id);
		if (this.previewMode === className) {
			// alert(this.previewMode);
			button.classList.add(active);
		} else {
			button.classList.remove(active);
		}
	}
	toNativeSize() {
		return (event) => {
			// alert("toNativeSize this.pk):" + this.pk);
			this.previewMode = PLANE;
			if (this.pk) {
				const action = ImageActionCreator.creatDetailAction(this, {
					imagePK: this.pk
				});
				this.dispatch(action);
			}
		}
	}
	toWindowSize() {
		return (event) => {
			// alert("toWindowSize this.pk):" + this.pk);
			this.previewMode = WINDOW;
			if (this.pk) {
				const action = ImageActionCreator.creatDetailAction(this, {
					imagePK: this.pk
				});
				this.dispatch(action);
			}
		}
	}
	toDoubleWindowSize() {
		return (event) => {
			// alert("toDoubleWindowSize this.pk):" + this.pk);
			this.previewMode = DOUBLE;
			if (this.pk) {
				const action = ImageActionCreator.creatDetailAction(this, {
					imagePK: this.pk
				});
				this.dispatch(action);
			}
		}
	}
	toHelfWindowSize() {
		return (event) => {
			// alert("toHelfWindowSize this.pk):" + this.pk);
			this.previewMode = HELF;
			if (this.pk) {
				const action = ImageActionCreator.creatDetailAction(this, {
					imagePK: this.pk
				});
				this.dispatch(action);
			}
		}
	}
	toQuadWindowSize() {
		return (event) => {
			// alert("toHelfWindowSize this.pk):" + this.pk);
			this.previewMode = QUAD;
			if (this.pk) {
				const action = ImageActionCreator.creatDetailAction(this, {
					imagePK: this.pk
				});
				this.dispatch(action);
			}
		}
	}
	toFullWindowSize() {
		return (event) => {
			// alert("toHelfWindowSize this.pk):" + this.pk);
			this.previewMode = FULL;
			if (this.pk) {
				const action = ImageActionCreator.creatDetailAction(this, {
					imagePK: this.pk
				});
				this.dispatch(action);
			}
		}
	}
	onMouseOn() {
		return (event) => {
			// alert("onMouseOn");
			this.startX = this.offsetX ?
				event.clientX + this.offsetX * 0 - this.offsetX１ :
				event.clientX;
			this.startY = this.offsetY ?
				event.clientY + this.offsetY * 0 - this.offsetY１ :
				event.clientY;
			const elm = event.target;
			this.isOnScroll = this.isOnScroll ? false : true;
		}
	}
	onMouseOff() {
		return (event) => {
			// alert("onMouseOff");
			const elm = event.target;
			this.isOnScroll = false;
		}
	}
	onMouseMove() {
		return (event) => {
			const elm = event.target;
			if (this.isOnScroll) {
				const currentX = event.clientX;
				const currentY = event.clientY;
				const offsetX = currentX - this.startX;
				const offsetY = currentY - this.startY;
				const targetNode = elm.parentNode.parentNode;
				// console.log("elm.tagName:" + elm.tagName + "/(offsetX:" + offsetX + "/offsetY:" + offsetY
				// + ")/(currentX:" + currentX + "/currentY:" + currentY
				// + ")/(this.startX:" + this.startX + "/this.startY:" + this.startY);
				targetNode.style.top = offsetY + "px";
				targetNode.style.left = offsetX + "px";
				this.offsetX = this.startX;
				this.offsetY = this.startY;
				this.offsetX１ = offsetX;
				this.offsetY１ = offsetY;
			}
		}
	}
}
