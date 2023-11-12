import { BaseView } from '../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../util/reactive/base/vtags.js';
export class Footer extends BaseView {
	constructor() {
		super('footer', 'footer');
		this.copyright = 'copyright:ryunosinfx - Licenced MIT';
	}
	render() {
		const newVnode = div(
			{
				style: {
					color: '#000',
				},
			},
			[div('copyright', ['copyright'], this.copyright)]
		);
		return newVnode;
	}
}
