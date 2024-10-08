import { BaseView } from '../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../util/reactive/base/vtags.js';
import { ImageActionCreator } from '../../reduxy/action/imageActionCreator.js';
import { PageActionCreator } from '../../reduxy/action/pageActionCreator.js';
import { Thumbnail } from './thumbnail.js';
export class Thumbnails extends BaseView {
	constructor(draggableArea) {
		super('Thumnails', 'Thumnails');
		this.imageAreaID = 'thumnailsImageArea';
		this.thumbnail = new Thumbnail(this, draggableArea);
		this.ip = this.ms.ip;
		this.storePagesKey = PageActionCreator.getStorePagesKey();
		this.storeImagesKey = ImageActionCreator.getStoreImagesKey();
		this.pageMap = {};
		this.thumbnails_block = 'thumbnails_block';
		this.draggableArea = draggableArea;
		this.draggableArea.cancelPageArea = null;
	}
	async onAfterAttach(store, data) {
		const action = ImageActionCreator.creatLoadImagesAction(this, {});
		await this.dispatch(action);
	}
	async onViewShow(store, actionData) {
		const pagesData = store[this.storePagesKey];
		const imagesData = store[this.storeImagesKey];
		if (imagesData && pagesData) {
			this.updatePageMap(pagesData);
			await this.showImages(imagesData).catch((e) => {
				console.error(e);
			});
			// console.error("Thumnails onViewShow count:"+pagesData.length+"/"+imagesData.length+"/"+JSON.stringify(this.pageMap));
		}
	}
	render(store, actionData) {
		return div(this.imageAreaID, 'Thumnails');
	}
	updatePageMap(pagesData) {
		for (const key in this.pageMap) delete this.pageMap[key];
		for (const pageEntity of pagesData) {
			if (!pageEntity) continue;
			const imagePk = pageEntity.baseImage;
			if (imagePk) this.pageMap[imagePk] = true;
		}
	}
	handleDragEnter() {
		return (event) => {
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnails_block)) {
				return;
			}
			elm.classList.add('over');
			this.draggableArea.cancelPageArea = elm;
		};
	}
	handleDragLeave() {
		return (event) => {
			const elm = event.target;
			if (!elm.classList || !elm.classList.contains(this.thumbnails_block)) {
				return;
			}
			elm.classList.remove('over'); // this / event.target is previous target element.
			setTimeout(() => {
				this.draggableArea.cancelPageArea = null;
			}, 100);
		};
	}
	handleDrop(event) {
		return (event) => {
			event.stopPropagation(); // Stops some browsers from redirecting.
			event.preventDefault();
			const elm = event.target;
			return false;
		};
	}

	reset() {
		return (event) => {
			const elm = event.target;
			//alert("reset!")
		};
	}
	async showImages(imageDatas) {
		const images = [];
		for (const imageData of imageDatas) {
			if (!imageData) continue;
			images.push(await this.thumbnail.crateDataLine(imageData, this.pageMap));
		}
		const newVnode = div(
			this.imageAreaID,
			[this.thumbnails_block],
			{
				on: {
					dragover: this.handleDragEnter(),
					dragstart: this.handleDragEnter(),
					dragenter: this.handleDragEnter(),
					dragleave: this.handleDragLeave(),
					drop: this.handleDrop(),
					dragend: this.handleDrop(),
					click: this.reset(),
				},
				props: {
					draggable: 'true',
				},
			},
			images
		);
		this.prePatch('#' + this.imageAreaID, newVnode);
	}
}
