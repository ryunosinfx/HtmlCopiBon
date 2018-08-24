import {Sorter} from "../../util/sorter";
import {getNowUnixtime} from "../../util/timeUtil";
import {UnicodeEncoder} from "../../util/unicodeEncoder";
import {MainService} from "../../service/mainService"
import {PreviewProcessor} from "./previewProcessor"

const order = {
  orderName:"MangaPaperA4ExpandTatikiri",
  basePaper: "mangaPaperA4ExpandTatikiri",
  dpiName: "dpi600"
};
export class ExportUtilProcesser {
  constructor() {
    this.ms = MainService.getInstance();
    this.em = this.ms.em;
    this.bm = this.ms.bm;
    this.im = this.ms.im;
    this.iom = this.ms.iom;
    this.tm = this.ms.tm;
  }
  async load() {
    const exportPks = this.tm.getExports();
    return await this.getZipPdfPair(exportPks);
  }
  async remove(exportPk = -1) {
    const exportPks = this.tm.getExports();
    for(let exportｓIndex in exportPks){
      if(exportPks[exportｓIndex] === exportPk){
        delete exportPks[exportｓIndex];
        await this.iom.save(exportPk);
        await this.tm.saveCurrent();
        break;
      }
    }
    alert('ExportImageProcesser remove');
  }
  async loadZip(exportPk) {
    if(exportPk){
      alert('ExportImageProcesser loadZip');
    }else{
      const imageOutpus = await this.load();
      const zip = imageOutpus.zip;
      if(zip && zip.binary){
        zip.ab = await this.bm.load(zip.binary);
      }
      return zip;
    }
    return null;
  }
  async loadPdf(exportPk) {
    if(exportPk){
      alert('ExportImageProcesser loadPdf');
    }else{
      const imageOutpus = await this.load();
      const pdf = imageOutpus.pdf;
      if(pdf && pdf.binary){
        pdf.ab = await this.bm.load(pdf.binary);
      }
      return pdf;
    }
    return null;
  }

  async getZipPdfPair(exportPks){
    const imageOutpus = {pdf:null,zip:null};
    for(let exportPk of exportPks){
      const imageOutput = await this.iom.load(exportPk);
      if(imageOutput && imageOutput.type==="zip"){
        imageOutpus.zip = imageOutput;
      }
      if(imageOutput && imageOutput.type==="pdf"){
        imageOutpus.pdf = imageOutput;
      }
    }
    return imageOutpus;
  }
}
