const defaultWorker = "./dest/worker.js";
export class Thread {
	constructor(workerJsPath = defaultWorker) {
		this.worker = new Worker(workerJsPath);
	}

	postMessage(key, dataMap) {
		return new Promise((resolve, reject) => {
			console.warn(key + "/" + dataMap);
			console.warn(dataMap);
			const { transObject, tranceArray } = Thread.buildPostObj(key, dataMap);
			for (let trance of tranceArray) {
				console.warn("trance:" + trance.length + "/" + trance.byteLength);
			}
			try {
				this.worker.postMessage(transObject, tranceArray);
				this.worker.onmessage = (event) => {
					const returendData = event.data;
					resolve(returendData);
				}
				this.worker.onerror = (event) => {
					console.log(event);
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
		Thread.buildPostObjExec("", dataMap, tranceArray);
		return { transObject: dataMap, tranceArray };
	}

	static buildPostObjExec(keyPrefix, dataMap, tranceArray) {
		if (!dataMap) {
			// nothig todo
			return
		}
		if (Array.isArray(dataMap)) {
			let count = 0;
			console.log("buildPostObjExec keyPrefix:" + keyPrefix);
			for (let value of dataMap) {
				Thread.buildPostObjExecParValue(keyPrefix, count, value, tranceArray);
				count++;
			}
		} else if (typeof dataMap === 'object' && Object.keys(dataMap)
			.length > 0) {
			for (let objKey in dataMap) {
				const value = dataMap[objKey];
				if (value === undefined) {
					continue;
				}
				Thread.buildPostObjExecParValue(keyPrefix, objKey, value, tranceArray);
			}
		} else {
			Thread.buildPostObjExecParValue(keyPrefix, null, dataMap, tranceArray);
		}
	}
	static buildPostObjExecParValue(keyPrefix, currentKey, value, tranceArray) {
		const type = typeof value;
		let isNotObject = false;
		const key = keyPrefix ? keyPrefix + (currentKey || currentKey === 0 ? "." + currentKey : "") : currentKey + "";
		if (!value) {
			isNotObject = true;
		} else if (value.buffer) {
			tranceArray.push(value.buffer);
			isNotObject = true;
		} else if (value.byteLength) {
			tranceArray.push(value);
			isNotObject = true;
		} else if (value instanceof ImageData) {
			tranceArray.push(value.data.buffer);
			isNotObject = true;
		} else if (type === "boolean" || type === "number" || type === "string") {
			isNotObject = true;
		}
		if (!isNotObject && currentKey) {
			Thread.buildPostObjExec(key, value, tranceArray)
		}

	}
	close() {
		this.worker.terminate();
	}
}