import { dpis, printMargin, paperSizeSet, basePaper } from '../../settings/exportSettings.js';
export class Paper {
	constructor() {
		//
		this.paparSize = {};
	}
	calcClopOffsetPixcel(basePaperSet, dpi) {
		const cropSizeMm = this.calcClopOffsetMm(basePaperSet);
		//const size = this.getTargetPaperSizeMm(basePaperSet);
		const offset = {
			x: this.calcPixcel(dpi, cropSizeMm.x) * -1,
			y: this.calcPixcel(dpi, cropSizeMm.y) * -1,
		};
		// console.log("calcClopOffsetPixce:l"+JSON.stringify(offset)+"/"+dpi);
		return offset;
	}
	calcClopOffsetMm(basePaperSet) {
		const targetPaper = basePaper[basePaperSet];
		const offset = {
			x: 0,
			y: 0,
		};
		if (!targetPaper || targetPaper.target === 'same') {
			//
			return offset;
		}
		const targetSize = this.getPaperSizeMm(targetPaper.target);
		const frameSize = this.getPaperSizeMm(targetPaper.frame);
		const targetX = targetSize.x * targetPaper.multiple;
		const targetY = targetSize.y * targetPaper.multiple;
		offset.x = (frameSize.x - targetX) / 2;
		offset.y = (frameSize.y - targetY) / 2;
		return offset;
	}
	getTargetPaperSizeMm(basePaperSet) {
		const size = {
			x: 0,
			y: 0,
		};
		if (!basePaperSet) {
			//
			return size;
		}
		const targetSize = this.getPaperSizeMm(basePaperSet);
		return targetSize;
	}
	getTargetPaperSize(basePaperSet, dpiName) {
		const targetPaper = basePaper[basePaperSet];
		const size = {
			x: 0,
			y: 0,
		};
		if (!targetPaper || targetPaper.target === 'same') {
			//
			return size;
		}
		const targetSize = this.getTargetPaperSizeMm(targetPaper.target);
		const dpi = this.getDpi(dpiName);
		size.x = this.calcPixcel(targetSize.x, dpi);
		size.y = this.calcPixcel(targetSize.y, dpi);
		return size;
	}
	calcPixcel(dpi, mm) {
		return Math.floor((mm * dpi) / 25.4);
	}

	calcDpi(pixcel, mm) {
		return (pixcel / mm) * 25.4;
	}
	getPaperFrameSizeMm(basePaperSet) {
		const targetPaper = basePaper[basePaperSet];
		return paperSizeSet[targetPaper.frame];
	}
	getTragetPaper(basePaperSet) {
		const targetPaper = basePaper[basePaperSet];
		return targetPaper.target;
	}
	getPaperSizeMm(paperSize) {
		return paperSizeSet[paperSize];
	}
	getPrintMargin(marginSetting) {
		return printMargin[marginSetting];
	}
	getDpi(dpiName) {
		return dpis[dpiName];
	}
	getOffset(dpiName, marginSetting) {
		const margin = this.getPrintMargin(marginSetting);
		const dpi = this.getDpi(dpiName);
		const mpi = dpi / 25.4;
		return Math.floor(mpi * margin);
	}
	getPixcelSizeBySelected(paperSize, dpiName, marginSetting = 'none') {
		const size = this.getPaperSizeMm(paperSize);
		const margin = this.getPrintMargin(marginSetting);
		const dpi = this.getDpi(dpiName);
		return this.getPixcelSizeWithMargin(dpi, size.x, size.y, margin);
	}
	getPixcelSize(dpi, mmWidth, mmHeight) {
		const mpi = dpi / 25.4;
		return {
			width: Math.floor(mpi * mmWidth),
			height: Math.floor(mpi * mmHeight),
		};
	}
	getPixcelSizeWithMargin(dpi, mmWidth, mmHeight, mmMargin) {
		const mmMarginDual = mmMargin * 2;
		return this.getPixcelSize(dpi, mmWidth - mmMarginDual, mmHeight - mmMarginDual);
	}
}
