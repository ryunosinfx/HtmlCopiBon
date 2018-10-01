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
	}
	static getKey() {
		return key;
	}
	async execute(srcData) {
		console.log(srcData);
		const result = await this.call(srcData)
			.catch((e) => {
				console.log(e)
			});
		return result;
	}
	async call(srcData) {
		const className = srcData.className;
		const methodName = srcData.methodName;
		const instance = this.classes[className];
		if (instance && instance[methodName]) {

		}
		return
	};
}
const aImageWorker = new ImageWorker();