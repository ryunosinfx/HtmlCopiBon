import {
  Sorter
} from "../../util/sorter";
import {
  getNowUnixtime,
  unixTimeToDateFormat
} from "../../util/timeUtil";
import {
  MainService
} from "../../service/mainService"
import {
  ProgressBarProcesser
} from "./progressBarProcesser"
import {
  PdfBuilder
} from "../../util/pdf/pdfBuilder"

export class ExportImageProcesser {
  constructor(pp) {
    this.pp = pp;
    this.ms = MainService.getInstance();
    this.em = this.ms.em;
    this.bm = this.ms.bm;
    this.im = this.ms.im;
    this.iom = this.ms.iom;
    this.ip = this.ms.ip;
    this.tm = this.ms.tm;
    this.pbp = new ProgressBarProcesser();
    this.progress = 0;
  }
  async createPdf(paperSize, pages) {
    const letList = [];
    const pdfImage = {
      data: new Uint8ClampedArray(targetSize.x * targetSize.y * 4),
      width: targetSize.x
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
    return pdfBuilder.createImagesDoc(paperSize,letList);
  }

  async exportDualImage4Print(targetSize, setting, pages, isSideSynced, isOdd, isPageDirectionR2L, isMaxSize10M) {
    const cropedPaperDual = {
      data: new Uint8ClampedArray(targetSize.x * targetSize.y * 8),
      width: targetSize.x * 2,
      height: targetSize.y
    };
    const dummyClass = "dummy";
    const pairPages = {
      right: null,
      left: null,
      rightBin: null,
      leftBin: null
    };
    let isSkeped = isSideSynced !== true;
    const printPages = [];
    const printPairs = [];
    let indexA = 0;
    console.time("exportDualImage4Print A1:");
    for (let page of pages) {
      if (indexA === 0 && isSideSynced) {
        printPages.push(null);
      }
      indexA++;
      const data = {
        pageNo: indexA,
        isDummy: false,
        isRight: indexA % 2 > 0 && isSideSynced,
        binary: !page || page.baseImage === null ?
          null : page
      }
      printPages.push(data);
    }
    console.timeEnd("exportDualImage4Print A1:");
    console.time("exportDualImage4Print A2:");
    for (let index = 0; index < printPages.length; index++) {
      const newPair = [null, null];
      newPair[0] = printPages[index];
      index++;
      if (index < printPages.length) {
        newPair[1] = printPages[index];
      }
      printPairs.push(newPair);
    }
    this.progress = 61;
    this.pbp.update(this.progress, 'start exportDualImage4Print');
    const pageNum = printPairs.length;
    let pageCount = 0;
    const stepNum = 9
    const progressUnit = 20 / (stepNum * pageNum)
    console.timeEnd("exportDualImage4Print A2:");
    console.time("exportDualImage4Print A3:");
    for (let printPagePair of printPairs) {
      pageCount++;
      const pageStep = "[" + pageCount + "/" + pageNum + "]";
      this.progress += progressUnit;
      this.pbp.update(this.progress, 'exportDualImage4Print' + pageStep);
      await this.buildDualImage(targetSize, cropedPaperDual, pairPages, printPagePair, isPageDirectionR2L, isMaxSize10M, pageStep, progressUnit);
    }
    console.timeEnd("exportDualImage4Print A3:");
  }
  async buildDualImage(targetSize, cropedPaperDual, pairPages, shapedPagePair, isPageDirectionR2L, isMaxSize10M, pageStep, progressUnit) {
    console.time("exportDualImage4Print buildDualImageA3 pageStep:" + pageStep);
    const one = shapedPagePair[0];
    const two = shapedPagePair[1];
    const right = isPageDirectionR2L ?
      one :
      two;
    const left = isPageDirectionR2L ?
      two :
      one;
    pairPages.right = right === null || right.isDummy ?
      null :
      right.binary;
    pairPages.left = left === null || left.isDummy ?
      null :
      left.binary;
    pairPages.rightBin = null;
    pairPages.leftBin = null;
    let pageEntity = null;
    this.progress += progressUnit;
    this.pbp.update(this.progress, 'load pairPages.right' + pageStep);
    if (pairPages.right && pairPages.right.outputExpandImage) {
      pairPages.rightBin = await this.loadBinaryWidCleanUp(pairPages.right.outputExpandImage);
      pageEntity = pairPages.right;
    }
    this.progress += progressUnit;
    this.pbp.update(this.progress, 'load pairPages.left' + pageStep);
    if (pairPages.left && pairPages.left.outputExpandImage) {
      pairPages.leftBin = await this.loadBinaryWidCleanUp(pairPages.left.outputExpandImage);
      pageEntity = pairPages.left;
    }
    if (!pageEntity) {
      this.progress += progressUnit * 7;
      this.pbp.update(this.progress, 'load null' + pageStep);
      return;
    }
    this.imageMerger.beWhiteImage(cropedPaperDual, true);
    this.progress += progressUnit;
    this.pbp.update(this.progress, 'set Left' + pageStep);
    if (pairPages.leftBin) {
      const data = pairPages.leftBin._ab;
      const origin = {
        data: new Uint8Array(data),
        width: pairPages.leftBin.width,
        height: pairPages.leftBin.height
      }
      origin.offsetX = 0;
      origin.offsetY = 0;
      await this.imageMerger.margeReplace(cropedPaperDual, [origin], false, true);
    }
    this.progress += progressUnit;
    this.pbp.update(this.progress, 'set right' + pageStep);
    if (pairPages.rightBin) {
      const data = pairPages.rightBin._ab;
      const origin = {
        data: new Uint8Array(data),
        width: pairPages.rightBin.width,
        height: pairPages.rightBin.height
      }
      origin.offsetX = targetSize.x;
      origin.offsetY = 0;
      await this.imageMerger.margeReplace(cropedPaperDual, [origin], false, true);
    }
    //ping?
    this.progress += progressUnit;
    this.pbp.update(this.progress, 'convert to jepg' + pageStep);
    let cropedPaperDualAb = this.ip.getArrayBufferFromImageBitmapDataAsJpg(cropedPaperDual, 1.0);
    const size10MB = 10 * 1000 * 1000;
    const length = cropedPaperDualAb.byteLength;
    if (isMaxSize10M && size10MB < length) {
      const retio = size10MB / length;
      ropedPaperDualAb = this.ip.getArrayBufferFromImageBitmapDataAsJpg(cropedPaperDual, retio);
    }
    const outputOld = pageEntity.outputDualImage;
    this.progress += progressUnit;
    this.pbp.update(this.progress, 'save jepg binary' + pageStep);
    const outputNew = await this.bm.save(outputOld, "expandDualPage", cropedPaperDualAb);
    this.progress += progressUnit;
    this.pbp.update(this.progress, 'save right and delete temp files' + pageStep);
    if (pairPages.right && pairPages.right.outputExpandImage) {
      pairPages.right.outputDualImage = outputNew;
      await this.em.Pages.save(pairPages.right);
      await this.em.delete(pairPages.rightBin);
    }
    this.progress += progressUnit;
    this.pbp.update(this.progress, 'save left and delete temp files' + pageStep);
    if (pairPages.left && pairPages.left.outputExpandImage) {
      pairPages.left.outputDualImage = outputNew;
      await this.em.Pages.save(pairPages.left);
      await this.em.delete(pairPages.leftBin);
    }
    console.timeEnd("exportDualImage4Print buildDualImageA3 pageStep:" + pageStep);
  }
  async loadBinaryWidCleanUp(pk) {
    const binaryEntity = await this.em.get(pk);
    this.delList.push(pk);
    return binaryEntity;
  }
}
