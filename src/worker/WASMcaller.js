import { BaseWorker } from "./baseWorker";
const cache = {};
export class WASMcaller extends BaseWorker {
	constructor() {
		super("WASMcaller");
	}
	async execute() {
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
if (!cache.aWASMcaller) {
	// cache.aWASMcaller = new WASMcaller();
}