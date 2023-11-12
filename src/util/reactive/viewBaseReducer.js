import { ViewBaseActions } from './viewBaseActions.js';
import { ActionCreator } from './actionCreator.js';
import { BaseReducer } from './baseReducer.js';
export class ViewBaseReducer extends BaseReducer {
	constructor() {
		super();
		this.atatch(ViewBaseActions.getGotoAnotherViewAction());
		this.atatch(ViewBaseActions.getShowViewAction());
	}
	async reduce(store, action) {
		//console.log('reduce! action:'+action);
		//console.log('reduce! oldVnode:'+action.data.oldVnode);
		if (ActionCreator.isEquals(ViewBaseActions.getGotoAnotherViewAction(), action)) {
			// todo update menue
			//console.log('getGotoAnotherViewAction!');
		} else if (ActionCreator.isEquals(ViewBaseActions.getShowViewAction(), action)) {
			store.isOrverride = true;

			store.oldVnode = action.data.oldVnode;
			store.selector = '#' + action.data.selector;
		}
		//console.log('reduced...');
		return store;
	}
}
const viewBaseReducer = new ViewBaseReducer();
