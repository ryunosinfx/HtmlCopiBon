import vu from '../../util/viewUtil.js';
import { BaseView } from '../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../util/reactive/base/vtags.js';
import { PageActionCreator } from '../../reduxy/action/pageActionCreator.js';
import { ImageActionCreator } from '../../reduxy/action/imageActionCreator.js';
export class PageImage extends BaseView {
	constructor(parent, listing, draggableArea) {
		super('PageImage' + listing, 'PageImage');
		this.ip = this.ms.ip;
		this.parent = parent;
		this.draggableArea = draggableArea;
		this.listing = listing;
		this.thumbnail = null;
		this.thumbnail_block = 'thumbnail_block';
		this.draggableArea.toDropPage = (elm) => {
			this.doDrop(elm);
		};
	}
	render() {
		this.button = div(this.id + 'child', 'PageImageA', this.id);
		return div([this.button]);
	}
	async setPageData(pageData, imageData) {
		this.pageData = pageData;
		this.imageData = imageData;
		if (!pageData) {
			return;
		}
		this.pk = pageData.getPk();
		const binaryEntity = this.imageData ? this.imageData.binaryEntity : null;
		if (binaryEntity) {
			const data = {
				name: 'page_' + this.listing,
				ab: binaryEntity._ab,
				type: binaryEntity.type,
			};
			this.thumbnail = await this.ip.createImageNodeByData(data).catch((e) => {
				console.error(e);
				throw e;
			});
			// console.log(this.thumbnail)
		} else {
			this.thumbnail = null;
		}
	}
	render(store, actionData) {
		return div('', '');
	}
	remove(pk) {
		return (event) => {
			if (window.confirm('delete ok?')) {
				const action = PageActionCreator.creatRemoveAction(this, { imagePKforDelete: pk });
				this.dispatch(action);
			}
		};
	}
	handleDragStart(dragImageSrc) {
		return (event) => {
			const elm = event.target;
			this.parent.dropElm = null;
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
		this.parent.dropElm = elm;
		const nowSelectedElm = this.draggableArea.nowSelectedElm;
		if (nowSelectedElm && nowSelectedElm.dataset.pk && nowSelectedElm !== elm) {
			const selectedPk = nowSelectedElm.dataset.pk;
			const targetPk = elm.dataset.pk;
			if (selectedPk && nowSelectedElm.dataset.is_image) {
				//console.log('sort handleDrop imagePKmove:' + nowSelectedElm+ "/elm.dataset.pk:" + elm.dataset.pk+"/targetPk:"+targetPk)
				const action = PageActionCreator.creatAddPageAction(this, {
					imagePk: selectedPk,
					pagePk: targetPk,
				});
				this.dispatch(action);
			} else if (selectedPk && nowSelectedElm.dataset.is_page) {
				//console.log('sort handleDrop imagePKmove:' + nowSelectedElm + "/elm.dataset.pk:" + elm.dataset.pk+"/targetPk:"+targetPk)
				const action = PageActionCreator.creatSortPagesAction(this, {
					formPk: selectedPk,
					toPk: targetPk,
				});
				this.dispatch(action);
			}
		}
		vu.clearSideElmClass(elm, 'over');
	}
	handleDragEnd(event) {
		return (event) => {
			const elm = event.target;
			const targetPk = elm.dataset.pk;
			//console.log('sort handleDrop imagePKmove:' + this.draggableArea.nowSelectedElm + "/elm.dataset.pk:" + elm.dataset.pk + "/targetPk:" + targetPk)
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return;
			}
			this.draggableArea.nowSelectedElm = null;
			vu.clearSideElmClass(elm, 'over');
			if (this.draggableArea.cancelPageArea !== null) {
				const action = PageActionCreator.creatRemovePageAction(this, {
					pagePk: targetPk,
				});
				this.dispatch(action);
			}
		};
	}
	handleTouchStart(dragImageSrc) {
		return (event) => {
			//console.log("handleTouchStart PP");
			const elm = event.target;
			this.parent.dropElm = null;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return;
			}
			window.blockMenuHeaderScroll = true;
			elm.style.opacity = '0.4'; // this / event.target is the source nodevent.
			this.draggableArea.nowSelectedElm = elm;
			// event.dataTransfer.effectAllowed = 'move';
			// // event.dataTransfer.setData('text/html', elm.innerHTML);
			// let dragIcon = document.createElement('img');
			// dragIcon.src = dragImageSrc;
			// dragIcon.width = 100;
			// event.dataTransfer.setDragImage(dragIcon, -10, -10);
		};
	}
	handleTouchMove() {
		return (event) => {
			//console.log("handleTouchMove PP");
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return;
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
		};
	}
	handleTouchEnd() {
		return (event) => {
			window.blockMenuHeaderScroll = false;
			const elm = event.target;
			const targetPk = elm.dataset.pk;
			//console.log('sort handleDrop imagePKmove:' + this.draggableArea.nowSelectedElm + "/elm.dataset.pk:" + elm.dataset.pk + "/targetPk:" + targetPk)
			vu.clearSideElmClass(elm, 'over');
			const pointedElm = this.pointedElm;
			if (!pointedElm || pointedElm === elm) {
				return;
			}
			this.pointedElm = null;
			vu.clearSideElmClass(pointedElm, 'over');
			if (!pointedElm.classList || !pointedElm.classList.contains(pointedElm.thumbnail_block)) {
				if (pointedElm.id === 'thumnailsImageArea' || pointedElm.getAttribute('draggable')) {
					const action = PageActionCreator.creatRemovePageAction(this, {
						pagePk: targetPk,
					});
					this.dispatch(action);
				}
				this.doDrop(pointedElm);
				this.draggableArea.nowSelectedElm = null;
				return;
			}
			if (!pointedElm.getAttribute('draggable')) {
				return;
			}
			this.doDrop(pointedElm);
			// this.draggableArea.toDropTumnails(pointedElm);
			this.draggableArea.nowSelectedElm = null;
		};
	}
	selectImage(event) {
		return (event) => {
			event.stopPropagation(); // Stops some browsers from redirecting.
			event.preventDefault();
			const elm = event.target;
			// console.log('sort selecImage imagePKmove:/elm.dataset.pk:' + elm.dataset.pk + "/" + this.pageData)
			if (this.pageData && this.pageData.baseImage) {
				const action = ImageActionCreator.creatDetailAction(this, { imagePK: this.pageData.baseImage });
				this.dispatch(action);
			}
			return false;
		};
	}
	renderVnode(parent) {
		const pageEntity = this.pageData;
		if (!pageEntity) {
			return div(this.id, ['aaaaaaa' + this.listing], 'null' + this.listing);
		}
		const src = this.thumbnail ? this.thumbnail.src : null;
		const imageBg = !src
			? {}
			: {
					'background-image': 'url(' + src + ')',
			  };
		//console.log("★A binaryEntity 01"+this.id+"/src:"+src)
		//const imgVnode = img(this.pk + "_page", [""], "", src, {});
		const enable = 'enable';
		const disable = 'disable';
		const pageBlock = div('', ['page_block'], []);
		const checkNoCropping = div(
			'',
			['checkNoCropping', pageEntity.isNoCropping ? enable : disable],
			'isNoCropping'
		);
		const checkForceColor = div(
			'',
			['checkForceColor', pageEntity.isForceColor ? enable : disable],
			'isForceColor'
		);
		const optionsBlock = div('', ['options_block'], [checkForceColor, checkNoCropping]);
		const rowVnode = div(
			this.id,
			['thumbnail_block'],
			{
				on: {
					dragstart: this.handleDragStart(src),
					dragover: this.handleDragOver(),
					dragenter: this.handleDragEnter(),
					dragleave: this.handleDragLeave(),
					drop: this.handleDrop(),
					dragend: this.handleDragEnd(),
					click: this.selectImage(),
					touchstart: this.handleTouchStart(),
					touchmove: this.handleTouchMove(),
					touchend: this.handleTouchEnd(),
				},
				dataset: {
					pk: this.pk,
					is_page: true,
				},
				style: imageBg,
				props: {
					draggable: 'true',
				},
			},
			[pageBlock, optionsBlock]
		);
		parent.prePatch('#' + this.id, rowVnode);
		return rowVnode;
	}
	createVnode() {}
}
