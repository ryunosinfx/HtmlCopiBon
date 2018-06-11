import {Thread} from "./util/thread/thread";
import {BaseWorker} from "./worker/baseWorker";
////////////////////////////////////////////////////////
export default class DefaultWorker extends BaseWorker {
  constructor() {
    super();
  }
}
const DEFAULT_WORKER = "DEFAULT_WORKER";
const workers = new Map();
workers.set(DEFAULT_WORKER, new DefaultWorker());
////////////////////////////////////////////////////////
onmessage = (event) => {
  const srcData = event.data;
  const key = srcData.key;
  const worker = workers.has(key)? workers.get(key):workers.get(DEFAULT_WORKER);
  const workerResult = worker.execute(srcData);
  const {transObject, tranceArray} = Thread.buildPostObj(key, workerResult);
  postMessage(transObject, tranceArray);
}
