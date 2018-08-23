import {Sorter} from "../../util/sorter";
import {getNowUnixtime} from "../../util/timeUtil";
import {Paper} from "../../util/image/paper";
import {ImageMerger} from "../../util/image/imageMerger";
import {ImageResizer} from "../../util/image/imageResizer";
import {ImageCropper} from "../../util/image/imageCropper";
import {UnicodeEncoder} from "../../util/unicodeEncoder";
import {MainService} from "../../service/mainService"
import {PreviewProcessor} from "./previewProcessor"
// import {Zlib, Zip, Raw, PKZIP} from "zlibjs/bin/zlib_and_gzip.min"
import {Zlib} from "zlibjs/bin/zip.min"

const order = {
  orderName:"MangaPaperA4ExpandTatikiri",
  basePaper: "mangaPaperA4ExpandTatikiri",
  dpiName: "dpi600"
};
export class ExportImageProcesser {
  constructor(pp) {
    this.pp = pp;
    this.ms = MainService.getInstance();
    this.em = this.ms.em;
    this.sm = this.ms.sm;
    this.bm = this.ms.bm;
    this.im = this.ms.im;
    this.iom = this.ms.iom;
    this.ip = this.ms.ip;
    this.tm = this.ms.tm;
    this.paper = new Paper();
    this.imageMerger = new ImageMerger();
    this.imageResizer = new ImageResizer();
    this.imageCropper = new ImageCropper();
  }
  async exportExecute(exportOrders = [order]) {
    // 0 load Title & pages ExecutePerPage
    const setting = await this.tm.loadSettings().catch((e) => {
      console.log(e)
    });
    const pages = await this.pp.loadPages().catch((e) => {
      console.log(e)
    });
  }
  async executeParOrder(setting,pages,order){
    //-1 order consts calc
    const targetDpi = this.paper.getDpi(order.dpiName);
    const targetSize = this.paper.getTargetPaperSize(order.basePaper, order.dpiName);
    const clopOffset = this.paper.calcClopOffsetPixcel(order.basePaper, targetDpi);
    const frameSizeMm = this.paper.getPaperFrameSizeMm(order.basePaper);
    const frameSize = {
      x: this.paper.calcPixcel(targetDpi, frameSizeMm.x),
      y: this.paper.calcPixcel(targetDpi, frameSizeMm.y)
    };
    await this.expandAndCropSize(targetSize,frameSizeMm,frameSize,clopOffset,pages);
    console.log(pages)
    console.log("aaaaaaaaaaaaaaaaaaaaaaaa5a-/")
    const isPageDirectionR2L = setting.pageDirection === "r2l";
    const isRightStart = setting.startPage === "r";
    const isSideSynced = (isPageDirectionR2L && isRightStart) || (!isPageDirectionR2L && !isRightStart);
    const isOdd = pages.length % 2 > 0;
    const hasAddSet = (isSideSynced && isOdd) || (!isSideSynced && !isOdd);
    await this.exportDualImage4Print(targetSize, setting, pages, hasAddSet, isSideSynced, isOdd);

    console.log("aaaaaaaaaaaaaaaaaaaaaaaa5b-/")
    //10 load images and add tozip
    // const ab = this.ip.getArrayBufferFromImageBitmapData(cropedPaper);
    // console.log("cropedPaper getArrayBufferFromImageBitmapData ab:"+cropedPaper.width+"/"+cropedPaper.height);
    // console.log(ab);
    // plainData1
    //11 save zip
    const compressed = await this.exoprtAsZip(pages);
    const exports = this.tm.getExports();
    let exportImagePk = null;
    for(let exportPk of exports){
      const imageOutput = await this.iom.load(exportPk);
      if(imageOutput.type==="zip"){
        exportImagePk = exportPk;
        break;
      }
    }
    const outputNew = await this.bm.save(outputOld, "expandPage", compressed);
    console.log("aaaaaaaaaaaaaaaaaaaaaaaa8b-/");
    const exportImageNewPk = await this.iom.save(exportImagePk, this.tm.getCurrentTitleName()+getNowUnixtime()+".zip", outputNew, "zip", order.orderName);
    // console.log(compressed);
    if(exportImageNewPk){
      exports.push(exportImageNewPk);
      await this.tm.saveCurrent();
    }
    // return pk list
    return exports;
  }
  async expandAndCropSize(targetSize,frameSizeMm,frameSize,clopOffset,pages){
    console.log("--targetSize--")
    console.log(targetSize)
    const expandedPaper = {
      data: new Uint8ClampedArray(frameSize.x * frameSize.y * 4),
      width: frameSize.x,
      height: frameSize.y
    };
    const cropedPaper = {
      data: new Uint8ClampedArray(targetSize.x * targetSize.y * 4),
      width: targetSize.x,
      height: targetSize.y
    };
    const cropedPaperForSave = {
      data: new Uint8ClampedArray(targetSize.x * targetSize.y * 4),
      width: targetSize.x,
      height: targetSize.y
    };
    const targetRetio = targetSize.x / targetSize.y;
    const isBaseWhite = true;binaryEntitySaved
    let currentDataAb = null
    for (let pageEntity of pages) {
      if (pageEntity && pageEntity.baseImage) {
        // console.log(pageEntity)
        //1 Expand
        const baseImageEntity = await this.em.get(pageEntity.baseImage);
        const width = baseImageEntity.width;
        const height = baseImageEntity.height;
        const baseBinaryEntity = await this.em.get(baseImageEntity.binary);
        // console.log(baseImageEntity)
        // console.log(baseBinaryEntity)
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa0a")
        // TODO convert flate bitmap data
        currentDataAb = baseBinaryEntity._ab;
        const origin = await this.ip.getImageDataFromArrayBuffer(baseBinaryEntity._ab);
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa0a w:" + origin.width + '/h:' + origin.height)
        const retio = width / height;
        const isWider = retio > targetRetio;
        const longPixcel = isWider
          ? width
          : height;
        const longMm = isWider
          ? frameSizeMm.x
          : frameSizeMm.y;
        const dpi = this.paper.calcDpi(longPixcel, longMm);
        //paper size nomalize
        const sizeWhitePaperWidth = isWider
          ? width
          : Math.floor(height * targetRetio);
        const sizeWhitePaperHeight = isWider
          ? Math.floor(width / targetRetio)
          : height;
        const offsetX = isWider
          ? 0
          : Math.floor((sizeWhitePaperWidth - width) / 2);
        const offsetY = isWider
          ? Math.floor((sizeWhitePaperHeight - height) / 2)
          : 0;
        const whitePaper = {
          data: new Uint8ClampedArray(sizeWhitePaperWidth * sizeWhitePaperHeight * 4),
          width: sizeWhitePaperWidth,
          height: sizeWhitePaperHeight
        };
        origin.offsetX = offsetX;
        origin.offsetY = offsetY;
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa1a/" + whitePaper.data.length + '/w:' + sizeWhitePaperWidth + '/h:' + sizeWhitePaperHeight)
        this.imageMerger.maegeReplace(whitePaper, [origin], isBaseWhite);
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa2a/" + expandedPaper.data.length)
        this.imageResizer.resizeAsByCubic(whitePaper, expandedPaper);
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa3a/" + cropedPaper.data.length)
        this.imageCropper.corpImageToData(expandedPaper, cropedPaper, clopOffset);
        currentDataAb = this.ip.getArrayBufferFromImageBitmapData(cropedPaper);
        const plain = cropedPaper.data;
        //console.log(Zlib);
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa4a-/")
        console.time('RawDeflate');
        // const deflate = new Raw.RawDeflate(plain);
        // console.log("aaaaaaaaaaaaaaaaaaaaaaaa5a")
        // const compressed = deflate.compress();
        // console.timeEnd('RawDeflate');
        // console.log("aaaaaaaaaaaaaaaaaaaaaaaa6a")
        // cropedPaperForSave.data = compressed;

        // console.log(compressed)
        // alert(frameSizeMm);
        //expand
        //2 Save to page
        const outputOld = pageEntity.outputExpandImage;
        const outputNew = await this.bm.save(outputOld, "expandPage", currentDataAb);
        pageEntity.outputExpandImage = outputNew;
        await this.em.Pages.save(pageEntity);
        //3 CropPage
        //4 saveImage
        //5 Save to page
        //break;
      }
    }
  }
  async exoprtAsZip(pages) {
    const zip = new Zlib.Zip();
    let pageNum = 0;
    let lastOne = null;
    for (let pageEntity of pages) {
      pageNum++;
      if (pageEntity && pageEntity.outputDualImage) {
        if (pageEntity.outputDualImage === lastOne) {
          pageEntity.outputDualImage = null;
          continue;
        }
        lastOne = pageEntity.outputDualImage;
        const outputBinaryEntity = await this.em.get(lastOne);
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa7a pageNum:" + pageNum + "/outputBinaryEntity:" + outputBinaryEntity + "/lastOne:" + lastOne);
        if (outputBinaryEntity) {
          zip.addFile(new Uint8Array(outputBinaryEntity._ab), {
            filename: UnicodeEncoder.stringToByteArray('page' + pageNum + "-" + pageNum + '.jpg')
          });
          await this.bm.remove(lastOne);
        }

      }
    }
    return zip.compress();
  }
  async exportDualImage4Print(targetSize, setting, pages, isSideSynced, isOdd) {
    //6 new WhiteImageCreate
    //7 load2PageImage
    //8 merge
    //9 save
    const cropedPaperDual = {
      data: new Uint8ClampedArray(targetSize.x * targetSize.y * 8),
      width: targetSize.x * 2,
      height: targetSize.y
    };
    console.log(setting);
    const cratePageData = PreviewProcessor.getCratePageDataFunc();
    const dummyClass = "dummy";
    const shapedList = PreviewProcessor.buildPageFrames(setting, pages, cratePageData, dummyClass);
    const pairPages = {
      right: null,
      left: null,
      rightBin: null,
      leftBin: null
    };
    const lastPagesPair = [null, null];
    const latestPagesPair = [null, null];
    let isSkeped = isSideSynced !== true;
    const printPages = [];
    const printPairs = [];
    for (let shapedPagePair of shapedList) {
      const one = shapedPagePair[0];
      const two = shapedPagePair[1];
      if (one && !one.isDummy) {
        printPages.push(one);
      }
      if (two && !two.isDummy) {
        printPages.push(two);
      }
    }

    for (let index = 0; index < printPages.length; index++) {
      const newPair = [null, null];
      if (index <= 0) {
        if (!isSideSynced) {
          newPair[1] = printPages[index];
        } else {
          newPair[0] = printPages[index];
          index++;
          newPair[1] = printPages[index];
        }
      } else {
        newPair[0] = printPages[index];
        index++;
        if (index < printPages.length) {
          newPair[1] = printPages[index];
        }
      }
      printPairs.push(newPair);
    }
    for (let printPagePair of printPairs) {
      await this.buildDualImage(targetSize, cropedPaperDual, pairPages, printPagePair);
    }
  }
  async buildDualImage(targetSize, cropedPaperDual, pairPages, shapedPagePair) {
    console.log(shapedPagePair);
    const one = shapedPagePair[0];
    const two = shapedPagePair[1];
    // reverse side!
    const right = one && one.isRight
      ? (two && !two.isRight?two:null)
      : one;
    const left = one && one.isRight
      ? one
      : (two && two.isRight?two:null);
    pairPages.right = right === null || right.isDummy
      ? null
      : right.binary;
    pairPages.left = left === null || left.isDummy
      ? null
      : left.binary;
    pairPages.rightBin = null;
    pairPages.leftBin = null;
    console.log("aaaaaaaaaaaaaaaaaaaaaaaa6a shapedPagePair:" + shapedPagePair + "/left:" + pairPages.left + "/right:" + pairPages.right);

    let pageEntity = null;
    if (pairPages.right && pairPages.right.outputExpandImage) {
      pairPages.rightBin = await this.em.get(pairPages.right.outputExpandImage);
      pageEntity = pairPages.right;
    }
    if (pairPages.left && pairPages.left.outputExpandImage) {
      pairPages.leftBin = await this.em.get(pairPages.left.outputExpandImage);
      pageEntity = pairPages.left;
    }
    if (!pageEntity) {
      return;
    }
    this.imageMerger.beWhiteImage(cropedPaperDual, true);
    console.log("aaaaaaaaaaaaaaaaaaaaaaaa6a left:" + pairPages.left + "/right:" + pairPages.right);
    if (pairPages.leftBin) {
      const origin = await this.ip.getImageDataFromArrayBuffer(pairPages.leftBin._ab);
      origin.offsetX = 0;
      origin.offsetY = 0;
      this.imageMerger.maegeReplace(cropedPaperDual, [origin], false);
    }
    if (pairPages.rightBin) {
      const origin = await this.ip.getImageDataFromArrayBuffer(pairPages.rightBin._ab);
      origin.offsetX = targetSize.x;
      origin.offsetY = 0;
      this.imageMerger.maegeReplace(cropedPaperDual, [origin], false);
    }
    //ping?
    const cropedPaperDualAb = this.ip.getArrayBufferFromImageBitmapDataAsJpg(cropedPaperDual, 1.0);
    const outputOld = pageEntity.outputDualImage;
    const outputNew = await this.bm.save(outputOld, "expandDualPage", cropedPaperDualAb);
    if (pairPages.right && pairPages.right.outputExpandImage) {
      pairPages.right.outputDualImage = outputNew;
      await this.em.Pages.save(pairPages.right);
      await this.em.delete(pairPages.rightBin);
    }
    if (pairPages.left && pairPages.left.outputExpandImage) {
      pairPages.left.outputDualImage = outputNew;
      await this.em.Pages.save(pairPages.left);
      await this.em.delete(pairPages.leftBin);
    }
  }
  exportPdfExecute(exportOrders) {
    alert('ExportImageProcesser exportPdfExecute');
  }
}
