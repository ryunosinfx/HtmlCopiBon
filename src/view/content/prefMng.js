import { BaseView } from '../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../util/reactive/base/vtags.js';
import { PrefList } from '../parts/pref/prefList.js';
export class PrefMng extends BaseView {
	constructor() {
		super('prefMng', 'prefMng');
		this.text = 'prefMng';
	}
	async onAfterAttach(store, data) {}
	render() {
		return div(this.id, ['prefMng'], this.text);
	}
	// loadTitleList
	// newTitle
	// deleteTitle
	// next Button
}
