import {
  Sorter
} from "../../util/sorter";
import {
  getNowUnixtime
} from "../../util/timeUtil";
import {
  UnicodeEncoder
} from "../../util/unicodeEncoder";
import {
  MainService
} from "../../service/mainService"
import {
  PreviewProcessor
} from "./previewProcessor"

const order = {
  orderName: "MangaPaperA4ExpandTatikiri",
  basePaper: "mangaPaperA4ExpandTatikiri",
  dpiName: "dpi600"
};
export class ExportUtilProcessor {
	constructor(pp) {
		this.pp = pp;
    this.ms = MainService.getInstance();
    this.em = this.ms.em;
    this.bm = this.ms.bm;
    this.im = this.ms.im;
    this.iom = this.ms.iom;
    this.tm = this.ms.tm;
  }
  async load() {
    const exportPks = await this.tm.getExports();
    return await this.getZipPdfPair(exportPks);
  }
  async remove(exportPk = -1) {
    const exportPks = await this.tm.getExports();
    if (exportPks) {
      for (let exportｓIndex in exportPks) {
        const current = exportPks[exportｓIndex];
        delete exportPks[exportｓIndex];
        await this.iom.remove(current);
      }
      await this.tm.saveCurrent();
    }
  }
  async loadZip(exportPk) {
    if (exportPk) {
      alert('ExportUtilProcessor loadZip is NULL!');
    } else {
      const imageOutpus = await this.load();
      const zip = imageOutpus.zip;
      if (zip && zip.binary) {
        //alert(zip.binary);
        const binaryEntity = await this.bm.load(zip.binary);
        zip.ab = binaryEntity._ab;
        // console.error(zip.ab)
      }
      return zip;
    }
    return null;
  }
  async loadPdf(exportPk) {
    if (exportPk) {
      alert('ExportUtilProcessor loadPdf exportPk is NULL!');
    } else {
      const imageOutpus = await this.load();
      const pdf = imageOutpus.pdf;
      if (pdf && pdf.binary) {
        const binaryEntity = await this.bm.load(pdf.binary);
        pdf.ab = binaryEntity._ab;
      }
      return pdf;
    }
    return null;
  }

  async getZipPdfPair(exportPks) {
    const imageOutpus = {
      pdf: null,
      zip: null
    };
    if (!!exportPks === false) {
      return imageOutpus;
    }
    for (let exportPk of exportPks) {
      const imageOutput = await this.iom.load(exportPk);
      if (imageOutput && imageOutput.type === "zip") {
        imageOutpus.zip = imageOutput;
      }
      if (imageOutput && imageOutput.type === "pdf") {
        imageOutpus.pdf = imageOutput;
      }
    }
    return imageOutpus;
  }
  async loadUploadedImagesZip() {
		const pages = await this.pp.loadPages()
			.catch((e) => {
				console.error(e)
			});
    if (!pages) {
      alert('ExportUtilProcessor UploadedImages is None!');
    } else {
      const zip = await this.exoprtAsUploadedZip(pages);
      return zip;
    }
    return null;
  }
  async exoprtAsUploadedZip(pages) {
    console.time("exoprtAsUploadedZip")
    const zip = new Zlib.Zip({
      compress: false
    });
    let pageNum = 0;
    let lastOne = null;
    let lastOneBin = null;
    for (let pageEntity of pages) {
      if (pageEntity && pageEntity.baseImage) {
        if (pageEntity.baseImage === lastOne) {
          // pageEntity.baseImage = null;
          continue;
        }
        pageNum++;
        lastOne = pageEntity.baseImage;
        const imageEntity = await this.em.get(lastOne);
        if (lastOne.binary === lastOneBin) {
          // pageEntity.baseImage = null;
          continue;
        }
				lastOneBin = lastOne.binary;
        const binaryEntity = await this.em.get(lastOneBin);
        //console.log("aaaaaaaaaaaaaaaaaaaaaaaa7a pageNum:" + pageNum + "/outputBinaryEntity:" + outputBinaryEntity + "/lastOne:" + lastOne);
        if (binaryEntity) {
          const nextPageNo = pageNum * 2;
          const currentPageNo = nextPageNo - 1;
          zip.addFile(new Uint8Array(binaryEntity._ab), {
            filename: UnicodeEncoder.stringToByteArray(lastOne.name)
          });
          // this.delList.push(lastOne);
        }
      }
    }
    //uncompress
    const result = zip.compress();
    console.timeEnd("exoprtAsUploadedZip")
    return result;
  }

  async loadFullBackupZip() {
    return null;
  }
}
