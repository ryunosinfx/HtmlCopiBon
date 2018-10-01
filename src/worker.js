import { Thread } from "./util/thread/thread";
import { BaseWorker } from "./worker/baseWorker";
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
	const key = srcData.key;
	console.log("hello Worker key:" + key);
	const worker = BaseWorker.getWorkerInstance(key);
	worker.execute(srcData)
		.then((workerResult) => {
			const { transObject, tranceArray } = Thread.buildPostObj(key, workerResult);
			postMessage(transObject, tranceArray);
		}, (error) => {
			console.error(error);
			const workerResult = data;
			const { transObject, tranceArray } = Thread.buildPostObj(key, workerResult);
			postMessage(transObject, tranceArray);
		})
}