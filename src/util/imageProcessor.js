import { ViewUtil } from './ViewUtil.js';
import { BinaryCnvtr } from './binaryConverter.js';
import { Paper } from './image/paper.js';
import { ImageMerger } from './image/imageMerger.js';
import { ImageResizer } from './image/imageResizer.js';
const imgRe = /^image\/.+|application\/octet-stream/;
export class ImageProcessor {
	constructor() {
		this.canvas = ViewUtil.createCanvas(null, 'hidden');
		this.ctx = this.canvas.getContext('2d');
		this.paper = new Paper();
		this.imageMerger = new ImageMerger();
		this.imageResizer = new ImageResizer();
		window.onload = () => document.body.appendChild(this.canvas);
	}
	setDataURI(dataURI) {
		this.dataURI = dataURI;
	}
	async resize(ab, maxWidth, maxHeight) {
		const origin = await this.getImageDataFromArrayBuffer(ab);
		return this.resizeInMaxSize(origin, maxWidth, maxHeight);
	}
	async resizeAsPaper(ab, paperSize, dpiName, marginSetting) {
		const origin = await this.getImageDataFromArrayBuffer(ab),
			sizeOfPaper = this.paper.getPixcelSizeBySelected(paperSize, dpiName),
			sizeOfImage = this.paper.getPixcelSizeBySelected(paperSize, dpiName, marginSetting),
			newData = this.resizeInMaxSize(origin, sizeOfImage.width, sizeOfImage.height),
			marginMM = this.paper.getOffset(dpiName, marginSetting),
			nd = newData.data,
			data = {
				offsetY: marginMM,
				offsetX: marginMM,
				data: nd,
				width: newData.width,
				height: newData.height,
			},
			len = nd.length;
		let newPaperData = this.ctx.createImageData(sizeOfPaper.width, sizeOfPaper.height);
		const npd = newPaperData.data;
		for (let i = 0; i < len; i++) npd[i] = nd[i];
		this.canvas.width = newPaperData.width;
		this.canvas.height = newPaperData.height;
		await this.imageMerger.margeReplace(newPaperData, [data], true);
		// console.log("newData---------------------------------------------------width:" + sizeOfImage.width + "/height:" + sizeOfImage.height)
		// console.log(newData)
		// console.log(data)
		// console.log(newPaperData.data)
		this.ctx.putImageData(newPaperData, 0, 0);
		newPaperData = undefined;
		let dataUri = this.canvas.toDataURL();
		console.time('resize copy');
		const abResized = BinaryCnvtr.D2a(dataUri);
		dataUri = undefined;
		console.timeEnd('resize copy');
		return abResized;
	}
	resizeInMaxSize(iamegData, maxWidth, maxHeight) {
		const { data, width, height } = iamegData,
			retioOuter = maxWidth / maxHeight,
			retioInner = width / height,
			isWidthGreater = retioInner >= retioOuter,
			retio = isWidthGreater ? maxWidth / width : maxHeight / height,
			newWidth = isWidthGreater ? maxWidth : width * retio,
			newHeight = isWidthGreater ? height * retio : maxHeight;
		// console.log("resizeInMaxSize---------------------------------------------------newWidth:" + newWidth + "/newHeight:" + newHeight)
		return this.resizeExecute(iamegData, newWidth, newHeight);
	}
	resizeExecute(iamegData, newWidth, newHeight) {
		console.time('resize');
		const newImageData = this.ctx.createImageData(newWidth, newHeight);
		this.imageResizer.resize(iamegData, newWidth, newHeight, newImageData);
		console.timeEnd('resize');
		return newImageData;
	}
	getImageDataFromArrayBuffer(ab) {
		// console.time('resize getImageDataFromArrayBuffer');
		return new Promise((resolve, reject) => {
			let dataUri = BinaryCnvtr.a2D(ab);
			ab = null;
			const img = new Image();
			img.src = dataUri;
			img.onload = () => {
				dataUri = null;
				const width = img.width,
					height = img.height;
				this.canvas.width = width;
				this.canvas.height = height;
				this.ctx.drawImage(img, 0, 0);
				const imageData = this.ctx.getImageData(0, 0, width, height);
				resolve(imageData);
				// console.timeEnd('resize getImageDataFromArrayBuffer');
			};
			img.onerror = (e) => reject(e);
		});
	}
	getArrayBufferFromImageBitmapDataAsJpg(iamgeBitmapData, quority) {
		const option = {
			type: 'image/jpeg',
			quority: quority,
		};
		return this.getArrayBufferFromImageBitmapData(iamgeBitmapData, option);
	}
	getArrayBufferFromImageBitmapDataAsPng(iamgeBitmapData) {
		return this.getArrayBufferFromImageBitmapData(iamgeBitmapData);
	}
	getArrayBufferFromImageBitmapData(iamgeBitmapData, option) {
		console.time('resize getArrayBufferFromImageBitmapData');
		this.canvas.width = Math.floor(iamgeBitmapData.width);
		this.canvas.height = Math.floor(iamgeBitmapData.height);
		let newPaperData = this.ctx.createImageData(iamgeBitmapData.width, iamgeBitmapData.height);
		const len = iamgeBitmapData.data.length;
		for (let i = 0; i < len; i++) newPaperData.data[i] = iamgeBitmapData.data[i];

		this.ctx.putImageData(newPaperData, 0, 0);
		let dataUri = option ? this.canvas.toDataURL(option.type, option.quority) : this.canvas.toDataURL();
		const abResized = BinaryCnvtr.D2a(dataUri);
		// console.log('iamgeBitmapData.data.length:'+iamgeBitmapData.data.length+'/w:'+iamgeBitmapData.width+'/h:'+iamgeBitmapData.height);
		// console.log('dataUri:'+dataUri);
		// console.log(abResized);
		newPaperData = undefined;
		console.timeEnd('resize getArrayBufferFromImageBitmapData');
		return abResized;
	}
	create(arrayBuffer, width, height, type) {
		return new Promise((resolve, reject) => {
			const imgElm = new Image();
			imgElm.src = BinaryCnvtr.a2D(arrayBuffer, type);
			imgElm.onload = () => {
				const widthScale = width / imgElm.width,
					heightScale = height / imgElm.height,
					scale = widthScale <= heightScale ? widthScale : heightScale;
				this.canvas.height = Math.floor(imgElm.height * scale);
				this.canvas.width = Math.floor(imgElm.width * scale);
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.ctx.scale(scale, scale);
				this.ctx.drawImage(imgElm, 0, 0);
				resolve(this.exportPng());
			};
			imgElm.onerror = (e) => {
				console.log('失敗', { arrayBuffer, width, height, type });
				console.error(e);
				reject(null);
			};
		});
	}
	exportPng() {
		return this.canvas.toDataURL();
	}
	exportJpeg(quority = 1.0) {
		return this.canvas.toDataURL('image/jpeg', quority);
	}
	createImageNodeByData(data) {
		return new Promise((resolve, reject) => {
			let { name, ab, type } = data;
			const imgElm = ViewUtil.createImage();
			imgElm.alt = escape(name);
			if (!type) type = 'application/octet-stream';
			if (type && type.match(imgRe)) {
				imgElm.src = BinaryCnvtr.a2D(ab, type);
				imgElm.onload = () => {
					data.height = imgElm.height;
					data.width = imgElm.width;
					resolve(imgElm);
				};
				imgElm.onerror = (e) => {
					console.log('失敗 type:' + type + '/ab:', data);
					console.error(e, e.stack);
					reject(e);
				};
				// setTimeout(() => {
				// 	resolve(imgElm);
				// }, 10000);
				return;
			} else resolve(imgElm);
		});
	}
}
