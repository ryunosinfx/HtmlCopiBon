import { MenuSelectActionCreator } from '../action/menuSelectActionCreator.js';
import { BaseReducer } from '../../util/reactive/baseReducer.js';
let menuSelectViewReducer = null;
export class MenuSelectViewReducer extends BaseReducer {
	constructor() {
		super();
		this.menuSelectAction = MenuSelectActionCreator.creatSelectAction();
		this.atatch(this.menuSelectAction);
		this.storeKey = MenuSelectActionCreator.getStoreKey();
		this.addInitializeKey(this.storeKey);
	}
	static register() {
		if (!menuSelectViewReducer) {
			menuSelectViewReducer = new MenuSelectViewReducer();
		}
	}
	async reduce(store, action) {
		if (this.menuSelectAction.type === action.type) {
			store[this.storeKey] = action.data.id;
		}
		return store;
	}
}
