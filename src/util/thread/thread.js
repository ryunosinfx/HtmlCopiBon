const defaultWorker = "./dist/worker.js";
export class Thread {
  constructor(workerJsPath = defaultWorker) {
    this.worker = new Worker(workerJsPath);
  }
  postMessage(key, dataMap) {
    return new Promise((resolve, reject) => {
      const {transObject, tranceArray} = Thread.buildPostObj(key, dataMap);
      this.worker.postMessage(transObject, tranceArray);
      this.worker.onmessage = (event)=> {
        resolev(event.data);
      }
      this.worker.onerror = (event)=> {
        reject(event);
      }
      this.worker.
    });
  }
  static buildPostObj(key, dataMap){
    const tranceArray = [];
    const transObject = {
      key: key
    };
    if (!dataMap) {
      // nothig todo
    } else if (Array.isArray(dataMap)) {
      let count = 0;
      for (let value of dataList) {
        if (value.buffer) {
          tranceArray.push(value.buffer);
        } else if (value.byteLength) {
          tranceArray.push(value);
        }
        transObject[count] = value;
        count++;
      }
    } else if (typeof dataMap === 'object' && Object.keys(dataMap).length > 0) {
      for (let key in Object.keys(dataMap)) {
        const value = dataMap[dataMap];
        transObject[key] = value;
        if (value.buffer) {
          tranceArray.push(value.buffer);
        } else if (value.byteLength) {
          tranceArray.push(value);
        }
      }
    }

  }
  close(){
    this.worker.terminate();
  }
}
