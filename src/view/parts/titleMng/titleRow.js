import { BaseView } from '../../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../../util/reactive/base/vtags.js';
import { TitleActionCreator } from '../../../reduxy/action/titleActionCreator.js';
export class TitleRow extends BaseView {
	constructor() {
		super('TitleRow', 'TitleRow');
	}

	render(store, actionData) {
		const name = div('', ['TitleName'], 'TitleName');
		return div('', [this.id + 'Frame'], [name, div(this.imageAreaID, ['ImageDetailA'], this.id + 'aaaaa')]);
	}
	async onAfterAttach(store, data) {}

	async onViewShow(store, actionData) {}
	buildRows(titles) {
		const retList = [];
		for (const title of titles) {
			retList.push(this.creatRow(title));
		}
		return retList;
	}
	creatRow(title) {
		const titleId = div('', ['TitleId'], this.titleId);
		const prefix = div('', ['prefix'], this.prefix);
		const name = div('', ['TitleName'], title.name);
		const size = div('', ['TitleName'], title.size + ' byte');
		const updateButton = div(
			'',
			['TitleUpdate', 'button'],
			{
				on: { click: this.onUpdate() },
			},
			'update'
		);
		const deleteButton = div(
			'',
			['TitleDelete', 'button'],
			{
				on: { click: this.onDelete() },
			},
			'del'
		);
		return div('', [this.id + 'Row'], [titleId, prefix, name, size, updateButton, deleteButton]);
	}
	onUpdate() {
		return (event) => {
			alert('onUpdate');
			const action = TitleActionCreator.creatLoadAction(this);
			this.dispatch(action);
			event.preventDefault(); // Necessary. Allows us to drop.
			return false;
		};
	}
	onDelete() {
		return (event) => {
			alert('onDelete');
			const action = TitleActionCreator.creatLoadAction(this);
			this.dispatch(action);
			event.preventDefault(); // Necessary. Allows us to drop.
			return false;
		};
	}
}
