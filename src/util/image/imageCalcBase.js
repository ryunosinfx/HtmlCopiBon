import { Thread } from '../thread/thread.js';
// import { ImageWorker } from "../../worker/imageWorker";
const instances = {};
const wokerKey = 'ImageWorker';
export class ImageCalcBase {
	constructor(key) {
		this.key = key;
		instances[key] = this;
		this.workerKey;
		// this.thread = null;
	}
	threadInit() {
		// if (!this.thread) {
		// 	this.thread = new Thread();
		// }
	}
	async execute(methodName, dataMap, isCallFromWorker) {
		// console.log("resizeExcWithThread. execute A ImageCalcBase methodName:" + methodName + "/dataMap:" + dataMap);
		dataMap['methodName'] = methodName;
		dataMap['className'] = this.key;
		const arrayImageData = {};
		for (const key in dataMap) {
			const data = dataMap[key];
			if (data instanceof ImageData) {
				arrayImageData[key] = data;
			}
			dataMap[key] = this.convertImageDataToObj(data);
		}
		// console.log("resizeExcWithThread. execute B ImageCalcBase methodName:" + methodName + "/dataMap:" + dataMap);
		const thread = new Thread();
		const result = await thread.postMessage(wokerKey, dataMap).catch((e) => {
			console.error(e);
		});
		if (result) {
			for (const key in dataMap) {
				// console.log("execute key:" + key);
				const resultData = result[key];
				// console.log(resultData)
				if (!resultData || !resultData.data || resultData.data.byteLength === undefined) {
					// console.log("execute continue1 key:" + key);
					continue;
				}
				const data = dataMap[key];
				// console.log(data)
				if (!data || !data.data || data.data.byteLength === undefined) {
					// console.log("execute continue2 key:" + key);
					continue;
				}
				if (resultData.data.byteLength > 0 && data.data.byteLength < 1) {
					// console.log("execute ok!! key:" + key);
					data.data = resultData.data;
				}
			}
		}
		// console.warn("resizeExcWithThread. execute C execute-dataMap")
		// console.warn(dataMap)
		// console.warn(result)
		// console.warn("resizeExcWithThread. execute D execute-dataMap")
		return result;
	}
	getClassName() {
		return this.key;
	}
	static loadInstance(className) {
		return instances(className);
	}
	convertImageDataToObj(target) {
		if (target && target.data && target.data.length > 0 && target instanceof ImageData) {
			return {
				width: target.width,
				height: target.height,
				data: target.data,
				offsetX: target.offsetX,
				offsetY: target.offsetY,
			};
		}
		return target;
	}
}
