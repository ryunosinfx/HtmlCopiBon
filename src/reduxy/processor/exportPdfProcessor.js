import { Sorter } from "../../util/sorter";
import { getNowUnixtime, unixTimeToDateFormat } from "../../util/timeUtil";
import { Paper } from "../../util/image/paper";
import { ImageMerger } from "../../util/image/imageMerger";
import { ImageResizer } from "../../util/image/imageResizer";
import { ImageCropper } from "../../util/image/imageCropper";
import { ImageFilter } from "../../util/image/imageFilter";
import { UnicodeEncoder } from "../../util/unicodeEncoder";
import { MainService } from "../../service/mainService"
import { PreviewProcessor } from "./previewProcessor"
import { ProgressBarProcesser } from "./progressBarProcesser"
// import {Zlib, Zip, Raw, PKZIP} from "zlibjs/bin/zlib_and_gzip.min"
import { Zlib } from "zlibjs/bin/zip.min"

const order = {
	orderName: "MangaPaperA4ExpandTatikiri",
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
		this.imageFilter = new ImageFilter();
		this.pbp = new ProgressBarProcesser();
		this.progress = 0;
	}
  createPdf(){
    
  }
}
