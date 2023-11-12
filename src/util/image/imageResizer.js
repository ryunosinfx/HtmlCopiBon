import { ByteUtil } from './byteUtil.js';
import { ImageCalcBase } from './imageCalcBase.js';
const threadCount = 4;
export class ImageResizer extends ImageCalcBase {
	constructor() {
		super('ImageResizer');
		this['resizeAsLanczos'] = this.resizeAsLanczos;
		this['resizeAsByCubic'] = this.resizeAsByCubic;
	}
	culcWeightByCubic(alpha) {
		return (x) => {
			let result = 0;
			if (x <= 1) {
				result = (alpha + 2.0) * x * x * x - (alpha + 3.0) * x * x + 1;
			} else if (x <= 2) {
				result = alpha * x * x * x - 5.0 * alpha * x * x + 8.0 * alpha * x - 4.0 * alpha;
			}
			return result;
		};
	}
	sincLanczos(x) {
		return Math.sin(x * Math.PI) / (x * Math.PI);
	}

	lanczosWeight(n = 3) {
		return (d) => {
			return d === 0 ? 1 : Math.abs(d) < n ? this.sincLanczos(d) * this.sincLanczos(d / n) : 0;
		};
	}

	async resizeAsLanczos(iamegData, distImage, isOtherThread) {
		// console.log("resizeAsLanczos.resizeExcWithThread；iamegData:" + iamegData);
		return await this.resizeExc(iamegData, distImage, isOtherThread, 'resizeAsLanczos').catch((e) => {
			console.log(e);
			console.error(e.stack);
		});
	}

	async resizeAsByCubic(iamegData, distImage, isOtherThread) {
		// console.log("resizeAsByCubic.resizeExcWithThread；iamegData:" + iamegData);
		const result = await this.resizeExc(iamegData, distImage, isOtherThread, 'resizeAsByCubic').catch((e) => {
			console.error('resizeAsByCubic resizeExcWithThread；iamegData', e.stack, e);
			console.error(e.currentTarget);
			console.error(e.returnValue);
			console.error(e.srcElement);
			console.error(e.target);
			console.error(e.type);
			console.error(e.eventPhase);
			console.error(e.timeStamp);
			console.error(e.message);
			console.error(e.lineno);
			console.error(e.error);
		});
		// console.log("resizeAsByCubic.resizeExcWithThread； result:" + result);
		return result;
	}

	async resizeExc(iamegData, distImage, isOtherThread, name) {
		if (isOtherThread) {
			if (!distImage) {
				distImage = iamegData.distImage;
				iamegData = iamegData.iamegData;
			}
			this.threadInit();
			// console.log("resizeExc execute.iamegData:" + iamegData);
			const result = await this.execute(name, { iamegData, distImage }).catch((e) => {
				console.log(e);
				console.error(e.stack);
			});
			return result;
		} else {
			// console.log("resizeExc.iamegData:" + iamegData);
			let rowCount = null;
			let offsetY = null;
			if (!distImage) {
				if (iamegData.rowCount) {
					rowCount = iamegData.rowCount;
					offsetY = iamegData.offsetY;
					distImage = iamegData.distImage;
					iamegData = iamegData.iamegData;
					// console.log("resizeExc resizeExcWithThread.offsetY:" + offsetY + "/rowCount:" + rowCount);
				} else {
					// console.log("resizeExc resizeExcWithThread S1.iamegData:" + iamegData + "/name:" + name);
					const result = await this.resizeExcWithThread(iamegData, distImage, name).catch((e) => {
						console.log(e);
						console.error(e.stack);
					});
					// console.log("resizeExc resizeExcWithThread S2.result:" + result + "/name:" + name);
					return result;
				}
			}
			// console.log(distImage);
			if (name === 'resizeAsByCubic') {
				// console.log("resizeExc resizeExcWithThread T1.iamegData:" + iamegData + "/name:" + name);
				return this.resizeAsByCubicExe(iamegData, distImage, offsetY, rowCount);
			}
			if (name === 'resizeAsLanczos') {
				// console.log("resizeExc resizeExcWithThread U1.iamegData:" + iamegData + "/name:" + name);
				return this.resizeAsLanczosExe(iamegData, distImage, offsetY, rowCount);
			}
		}
	}
	resizeExcWithThread(iamegData, distImage, name) {
		// console.log("resizeExcWithThread A .iamegData:" + iamegData);
		return new Promise((resolve, reject) => {
			// console.log("resizeExcWithThread. B iamegData:" + iamegData);
			distImage = iamegData.distImage;
			iamegData = iamegData.iamegData;

			this.threadInit();
			const distBitmap = distImage.data;
			const newWidth = distImage.width;
			const newHeight = distImage.height;
			const currentBitmap = iamegData.data;
			const currentWidth = iamegData.width;
			const currentHeight = iamegData.height;
			const promises = [];
			let total = 0;
			const parLength = Math.floor(newHeight / threadCount);
			// console.log("resizeExcWithThread. C threadCount:" + threadCount + "/name:" + name);
			for (let i = 0; i < threadCount; i++) {
				const limitHeight = threadCount - 1 === i ? newHeight - total : parLength;
				// todo Plus
				const newData = new Uint8ClampedArray(newWidth * 4 * limitHeight);
				const newDistData = { data: newData, width: newWidth, height: newHeight };
				const currentImageLen = currentBitmap.length;
				const newIData = new Uint8ClampedArray(currentImageLen);
				// console.log("resizeExcWithThread. D limitHeight:" + limitHeight + "/i:" + i);
				for (let j = 0; j < currentImageLen; j++) {
					newIData[j] = currentBitmap[j];
				}
				const newImageData = { data: newIData, width: currentWidth, height: currentHeight };

				// console.log("resizeExcWithThread. E limitHeight:" + limitHeight + "/i:" + i);
				const promise = this.execute(name, {
					iamegData: newImageData,
					distImage: newDistData,
					offsetY: total,
					rowCount: limitHeight,
				});
				total += limitHeight;
				promises.push(promise);
			}
			Promise.all(promises)
				.then((values) => {
					// console.log("resizeExcWithThread -----A--- values.length:" + values.length);
					// console.log(values)
					// console.log(bc.arrayBuffer2base64(distBitmap.buffer));
					for (const val of values) {
						// console.log(val)
						const { data, width, height, offsetY, rowCount } = val.distImage;
						const startIndex = offsetY * 4 * newWidth;
						// const endIndex = (offsetY + rowCount) * 4 * newWidth;
						// let index = 0;
						distBitmap.set(data, startIndex);
						// for (let j = startIndex; j < endIndex; j++) {
						// 	distBitmap[j] = data[index];
						// 	index++;
						// }
						// console.log(bc.arrayBuffer2base64(data.buffer));
					}
					// console.log("resizeExcWithThread -----B--- values.length:" + values.length);
					resolve(distBitmap.buffer);
				})
				.catch((e) => {
					console.error(e.stack);
					console.error(e);
					console.error(e.currentTarget);
					console.error(e.returnValue);
					console.error(e.srcElement);
					console.error(e.target);
					console.error(e.type);
					console.error(e.eventPhase);
					console.error(e.timeStamp);
					console.error(e.message);
					console.error(e.lineno);
					console.error(e.error);
					reject(e);
				});
		});
	}
	resizeAsLanczosExe(iamegData, distImage, offsetY, rowCount) {
		const { data, width, height } = iamegData;
		const distBitmap = distImage.data;
		const newWidth = distImage.width;
		const newHeight = distImage.height;
		distImage.offsetY = offsetY;
		distImage.rowCount = rowCount;
		// console.log("resizeAsByCubicExe offsetY:" + offsetY + "/newWidth:" + newWidth + "/rowCount:" + rowCount + "/newHeight:" + newHeight);
		const newData = new Uint8ClampedArray(
			this.resizeLanczos(data, width, height, newWidth, newHeight, distBitmap, offsetY, rowCount)
		);
		// console.log(bc.arrayBuffer2base64(distBitmap.buffer));
		return distImage;
	}
	resizeAsByCubicExe(iamegData, distImage, offsetY, rowCount) {
		const { data, width, height } = iamegData;
		const distBitmap = distImage.data;
		const newWidth = distImage.width;
		const newHeight = distImage.height;
		distImage.offsetY = offsetY;
		distImage.rowCount = rowCount;
		// console.log("A offsetY:[" + offsetY + "]" + "--resizeAsByCubicExe A1 offsetY:" + offsetY + "/newWidth:" + newWidth + "/rowCount:" + rowCount + "/newHeight:" + newHeight);
		// console.log("A1 offsetY:[" + offsetY + "]" + bc.arrayBuffer2base64(data.buffer));
		// console.log("A2 offsetY:[" + offsetY + "]" + bc.arrayBuffer2base64(distBitmap.buffer));
		const newData = new Uint8ClampedArray(
			this.resizeByCubic(data, width, height, newWidth, newHeight, distBitmap, offsetY, rowCount)
		);
		// console.log("B offsetY:[" + offsetY + "]" + "--resizeAsByCubicExe A2 offsetY:" + offsetY + "/newWidth:" + newWidth + "/rowCount:" + rowCount + "/newHeight:" + newHeight);
		// console.log("B offsetY:[" + offsetY + "]" + bc.arrayBuffer2base64(distBitmap.buffer));
		return distImage;
	}
	/////////////
	resize(iamegData, newWidth, newHeight, distImage) {
		const { data, width, height } = iamegData;
		const distBitmap = distImage.data;
		const newData = new Uint8ClampedArray(this.resizeByCubic(data, width, height, newWidth, newHeight, distBitmap));
		return distImage;
	}
	resizeLanczos(originBitmap, sourceWidth, sourceHeight, newWidth, newHeight, distBitmap, offsetY, rowCount) {
		return this.resizeExecute(
			originBitmap,
			sourceWidth,
			sourceHeight,
			newWidth,
			newHeight,
			this.lanczosWeight(3),
			6,
			distBitmap,
			offsetY,
			rowCount
		);
	}
	resizeByCubic(originBitmap, sourceWidth, sourceHeight, newWidth, newHeight, distBitmap, offsetY, rowCount) {
		return this.resizeExecute(
			originBitmap,
			sourceWidth,
			sourceHeight,
			newWidth,
			newHeight,
			this.culcWeightByCubic(-1.0),
			4,
			distBitmap,
			offsetY,
			rowCount
		);
	}
	// TODO run with maltiThead
	resizeExecute(
		originBitmap,
		sourceWidth,
		sourceHeight,
		newWidthF,
		newHeightF,
		weightFunc,
		size,
		distBitmap,
		offsetY,
		rowCount
	) {
		const newWidth = Math.floor(newWidthF);
		const newHeight = Math.floor(newHeightF);
		const sw = Math.floor(sourceWidth);
		const sw4 = sw * 4;
		const swLimit = sw - 1;
		const sh = Math.floor(sourceHeight);
		const sh4 = sh * 4;
		const shLimit = sh - 1;
		const wf = sw / newWidth;
		const hf = sh / newHeight;
		const src = originBitmap;
		const dist = distBitmap ? distBitmap : new Uint8Array(newWidth * newHeight * 4);
		const sizeHalf = size / 2;
		const sizeHalfm1 = sizeHalf - 1;
		const xMap = {};
		const threadRowCount = rowCount ? rowCount : newHeight;
		const threadOffsetY = offsetY ? offsetY : 0;
		const threadEnd = threadOffsetY + threadRowCount;
		for (let iy = threadOffsetY; iy < threadEnd; iy++) {
			const wfy = hf * iy;
			const y = Math.floor(wfy);
			const startY = y - sizeHalfm1;
			const endY = y + sizeHalf;
			const y32bitOffsetDist = (iy - threadOffsetY) * 4 * newWidth;
			for (let ix = 0; ix < newWidth; ix++) {
				const wfx = wf * ix;
				const x = Math.floor(wfx);
				let r = 0;
				let g = 0;
				let b = 0;
				const startX = x - sizeHalfm1;
				const endX = x + sizeHalf;
				for (let jy = startY; jy <= endY; jy++) {
					const weightY = weightFunc(Math.abs(wfy - jy));
					const sy = jy < 0 || jy > shLimit ? y : jy;
					const y32bitOffset = sw4 * sy;
					for (let jx = startX; jx <= endX; jx++) {
						const w = weightFunc(Math.abs(wfx - jx)) * weightY;
						if (w === 0) {
							continue;
						}
						const sx = jx < 0 || jx > swLimit ? x : jx;
						const offset32bit = y32bitOffset + sx * 4;
						r += src[offset32bit] * w;
						g += src[offset32bit + 1] * w;
						b += src[offset32bit + 2] * w;
					}
				}
				// console.log("newHeight y32bitOffsetDist:" + y32bitOffsetDist);
				const offset32bitDist = y32bitOffsetDist + ix * 4;
				dist[offset32bitDist] = ByteUtil.trimByte(r);
				dist[offset32bitDist + 1] = ByteUtil.trimByte(g);
				dist[offset32bitDist + 2] = ByteUtil.trimByte(b);
				dist[offset32bitDist + 3] = 255;
			}
		}
		// console.log("newHeight:" + dist.buffer);
		// console.log(dist.buffer);
		return dist.buffer;
	}
}
