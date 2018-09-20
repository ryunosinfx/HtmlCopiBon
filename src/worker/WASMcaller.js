import { BaseWorker } from "./baseWorker";
export class WASMcaller extends BaseWorker {
	constructor() {
		super("WASMcaller");
	}
	execute() {
		const msg = "hello WASMcaller! now:" + Date.now();
		console.log(msg);
		this.call()
			.catch((e) => {
				console.log(e)
			});
		return msg;
	}
	async call() {
		const response = await fetch('./wasm/sum.wasm');
		const bytes = await response.arrayBuffer();
		const module = await WebAssembly.instantiate(bytes, {})
		const instance = module.instance;
		console.log(instance.exports.sum(21, 31));
		const msg = "hello WASMcaller! now:" + Date.now();
		console.log(msg);
	};
}
const aWASMcaller = new WASMcaller();