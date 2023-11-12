const inch = 25.4;
const dpi = 72;
const aPoint = inch / dpi;
export class UnitUtil {
	constructor() {}
	static convertMmToPoint(mm) {
		return Math.floor(mm * aPoint);
	}
	static convertMmToPointArray(mmArray) {
		const retArray = [];
		for (const mm of mmArray) {
			retArray.push(UnitUtil.convertMmToPoint(mm));
		}
		return retArray;
	}
}
