import {Sorter} from "../../util/sorter";
import {Paper} from "../../util/image/paper";
import {ImageMerger} from "../../util/image/imageMerger";
import {ImageResizer} from "../../util/image/imageResizer";
import {ImageCropper} from "../../util/image/imageCropper";
import {UnicodeEncoder} from "../../util/unicodeEncoder";
import {MainService} from "../../service/mainService"
// import {Zlib, Zip, Raw, PKZIP} from "zlibjs/bin/zlib_and_gzip.min"
import {Zlib} from "zlibjs/bin/zip.min"

export class ExportImageProcesser {
  constructor(pp) {
    this.pp = pp;
    this.ms = MainService.getInstance();
    this.em = this.ms.em;
    this.sm = this.ms.sm;
    this.bm = this.ms.bm;
    this.im = this.ms.im;
    this.ip = this.ms.ip;
    this.tm = this.ms.tm;
    this.paper = new Paper();
    this.imageMerger = new ImageMerger();
    this.imageResizer = new ImageResizer();
    this.imageCropper = new ImageCropper();
  }
  load(eportSetting) {
    alert('ExportImageProcesser load');
    this.eportSetting = eportSetting;
  }
  remove(exportPk = -1) {
    alert('ExportImageProcesser remove');

  }
  loadZip(exportPk) {
    alert('ExportImageProcesser loadZip');

  }
  loadPdf(exportPk) {
    alert('ExportImageProcesser loadPdf');

  }
  async exportExecute(exportOrders = []) {
    alert('ExportImageProcesser exportExecute');
    // 0 load Title & pages ExecutePerPage
    const pages = await this.pp.loadPages();
    const order = {
      basePaper: "mangaPaperA4ExpandTatikiri",
      dpiName: "dpi600"
    };
    //-1 order consts calc
    const targetDpi = this.paper.getDpi(order.dpiName);
    const targetSize = this.paper.getTargetPaperSize(order.basePaper, order.dpiName);
    const clopOffset = this.paper.calcClopOffsetPixcel(order.basePaper, targetDpi);
    const frameSizeMm = this.paper.getPaperFrameSizeMm(order.basePaper);
    const frameSize = {
      x: this.paper.calcPixcel(targetDpi, frameSizeMm.x),
      y: this.paper.calcPixcel(targetDpi, frameSizeMm.y)
    };
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
    const cropedPaperDual = {
      data: new Uint8ClampedArray(targetSize.x * targetSize.y * 8),
      width: targetSize.x*2,
      height: targetSize.y
    };
    const targetRetio = targetSize.x / targetSize.y;
    const isBaseWhite = true;
    let currentDataAb = null
    for (let pageEntity of pages) {
      if (pageEntity && pageEntity.baseImage) {
        console.log(pageEntity)
        //1 Expand
        const baseImageEntity = await this.em.get(pageEntity.baseImage);
        const width = baseImageEntity.width;
        const height = baseImageEntity.height;
        const baseBinaryEntity = await this.em.get(baseImageEntity.binary);
        console.log(baseImageEntity)
        console.log(baseBinaryEntity)
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa0a")
        // TODO convert flate bitmap data
        currentDataAb = baseBinaryEntity._ab;
        const origin = await this.ip.getImageDataFromArrayBuffer(baseBinaryEntity._ab);
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa0a w:"+origin.width+'/h:'+origin.height)
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
        origin.offsetX=offsetX;
        origin.offsetY=offsetY;
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa1a/" + whitePaper.data.length+'/w:'+sizeWhitePaperWidth+'/h:'+sizeWhitePaperHeight)
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
        const outputNew = await this.bm.save(outputOld,"expandPage",currentDataAb);
        pageEntity.outputExpandImage = outputNew;
        await this.em.Pages.save(pageEntity);
        //3 CropPage
        //4 saveImage
        //5 Save to page
        //break;
      }
    }

    //6 new WhiteImageCreate
    //7 load2PageImage
    //8 merge
    //9 save
    let cupleNum = 0;
    let leftPage = null;
    let rightPage = null;

    for (let pageEntity of pages) {
      cupleNum++;
      if (pageEntity && pageEntity.outputExpandImage) {
        const outputBinaryEntity = await this.em.get(pageEntity.outputExpandImage);
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa6a pageNum:"+cupleNum+"/outputBinaryEntity:"+outputBinaryEntity);
        if(outputBinaryEntity){

        }
      }
    }


    const zip = new Zlib.Zip();
    let pageNum = 0;
    for (let pageEntity of pages) {
      pageNum++;
      if (pageEntity && pageEntity.outputExpandImage) {
        const outputBinaryEntity = await this.em.get(pageEntity.outputExpandImage);
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa7a pageNum:"+pageNum+"/outputBinaryEntity:"+outputBinaryEntity);
        if(outputBinaryEntity){
          zip.addFile(new Uint8Array(outputBinaryEntity._ab), {filename: UnicodeEncoder.stringToByteArray('foo'+pageNum+'.png')});
        }
      }
    }
    const compressed = zip.compress();



    //10 load images and add tozip
    // const ab = this.ip.getArrayBufferFromImageBitmapData(cropedPaper);
    // console.log("cropedPaper getArrayBufferFromImageBitmapData ab:"+cropedPaper.width+"/"+cropedPaper.height);
    // console.log(ab);
    // plainData1
    //11 save zip
    // console.log(compressed);
    return compressed;
  }
  exportPdfExecute(exportOrders) {
    alert('ExportImageProcesser exportPdfExecute');

  }
}