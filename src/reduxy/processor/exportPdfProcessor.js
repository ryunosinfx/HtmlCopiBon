import {
	MainService
} from "../../service/mainService"
import {
	ProgressBarProcessor
} from "./progressBarProcessor"
import {
	PdfBuilder
} from "../../util/pdf/pdfBuilder"
import { Paper } from "../../util/image/paper";

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
	async createPdf(paperSize, pages, targetSize, settings) {
		const letList = [];
		const pageNum = settings.pageNum;
		const pdfImage = {
			data: new Uint8Array(targetSize.x * targetSize.y * 4),
			width: targetSize,
			height: targetSize.y
		};
		let pageCount = 0;
		for (let page of pages) {
			pageCount++;
			if (pageNum < pageCount) {
				break;
			}
			if (!page || !page.outputExpandImage) {
				letList.push({})
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
				height: pdfImage.height
			})
			// console.log(pdfImageAb);
		}
		const pdfBuilder = new PdfBuilder();
		const result = pdfBuilder.createImagesDoc(paperSize, letList);
		this.delOnList();
		// console.log(result)
		// console.log(result.byteLength)
		// alert(result)
		return result;
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
		for (let pk of this.delList) {
			// const outputNew = await this.bm.save(pk, "expandPage", new Uint8Array(1)
			// 	.buffer, { width: 1, height: 1 });
			// await this.bm.remove(pk);
		}
	}
}