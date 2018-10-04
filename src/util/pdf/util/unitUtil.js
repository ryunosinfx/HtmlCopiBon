const inch = 25.4;
const dpi = 72;
const aPoint = inch/dpi;
export class UnitUtil {
  constructor() {}
  convertMmToPoint(mm) {
    return Math.floor(mm*apoint);
  }
  conertMmToPointArray(mmArray){
    const retArray = [];
    for(let mm of mmArray){
      retArray.push(UnitUtil.convertMmToPoint(mm));
    }
    return retArray;
  }
}
