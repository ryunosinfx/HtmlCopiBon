import {BaseWorker} from "./baseWorker";
export class WASMcaller extends BaseWorker {
  constructor() {
    super("WASMcaller");
  }
  execute() {
    const msg = "hello WASMcaller! now:" + Date.now();
    console.log(msg);
    this.call().catch((e) => {
      console.log(e)
    });
    return msg;
  }
  async call() {
    console.log("hello WASMcaller! 1");
    const response = await fetch('./wasm/sum.wasm');
    console.log("hello WASMcaller! 2" );
    const bytes = await response.arrayBuffer();
    console.log("hello WASMcaller! 3a bytes:" + bytes);
    const module = await WebAssembly.instantiate(bytes, {})
    console.log("hello WASMcaller! 3");
    const instance = module.instance;
    console.log("hello WASMcaller! 4");
    console.log(instance.exports.sum(21, 31));
    const msg = "hello WASMcaller! now:" + Date.now();
    console.log(msg);
  };
}
const aWASMcaller = new WASMcaller();
