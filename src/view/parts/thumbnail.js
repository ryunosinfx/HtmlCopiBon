import { ViewUtil } from '../../util/ViewUtil.js';
import { BinaryCnvtr, H } from '../../util/binaryConverter.js';
import { ImageSrcCache } from '../../util/image/ImageSrcCache.js';
import { BaseView } from '../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../util/reactive/base/vtags.js';
import { ImageActionCreator } from '../../reduxy/action/imageActionCreator.js';
import { PageActionCreator } from '../../reduxy/action/pageActionCreator.js';
import { Dialog } from './dialog/dialog.js';
export class Thumbnail extends BaseView {
	constructor(parent, draggableArea) {
		super('Thumnail' + parent.id, 'Thumnail');
		this.parent = parent;
		this.draggableArea = draggableArea;
		this.ip = this.ms.ip;
		this.draggableArea.nowSelectedElm = null;
		this.thumbnail_block = 'thumbnail_block';
		this.displayNone = 'display_none';
		this.draggableArea.toDropTumnails = (elm) => {
			this.doDrop(elm);
		};
	}
	setImageData(imageData) {
		this.imageData = imageData;
	}
	render(store, actionData) {
		return div('', '');
	}
	remove(pk) {
		return async (event) => {
			const result = await Dialog.opneConfirm('Clicked Image Delete Button!', 'delete ok?');
			if (result) {
				// alert('result:' + result);
				this.dispatch(
					ImageActionCreator.creatRemoveAction(this, {
						imagePKforDelete: pk,
					})
				);
				const action = ImageActionCreator.creatDetailAction(this, {
					imagePK: pk,
					isDelete: true,
				});
				this.dispatch(action);
			}
		};
	}
	handleDragStart(dragImageSrc) {
		return (event) => {
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return;
			}
			elm.style.opacity = '0.4'; // this / event.target is the source nodevent.
			this.draggableArea.nowSelectedElm = elm;
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/html', elm.innerHTML);
			let dragIcon = document.createElement('img');
			dragIcon.src = dragImageSrc;
			dragIcon.width = 100;
			event.dataTransfer.setDragImage(dragIcon, -10, -10);
		};
	}
	handleDragOver() {
		return (event) => {
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return;
			}
			event.preventDefault(); // Necessary. Allows us to drop.
			event.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
			return false;
		};
	}
	handleDragEnter() {
		return (event) => {
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return;
			}
			elm.classList.add('over');
		};
	}
	handleDragLeave() {
		return (event) => {
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return;
			}
			elm.classList.remove('over'); // this / event.target is previous target element.
		};
	}
	handleDrop(event) {
		return (event) => {
			event.stopPropagation(); // Stops some browsers from redirecting.
			event.preventDefault();
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return;
			}
			this.doDrop(elm);
			return false;
		};
	}
	doDrop(elm) {
		const nowSelectedElm = this.draggableArea.nowSelectedElm;
		if (nowSelectedElm && nowSelectedElm.dataset.pk && nowSelectedElm !== elm) {
			const selectedPk = nowSelectedElm.dataset.pk;
			if (nowSelectedElm.dataset.is_image) {
				//console.log('sort handleDrop imagePKmove:'+selectedPk+"/elm.dataset.pk:"+elm.dataset.pk)
				const action = ImageActionCreator.creatSortImagesAction(this, {
					imagePKmove: selectedPk,
					imagePKdrop: elm.dataset.pk,
				});
				this.dispatch(action);
			} else if (nowSelectedElm.dataset.is_page) {
				//console.log('sort handleDrop imagePKmove:'+selectedPk+"/elm.dataset.pk:"+elm.dataset.pk)
				const action = PageActionCreator.creatRemovePageAction(this, {
					pagePk: selectedPk,
				});
				this.dispatch(action);
			}
			this.draggableArea.nowSelectedElm = null;
		}
		ViewUtil.clearSideElmClass(elm, 'over');
	}
	handleDragEnd(event) {
		return (event) => {
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return;
			}
			window.blockMenuHeaderScroll = true;
			const nowSelectedElm = this.draggableArea.nowSelectedElm;
			// console.log('handleDragEnd imagePKmove:'+(nowSelectedElm?nowSelectedElm.dataset.pk:nowSelectedElm)+"/elm.dataset.pk:"+elm.dataset.pk)
			ViewUtil.clearSideElmClass(elm, 'over');
		};
	}
	handleTouchStart(dragImageSrc) {
		return (event) => {
			//console.log("handleTouchStart");
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return;
			}
			elm.style.opacity = '0.4'; // this / event.target is the source nodevent.
			this.draggableArea.nowSelectedElm = elm;
			// event.dataTransfer.effectAllowed = 'move';
			// event.dataTransfer.setData('text/html', elm.innerHTML);
			// let dragIcon = document.createElement('img');
			// dragIcon.src = dragImageSrc;
			// dragIcon.width = 100;
			// event.dataTransfer.setDragImage(dragIcon, -10, -10);
		};
	}
	handleTouchMove() {
		return (event) => {
			window.blockMenuHeaderScroll = false;
			event.preventDefault(); // Necessary. Allows us to drop.
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return;
			}
			const pointedElm = ViewUtil.getCurrentPointedElm(event);
			if (this.pointedElm && this.pointedElm !== pointedElm) {
				ViewUtil.clearSideElmClass(this.pointedElm, 'over');
			}
			this.pointedElm = pointedElm;
			if (!pointedElm.getAttribute('draggable') || pointedElm === elm) {
				return;
			}
			pointedElm.classList.add('over');
			// event.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
			return false;
		};
	}
	handleTouchEnd() {
		return (event) => {
			//console.log("handleTouchEnd");
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return;
			}
			const nowSelectedElm = this.draggableArea.nowSelectedElm;
			ViewUtil.clearSideElmClass(elm, 'over');
			const pE = this.pointedElm;
			if (!pE || !pE.getAttribute('draggable') || pE === elm) {
				return;
			}
			this.pointedElm = null;
			if (!pE.classList || !pE.classList.contains(pE.thumbnail_block)) {
				this.draggableArea.toDropPage(pE);
				return;
			}
			// console.log('handleDragEnd imagePKmove:'+(nowSelectedElm?nowSelectedElm.dataset.pk:nowSelectedElm)+"/elm.dataset.pk:"+elm.dataset.pk)
			ViewUtil.clearSideElmClass(pE, 'over');
			this.doDrop(elm);
		};
	}
	selectImageToDetail(event) {
		return (event) => {
			event.stopPropagation(); // Stops some browsers from redirecting.
			event.preventDefault();
			const elm = event.target;
			// console.log(' selecImage imagePKmove:/elm.dataset.pk:'+elm.dataset.pk)
			const action = ImageActionCreator.creatDetailAction(this, {
				imagePK: elm.dataset.pk,
				isDelete: false,
			});
			this.dispatch(action);
			return false;
		};
	}
	async crateDataLine(imageData, pagesMap = {}) {
		const imageEntity = imageData.imageEntity;
		//console.log(binaryEntity)
		const src = await ImageSrcCache.get(imageData);
		const pk = imageEntity.getPk();
		const textVnode = span(pk + '_text', ['thumbnail_text'], imageData.imageText);
		const delButton = span(
			pk + '_delButton',
			['delButton'],
			{
				on: {
					click: this.remove(pk),
				},
			},
			'x'
		);
		const classObj = {};
		classObj[this.displayNone] = pagesMap[pk];
		const rowVnode = div(
			'',
			[this.thumbnail_block],
			{
				on: {
					dragstart: this.handleDragStart(src),
					dragover: this.handleDragOver(),
					dragenter: this.handleDragEnter(),
					dragleave: this.handleDragLeave(),
					drop: this.handleDrop(),
					dragend: this.handleDragEnd(),
					click: this.selectImageToDetail(),
					touchstart: this.handleTouchStart(src),
					touchmove: this.handleTouchMove(),
					touchend: this.handleTouchEnd(),
				},
				style: {
					'background-image': 'url(' + src + ')',
				},
				class: classObj,
				dataset: {
					pk: pk,
					is_image: true,
				},
				props: {
					draggable: 'true',
				},
			},
			[delButton, textVnode]
		);
		return rowVnode;
	}
}
