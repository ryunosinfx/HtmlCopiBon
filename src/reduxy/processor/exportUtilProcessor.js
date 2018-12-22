import {
	Sorter
} from "../../util/sorter";
import {
	unixTimeToDateFormat
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
import { Zlib } from "zlibjs/bin/zip.min"

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
		const now = (new Date()
			.getTime());
		const yyyyMMddThhmmss = unixTimeToDateFormat(now, "yyyyMMddThhmmss");
		const output = {
			ab: null,
			name: "UploadedImagesZip_" + yyyyMMddThhmmss + ".zip"
		}
		const imageEntitis = await this.im.loadImages()
			.catch((e) => {
				console.error(e)
			});
		console.log("aaaaaaaaaaaaaaaaaaaaaaaa5a imageEntitis:" + imageEntitis);
		console.log(imageEntitis);
		if (!imageEntitis) {
			alert('ExportUtilProcessor UploadedImages is None!');
		} else {
			output.ab = await this.exoprtAsUploadedZip(imageEntitis);
		}
		return output;
	}
	async exoprtAsUploadedZip(imageEntitis) {
		console.time("exoprtAsUploadedZip")
		const zip = new Zlib.Zip({
			compress: false
		});
		let lastOne = null;
		for (let imageEntity of imageEntitis) {
			console.log("aaaaaaaaaaaaaaaaaaaaaaaa6a imageEntity:" + imageEntity);
			if (imageEntity && imageEntity.imageEntity && imageEntity.imageEntity.binary && imageEntity.imageEntity.binary.pk) {
				if (imageEntity.imageEntity.binary.pk === lastOne) {
					// pageEntity.baseImage = null;
					continue;
				}
				lastOne = imageEntity.imageEntity.binary.pk;
				const binaryEntity = await this.em.get(lastOne);
				console.log("aaaaaaaaaaaaaaaaaaaaaaaa7a binaryEntity:" + binaryEntity + "/lastOne:" + lastOne);
				if (binaryEntity) {
					zip.addFile(new Uint8Array(binaryEntity._ab), {
						filename: UnicodeEncoder.stringToByteArray(imageEntity.imageEntity.name)
					});
					console.log("exoprtAsUploadedZip" + binaryEntity)
					this.delList.push(lastOne);
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