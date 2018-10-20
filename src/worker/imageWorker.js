import { BaseWorker } from "./baseWorker";
import { ImageMerger } from "../util/image/imageMerger";
import { ImageResizer } from "../util/image/imageResizer";
const key = "ImageWorker";
export class ImageWorker extends BaseWorker {
	constructor() {
		super(key);
		const im = new ImageMerger();
		const ir = new ImageResizer();
		this.classes = {};
		this.classes[im.getClassName()] = im;
		this.classes[ir.getClassName()] = ir;
		// console.log("ImageWorker")
	}
	static getKey() {
		return key;
	}
	async execute(srcData) {
		// console.log("ImageWorker execute key:" + this.key);
		// console.log(srcData);
		const result = await this.call(srcData)
			.catch((e) => {
				console.log(e)
				console.error(e.stack);
			});
		return result;
	}
	async call(srcData) {
		const className = srcData.className;
		const methodName = srcData.methodName;
		const instance = this.classes[className];
		if (instance && instance[methodName]) {
			try {
				// console.warn("ImageWorker execute call");
				await instance[methodName](srcData)
					.catch((e) => {
						console.log(e)
						console.error(e.stack);
					});
			} catch (e) {
				console.erroe(e);
			}
		}
		return srcData
	};
}
const aImageWorker = new ImageWorker();