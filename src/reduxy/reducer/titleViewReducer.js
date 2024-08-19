import { TitleActionCreator } from '../action/titleActionCreator.js';
import { MainService } from '../../service/mainService.js';
import { TitleProcessor } from '../processor/titleProcessor.js';
import { BaseReducer } from '../../util/reactive/baseReducer.js';
let titleViewReducer = null;
export class TitleViewReducer extends BaseReducer {
	constructor() {
		super();
		this.ms = MainService.getInstance();
		this.tm = this.ms.tm;
		this.em = this.ms.em;
		this.tp = new TitleProcessor(this.em, this.tm);
		this.titleCreatAction = TitleActionCreator.creatAction();
		this.titleRemoveAction = TitleActionCreator.creatRemoveAction();
		this.titleLoadAction = TitleActionCreator.creatLoadAction();
		this.titleChangection = TitleActionCreator.creatChangeAction();
		this.titleUpdateAction = TitleActionCreator.creatUpdateAction();
		this.titleClearAllAction = TitleActionCreator.creatClearAllAction();
		this.atatch(this.titleCreatAction);
		this.atatch(this.titleRemoveAction);
		this.atatch(this.titleLoadAction);
		this.atatch(this.titleChangection);
		this.atatch(this.titleUpdateAction);
		this.atatch(this.titleClearAllAction);
		this.storeKey = TitleActionCreator.getStoreKey();
		this.storeCurrentKey = TitleActionCreator.getStoreCurrentKey();
		this.addInitializeKey(this.storeKey);
		this.addInitializeKey(this.storeCurrentKey);
	}
	static register() {
		if (!titleViewReducer) titleViewReducer = new TitleViewReducer();
	}
	async reduce(store, action) {
		if (this.titleCreatAction.type === action.type) {
			store[this.storeCurrentKey] = await this.tp.create(
				action.data.titleId,
				action.data.titlePrefix,
				action.data.name
			);
			store[this.storeKey] = await this.tp.loadAll();
		} else if (this.titleRemoveAction.type === action.type) {
			store[this.storeCurrentKey] = await this.tp.remove(action.data.titleId);
			store[this.storeKey] = await this.tp.loadAll();
		} else if (this.titleLoadAction.type === action.type) {
			store[this.storeCurrentKey] = await this.tp.loadAll();
			store[this.storeKey] = await this.tp.loadAll();
		} else if (this.titleChangection.type === action.type) {
			store[this.storeKey] = await this.tp.loadAll();
			store[this.storeCurrentKey] = await this.tp.changeTtitle(action.data.titleId);
		} else if (this.titleUpdateAction.type === action.type) {
			store[this.storeKey] = await this.tp.loadAll();
			store[this.storeCurrentKey] = await this.tp.update(action.data.titleId, action.data.name);
		} else if (this.titleClearAllAction.type === action.type) store[this.storeKey] = await this.tp.clearAll();
		return store;
	}
}
