
export class BaseWorker {
  constructor() {
  }
  execute(){
    const msg = "hello world! now:"+ Date.now();
    console.log(msg);
    return msg;
  }
}
