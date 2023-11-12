import { BaseView } from '../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../util/reactive/base/vtags.js';

import { StorageMeter } from '../parts/titleMng/storageMeter.js';
import { TitleList } from '../parts/titleMng/titleList.js';
import { TitleNewone } from '../parts/titleMng/titleNewone.js';
import { StorageInitializer } from '../parts/titleMng/storageInitializer.js';
export class TitleMng extends BaseView {
	constructor() {
		super('TitleMng', 'TitleMng');
		this.text = 'TitleMng';
		this.storageMeter = new StorageMeter(this);
		this.titleList = new TitleList(this);
		this.titleNewone = new TitleNewone(this);
		this.storageInitializer = new StorageInitializer(this);
	}
	async onAfterAttach(store, data) {
		await this.storageMeter.attach(this);
		await this.titleList.attach(this);
		await this.titleNewone.attach(this);
		await this.storageInitializer.attach(this);
	}
	render() {
		return div(
			this.id + 'Frame',
			['TitleMng'],
			[
				div('', ['name'], 'Title Manager'),
				div(this.storageMeter.id),
				div(this.titleList.id),
				div(this.titleNewone.id),
				div(this.storageInitializer.id),
			]
		);
	}
	// loadTitleList
	// newTitle
	// deleteTitle
	// next Button
}
