import { MainServiceImpl } from './mainServiceImpl.js';
// import { Thread } from '../util/thread/thread.js';
const mainServiceImpl = new MainServiceImpl();
// const currentSiries = '';
// const currentTitle = '';
export class MainService {
	static getInstance() {
		// const thread = new Thread();
		// thread.postMessage('WASMcaller', '');
		return mainServiceImpl;
	}
	async init(appTitle, appVersion) {
		await mainServiceImpl.init(appTitle, appVersion);
	}
}
