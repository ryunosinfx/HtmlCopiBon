import {dpis, printMargin, paperSizeSet, basePaper} from "../../settings/exportSettings";
export class Paper {
  constructor() {
    //
    this.paparSize = {}
  }

  calcClopOffset(basePaperSet){
    const targetPaper = basePaper[basePaperSet];

    const offset = {x:0,y:0};
    if(!targetPaper){
      return offset;
    }
    return offset;
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
  getOffset(dpiName,marginSetting){
    const margin = this.getPrintMargin(marginSetting);
    const dpi = this.getDpi(dpiName);
    const mpi = dpi / 25.4;
    return Math.floor(mpi * margin);
  }
  getPixcelSizeBySelected(paperSize, dpiName, marginSetting = "none") {
    const size = this.getPaperSizeMm(paperSize);
    const margin = this.getPrintMargin(marginSetting);
    const dpi = this.getDpi(dpiName);
    return this.getPixcelSizeWithMargin(dpi, size.x, size.y, margin);
  }
  getPixcelSize(dpi, mmWidth, mmHeight) {
    const mpi = dpi / 25.4;
    return {
      width: Math.floor(mpi * mmWidth),
      height: Math.floor(mpi * mmHeight)
    }
  }
  getPixcelSizeWithMargin(dpi, mmWidth, mmHeight, mmMargin) {
    const mmMarginDual = mmMargin * 2;
    return this.getPixcelSize(dpi, mmWidth - mmMarginDual, mmHeight - mmMarginDual)
  }
}
