// import { Sorter } from "../../util/sorter";
import { getNowUnixtime, unixTimeToDateFormat } from '../../util/timeUtil.js';
import { Paper } from '../../util/image/paper.js';
import { ImageMerger } from '../../util/image/imageMerger.js';
import { ImageResizer } from '../../util/image/imageResizer.js';
import { ImageCropper } from '../../util/image/imageCropper.js';
import { ImageFilter } from '../../util/image/imageFilter.js';
import { UnicodeEncoder } from '../../util/unicodeEncoder.js';
import { MainService } from '../../service/mainService.js';
// import { PreviewProcessor } from "./previewProcessor"
import { ProgressBarProcessor } from './progressBarProcessor.js';
import { ExportPdfProcessor } from './exportPdfProcessor.js';
// import {Zlib, Zip, Raw, PKZIP} from "zlibjs/bin/zlib_and_gzip.min"
import { Zlib } from '../../../lib/zip.min.es.js';
// import Zlib from '../../../lib/zlibjs/bin/zip.min.js';
const order = {
	orderName: 'MangaPaperA4ExpandTatikiri',
	basePaper: 'mangaPaperA4ExpandTatikiri',
	dpiName: 'dpi600',
};
const isOtherThread = false;
export class ExportImageProcessor {
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
		this.pbp = new ProgressBarProcessor();
		this.epp = new ExportPdfProcessor();

		this.progress = 0;
		this.delList = [];
	}
	async exportZipExecute(exportOrders = [order]) {
		return await this.exportExecuteEIP(exportOrders, true);
	}
	async exportPdfExecute(exportOrders) {
		return await this.exportExecuteEIP(exportOrders, false);
	}
	async exportExecuteEIP(exportOrders = [order], isZip = true) {
		// 0 load Title & pages ExecutePerPage
		await this.pbp.open('Export and save files for print as ' + (isZip ? 'zip' : 'pdf'));
		this.progress = 0;
		this.pbp.update(this.progress, 'loading Settings');
		const setting = await this.tm.loadSettings();
		this.progress = 1;
		this.pbp.update(this.progress, 'loading pages');
		const pages = await this.pp.loadPages();
		this.progress = 2;
		await this.pbp.update(this.progress, 'start executess');
		const result = await this.executeParOrder(setting, pages, exportOrders[0], isZip);
		await this.pbp.comple(this.progress);
		return result;
	}
	async executeParOrder(setting, pages, order, isZip) {
		//-1 order consts calc
		const targetDpi = this.paper.getDpi(order.dpiName);
		const targetSize = this.paper.getTargetPaperSize(order.basePaper, order.dpiName);
		const clopOffset = this.paper.calcClopOffsetPixcel(order.basePaper, targetDpi);
		const frameSizeMm = this.paper.getPaperFrameSizeMm(order.basePaper);
		const isGrayscale = order.isGrayscale;
		const isMaxSize10M = order.isMaxSize10M;
		const isLanczose = order.isLanczose;
		const isSaddleStitchingOrder = order.isSaddleStitchingOrder;
		const frameSize = {
			x: this.paper.calcPixcel(targetDpi, frameSizeMm.x),
			y: this.paper.calcPixcel(targetDpi, frameSizeMm.y),
		};
		this.progress = 3;
		this.pbp.update(this.progress, 'expandAndCropSize');
		await this.expandAndCropSize(
			targetSize,
			frameSizeMm,
			frameSize,
			clopOffset,
			pages,
			isGrayscale,
			isLanczose,
			setting.pageNum
		);
		const exports = isZip
			? await this.executeAsZip(targetSize, setting, pages, isMaxSize10M)
			: await this.executeAsPdf(order.basePaper, setting, pages, isMaxSize10M, isSaddleStitchingOrder);
		return exports;
	}
	async executeAsZip(targetSize, setting, pages, isMaxSize10M) {
		const isPageDirectionR2L = setting.pageDirection === 'r2l';
		const isRightStart = setting.startPage === 'r';
		const isSideSynced = (isPageDirectionR2L && isRightStart) || (!isPageDirectionR2L && !isRightStart);
		const isOdd = pages.length % 2 > 0;

		this.progress = 60;
		this.pbp.update(this.progress, 'start exportDualImage4Print');
		await this.exportDualImage4Print(
			targetSize,
			setting,
			pages,
			isSideSynced,
			isOdd,
			isPageDirectionR2L,
			isMaxSize10M
		).catch((e) => {
			console.error('ExportImageProcessor exportExecute executeParOrder');
			console.error(e.stack);
			console.error(e);
			console.error(e.currentTarget);
			console.error(e.returnValue);
			console.error(e.srcElement);
			console.error(e.target);
			console.error(e.type);
			console.error(e.eventPhase);
			console.error(e.timeStamp);
			console.error(e.message);
			console.error(e.lineno);
			console.error(e.error);
		});
		//11 save zip
		this.progress = 85;
		this.pbp.update(this.progress, 'start exoprtAsZip');
		await this.delOnList();
		const compressed = await this.exoprtAsZip(pages).catch((e) => {
			console.error('ExportImageProcessor exportExecute executeParOrder');
			console.error(e.stack);
			console.error(e);
			console.error(e.currentTarget);
			console.error(e.returnValue);
			console.error(e.srcElement);
			console.error(e.target);
			console.error(e.type);
			console.error(e.eventPhase);
			console.error(e.timeStamp);
			console.error(e.message);
			console.error(e.lineno);
			console.error(e.error);
		});
		return await this.commonEnd(compressed, 'zip');
	}
	async executeAsPdf(targetSize, setting, pages, isMaxSize10M, isSaddleStitchingOrder) {
		const isPageDirectionR2L = setting.pageDirection === 'r2l';
		const isRightStart = setting.startPage === 'r';
		const isSideSynced = (isPageDirectionR2L && isRightStart) || (!isPageDirectionR2L && !isRightStart);
		const isOdd = pages.length % 2 > 0;

		this.progress = 60;
		this.pbp.update(this.progress, 'start exportDualImage4Print');
		this.progress = 85;
		this.pbp.update(this.progress, 'start exoprtAsPdf');
		const targetPaper = this.paper.getTragetPaper(targetSize);
		// console.log(setting);
		// alert(setting);
		const pdf = await this.epp
			.createPdf(targetPaper, pages, targetSize, setting, isSaddleStitchingOrder)
			.catch((e) => {
				console.error('ExportImageProcessor exportExecute executeParOrder');
				console.error(e.stack);
				console.error(e);
				console.error(e.currentTarget);
				console.error(e.returnValue);
				console.error(e.srcElement);
				console.error(e.target);
				console.error(e.type);
				console.error(e.eventPhase);
				console.error(e.timeStamp);
				console.error(e.message);
				console.error(e.lineno);
				console.error(e.error);
			});
		// alert("pdf:" + pdf);
		return await this.commonEnd(pdf, 'pdf');
	}
	//End
	async commonEnd(result, type) {
		const exports = await this.tm.getExports();
		let exportImagePk = null;
		let outputOld = null;
		for (const exportPk of exports) {
			const imageOutput = await this.iom.load(exportPk);
			if (imageOutput && imageOutput.type === type) {
				exportImagePk = exportPk;
				outputOld = imageOutput.binary;
				break;
			}
		}
		const outputNew = await this.bm.save(outputOld, 'expandPage', result);
		const size = result.byteLength;
		const now = new Date().getTime();
		const yyyyMMddThhmmss = unixTimeToDateFormat(now, 'yyyyMMddThhmmss');
		const settings = await this.tm.loadSettings();
		const defaultTitle = await this.tm.getCurrentTitleName();
		const exportPrefix = settings.name ? settings.name : defaultTitle;
		const exportImageNewPk = await this.iom.save(
			exportImagePk,
			exportPrefix + yyyyMMddThhmmss + '.' + type,
			outputNew,
			type,
			order.orderName,
			size
		);
		// console.log(result);
		if (exportImageNewPk) {
			exports.push(exportImageNewPk);
			await this.tm.saveCurrent();
		}
		await this.delOnList();
		// return pk list PK!PK!
		this.progress = 100;
		this.pbp.update(this.progress, 'end all!');
		this.pbp.comple(this.progress);
		return exports;
	}
	async expandAndCropSize(targetSize, frameSizeMm, frameSize, clopOffset, pages, isGrayscale, isLanczose, pageNum) {
		//console.log("--targetSize--isGrascale:" + isGrascale)
		//console.log(targetSize)
		const expandedPaper = {
			data: new Uint8ClampedArray(frameSize.x * frameSize.y * 4),
			width: frameSize.x,
			height: frameSize.y,
		};
		const cropedPaper = {
			data: new Uint8ClampedArray(targetSize.x * targetSize.y * 4),
			width: targetSize.x,
			height: targetSize.y,
		};
		const cropedPaperForSave = {
			data: new Uint8ClampedArray(targetSize.x * targetSize.y * 4),
			width: targetSize.x,
			height: targetSize.y,
		};
		const targetRetio = targetSize.x / targetSize.y;
		const isBaseWhite = true;
		const pegaNum = pageNum; //pages.length;
		const stepNum = 9;
		const progressUnit = 50 / (stepNum * pegaNum);
		let currentDataAb = null;
		this.progress = 5;
		this.pbp.update(this.progress, 'start pages');
		//50
		let pageCount = 0;
		for (const pageEntity of pages) {
			pageCount++;
			if (pageCount > pegaNum) break;
			const pageStep = '[' + pageCount + '/' + pegaNum + ']';
			if (pageEntity && pageEntity.baseImage) {
				// console.log(pageEntity)
				//1 Expand
				this.pbp.update(this.progress, 'load baseImageEntity' + pageStep);
				const baseImageEntity = await this.em.get(pageEntity.baseImage);
				this.progress += progressUnit;
				this.pbp.update(this.progress, 'load baseBinaryEntity' + pageStep);
				const width = baseImageEntity.width;
				const height = baseImageEntity.height;
				const baseBinaryEntity = await this.em.get(baseImageEntity.binary);
				if (!baseBinaryEntity) break;
				// console.log(baseImageEntity)
				// console.log(bastapNumseBinaryEntity)
				// console.log("aaaaaaaaaaaaaaaaaaaaaaaa0a")
				// TODO convert flate bitmap data
				currentDataAb = baseBinaryEntity._ab;
				this.progress += progressUnit;
				this.pbp.update(this.progress, 'get ImageDataFromArrayBuffer' + pageStep);
				const origin = await this.ip.getImageDataFromArrayBuffer(baseBinaryEntity._ab);
				// console.log("aaaaaaaaaaaaaaaaaaaaaaaa0a w:" + origin.width + '/h:' + origin.height)
				const retio = width / height;
				const isWider = retio > targetRetio;
				const longPixcel = isWider ? width : height;
				const longMm = isWider ? frameSizeMm.x : frameSizeMm.y;
				const dpi = this.paper.calcDpi(longPixcel, longMm);
				//paper size nomalize
				const sizeWhitePaperWidth = isWider ? width : Math.floor(height * targetRetio);
				const sizeWhitePaperHeight = isWider ? Math.floor(width / targetRetio) : height;
				const offsetX = isWider ? 0 : Math.floor((sizeWhitePaperWidth - width) / 2);
				const offsetY = isWider ? Math.floor((sizeWhitePaperHeight - height) / 2) : 0;
				const whitePaper = {
					data: new Uint8ClampedArray(sizeWhitePaperWidth * sizeWhitePaperHeight * 4),
					width: sizeWhitePaperWidth,
					height: sizeWhitePaperHeight,
				};
				origin.offsetX = offsetX;
				origin.offsetY = offsetY;
				// console.log("aaaaaaaaaaaaaaaaaaaaaaaa1a/" + whitePaper.data.length + '/w:' + sizeWhitePaperWidth + '/h:' + sizeWhitePaperHeight); // + "/isGrascale:" + isGrascale)

				this.progress += progressUnit;
				this.pbp.update(this.progress, 'maege Replace origin to whitePaper' + pageStep);

				console.time('maege Replace origin to whitePaper' + pageStep);
				if (isGrayscale && !pageEntity.isForceColor)
					await this.imageMerger.margeReplace(
						whitePaper,
						[this.imageFilter.beGrascale(origin)],
						isBaseWhite,
						isOtherThread
					);
				else await this.imageMerger.margeReplace(whitePaper, [origin], isBaseWhite, isOtherThread);

				console.timeEnd('maege Replace origin to whitePaper' + pageStep);
				// console.log("aaaaaaaaaaaaaaaaaaaaaaaa2a/" + expandedPaper.data.length)
				this.progress += progressUnit;
				this.pbp.update(
					this.progress,
					(isLanczose ? 'expand resizeAsLanczos' : 'expand resizeAsByCubic') + pageStep
				);
				console.time((isLanczose ? 'expand resizeAsLanczos' : 'expand resizeAsByCubic') + pageStep);
				if (pageEntity.isNoCropping) {
					if (isLanczose) await this.imageResizer.resizeAsLanczos(whitePaper, cropedPaper, isOtherThread);
					else await this.imageResizer.resizeAsByCubic(whitePaper, cropedPaper, isOtherThread);
					//console.log("aaaaaaaaaaaaaaaaaaaaaaaa3a/" + cropedPaper.data.length)
					this.progress += progressUnit;
					this.pbp.update(this.progress, 'No crop!' + pageStep);
				} else {
					if (isLanczose) await this.imageResizer.resizeAsLanczos(whitePaper, expandedPaper, isOtherThread);
					else await this.imageResizer.resizeAsByCubic(whitePaper, expandedPaper, isOtherThread);
					// console.log("aaaaaaaaaaaaaaaaaaaaaaaa3a/" + cropedPaper.data.length)
					this.progress += progressUnit;
					this.pbp.update(this.progress, 'crop!' + pageStep);
					await this.imageCropper.corpImageToData(expandedPaper, cropedPaper, clopOffset);
					// console.log("aaaaaaaaaaaaaaaaaaaaaaaa3b/" + cropedPaper.data.length)
				}
				console.timeEnd((isLanczose ? 'expand resizeAsLanczos' : 'expand resizeAsByCubic') + pageStep);
				this.progress += progressUnit;
				this.pbp.update(this.progress, 'get ArrayBuffer From ImageBitmapData' + pageStep);

				//currentDataAb = this.ip.getArrayBufferFromImageBitmapData(cropedPaper);
				currentDataAb = cropedPaper.data.buffer;
				const plain = cropedPaper.data;
				//console.log(Zlib);
				//console.log("aaaaaaaaaaaaaaaaaaaaaaaa4a-/")
				//console.time('RawDeflate');
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
				this.progress += progressUnit;
				this.pbp.update(this.progress, 'save ArrayBuffer' + pageStep);
				const outputNew = await this.bm.save(outputOld, 'expandPage', currentDataAb, {
					width: cropedPaper.width,
					height: cropedPaper.height,
				});
				pageEntity.outputExpandImage = outputNew;
				this.progress += progressUnit;
				this.pbp.update(this.progress, 'save pageEntity' + pageStep);
				await this.em.Pages.save(pageEntity);
				//3 CropPage
				//4 saveImage
				//5 Save to page
				//break;
			} else {
				this.progress += progressUnit * stepNum;
				this.pbp.update(this.progress, 'save pageEntity' + pageStep);
			}
		}
	}
	async exoprtAsZip(pages) {
		console.time('exoprtAsZip');
		const zip = new Zlib.Zip({ compress: false });
		let pageNum = 0;
		let lastOne = null;
		for (const pageEntity of pages) {
			if (pageEntity && pageEntity.outputDualImage) {
				if (pageEntity.outputDualImage === lastOne) {
					pageEntity.outputDualImage = null;
					continue;
				}
				pageNum++;
				lastOne = pageEntity.outputDualImage;
				const outputBinaryEntity = await this.em.get(lastOne);
				//console.log("aaaaaaaaaaaaaaaaaaaaaaaa7a pageNum:" + pageNum + "/outputBinaryEntity:" + outputBinaryEntity + "/lastOne:" + lastOne);
				if (outputBinaryEntity) {
					const nextPageNo = pageNum * 2;
					const currentPageNo = nextPageNo - 1;
					zip.addFile(new Uint8Array(outputBinaryEntity._ab), {
						filename: UnicodeEncoder.stringToByteArray('page' + currentPageNo + '-' + nextPageNo + '.jpg'),
					});
					this.delList.push(lastOne);
				}
			}
		}
		//uncompress
		const result = zip.compress();
		console.timeEnd('exoprtAsZip');
		return result;
	}
	async exportDualImage4Print(targetSize, setting, pages, isSideSynced, isOdd, isPageDirectionR2L, isMaxSize10M) {
		//6 new WhiteImageCreate
		//7 load2PageImage
		//8 merge
		//9 save
		const cropedPaperDual = {
			data: new Uint8ClampedArray(targetSize.x * targetSize.y * 8),
			width: targetSize.x * 2,
			height: targetSize.y,
		};
		//console.log(setting);
		// const cratePageData = PreviewProcessor.getCratePageDataFunc();
		// const dummyClass = 'dummy';
		// const shapedList = PreviewProcessor.buildPageFrames(setting, pages, cratePageData, dummyClass);
		const pairPages = {
			right: null,
			left: null,
			rightBin: null,
			leftBin: null,
		};
		// let isSkeped = isSideSynced !== true;
		const printPages = [];
		const printPairs = [];
		let indexA = 0;
		console.time('exportDualImage4Print A1:');
		for (const page of pages) {
			if (indexA === 0 && isSideSynced) printPages.push(null);
			indexA++;
			// console.error(page);
			const data = {
				pageNo: indexA,
				isDummy: false,
				isRight: indexA % 2 > 0 && isSideSynced,
				binary: !page || page.baseImage === null ? null : page,
			};
			printPages.push(data);
		}
		console.timeEnd('exportDualImage4Print A1:');

		console.time('exportDualImage4Print A2:');
		for (let index = 0; index < printPages.length; index++) {
			const newPair = [null, null];
			newPair[0] = printPages[index];
			index++;
			if (index < printPages.length) newPair[1] = printPages[index];
			printPairs.push(newPair);
		}
		this.progress = 61;
		this.pbp.update(this.progress, 'start exportDualImage4Print');
		const pageNum = printPairs.length;
		let pageCount = 0;
		const stepNum = 9;
		const progressUnit = 20 / (stepNum * pageNum);
		console.timeEnd('exportDualImage4Print A2:');
		console.time('exportDualImage4Print A3:');
		for (const printPagePair of printPairs) {
			pageCount++;
			const pageStep = '[' + pageCount + '/' + pageNum + ']';
			this.progress += progressUnit;
			this.pbp.update(this.progress, 'exportDualImage4Print' + pageStep);
			// console.log("exportDualImage4Print　pageStep:" + pageStep + "/" + cropedPaperDual.data.length);
			// console.log(cropedPaperDual);
			await this.buildDualImage(
				targetSize,
				cropedPaperDual,
				pairPages,
				printPagePair,
				isPageDirectionR2L,
				isMaxSize10M,
				pageStep,
				progressUnit
			);
		}
		console.timeEnd('exportDualImage4Print A3:');
		// console.log(cropedPaperDual);
	}
	async buildDualImage(
		targetSize,
		cropedPaperDual,
		pairPages,
		shapedPagePair,
		isPageDirectionR2L,
		isMaxSize10M,
		pageStep,
		progressUnit
	) {
		console.time('exportDualImage4Print buildDualImageA3 pageStep:' + pageStep);
		//console.log(shapedPagePair);
		const one = shapedPagePair[0];
		const two = shapedPagePair[1];
		// reverse side!
		const right = isPageDirectionR2L ? one : two;
		const left = isPageDirectionR2L ? two : one;
		pairPages.right = right === null || right.isDummy ? null : right.binary;
		pairPages.left = left === null || left.isDummy ? null : left.binary;
		pairPages.rightBin = null;
		pairPages.leftBin = null;
		// console.log("aaaaaaaaaaaaaaaaaaaaaaaa6a shapedPagePair:" + shapedPagePair + "/left:" + pairPages.left + "/right:" + pairPages.right);

		let pageEntity = null;
		this.progress += progressUnit;
		this.pbp.update(this.progress, 'load pairPages.right' + pageStep);
		if (pairPages.right && pairPages.right.outputExpandImage) {
			// pairPages.rightBin = await this.em.get(pairPages.right.outputExpandImage);
			pairPages.rightBin = await this.loadBinaryWidCleanUp(pairPages.right.outputExpandImage);
			pageEntity = pairPages.right;
		}
		this.progress += progressUnit;
		this.pbp.update(this.progress, 'load pairPages.left' + pageStep);
		if (pairPages.left && pairPages.left.outputExpandImage) {
			// pairPages.leftBin = await this.em.get(pairPages.left.outputExpandImage);
			pairPages.leftBin = await this.loadBinaryWidCleanUp(pairPages.left.outputExpandImage);
			pageEntity = pairPages.left;
		}
		if (!pageEntity) {
			this.progress += progressUnit * 7;
			this.pbp.update(this.progress, 'load null' + pageStep);
			return;
		}
		this.imageMerger.beWhiteImage(cropedPaperDual, true);
		//console.log("aaaaaaaaaaaaaaaaaaaaaaaa6a left:" + pairPages.left + "/right:" + pairPages.right);
		this.progress += progressUnit;
		this.pbp.update(this.progress, 'set Left' + pageStep);
		if (pairPages.leftBin) {
			const data = pairPages.leftBin._ab;
			//	const data = await this.ip.getImageDataFromArrayBuffer(pairPages.leftBin._ab);
			const origin = {
				data: new Uint8Array(data),
				width: pairPages.leftBin.width,
				height: pairPages.leftBin.height,
			};
			origin.offsetX = 0;
			origin.offsetY = 0;
			// console.log("A pairPages.leftBin　pageStep:" + pageStep);
			// console.log(cropedPaperDual);
			// console.log(origin);
			await this.imageMerger.margeReplace(cropedPaperDual, [origin], false, isOtherThread);
			// console.log("pairPages.leftBin");
		}
		this.progress += progressUnit;
		this.pbp.update(this.progress, 'set right' + pageStep);
		if (pairPages.rightBin) {
			const data = pairPages.rightBin._ab;
			// const data = await this.ip.getImageDataFromArrayBuffer(pairPages.rightBin._ab);
			const origin = {
				data: new Uint8Array(data),
				width: pairPages.rightBin.width,
				height: pairPages.rightBin.height,
			};
			origin.offsetX = targetSize.x;
			origin.offsetY = 0;
			// console.log("B pairPages.rightBin　pageStep:" + pageStep);
			// console.log(cropedPaperDual);
			// console.log(origin);
			await this.imageMerger.margeReplace(cropedPaperDual, [origin], false, isOtherThread);
			// console.log("pairPages.rightBin");
		}
		//ping?
		this.progress += progressUnit;
		this.pbp.update(this.progress, 'convert to jepg' + pageStep);
		let cropedPaperDualAb = this.ip.getArrayBufferFromImageBitmapDataAsJpg(cropedPaperDual, 1.0);
		const size10MB = 10 * 1000 * 1000;
		const length = cropedPaperDualAb.byteLength;
		if (isMaxSize10M && size10MB < length) {
			const retio = size10MB / length;
			ropedPaperDualAb = this.ip.getArrayBufferFromImageBitmapDataAsJpg(cropedPaperDual, retio);
		}
		const outputOld = pageEntity.outputDualImage;
		this.progress += progressUnit;
		this.pbp.update(this.progress, 'save jepg binary' + pageStep);
		const outputNew = await this.bm.save(outputOld, 'expandDualPage', cropedPaperDualAb);
		this.progress += progressUnit;
		this.pbp.update(this.progress, 'save right and delete temp files' + pageStep);
		if (pairPages.right && pairPages.right.outputExpandImage) {
			pairPages.right.outputDualImage = outputNew;
			await this.em.Pages.save(pairPages.right);
			await this.em.delete(pairPages.rightBin);
		}
		this.progress += progressUnit;
		this.pbp.update(this.progress, 'save left and delete temp files' + pageStep);
		if (pairPages.left && pairPages.left.outputExpandImage) {
			pairPages.left.outputDualImage = outputNew;
			await this.em.Pages.save(pairPages.left);
			await this.em.delete(pairPages.leftBin);
		}
		console.timeEnd('exportDualImage4Print buildDualImageA3 pageStep:' + pageStep);
	}
	async loadBinaryWidCleanUp(pk) {
		const binaryEntity = await this.em.get(pk);
		this.delList.push(pk);
		return binaryEntity;
	}
	async delOnList() {
		for (const pk of this.delList) {
			const outputNew = await this.bm.save(pk, 'expandPage', new Uint8Array(1).buffer, { width: 1, height: 1 });
			await this.bm.remove(pk);
		}
	}
}
