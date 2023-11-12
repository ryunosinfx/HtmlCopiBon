import { MainService } from '../../service/mainService.js';
// import { ProgressBarProcessor } from './progressBarProcessor';
import { PdfBuilder } from '../../util/pdf/pdfBuilder.js';
import { Paper } from '../../util/image/paper.js';

export class ExportPdfProcessor {
	constructor(pp) {
		this.pp = pp;
		this.ms = MainService.getInstance();
		this.em = this.ms.em;
		this.bm = this.ms.bm;
		this.im = this.ms.im;
		this.ip = this.ms.ip;
		this.paper = new Paper();
		this.delList = [];
	}
	async createPdf(paperSize, pages, targetSize, settings, isSaddleStitchingOrder) {
		const letList = [];
		const pageNum = settings.pageNum;
		const startPage = settings.startPage;
		const isPageDirectionR2L = settings.pageDirection === 'r2l';
		const isMatchPageStartSide = settings.pageDirection.indexOf(startPage) === 0;
		const pdfImage = {
			data: new Uint8Array(targetSize.x * targetSize.y * 4),
			width: targetSize,
			height: targetSize.y,
		};
		if (isMatchPageStartSide) {
			letList.push({});
		}
		let pageCount = 0;
		// alert("isSaddleStitchingOrder:" + isSaddleStitchingOrder);
		for (const page of pages) {
			pageCount++;
			if (pageNum < pageCount) {
				break;
			}
			if (!page || !page.outputExpandImage) {
				letList.push({});
				continue;
			}

			const binaryEntity = await this.loadBinaryWidCleanUp(page.outputExpandImage);
			pdfImage.data = new Uint8ClampedArray(binaryEntity._ab);
			pdfImage.width = binaryEntity.width;
			pdfImage.height = binaryEntity.height;
			let pdfImageAb = this.ip.getArrayBufferFromImageBitmapDataAsJpg(pdfImage, 1.0);
			letList.push({
				ab: pdfImageAb,
				width: pdfImage.width,
				height: pdfImage.height,
			});
			// console.log(pdfImageAb);
		}
		this.reSortAsSaddleStitchingOrder(letList, isPageDirectionR2L, isSaddleStitchingOrder);
		const pdfBuilder = new PdfBuilder();
		console.log(paperSize + '/isMatchPageStartSide:' + isMatchPageStartSide);
		// alert(paperSize)
		const result = pdfBuilder.createImagesDoc(paperSize, letList);
		this.delOnList();
		// console.log(result)
		// console.log(result.byteLength)
		// alert(result)
		return result;
	}
	reSortAsSaddleStitchingOrder(letList, isPageDirectionR2L, isSaddleStitchingOrder) {
		// console.log("reSortAsSaddleStitchingOrder A1:" + "/" + letList.length)
		if (isSaddleStitchingOrder !== true) {
			return;
		}
		const tmpList = [];
		const len = letList.length;
		// console.log("reSortAsSaddleStitchingOrder len:" + len);
		for (let i = 0; i < len; i++) {
			tmpList.push(letList.shift());
		}
		const mod = 4 - (len % 4);
		// console.log("reSortAsSaddleStitchingOrder mod:" + mod);
		if (mod < 4) {
			for (let i = 0; i < mod; i++) {
				tmpList.push({});
			}
		}
		const outputLength = tmpList.length;
		// console.log("reSortAsSaddleStitchingOrder outputLength:" + outputLength);
		let isFromFirst = isPageDirectionR2L === false;
		// console.log("reSortAsSaddleStitchingOrder A2:" + isFromFirst + "/" + tmpList.length + "/" + letList.length)
		const setCount = outputLength / 4;
		for (let i = 0; i < setCount; i++) {
			const switchFlag = isFromFirst; //setCount % 2 > 0 ? !isFromFirst : isFromFirst;
			const offsetPageNum = i * 2;
			const one = switchFlag ? tmpList[offsetPageNum] : tmpList[outputLength - (1 + offsetPageNum)];
			const two = switchFlag ? tmpList[outputLength - (1 + offsetPageNum)] : tmpList[offsetPageNum];
			const three = switchFlag ? tmpList[outputLength - (2 + offsetPageNum)] : tmpList[offsetPageNum + 1];
			const four = switchFlag ? tmpList[offsetPageNum + 1] : tmpList[outputLength - (2 + offsetPageNum)];

			letList.push(one);
			letList.push(two);
			letList.push(three);
			letList.push(four);
		}
		// console.log("reSortAsSaddleStitchingOrder A3:" + isFromFirst + "/" + tmpList.length + "/" + letList.length)
	}
	addDummyPage() {
		return {};
	}
	async loadBinaryWidCleanUp(pk) {
		if (!pk) {
			return null;
		}
		const binaryEntity = await this.em.get(pk);
		this.delList.push(pk);
		return binaryEntity;
	}
	async delOnList() {
		for (const pk of this.delList) {
			const outputNew = await this.bm.save(pk, 'expandPage', new Uint8Array(1).buffer, { width: 1, height: 1 });
			await this.bm.remove(pk);
		}
	}
}
