import { Thread } from "./util/thread/thread";
import { BaseWorker } from "./worker/baseWorker";
import { ImageWorker } from "./worker/imageWorker";
import { WASMcaller } from "./worker/WASMcaller";
////////////////////////////////////////////////////////
export default class DefaultWorker extends BaseWorker {
	constructor() {
		super();
	}
}
const defaultWorker = new DefaultWorker();
////////////////////////////////////////////////////////
onmessage = (event) => {
	const srcData = event.data;
	const key = srcData ? srcData.key : "";
	// console.log("hello Worker key:" + key);
	// console.log(srcData);
	const worker = BaseWorker.getWorkerInstance(key);
	worker.execute(srcData)
		.then((workerResult) => {
			// console.warn(workerResult);
			const { transObject, tranceArray } = Thread.buildPostObj(key, workerResult);
			//
			// for (let trance of tranceArray) {
			// 	console.warn("worker trance:" + trance.length + "/" + trance.byteLength);
			// }
			postMessage(transObject, tranceArray);
		}, (error) => {
			console.error(error);
			console.error(error.stack);
			const workerResult = data;
			const { transObject, tranceArray } = Thread.buildPostObj(key, workerResult);
			postMessage(transObject, tranceArray);
		})
}