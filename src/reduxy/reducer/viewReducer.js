import { ActionCreator } from '../../util/reactive/actionCreator.js';
import BaseReducer from '../../util/reactive/baseReducer.js';
export default class ViewBaseReducer extends BaseReducer {
	constructor() {
		super();
		this.atatch(ViewBaseActions.getGotoAnotherViewAction());
		this.atatch(ViewBaseActions.getShowViewAction());
	}
	async reduce(store, action) {
		if (ActionCreator.isEquals(ViewBaseActions.getGotoAnotherViewAction(), action)) {
			console.log('getGotoAnotherViewAction!');
		} else if (ActionCreator.isEquals(ViewBaseActions.getShowViewAction(), action)) {
			store.isOrverride = true;
			store.oldVnode = action.data.oldVnode;
			store.selector = action.data.selector;
		}
		return store;
	}
}
const viewBaseReducer = new ViewBaseReducer();
