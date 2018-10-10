import { Thread } from "../thread/thread";
// import { ImageWorker } from "../../worker/imageWorker";
const instances = {};
const wokerKey = "ImageWorker";
export class ImageCalcBase {
	constructor(key) {
		this.key = key;
		instances[key] = this;
		this.workerKey
		this.thread = null;
	}
	threadInit() {
		if (!this.thread) {
			this.thread = new Thread();
		}
	}
	async execute(methodName, dataMap) {
		dataMap["methodName"] = methodName;
		dataMap["className"] = this.key;
		return await this.thread.postMessage(wokerKey, dataMap);
	}
	getClassName() {
		return this.key;
	}
	static loadInstance(className) {
		return instances(className);
	}
}