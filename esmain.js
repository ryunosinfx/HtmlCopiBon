import { MainFrame } from './src/view/mainFrame.js';
import { MainService } from './src/service/mainService.js';
const appTitle = 'CopiBon';
const appVersion = 'v0.0.12alpha';
export default class CopiBonService {
	constructor() {
		console.log('CopiBonService constructor');
		this.mainService = MainService.getInstance();
	}
	async init() {
		console.log('CopiBonService init1');
		await this.mainService.init(appTitle, appVersion);
		console.log('CopiBonService init2');
		this.mf = new MainFrame(this.mainService);
		console.log('CopiBonService init3');
		//this.mf.initialize(title);
		///
		// const sumModule = await import ("./sum.wasm");
		// console.log(sumModule.sum(22, 2200));
	}
	static main() {
		const self = new CopiBonService();
		console.log('CopiBonService main');
		self.init();
	}
}
CopiBonService.main();
