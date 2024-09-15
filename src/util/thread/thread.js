const defaultWorker = './src/worker.js';
export class Thread {
	constructor(workerJsPath = defaultWorker) {
		console.log('trance Thread workerJsPath:' + workerJsPath);
		this.worker = new Worker(workerJsPath);
	}

	postMessage(key, dataMap) {
		return new Promise((resolve, reject) => {
			// console.warn("trance key:" + key + "/" + dataMap);
			// console.warn(dataMap);
			const { transObject, tranceArray } = Thread.buildPostObj(key, dataMap);
			// console.warn("trance！ー！＝！＝！＝！:" + tranceArray.length);
			// for (const trance of tranceArray) {
			// 	console.warn("trance:" + trance.length + "/" + trance.byteLength);
			// }
			// console.warn("trance！ー！＝！＝！＝！:-----");

			try {
				console.warn('postMessage tranceArray:', tranceArray);
				console.warn('postMessage transObject:', transObject);

				this.worker.onmessage = (event) => {
					const returendData = event.data;
					// console.warn(returendData);
					resolve(returendData);
				};
				this.worker.onerror = (event, e2) => {
					console.log(event, e2);
					const e = event;
					console.error(e.stack);
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
				};
				this.worker.postMessage(transObject, tranceArray);
			} catch (e) {
				console.error(e);
				console.error(e.stack);
			}
		});
	}

	static buildPostObj(key, dataMap) {
		const tranceArray = [];
		if (dataMap && typeof dataMap === 'object') dataMap.key = key;
		else
			dataMap = {
				key,
			};

		console.log('trance--buildPostObj A dataMap:' + dataMap);
		Thread.buildPostObjExec(dataMap, tranceArray);
		console.log('trance--buildPostObj B tranceArray:' + tranceArray.length);
		return { transObject: dataMap, tranceArray };
	}

	static buildPostObjExec(dataMap, tranceArray) {
		// console.log("trance buildPostObjExec A1 dataMap:" + dataMap);
		if (!dataMap) {
			// console.log("trance--buildPostObjExec dataMap:" + dataMap);
			// nothig todo
			return;
		}
		// console.log("trance buildPostObjExec A2 dataMap:" + dataMap);
		if (Array.isArray(dataMap)) {
			// console.log("trance buildPostObjExec array:" + dataMap);
			let count = 0;
			for (const value of dataMap) {
				Thread.buildPostObjExecParValue(count, value, tranceArray);
				count++;
			}
		} else if (typeof dataMap === 'object' && Object.keys(dataMap).length > 0) {
			// console.log("trance buildPostObjExec object:" + dataMap);
			for (const objKey in dataMap) {
				const value = dataMap[objKey];
				if (value === undefined) continue;
				Thread.buildPostObjExecParValue(objKey, value, tranceArray);
			}
		} else {
			// console.log("trance buildPostObjExec other:" + dataMap);
			Thread.buildPostObjExecParValue(null, dataMap, tranceArray);
		}
	}
	static buildPostObjExecParValue(currentKey, value, tranceArray) {
		//「このデバッグ出力を消すと落ちる」
		console.log('trance buildPostObjExecParValue currentKey:' + currentKey + '/' + tranceArray.length);
		// console.log(tranceArray);
		const type = typeof value;
		let isNotObject = false;
		if (!value) {
			console.log('trance buildPostObjExecParValue1 value:' + value);
			isNotObject = true;
		} else if (value.buffer && value.buffer > 0) {
			tranceArray.push(value.buffer);
			isNotObject = true;
			console.log('trance buildPostObjExecParValue0 buffer:' + value);
		} else if (value.byteLength && value.byteLength > 0) {
			tranceArray.push(value);
			isNotObject = true;
			console.log('trance buildPostObjExecParValueA byteLength:' + value);
		} else if (value.data && value.data.buffer && value.data.buffer.byteLength > 0) {
			tranceArray.push(value.data.buffer);
			isNotObject = true;
			console.log('trance buildPostObjExecParValueB ImageData:' + value + '/' + value.data.buffer.byteLength);
		} else if (type === 'boolean' || type === 'number' || type === 'string') {
			isNotObject = true;
			console.log('trance buildPostObjExecParValueC primitive:' + value);
			// } else {
			// 	console.log("trance buildPostObjExecParValueD other:" + value);
		}
		if (!isNotObject && currentKey) {
			console.log('trance buildPostObjExecParValueE add:' + currentKey, value);
			Thread.buildPostObjExec(value, tranceArray);
		}
	}
	close() {
		console.log('trance close terminate:' + terminate);
		this.worker.terminate();
	}
}
