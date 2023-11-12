import { ActionDispatcherImple } from './actionDispatcherImple.js';
export class ActionDispatcher {
	constructor() {}
	static create(view) {
		return new ActionDispatcherImple(view);
	}
	static createStandAlone() {
		return new ActionDispatcherImple(false);
	}
}
