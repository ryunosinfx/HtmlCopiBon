import { ViewUtil } from '../../util/ViewUtil.js';
import { BinaryCnvtr, H } from '../../util/binaryConverter.js';
const imgRe = /^image\/.+|application\/octet-stream/;
export class ImageSrcCache {
	static cache = new Map();
	static iq = [];
	static async get(imgRecord) {
		const imageEntity = imgRecord.imageEntity;
		const binaryEntity = imgRecord.binaryEntity;
		//console.log(binaryEntity)
		const d = {
			ab: binaryEntity._ab,
			type: imageEntity.type,
		};
		const hash = await ImageSrcCache.calcHash(imgRecord);
		const cashSrc = ImageSrcCache.cache.get(hash);
		const src = cashSrc ? cashSrc : await ImageSrcCache.loadSrc(d);
		ImageSrcCache.cache.set(hash, src);
		return src;
	}
	static async calcHash(data) {
		const imageEntity = data.imageEntity;
		const binaryEntity = data.binaryEntity;
		return await H.d(
			BinaryCnvtr.jus([
				BinaryCnvtr.s2u(imageEntity.name),
				BinaryCnvtr.u8(binaryEntity._ab),
				BinaryCnvtr.s2u(imageEntity.type),
			])
		);
	}
	static loadSrc(data) {
		return new Promise((resolve, reject) => {
			let { ab, type } = data;
			const i = ImageSrcCache.iq.shift();
			const iE = i ? i : ViewUtil.createImage();
			if (!type) type = 'application/octet-stream';
			if (type && type.match(imgRe)) {
				iE.onload = () => {
					resolve(iE.src);
					ImageSrcCache.iq.push(iE);
				};
				iE.onerror = (e) => {
					console.log('失敗');
					console.error(e);
					reject(e);
				};
				iE.src = BinaryCnvtr.a2D(ab, type);
			} else resolve(iE);
		});
	}
	static async set(imgRecord, src) {
		const hash = await ImageSrcCache.calcHash(imgRecord);
		ImageSrcCache.Cash.set(hash, src);
	}
}
