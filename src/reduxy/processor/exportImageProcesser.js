import {Sorter} from "../../util/sorter";
import {Paper} from "../../util/image/paper";
import {MainService} from "../../service/mainService"
export class ExportImageProcesser {
    constructor(pp) {
      this.pp = pp;
      this.ms = MainService.getInstance();
      this.em = this.ms.em;
      this.sm = this.ms.sm;
      this.bm = this.ms.bm;
      this.tm = this.ms.tm;
      this.paper = new Paper();
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
        basePaper:"mangaPaperA4ExpandTatikiri",
        dpiName:"dpi600"
      };
      //-1 order consts calc
      const targetSize = this.paper.getTargetPaperSize(order.basePaper);
      const clopOffset = this.paper.calcClopOffset(order.basePaper);
      const targetRetio = targetSize.x/targetSize.y;

      for(let page of pages){
        const pageEntity = this.em.get(page);
        if(page && pageEntity && pageEntity.baseImage){
          //1 Expand
          const baseImageEntity = this.em.get(page.baseImage);
          const width = baseImageEntity.width;
          const height = baseImageEntity.height;
          const rectio = width/height;
          const isWider = rectio > targetRetio;
          const longPixcel = isWider?width:height;
          const dpi = this.paper.calcDpi()
          //2 Save to page
          //3 CropPage
          //4 saveImage
          //5 Save to page

        }
      }

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
