import vu from "../../util/viewUtil";
import {
	BaseView
} from "../../util/reactive/baseView";
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
import {
	PageActionCreator
} from '../../reduxy/action/pageActionCreator'
import { Dialog } from "./dialog/dialog";
export class Thumbnail extends BaseView {
	constructor(parent, draggableArea) {
		super("Thumnail" + parent.id, "Thumnail");
		this.parent = parent;
		this.draggableArea = draggableArea;
		this.ip = this.ms.ip;
		this.draggableArea.nowSelectedElm = null;
		this.thumbnail_block = "thumbnail_block";
		this.displayNone = "display_none";
		this.draggableArea.toDropTumnails = (elm) => { this.doDrop(elm) };
	}
	setImageData(imageData) {
		this.imageData = imageData;
	}
	render(store, actionData) {
		return div('', "");
	}
	remove(pk) {
		return async (event) => {
			const result = await Dialog.opneConfirm("Clicked Image Delete Button!", "delete ok?");
			if (result) {
				const action = ImageActionCreator.creatRemoveAction(this, {
					imagePKforDelete: pk
				});
				this.dispatch(action);
			}
		}
	}
	handleDragStart(dragImageSrc) {
		return (event) => {
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return
			}
			elm.style.opacity = '0.4'; // this / event.target is the source nodevent.
			this.draggableArea.nowSelectedElm = elm;
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/html', elm.innerHTML);
			let dragIcon = document.createElement('img');
			dragIcon.src = dragImageSrc;
			dragIcon.width = 100;
			event.dataTransfer.setDragImage(dragIcon, -10, -10);
		}
	}
	handleDragOver() {
		return (event) => {
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return
			}
			event.preventDefault(); // Necessary. Allows us to drop.
			event.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
			return false;
		}
	}
	handleDragEnter() {
		return (event) => {
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return
			}
			elm.classList.add('over');
		}
	}
	handleDragLeave() {
		return (event) => {
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return
			}
			elm.classList.remove('over'); // this / event.target is previous target element.
		}
	}
	handleDrop(event) {
		return (event) => {
			event.stopPropagation(); // Stops some browsers from redirecting.
			event.preventDefault();
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return
			}
			this.doDrop(elm);
			return false;
		}
	}
	doDrop(elm) {
		const nowSelectedElm = this.draggableArea.nowSelectedElm;
		if (nowSelectedElm && nowSelectedElm.dataset.pk && nowSelectedElm !== elm) {
			const selectedPk = nowSelectedElm.dataset.pk;
			if (nowSelectedElm.dataset.is_image) {
				//console.log('sort handleDrop imagePKmove:'+selectedPk+"/elm.dataset.pk:"+elm.dataset.pk)
				const action = ImageActionCreator.creatSortImagesAction(this, {
					imagePKmove: selectedPk,
					imagePKdrop: elm.dataset.pk
				});
				this.dispatch(action);
			} else if (nowSelectedElm.dataset.is_page) {
				//console.log('sort handleDrop imagePKmove:'+selectedPk+"/elm.dataset.pk:"+elm.dataset.pk)
				const action = PageActionCreator.creatRemovePageAction(this, {
					pagePk: selectedPk
				});
				this.dispatch(action);
			}
			this.draggableArea.nowSelectedElm = null;
		}
		vu.clearSideElmClass(elm, 'over');
	}
	handleDragEnd(event) {
		return (event) => {
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return
			}
			window.blockMenuHeaderScroll = true;
			const nowSelectedElm = this.draggableArea.nowSelectedElm;
			// console.log('handleDragEnd imagePKmove:'+(nowSelectedElm?nowSelectedElm.dataset.pk:nowSelectedElm)+"/elm.dataset.pk:"+elm.dataset.pk)
			vu.clearSideElmClass(elm, 'over');
		}
	}
	handleTouchStart(dragImageSrc) {
		return (event) => {
			//console.log("handleTouchStart");
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return
			}
			elm.style.opacity = '0.4'; // this / event.target is the source nodevent.
			this.draggableArea.nowSelectedElm = elm;
			// event.dataTransfer.effectAllowed = 'move';
			// event.dataTransfer.setData('text/html', elm.innerHTML);
			// let dragIcon = document.createElement('img');
			// dragIcon.src = dragImageSrc;
			// dragIcon.width = 100;
			// event.dataTransfer.setDragImage(dragIcon, -10, -10);
		}
	}
	handleTouchMove() {
		return (event) => {
			window.blockMenuHeaderScroll = false;
			event.preventDefault(); // Necessary. Allows us to drop.
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return
			}
			const pointedElm = vu.getCurrentPointedElm(event);
			if (this.pointedElm && this.pointedElm !== pointedElm) {
				vu.clearSideElmClass(this.pointedElm, 'over');
			}
			this.pointedElm = pointedElm;
			if (!pointedElm.getAttribute('draggable') || pointedElm === elm) {
				return;
			}
			pointedElm.classList.add('over');
			// event.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
			return false;
		}
	}
	handleTouchEnd() {
		return (event) => {
			//console.log("handleTouchEnd");
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return
			}
			const nowSelectedElm = this.draggableArea.nowSelectedElm;
			vu.clearSideElmClass(elm, 'over');
			const pointedElm = this.pointedElm;
			if (!pointedElm || !pointedElm.getAttribute('draggable') || pointedElm === elm) {
				return;
			}
			this.pointedElm = null;
			if (!pointedElm.classList || !pointedElm.classList.contains(pointedElm.thumbnail_block)) {
				this.draggableArea.toDropPage(pointedElm);
				return
			}
			// console.log('handleDragEnd imagePKmove:'+(nowSelectedElm?nowSelectedElm.dataset.pk:nowSelectedElm)+"/elm.dataset.pk:"+elm.dataset.pk)
			vu.clearSideElmClass(pointedElm, 'over');
			this.doDrop(elm);
		}
	}
	selectImage(event) {
		return (event) => {
			event.stopPropagation(); // Stops some browsers from redirecting.
			event.preventDefault();
			const elm = event.target;
			// console.log(' selecImage imagePKmove:/elm.dataset.pk:'+elm.dataset.pk)
			const action = ImageActionCreator.creatDetailAction(this, {
				imagePK: elm.dataset.pk
			});
			this.dispatch(action);
			return false;
		}
	}
	async crateDataLine(imageData, pagesMap = {}) {
		const imageEntity = imageData.imageEntity;
		const binaryEntity = imageData.binaryEntity;
		//console.log(binaryEntity)
		const data = {
			name: imageEntity.name,
			ab: binaryEntity._ab,
			type: imageEntity.type
		}
		const imgElm = await this.ip.createImageNodeByData(data)
			.catch((e) => {
				console.error(e);
				throw e
			});
		const pk = imageEntity.getPk();
		// const imgVnode = img(pk + "_image", imageEntity.name, imageEntity.name, imgElm.src, {});
		const textVnode = span(pk + "_text", ["thumbnail_text"], imageData.imageText);
		const delButton = span(pk + "_delButton", ["delButton"], {
			on: {
				"click": this.remove(pk)
			}
		}, "x");
		const imageVnode = div("", ["image_block"], {
			on: {
				dragstart: this.handleDragStart(imgElm.src),
				dragover: this.handleDragOver(),
				dragenter: this.handleDragEnter(),
				dragleave: this.handleDragLeave(),
				drop: this.handleDrop(),
				dragend: this.handleDragEnd(),
				click: this.selectImage(),
				touchstart: this.handleTouchStart(imgElm.src),
				touchmove: this.handleTouchMove(),
				touchend: this.handleTouchEnd()
			},
			dataset: {
				pk: pk,
				is_image: true
			},
			props: {
				"draggable": "true"
			}
		});
		const classObj = {};
		classObj[this.displayNone] = pagesMap[pk];
		const rowVnode = div("", [this.thumbnail_block], {
			on: {
				dragstart: this.handleDragStart(imgElm.src),
				dragover: this.handleDragOver(),
				dragenter: this.handleDragEnter(),
				dragleave: this.handleDragLeave(),
				drop: this.handleDrop(),
				dragend: this.handleDragEnd(),
				click: this.selectImage(),
				touchstart: this.handleTouchStart(imgElm.src),
				touchmove: this.handleTouchMove(),
				touchend: this.handleTouchEnd()
			},
			style: {
				"background-image": "url(" + imgElm.src + ")"
			},
			class: classObj,
			dataset: {
				pk: pk,
				is_image: true
			},
			props: {
				"draggable": "true"
			}
		}, [delButton, textVnode]);
		return rowVnode;
	}
}