import { BaseView } from '../../util/reactive/baseView.js';
import { BinaryCnvtr } from '../../util/binaryConverter.js';
import { a, div, li, ul, img, span, input, label } from '../../util/reactive/base/vtags.js';
import { ImageActionCreator } from '../../reduxy/action/imageActionCreator.js';
const PLANE = 'PLANE';
const WINDOW = 'WINDOW';
const HEIGHT = 'HEIGHT';
const DOUBLE = 'DOUBLE';
const HELF = 'HELF';
const QUAD = 'QUAD';
const FULL = 'FULL';
export class ImageDetail extends BaseView {
	constructor() {
		super('ImageDetail', 'ImageDetail');
		this.imageAreaID = this.id + 'child';
		this.isOnScroll = false;
		this.startX = 0;
		this.startY = 0;
		this.previewMode = PLANE;
		this.pk = null;
	}
	render(store, actionData) {
		const toNativeSizeButton = a(
			this.id + 'toNativeSizeButton',
			['toNativeSizeButton'],
			'#FilesArea',
			{
				on: {
					click: this.toNativeSize(),
				},
			},
			'1:1'
		);
		const toWindowSizeButton = a(
			this.id + 'toWindowSizeButton',
			['toWindowSizeButton'],
			'#FilesArea',
			{
				on: {
					click: this.toWindowSize(),
				},
			},
			'W'
		);
		const toWindowHeightSizeButton = a(
			this.id + 'toWindowHeightSizeButton',
			['toWindowHeightSizeButton'],
			'#FilesArea',
			{
				on: {
					click: this.toWindowHightSize(),
				},
			},
			'H'
		);
		const toDoubleWindowSizeButton = a(
			this.id + 'toDoubleWindowSizeButton',
			['toDoubleWindowSizeButton'],
			'#FilesArea',
			{
				on: {
					click: this.toDoubleWindowSize(),
				},
			},
			'Wx2'
		);
		const toQuadWindowSizeButton = a(
			this.id + 'toQuadWindowSizeButton',
			['toQuadWindowSizeButton'],
			'#FilesArea',
			{
				on: {
					click: this.toQuadWindowSize(),
				},
			},
			'Wx4'
		);
		const toHelfWindowSizeButton = a(
			this.id + 'toHelfWindowSizeButton',
			['toHelfWindowSizeButton'],
			'#FilesArea',
			{
				on: {
					click: this.toHelfWindowSize(),
				},
			},
			'W/2'
		);
		const toFullWindowSizeButton = a(
			this.id + 'toFullWindowSizeButton',
			['toFullWindowSizeButton'],
			'#FilesArea',
			{
				on: {
					click: this.toFullWindowSize(),
				},
			},
			'FW'
		);
		const title = span('', ['ImageDetailTitleText'], 'ImageDetailTitle');
		const titleBar = div(
			'',
			['ImageDetailTitle'],
			[
				title,
				toNativeSizeButton,
				toWindowSizeButton,
				toWindowHeightSizeButton,
				toDoubleWindowSizeButton,
				toQuadWindowSizeButton,
				toHelfWindowSizeButton,
				toFullWindowSizeButton,
			]
		);
		return div('', [''], [titleBar, div(this.imageAreaID, ['ImageDetailA'], 'No Image Selected')]);
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
		this.setSelectStyle('toNativeSizeButton', PLANE);
		this.setSelectStyle('toWindowSizeButton', WINDOW);
		this.setSelectStyle('toWindowHeightSizeButton', HEIGHT);
		this.setSelectStyle('toDoubleWindowSizeButton', DOUBLE);
		this.setSelectStyle('toQuadWindowSizeButton', QUAD);
		this.setSelectStyle('toHelfWindowSizeButton', HELF);
		this.setSelectStyle('toFullWindowSizeButton', FULL);
	}
	async showImage(imageData) {
		const { imageEntity, binaryEntity, imageText } = imageData;
		const pk = imageEntity.getPk();
		if (this.pk !== pk) {
			this.previewMode = HEIGHT;
		}
		this.setSelectStyle('toNativeSizeButton', PLANE);
		this.setSelectStyle('toWindowSizeButton', WINDOW);
		this.setSelectStyle('toWindowHeightSizeButton', HEIGHT);
		this.setSelectStyle('toDoubleWindowSizeButton', DOUBLE);
		this.setSelectStyle('toQuadWindowSizeButton', QUAD);
		this.setSelectStyle('toHelfWindowSizeButton', HELF);
		this.setSelectStyle('toFullWindowSizeButton', FULL);
		this.pk = pk;
		const dataUri = BinaryCnvtr.a2D(binaryEntity._ab);
		const imgVnode = img(pk + '_image', imageEntity.name, imageEntity.name, dataUri, {});
		const textVnode = span(pk + '_text', ['thumbnail_text'], imageData.imageText);
		const image = [div('', [''], [imgVnode]), div('', [textVnode])];
		this.prePatch(
			'#' + this.imageAreaID,
			div(
				this.imageAreaID,
				['image_detail_block', this.previewMode],
				{
					on: {
						mousedown: this.onMouseOn(),
						mousemove: this.onMouseMove(),
						click: this.onClick(),
					},
					style: {
						top: 0,
						left: 0,
					},
				},
				image
			)
		);
	}
	onClick() {
		return (event) => {
			this.toNativeSize()(event);
		};
	}
	getFunc(previewMode) {
		return (event) => {
			// alert("toWindowSize this.pk):" + this.pk);
			this.previewMode = previewMode;
			if (this.pk) {
				const action = ImageActionCreator.creatDetailAction(this, {
					imagePK: this.pk,
				});
				this.dispatch(action);
			}
		};
	}
	setSelectStyle(id, className) {
		const active = 'active';
		const button = document.getElementById(this.id + id);
		if (this.previewMode === className) {
			// alert(this.previewMode);
			button.classList.add(active);
		} else {
			button.classList.remove(active);
		}
	}
	toNativeSize() {
		return this.getFunc(PLANE);
	}
	toWindowSize() {
		return this.getFunc(WINDOW);
	}
	toWindowHightSize() {
		return this.getFunc(HEIGHT);
	}
	toDoubleWindowSize() {
		return this.getFunc(DOUBLE);
	}
	toHelfWindowSize() {
		return this.getFunc(QUAD);
	}
	toQuadWindowSize() {
		return this.getFunc(HELF);
	}
	toFullWindowSize() {
		return this.getFunc(FULL);
	}
	onMouseOn() {
		return (event) => {
			// alert("onMouseOn");
			this.startX = this.offsetX ? event.clientX + this.offsetX * 0 - this.offsetX１ : event.clientX;
			this.startY = this.offsetY ? event.clientY + this.offsetY * 0 - this.offsetY１ : event.clientY;
			const elm = event.target;
			this.isOnScroll = this.isOnScroll ? false : true;
		};
	}
	onMouseOff() {
		return (event) => {
			// alert("onMouseOff");
			const elm = event.target;
			this.isOnScroll = false;
		};
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
				targetNode.style.top = offsetY + 'px';
				targetNode.style.left = offsetX + 'px';
				this.offsetX = this.startX;
				this.offsetY = this.startY;
				this.offsetX１ = offsetX;
				this.offsetY１ = offsetY;
			}
		};
	}
}
