export class ByteUtil {
	static trimByte(byteX) {
		const x = Math.floor(byteX);
		const maxByte = x > 255 ? 255 : x;
		const minByte = maxByte < 0 ? 0 : maxByte;
		return minByte;
	}
}
