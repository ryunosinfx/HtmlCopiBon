const workers = new Map();
const DEFAULT_WORKER = "DEFAULT_WORKER";
export class BaseWorker {
  static getWorkerInstance(key){
    const worker = workers.has(key)? workers.get(key):workers.get(DEFAULT_WORKER);
    return worker;
  }
  constructor(key =DEFAULT_WORKER) {
    this.key = key;
    workers.set(this.key,this);
  }
  execute(){
    const msg = "hello world! now:"+ Date.now();
    console.log(msg);
    return msg;
  }
}
