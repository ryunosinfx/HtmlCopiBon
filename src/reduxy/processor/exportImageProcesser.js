import {Sorter} from "../../util/sorter";
import {MainService} from "../../service/mainService"
export class ExportImageProcesser {
    constructor(pp) {
      this.pp = pp;
      this.ms = MainService.getInstance();
      this.em = this.ms.em;
      this.sm = this.ms.sm;
      this.tm = this.ms.tm;
    }
    load(eportSetting){
      alert('ExportImageProcesser load');
      this.eportSetting= eportSetting;
    }
    remove(exportPk=-1){
      alert('ExportImageProcesser remove');

    }
    loadZip(exportPk){
      alert('ExportImageProcesser loadZip');

    }
    loadPdf(exportPk){
      alert('ExportImageProcesser loadPdf');

    }
    exportExecute(exportOrders=[]){
      alert('ExportImageProcesser exportExecute');
      // 0 load Title & pages ExecutePerPage
      const pages =this.pp.loadPages();
      const order = {
        basePaper:""
      };
      //-1 order consts calc
      //1 Expand
      //2 Save to page
      //3 CropPage
      //4 saveImage
      //5 Save to page
      //6 new WhiteImageCreate
      //7 load2PageImage
      //8 merge
      //9 save

      //10 load images and add tozip
      //11 save zip


    }
    exportPdfExecute(exportOrders){
      alert('ExportImageProcesser exportPdfExecute');

    }
}
