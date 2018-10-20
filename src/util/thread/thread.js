const defaultWorker = "worker.js";
const defaultWorkerFromWorker = "./worker.js";
export class Thread {
	constructor(workerJsPath = defaultWorker) {
		this.worker = new Worker(workerJsPath);
	}

	postMessage(key, dataMap) {
		return new Promise((resolve, reject) => {
			// console.warn("trance key:" + key + "/" + dataMap);
			// console.warn(dataMap);
			const { transObject, tranceArray } = Thread.buildPostObj(key, dataMap);
			// console.warn("trance！ー！＝！＝！＝！:" + tranceArray.length);
			// for (let trance of tranceArray) {
			// 	console.warn("trance:" + trance.length + "/" + trance.byteLength);
			// }
			// console.warn("trance！ー！＝！＝！＝！:-----");

			try {
				this.worker.postMessage(transObject, tranceArray);
				this.worker.onmessage = (event) => {
					const returendData = event.data;
					// console.warn(returendData);
					resolve(returendData);
				}
				this.worker.onerror = (event) => {
					console.log(event);
					const e = event;
					console.error(e.currentTarget);
					console.error(e.returnValue);
					console.error(e.srcElement);
					console.error(e.target);
					console.error(e.type);
					console.error(e.eventPhase);
					console.error(e.timeStamp);
					console.error(e.message);
					console.error(e.lineno);
					console.error(e.error);
					reject(event);
				}
			} catch (e) {
				console.error(e);
				console.error(e.stack);
			}
		});
	}

	static buildPostObj(key, dataMap) {
		const tranceArray = [];
		if (dataMap) {
			dataMap.key = key;
		} else {
			dataMap = {
				key: key
			};
		}

		// console.log("trance--buildPostObj A dataMap:" + dataMap);
		Thread.buildPostObjExec(dataMap, tranceArray);
		// console.log("trance--buildPostObj B tranceArray:" + tranceArray.length);
		return { transObject: dataMap, tranceArray };
	}

	static buildPostObjExec(dataMap, tranceArray) {
		// console.log("trance buildPostObjExec A1 dataMap:" + dataMap);
		if (!dataMap) {
			// console.log("trance--buildPostObjExec dataMap:" + dataMap);
			// nothig todo
			return
		}
		// console.log("trance buildPostObjExec A2 dataMap:" + dataMap);
		if (Array.isArray(dataMap)) {
			// console.log("trance buildPostObjExec array:" + dataMap);
			let count = 0;
			for (let value of dataMap) {
				Thread.buildPostObjExecParValue(count, value, tranceArray);
				count++;
			}
		} else if (typeof dataMap === 'object' && Object.keys(dataMap)
			.length > 0) {
			// console.log("trance buildPostObjExec object:" + dataMap);
			for (let objKey in dataMap) {
				const value = dataMap[objKey];
				if (value === undefined) {
					continue;
				}
				Thread.buildPostObjExecParValue(objKey, value, tranceArray);
			}
		} else {
			// console.log("trance buildPostObjExec other:" + dataMap);
			Thread.buildPostObjExecParValue(null, dataMap, tranceArray);
		}
	}
	static buildPostObjExecParValue(currentKey, value, tranceArray) {
		console.log("trance buildPostObjExecParValue currentKey:" + currentKey + "/" + tranceArray.length);
		// console.log(tranceArray);
		const type = typeof value;
		let isNotObject = false;
		if (!value) {
			isNotObject = true;
		} else if (value.buffer) {
			tranceArray.push(value.buffer);
			isNotObject = true;
			// console.log("trance buildPostObjExecParValue0 buffer:" + value);
		} else if (value.byteLength) {
			tranceArray.push(value);
			isNotObject = true;
			// console.log("trance buildPostObjExecParValueA byteLength:" + value);
		} else if (value instanceof ImageData) {
			tranceArray.push(value.data.buffer);
			isNotObject = true;
			// console.log("trance buildPostObjExecParValueB ImageData:" + value);
		} else if (type === "boolean" || type === "number" || type === "string") {
			isNotObject = true;
			// console.log("trance buildPostObjExecParValueC primitive:" + value);
			// } else {
			// 	console.log("trance buildPostObjExecParValueD other:" + value);
		}
		if (!isNotObject && currentKey) {
			// console.log("trance buildPostObjExecParValueE add:" + currentKey);
			Thread.buildPostObjExec(value, tranceArray)
		}

	}
	close() {
		this.worker.terminate();
	}
}