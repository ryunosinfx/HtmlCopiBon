// import { ImageWorker } from "../../worker/imageWorker";
import { Thread } from "../thread/thread";
const instances = {};
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
		const key = " ImageWorker.getKey();"
		this.thread.postMessage(key, dataMap);
	}
	getClassName() {
		return this.key;
	}
	static loadInstance(className) {
		return instances(className);
	}
}