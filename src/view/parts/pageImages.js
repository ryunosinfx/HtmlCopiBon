import { BaseView } from '../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../util/reactive/base/vtags.js';
import { SettingActionCreator } from '../../reduxy/action/settingActionCreator.js';
import { PageImage } from './pageImage.js';
import { ImageActionCreator } from '../../reduxy/action/imageActionCreator.js';
import { PageActionCreator } from '../../reduxy/action/pageActionCreator.js';
import { PreviewActionCreator } from '../../reduxy/action/previewActionCreator.js';
export class PageImages extends BaseView {
	constructor(draggableArea) {
		super('PageImages', 'PageImages');
		this.storeKey = SettingActionCreator.getStoreKey();
		this.childId = this.id + 'child';
		this.thumbnails = {};
		this.dummyClass = 'Dummy';
		this.pages = [];
		this.storeImagesKey = ImageActionCreator.getStoreImagesKey();
		this.storePagesKey = PageActionCreator.getStorePagesKey();
		for (let index = 0; index < 32; index++) {
			this.pages.push(new PageImage(this, index, draggableArea));
		}
		this.dropElm = null;
		this.lastSettingOne = null;
		this.lastPagesData = null;
		this.lastImagesData = null;
	}
	render() {
		this.setting = div(this.id + 'child', ['PageImagesA'], this.id);
		return div(this.id, 'PageImages', [this.setting]);
	}
	async onViewShow(store, actionData) {
		const pagesData = store[this.storePagesKey];
		const imagesData = store[this.storeImagesKey];
		const pagesDataJson = JSON.stringify(pagesData);
		const imagesDataJson = JSON.stringify(imagesData);
		if (store[this.storeKey]) {
			const settings = store[this.storeKey];
			const settingsJson = JSON.stringify(settings);
			// console.log("Pages onViewShow settingsJson:" + settingsJson);
			// console.log("Pages onViewShow settingsJson:" + this.lastSettingOne);
			if (settingsJson !== this.lastSettingOne) {
				//alert("imagesData:"+imagesData+"/pagesData:"+pagesData);
				// alert("store[this.storeKey]:"+this.lastSettingOne+"/"+(JSON.stringify(settings)));
				//
				// console.log("Pages onViewShow pagesData:" + pagesData);
				// console.log(pagesData);
				// alert("Pages onViewShow" + JSON.stringify(settings));
				const pageFrames = this.buildPageFrames(settings);
				this.prePatch('#' + this.childId, div(this.childId, pageFrames));
				this.lastSettingOne = settingsJson;
			}
		} else {
			// return;
		}
		if (
			imagesData &&
			pagesData &&
			(this.lastPagesData !== pagesDataJson || this.lastImagesData !== imagesDataJson)
		) {
			await this.showPages(pagesData, imagesData);
			this.lastPagesData = pagesDataJson;
			this.lastImagesData = imagesDataJson;
			// console.log("Pages onViewShow"+store[this.storeKey]);
		}
	}
	addPage(imagesPk, pagePk) {
		const action = PageActionCreator.creatAddPageAction(this, {
			imagePk: imagesPk,
			pagePk: pagePk,
		});
		this.dispatch(action);
	}
	async showPages(pagesData, imagesData) {
		const imageMap = {};
		for (const imageData of imagesData) {
			if (!imageData) {
				continue;
			}
			const imageEntity = imageData.imageEntity;
			const imagePk = imageEntity.getPk();
			imageMap[imagePk] = imageData;
		}
		let index = 0;
		for (const pageEntity of pagesData) {
			const page = this.pages[index];
			index++;
			if (!pageEntity) {
				continue;
			}
			const pk = pageEntity.getPk();
			const imagePk = pageEntity.baseImage;
			const imageData = imageMap[imagePk];
			//alert("id:"+imageData+"/imagePk:"+imagePk)
			await page.setPageData(pageEntity, imageData);
			page.renderVnode(this);
		}
	}
	creatPageFrame(pageNo, dummyClass, isRight) {
		const frameParts = [];
		if (dummyClass === this.dummyClass) {
			return frameParts;
		}
		const sideClass = 'pageFrameHeader' + (isRight ? 'Right' : 'Left');
		frameParts.push(div('', ['pageFrameHeader', sideClass], pageNo + ''));
		const pageIndex = pageNo - 1;
		const page = this.pages[pageIndex].renderVnode(this);
		frameParts.push(page);
		return frameParts;
	}
	showPreviewSingle() {
		return (event) => {
			//alert("showPreviewSingle");
			const action = PreviewActionCreator.creatOpenAction(this, { isSingle: true });
			this.dispatch(action);
		};
	}
	showPreviewDual() {
		return (event) => {
			//alert("showPreviewDual");
			const action = PreviewActionCreator.creatOpenAction(this, { isSingle: false });
			this.dispatch(action);
		};
	}
	buildPreviewButtons() {
		const previewSingle = div(
			'',
			['previewCallButton'],
			{
				on: {
					click: this.showPreviewSingle(),
				},
			},
			'Preview Single'
		);
		const previewDouble = div(
			'',
			['previewCallButton'],
			{
				on: {
					click: this.showPreviewDual(),
				},
			},
			'Preview Dual'
		);
		return div('', ['previewFrame'], [previewSingle, previewDouble]);
	}
	buildPageFrames(setting) {
		const frames = [];
		frames.push(this.buildPreviewButtons());
		const startPage = setting.startPage;
		const pageNum = setting.pageNum * 1; //SettingData.pageNums[setting.pageNum-1]*1;
		this.pageNum = pageNum;
		const pageDirection = setting.pageDirection;
		const isPageDirectionR2L = pageDirection === 'r2l';
		const isPageStartR = startPage === 'r';
		const frameNum = Math.ceil(pageNum / 2);
		const isOdd = pageNum % 2 === 1;
		const isMatchPageStartSide = pageDirection && pageDirection.indexOf(startPage) === 0;
		const addPageNum = isOdd ? 1 : isMatchPageStartSide ? 0 : 1;
		const totalPageFrame = frameNum * 1 + addPageNum * 1;
		const dummyClass = this.dummyClass;
		const pageClass = 'Page';
		const isStartFull = (isPageDirectionR2L && isPageStartR) || (!isPageDirectionR2L && !isPageStartR);
		const leftStartDummyClass = !isPageStartR || isStartFull ? '' : dummyClass;
		const rightStartDummyClass = isPageStartR || isStartFull ? '' : dummyClass;
		const leftEndDummyClass =
			(isOdd && (!isStartFull || (isStartFull && !isPageDirectionR2L))) ||
			(!isOdd && (!isPageDirectionR2L || isStartFull))
				? ''
				: dummyClass;
		const rightEndDummyClass =
			(isOdd && (!isStartFull || (isStartFull && isPageDirectionR2L))) ||
			(!isOdd && (isPageDirectionR2L || isStartFull))
				? ''
				: dummyClass;
		const lastIndex = totalPageFrame - 1;
		let pagNo = 0;
		let pageOffset = 0;
		//console.log("★lastIndex:"+lastIndex+"/pageNum:"+pageNum+"/setting.pageNum:"+setting.pageNum);
		for (let index = 0; index < totalPageFrame; index++) {
			const leftPageNo = (isPageDirectionR2L ? 1 : 0) + pageOffset + pagNo;
			const rightPageNo = (isPageDirectionR2L ? 0 : 1) + pageOffset + pagNo;
			const pagePair = [];
			//////////////////////////////////
			if (index === 0) {
				//LR
				const leftPageNoFirst =
					isPageDirectionR2L && isStartFull ? 2 : isPageDirectionR2L ? 1 : isStartFull ? 1 : 0;
				const rightPageNoFirst =
					isPageDirectionR2L && isStartFull ? 1 : isPageDirectionR2L ? 0 : isStartFull ? 2 : 1;
				pagePair.push(
					div(
						'',
						[pageClass, leftStartDummyClass],
						this.creatPageFrame(leftPageNoFirst, leftStartDummyClass, false),
						totalPageFrame + 'L' + leftPageNoFirst + ' ' + isMatchPageStartSide
					)
				);
				pagePair.push(
					div(
						'',
						[pageClass, rightStartDummyClass],
						this.creatPageFrame(rightPageNoFirst, rightStartDummyClass, true),
						frameNum + 'R' + rightPageNoFirst + ' ' + isOdd
					)
				);
				pageOffset = 1;
				pagNo += isStartFull ? 2 : 1;
			} else if (index === lastIndex) {
				pagePair.push(
					div(
						'',
						[pageClass, leftEndDummyClass],
						this.creatPageFrame(leftPageNo, leftEndDummyClass, false),
						'L' + leftPageNo
					)
				);
				pagePair.push(
					div(
						'',
						[pageClass, rightEndDummyClass],
						this.creatPageFrame(rightPageNo, rightEndDummyClass, true),
						'R' + rightPageNo
					)
				);
			} else {
				pagePair.push(div('', [pageClass], this.creatPageFrame(leftPageNo, '', false), 'L' + leftPageNo));
				pagePair.push(div('', [pageClass], this.creatPageFrame(rightPageNo, '', true), 'R' + rightPageNo));
				pagNo += 2;
			}
			frames.push(div('', ['PageFrame'], pagePair, 'pageFrame index:' + index));
		}
		return frames;
	}
}
