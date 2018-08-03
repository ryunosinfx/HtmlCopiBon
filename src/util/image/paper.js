export class Paper {
  constructor() {
    //
    paparSize = {

    }
  }
  getPixcelSize(dpi, mmWidth, mmHeight) {
    const mpi = dpi / 2.54;
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
