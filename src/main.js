import css from '../index.css';
import { MainFrame } from './view/mainFrame';
import { MainService } from './service/mainService';
const appTitle = 'CopiBon';
const appVersion = 'v0.0.11alpha';
export default class CopiBonService {
	constructor() {
		this.mainService = MainService.getInstance();
	}
	async init() {
		await this.mainService.init(appTitle, appVersion);
		this.mf = new MainFrame(this.mainService);
		//this.mf.initialize(title);
		///
		// const sumModule = await import ("./sum.wasm");
		// console.log(sumModule.sum(22, 2200));
	}
	static main() {
		const self = new CopiBonService();
		self.init();
	}
}
CopiBonService.main();
