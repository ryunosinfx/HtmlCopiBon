import { ImageCalcBase } from './imageCalcBase.js';
export class ImageMerger extends ImageCalcBase {
	constructor() {
		super('ImageMerger');
		this['margeReplace'] = this.margeReplace;
		this['margeLinninr'] = this.margeLinninr;
		this['margeMultiplication'] = this.margeMultiplication;
	}
	trimByte(byteX) {
		const x = Math.floor(byteX);
		const maxByte = x > 255 ? 255 : x;
		const minByte = maxByte < 0 ? 0 : maxByte;
		return minByte;
	}
	async margeReplace(imageDataBase, images, isBaseWhite, isOtherThread) {
		await this.margeExc(imageDataBase, images, isBaseWhite, isOtherThread, 'margeReplace', this.replace());
		// console.warn("margeReplace-imageDataBase")
		// console.warn(imageDataBase)
	}
	async margeLinninr(imageDataBase, images, isBaseWhite, isOtherThread) {
		await this.margeExc(imageDataBase, images, isBaseWhite, isOtherThread, 'margeLinninr', this.linier());
	}
	async margeMultiplication(imageDataBase, images, isBaseWhite, isOtherThread) {
		await this.margeExc(
			imageDataBase,
			images,
			isBaseWhite,
			isOtherThread,
			'margeMultiplication',
			this.multiplication()
		);
	}
	async margeExc(imageDataBase, images, isBaseWhite, isOtherThread, name, func) {
		let isImageEmpty = true;
		if (!images && !isOtherThread) {
			images = imageDataBase.images;
			isBaseWhite = imageDataBase.isBaseWhite;
			imageDataBase = imageDataBase.imageDataBase;
		}
		const threadImages = [];
		if (images) {
			for (const image of images) {
				if (image && image.data && image.data.length > 0) {
					isImageEmpty = false;
					threadImages.push(this.convertImageDataToObj(image));
				}
			}
		}
		if (isImageEmpty) {
			return;
		}
		if (isOtherThread) {
			// this.thread.
			this.threadInit();
			const dataMap = { imageDataBase, images: threadImages, isBaseWhite };
			const result = await this.execute(name, dataMap).catch((e) => {
				console.log(e);
				console.error(e.stack);
			});
			// console.warn("margeExc-imageDataBase")
			// console.warn(dataMap)
			// console.warn(imageDataBase)
			return result;
		}
		this.beWhiteImage(imageDataBase, isBaseWhite);
		this.mergeImages(imageDataBase, images, func);
	}
	beWhiteImage(imageDataBase, isBaseWhite) {
		if (isBaseWhite) {
			const length = imageDataBase.data.length;
			for (let i = 0; i < length; i++) {
				imageDataBase.data[i] = 255;
			}
		}
	}
	mergeImages(imageDataBase, images, func) {
		const { data, width, height } = imageDataBase;
		for (const imageData of images) {
			const addData = imageData.data;
			const addWidth = imageData.width;
			const addHeight = imageData.height;
			//console.log(width+"*"+height+"*4="+data.length+"/"+width+"*"+height+"*4="+data.length)
			const plainOffsetY = imageData.offsetY;
			const plainOffsetX = imageData.offsetX;
			const offsetY =
				imageData.offsetY && imageData.offsetY > 0 && imageData.offsetY < height
					? imageData.offsetY
					: !imageData.offsetY || imageData.offsetY < height
					? 0
					: height;
			const offsetX =
				imageData.offsetX && imageData.offsetX > 0 && imageData.offsetX < width
					? imageData.offsetX
					: !imageData.offsetX || imageData.offsetX < width
					? 0
					: width;
			const addOffsetY = offsetY + addHeight;
			const endY = addOffsetY > height ? height : addOffsetY;
			const addOffsetX = offsetX + addWidth;
			const endX = addOffsetX > width ? width : addOffsetX;
			let maxY = 0;
			let maxX = 0;
			let count = 0;
			// console.error("offsetY:"+offsetY+"/offsetX:"+offsetX);
			for (let iy = offsetY; iy < endY; iy++) {
				const addPixcelIndexY = iy - plainOffsetY;
				maxY = addPixcelIndexY;
				for (let ix = offsetX; ix < endX; ix++) {
					const addPixcelIndexX = ix - plainOffsetX;
					const basePixcelIndex = iy * width + ix;
					const addPixcelIndex = addPixcelIndexY * addWidth + addPixcelIndexX;
					count++;
					func(data, basePixcelIndex, addData, addPixcelIndex);
					maxX = addPixcelIndexX;
				}
			}
			//console.log("count:"+count+"/maxX:"+maxX+"/maxY:"+maxY+"/w:"+addWidth+"/h:"+addHeight+"/offsetX:"+offsetX+"/offsetY:"+offsetY+"/endX:"+endX+"/endY:"+endY+"/width:"+width+"/height:"+height)
		}
	}

	replace() {
		return (base, basePixcelIndex, addOne, addPixcelIndex) => {
			const index = basePixcelIndex * 4;
			const indexAdd = addPixcelIndex * 4;
			base[index] = addOne[indexAdd];
			base[index + 1] = addOne[indexAdd + 1];
			base[index + 2] = addOne[indexAdd + 2];
			base[index + 3] = 255; //addOne[addPixcelIndex + 2]
		};
	}
	linier() {
		return (base, basePixcelIndex, addOne, addPixcelIndex) => {
			const index = basePixcelIndex * 4;
			const indexAdd = addPixcelIndex * 4;
			base[index] = base[index] + addOaddOffsetXne[indexAdd];
			base[index + 1] = base[index + 1] + addOne[indexAdd + 1];
			base[index + 2] = base[index + 2] + addOne[indexAdd + 2];
		};
	}
	multiplication() {
		return (base, basePixcelIndex, addOne, addPixcelIndex) => {
			const index = basePixcelIndex * 4;
			const indexAdd = addPixcelIndex * 4;
			base[index] = this.trimByte((base[index] * addOne[indexAdd]) / 255);
			base[index + 1] = this.trimByte((base[index + 1] * addOne[indexAdd + 1]) / 255);
			base[index + 2] = this.trimByte((base[index + 2] * addOne[indexAdd + 2]) / 255);
		};
	}
}
