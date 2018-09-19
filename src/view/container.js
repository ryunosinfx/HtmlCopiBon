import vu from "../util/viewUtil";
import { BaseView } from "../util/reactive/baseView";
import {
	a,
	div,
	li,
	ul,
	img,
	span,
	input,
	label
} from "../util/reactive/base/vtags";
import { FileUploadArea } from "./content/fileUploadArea";
import { TitleSettings } from "./content/titleSettings";
import { ExportArea } from "./content/exportArea";
import { FilesArea } from "./content/filesArea";
import { ProgressBar } from "./parts/progress/progressBar";
import { TitleMng } from "./content/titleMng";
import { Dialog } from "./parts/dialog/dialog";
import { MenuSelectActionCreator } from '../reduxy/action/menuSelectActionCreator'
export class Container extends BaseView {
	constructor() {
		super("container", "main-container");
		this.fileUploadArea = new FileUploadArea();
		this.titleSettings = new TitleSettings();
		this.filesArea = new FilesArea();
		this.exportArea = new ExportArea();
		this.progressBar = new ProgressBar();
		this.titleMng = new TitleMng();
		this.dialog = new Dialog();
		this.contentsScrollTops = [];
		this.contentsScrollRanges = [];
		this.contentsIdMap = {};
	}

	async onAfterAttach(store, data) {
		await this.progressBar.attach(this);
		await this.dialog.attach(this);
		await this.addScrollMap(this.titleSettings);
		await this.addScrollMap(this.fileUploadArea);
		await this.addScrollMap(this.filesArea);
		await this.addScrollMap(this.exportArea);
		await this.addScrollMap(this.titleMng);
		this.buildFinish();
		this.currentVnode.elm.childNodes[0].addEventListener('scroll', this.onScroll());
		this.currentCheck();
	}
	async addScrollMap(part) {
		await part.attach(this);
		const scrolltop = part.currentVnode.elm.getBoundingClientRect()
			.top;
		this.contentsScrollTops.push(scrolltop);
		this.contentsIdMap[scrolltop] = part.id;
		this.timer = null;
	}
	buildFinish() {
		const len = this.contentsScrollTops.length;
		for (let i = 0; i < len; i++) {
			const range = {
				current: this.contentsScrollTops[i],
				next: i === (len - 1) ?
					9999 : this.contentsScrollTops[i + 1]
			};
			this.contentsScrollRanges.push(range);
		}
	}
	render() {
		const newVnode = div('', ['scroll-container'], {
			style: {
				color: '#000'
			}
		}, [
			div(this.progressBar.id),
			div(this.titleSettings.id),
			div(this.fileUploadArea.id),
			div(this.filesArea.id),
			div(this.exportArea.id),
			div(this.titleMng.id)
		], "container");
		// console.log('container!render!!!!!!!!!!!')s
		return newVnode;
	}
	onScroll() {
		return (event) => {
			this.currentCheck(event);
		}
	}
	// 現在地をチェックする
	currentCheck(event) {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		if (!this.currentVnode) {
			return;
		}
		this.timer = setTimeout(() => {
			// 現在のスクロール位置を取得
			const top = this.currentVnode.elm.getBoundingClientRect()
				.top + 120;
			const scrolltop = this.currentVnode.elm.childNodes[0].scrollTop + top;
			const len = this.contentsScrollRanges.length;
			for (let i = 0; i < len; i++) {
				const range = this.contentsScrollRanges[i];
				// 現在のスクロール位置が、配列に格納した開始位置と終了位置の間にあるものを調べる
				if ((i === 0 || range.current < scrolltop) && (range.next + 0) > scrolltop) {
					const id = this.contentsIdMap[range.current];
					const action = MenuSelectActionCreator.creatSelectAction(this, { id: id });
					this.dispatch(action);
					return;
				}
			};
		}, 100)
	}
}
