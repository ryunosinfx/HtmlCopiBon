import { BaseView } from '../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../util/reactive/base/vtags.js';
import { ImageDetail } from '../parts/imageDetail.js';
import { PageImages } from '../parts/pageImages.js';
import { Preview } from '../parts/preview/preview.js';
import { Thumbnails } from '../parts/thumbnails.js';
import { ImageViewReducer } from '../../reduxy/reducer/imageViewReducer.js';
import { PagesViewReducer } from '../../reduxy/reducer/pagesViewReducer.js';
export class FilesArea extends BaseView {
	constructor() {
		super('FilesArea', 'FilesArea');
		this.nowSelectedElm = null;
		this.imageDetail = new ImageDetail();
		this.pageImages = new PageImages(this);
		this.thumbnails = new Thumbnails(this);
		this.preview = new Preview();
		ImageViewReducer.register();
		PagesViewReducer.register();
	}

	async onAfterAttach(store, data) {
		await this.imageDetail.attach(this);
		await this.pageImages.attach(this);
		await this.thumbnails.attach(this);
		await this.preview.attach(this);
	}
	render() {
		return div('', [
			div(this.pageImages.id),
			div(this.thumbnails.id),
			div(this.imageDetail.id),
			div(this.preview.id),
		]);
	}
}
