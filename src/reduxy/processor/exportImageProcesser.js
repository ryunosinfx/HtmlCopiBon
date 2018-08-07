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
    load(){
      this.eportSetting= eportSetting;
    }
    remove(exportPk=-1){

    }
    loadZip(exportPk){

    }
    loadPdf(exportPk){

    }
    exportExecute(exportOrders=[]){

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

    }
}
