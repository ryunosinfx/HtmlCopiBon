import { BaseView } from '../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../util/reactive/base/vtags.js';
export class Header extends BaseView {
	constructor(titleText) {
		super('header', 'header');
		this.titleText = this.ms.getAppTitle();
		this.Version = this.ms.getAppVersion();
	}
	render() {
		const title = span('', ['MainTitle'], this.titleText);
		const version = span('', ['Version'], this.Version);
		const newVnode = div(
			'aaa',
			{
				style: {
					color: '#000',
				},
			},
			[div('title', ['title'], [title, version])]
		);
		return newVnode;
	}
}
