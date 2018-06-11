import {Thread} from "./util/thread/thread";
import {BaseWorker} from "./worker/baseWorker";
import {WASMcaller} from "./worker/WASMcaller";
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
  console.log("hello Worker key:"+key);
  const worker = BaseWorker.getWorkerInstance(key);
  const workerResult = worker.execute(srcData);
  const {transObject, tranceArray} = Thread.buildPostObj(key, workerResult);
  postMessage(transObject, tranceArray);
}
