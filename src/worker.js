import { Thread } from './util/thread/thread.js';
import { BaseWorker } from './worker/baseWorker.js';
import { ImageWorker } from './worker/imageWorker.js';
// import { WASMcaller } from './worker/WASMcaller.js';
////////////////////////////////////////////////////////
// export default class DefaultWorker extends BaseWorker {
// 	constructor() {
// 		super();
// 	}
// }
const defaultWorker = new ImageWorker();
////////////////////////////////////////////////////////
onmessage = async (event) => {
	const srcData = event.data;
	const key = srcData ? srcData.key : '';
	console.log('!!!!!!!!!!!!!!!!!!!!hello Worker key:' + key);
	console.log(srcData);
	const workerResult = await defaultWorker.execute(srcData);

	console.warn(workerResult);
	try {
		const { transObject, tranceArray } = Thread.buildPostObj(key, workerResult);
		//
		for (const trance of tranceArray) console.warn('worker trance:' + trance.length + '/' + trance.byteLength);
		postMessage(transObject, tranceArray);
	} catch (e) {
		postMessage(srcData, [srcData]);
		console.log('!!!!!!!!!!!!!!!!!!!!hello Worker e:', e, e.stack);
	}
};
