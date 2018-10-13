import { ByteUtil } from "./byteUtil";
import { ImageCalcBase } from "./imageCalcBase";
export class ImageResizer extends ImageCalcBase {
	constructor() {
		super("ImageResizer");
		this["resizeAsLanczos"] = this.resizeAsLanczos;
		this["resizeAsByCubic"] = this.resizeAsByCubic;
	}
	culcWeightByCubic(alpha) {
		return (x) => {
			let result = 0;
			if (x <= 1) {
				result = ((alpha + 2.0) * x * x * x) - ((alpha + 3.0) * x * x) + 1;
			} else if (x <= 2) {
				result = (alpha * x * x * x) - (5.0 * alpha * x * x) + (8.0 * alpha * x) - (4.0 * alpha);
			}
			return result;
		}
	}
	sincLanczos(x) {
		return Math.sin(x * Math.PI) / (x * Math.PI);
	}

	lanczosWeight(n = 3) {
		return (d) => {
			return d === 0 ?
				1 :
				(
					Math.abs(d) < n ?
					this.sincLanczos(d) * this.sincLanczos(d / n) :
					0);
		}
	}

	async resizeAsLanczos(iamegData, distImage, isOtherThread) {
		// if (isOtherThread) {
		// 	// this.thread.
		// 	this.threadInit();
		// 	return await this.execute("resizeAsLanczos", { iamegData, distImage });
		// }
		// if (!distImage) {
		// 	return this.resizeAsLanczosExe(iamegData.iamegData, iamegData.distImage);
		// } else {
		// 	return this.resizeAsLanczosExe(iamegData, distImage);
		// }
		return this.resizeExc(iamegData, distImage, isOtherThread, "resizeAsLanczos");
	}

	async resizeAsByCubic(iamegData, distImage, isOtherThread) {
		// if (isOtherThread) {
		// 	// this.thread.
		// 	this.threadInit();
		// 	return await this.execute("resizeAsByCubic", { iamegData, distImage });
		// }
		// if (!distImage) {
		// 	return this.resizeAsByCubicExe(iamegData.iamegData, iamegData.distImage);
		// } else {
		// 	return this.resizeAsByCubicExe(iamegData, distImage);
		// }
		return this.resizeExc(iamegData, distImage, isOtherThread, "resizeAsByCubic");
	}

	async resizeExc(iamegData, distImage, isOtherThread, name) {
		if (isOtherThread) {
			// this.thread.
			this.threadInit();
			// console.log("resizeExc1 name:" + name + "/isOtherThread:" + isOtherThread);
			// console.log(iamegData);
			// console.log(distImage);
			const result = await this.execute(name, { iamegData, distImage });
			// console.log("resizeExc1a name:" + name + "/isOtherThread:" + isOtherThread);
			// console.log(result);
			return result;
		} else {
			// console.log("resizeExc2 name:" + name);
			// console.log(iamegData);
			// console.log(distImage);
			if (!distImage) {
				distImage = iamegData.distImage
				iamegData = iamegData.iamegData
				// console.log("resizeExc3 name:" + name);
				// console.log(iamegData);
				// console.log(distImage);
			}
			if (name === "resizeAsByCubic") {
				return this.resizeAsByCubicExe(iamegData, distImage);
			}
			if (name === "resizeAsLanczos") {
				return this.resizeAsLanczosExe(iamegData, distImage);
			}
		}
	}
	resizeAsLanczosExe(iamegData, distImage) {
		const {
			data,
			width,
			height
		} = iamegData;
		const distBitmap = distImage.data;
		const newWidth = distImage.width;
		const newHeight = distImage.height;
		const newData = new Uint8ClampedArray(this.resizeLanczos(data, width, height, newWidth, newHeight, distBitmap));
		return distImage
	}
	resizeAsByCubicExe(iamegData, distImage) {
		const {
			data,
			width,
			height
		} = iamegData;
		const distBitmap = distImage.data;
		const newWidth = distImage.width;
		const newHeight = distImage.height;
		const newData = new Uint8ClampedArray(this.resizeByCubic(data, width, height, newWidth, newHeight, distBitmap));
		return distImage
	}
	resize(iamegData, newWidth, newHeight, distImage) {
		const {
			data,
			width,
			height
		} = iamegData;
		const distBitmap = distImage.data;
		const newData = new Uint8ClampedArray(this.resizeByCubic(data, width, height, newWidth, newHeight, distBitmap));
		return distImage
	}
	resizeLanczos(originBitmap, sourceWidth, sourceHeight, newWidth, newHeight, distBitmap) {
		return this.resizeExecute(originBitmap, sourceWidth, sourceHeight, newWidth, newHeight, this.lanczosWeight(3), 6, distBitmap);
	}
	resizeByCubic(originBitmap, sourceWidth, sourceHeight, newWidth, newHeight, distBitmap) {
		return this.resizeExecute(originBitmap, sourceWidth, sourceHeight, newWidth, newHeight, this.culcWeightByCubic(-1.0), 4, distBitmap);
	}
	// TODO run with maltiThead
	resizeExecute(originBitmap, sourceWidth, sourceHeight, newWidthF, newHeightF, weightFunc, size, distBitmap) {
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
		const dist = distBitmap ?
			distBitmap :
			new Uint8Array(newWidth * newHeight * 4);
		const sizeHalf = size / 2;
		const sizeHalfm1 = sizeHalf - 1;
		const xMap = {};
		for (let iy = 0; iy < newHeight; iy++) {
			const wfy = hf * iy;
			const y = Math.floor(wfy);
			const startY = y - sizeHalfm1;
			const endY = y + sizeHalf;
			const y32bitOffsetDist = iy * 4 * newWidth;
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
					const sy = (jy < 0 || jy > shLimit) ?
						y :
						jy;
					const y32bitOffset = sw4 * sy;
					for (let jx = startX; jx <= endX; jx++) {
						const w = weightFunc(Math.abs(wfx - jx)) * weightY;
						if (w === 0) {
							continue;
						}
						const sx = (jx < 0 || jx > swLimit) ?
							x :
							jx;
						const offset32bit = y32bitOffset + sx * 4;
						r += src[offset32bit] * w;
						g += src[offset32bit + 1] * w;
						b += src[offset32bit + 2] * w;
					}
				}
				// console.log("newHeight y32bitOffsetDist:"+y32bitOffsetDist);
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