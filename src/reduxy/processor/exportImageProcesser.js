import {Sorter} from "../../util/sorter";
import {Paper} from "../../util/image/paper";
import {ImageMerger} from "../../util/image/imageMerger";
import {ImageResizer} from "../../util/image/imageResizer";
import {ImageCropper} from "../../util/image/imageCropper";
import {MainService} from "../../service/mainService"
import {Zlib} from "zlibjs/bin/rawdeflate.min"
export class ExportImageProcesser {
  constructor(pp) {
    this.pp = pp;
    this.ms = MainService.getInstance();
    this.em = this.ms.em;
    this.sm = this.ms.sm;
    this.bm = this.ms.bm;
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
    const pages = this.pp.loadPages();
    const order = {
      basePaper: "mangaPaperA4ExpandTatikiri",
      dpiName: "dpi600"
    };
    //-1 order consts calc
    const targetDpi = this.paper.getDpi(order.dpiName);
    const targetSize = this.paper.getTargetPaperSize(order.basePaper);
    const clopOffset = this.paper.calcClopOffsetPixcel(order.basePaper,targetDpi);
    const frameSizeMm = this.paper.getPaperFrameSizeMm(order.basePaper);
    const frameSize = {
      x:this.paper.calcPixcel(targetDpi,frameSizeMm.x),
      y:this.paper.calcPixcel(targetDpi,frameSizeMm.y)
    };

    const expandedPaper = {
      data:new Uint8ClampedArray(frameSize.x*frameSize.y*4),
      width:frameSize.x,
      height:frameSize.y
    };
    const cropedPaper = {
      data:new Uint8ClampedArray(targetSize.x*targetSize.y*4),
      width:targetSize.x,
      height:targetSize.y
    };
    const cropedPaperForSave = {
      data:new Uint8ClampedArray(targetSize.x*targetSize.y*4),
      width:targetSize.x,
      height:targetSize.y
    };
    const targetRetio = targetSize.x / targetSize.y;

    for (let page of pages) {
      const pageEntity = this.em.get(page);
      if (page && pageEntity && pageEntity.baseImage) {
        //1 Expand
        const baseImageEntity = this.em.get(page.baseImage);
        const width = baseImageEntity.width;
        const height = baseImageEntity.height;
        // TODO convert flate bitmap data
        const origin = await this.ip.getImageDataFromArrayBuffer(baseImageEntity._ab);
        const originData = {data:"",width:width,height:height};
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
          : height * targetRetio;
        const sizeWhitePaperHeight = isWider
          ? width / targetRetio
          : height;
        const offsetX = isWider
          ? 0
          : (sizeWhitePaperWidth - width) / 2;
        const offsetY = isWider
          ? (sizeWhitePaperHeight - height) / 2
          : 0;
        const whitePaper = {
          data:new Uint8ClampedArray(sizeWhitePaperWidth*sizeWhitePaperHeight*4),
          width:sizeWhitePaperWidth,
          height:sizeWhitePaperHeight
        };
        this.imageMerger.maegeReplace(whitePaper, [origin], isBaseWhite);
        this.imageResizer.resizeByCubic(whitePaper, expandedPaper);
        this.imageCropper.corpImageToData(expandedPaper,cropedPaper,clopOffset);
        const deflate = new Zlib.RawDeflate(plain);
const compressed = deflate.compress();
cropedPaperForSave.data =compressed;

        //expand
        //2 Save to page

        //3 CropPage
        //4 saveImage
        //5 Save to page
break;
      }
    }

    //6 new WhiteImageCreate
    //7 load2PageImage
    //8 merge
    //9 save

    //10 load images and add tozip
    //11 save zip

  }
  exportPdfExecute(exportOrders) {
    alert('ExportImageProcesser exportPdfExecute');

  }
}
