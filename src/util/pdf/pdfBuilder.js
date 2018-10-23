import {
  PdfDocument
} from './pdfDocument'
export class PdfBuilder {
  constructor() {}
  createDoc(title) {}
  createImagesDoc(pageSize = 'A4', imageList) {
    const pdfDoc = new PdfDocument(pageSize);
    for (let item of imageList) {
      if (!item || typeof item !== 'object') {
        pdfDoc.addDummyPage();
        continue;
      }
      const dataUri = item.dataUri;
      const ab = item.ab;
      const height = item.height;
      const width = item.width;
      pdfDoc.addImagePage(dataUri, ab, width, height);
    }
    return pdfDoc.createFile();
  }
}
