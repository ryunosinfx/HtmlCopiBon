import { PdfDocument } from './pdfDocument.js';
export class PdfBuilder {
	constructor() {}
	createDoc(title) {}
	createImagesDoc(pageSize = 'A4', imageList) {
		const pdfDoc = new PdfDocument(pageSize);
		// console.log("createImagesDoc imageList:" + imageList.length);
		let i = 0;
		for (const item of imageList) {
			i++;
			if (!item || typeof item !== 'object') {
				pdfDoc.addDummyPage();
				// console.log(item);
				// console.log("createImagesDoc continue:" + item);
				continue;
			}
			const dataUri = item.dataUri;
			const ab = item.ab;
			const height = item.height;
			const width = item.width;
			pdfDoc.addImagePage(dataUri, ab, width, height);
			// console.log("createImagesDoc i:" + i + "item:" + item);
		}
		return pdfDoc.createFile();
	}
}
