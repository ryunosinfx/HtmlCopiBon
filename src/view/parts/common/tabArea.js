import { BaseView } from '../../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../../util/reactive/base/vtags.js';
export class TabArea extends BaseView {
	constructor() {
		super('TabArea', 'TabArea');
	}

	render(store, actionData) {
		const name = div('', ['TitleName'], 'TitleName');
		return div('', [this.id + 'Frame'], [name, div(this.imageAreaID, ['ImageDetailA'], this.id + 'aaaaa')]);
	}
	async onAfterAttach(store, data) {}

	async onViewShow(store, actionData) {}
}
