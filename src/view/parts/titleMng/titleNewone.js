import { BaseView } from '../../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../../util/reactive/base/vtags.js';
import { TitleActionCreator } from '../../../reduxy/action/titleActionCreator.js';
export class TitleNewone extends BaseView {
	constructor() {
		super('TitleNewone', 'TitleNewone');
		this.storeKey = TitleActionCreator.getStoreKey();
		this.storeCurrentKey = TitleActionCreator.getStoreCurrentKey();
		this.idOfName = this.id + 'name';
	}

	render(store, actionData) {
		//(titleId, titlePrefix, name)
		const name = div('', ['TitleNewone'], 'TitleNewone');
		const nameRow = this.createInputRow('name', 'NameInput');
		const prefixRow = this.createInputRow('prefix', 'NameInput');
		const titleIdRow = this.createInputRow('titleId', 'titleIdInput');
		const button = div(
			'',
			['titleIdInput', 'button'],
			{
				on: {
					click: this.onClick(),
				},
			},
			'create new title.'
		);
		return div('', [this.id + 'Frame'], [name, titleIdRow, prefixRow, nameRow, button]);
	}
	async onAfterAttach(store, data) {}

	async onViewShow(store, actionData) {
		if (store[this.storeKey]) {
			this.ids = {};
			const { list, totalSize } = store[this.storeKey];
			for (const title of list) {
				this.ids[title.getPk()] = true;
			}
		} else if (store[this.storeCurrentKey]) {
			//
		}
	}
	onClick() {
		return (event) => {
			alert('onClick');
			if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
				return;
			}
			event.preventDefault(); // Necessary. Allows us to drop.
			return false;
		};
	}

	getCurrentOptions() {
		const result = {
			isGrayscale: document.getElementById(this.checkboxIsGrascale).checked,
			dpiName: document.getElementById(this.selectBoxDpiName).value,
			isMaxSize10M: document.getElementById(this.checkboxIsMaxSize10M).checked,
			isLanczose: document.getElementById(this.checkboxIsLanczose).checked,
		};
		return result;
	}
	createInputRow(label, inputClass, pattern = '', defaultValue = '') {
		const labelClass = this.id + 'Label';
		const nameLabel = span('', [labelClass], label + ':');
		const nameInput = input(
			this.id + inputClass,
			[this.id + inputClass],
			{
				props: {
					name: this.id + inputClass,
				},
				attr: {
					pattern: pattern,
				},
			},
			'text',
			defaultValue
		);
		const row = div('', [this.id + 'Row'], [nameLabel, nameInput]);
		return row;
	}
}
