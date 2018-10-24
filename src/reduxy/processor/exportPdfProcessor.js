import {
	MainService
} from "../../service/mainService"
import {
	ProgressBarProcesser
} from "./progressBarProcesser"
import {
	PdfBuilder
} from "../../util/pdf/pdfBuilder"

export class ExportPdfProcesser {
	constructor(pp) {
		this.pp = pp;
		this.ms = MainService.getInstance();
		this.em = this.ms.em;
		this.bm = this.ms.bm;
		this.im = this.ms.im;
		this.ip = this.ms.ip;
		this.delList = [];
	}
	async createPdf(paperSize, pages) {
		const letList = [];
		const pdfImage = {
			data: new Uint8ClampedArray(targetSize.x * targetSize.y * 4),
			width: targetSize,
			height: targetSize.y
		};
		for (let page of pages) {
			const binaryEntity = await this.loadBinaryWidCleanUp(page.outputExpandImage);
			pdfImage.data = new new Uint8ClampedArray(UinaryEntity._ab);
			pdfImage.width = UinaryEntity.width;
			pdfImage.height = UinaryEntity.height;
			let pdfImageAb = this.ip.getArrayBufferFromImageBitmapDataAsJpg(pdfImage, 1.0);
			letList.push({
				ab: pdfImageAb,
				width: pdfImage.width,
				height: pdfImage.height
			})
		}
		const pdfBuilder = new PdfBuilder();
		const result = pdfBuilder.createImagesDoc(paperSize, letList);
		this.delOnList();

		let exportImagePk = null;
		let outputOld = null;
		for (let exportPk of exports) {
			const imageOutput = await this.iom.load(exportPk);
			if (imageOutput && imageOutput.type === "pdf") {
				exportImagePk = exportPk;
				outputOld = imageOutput.binary;
				break;
			}
		}
		const outputNew = await this.bm.save(outputOld, "expandPage", compressed);
		return result;
	}

	async loadBinaryWidCleanUp(pk) {
		const binaryEntity = await this.em.get(pk);
		this.delList.push(pk);
		return binaryEntity;
	}
	async delOnList() {
		for (let pk of this.delList) {
			// const outputNew = await this.bm.save(pk, "expandPage", new Uint8Array(1)
			// 	.buffer, { width: 1, height: 1 });
			await this.bm.remove(pk);
		}
	}
}
