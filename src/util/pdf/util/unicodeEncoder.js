export class UnicodeEncoder {
	static surrogatePairToCodePoint(charCode1, charCode2) {
		return ((charCode1 & 0x3ff) << 10) + (charCode2 & 0x3ff) + 0x10000;
	}

	static stringToCodePointArray(str) {
		const codePoints = [];
		if (!str) {
			return codePoints;
		}
		const len = str.length;
		for (let i = 0; i < len; i++) {
			const charCode = str.charCodeAt(i);
			if ((charCode & 0xf800) === 0xd800) {
				codePoints.push(UnicodeEncoder.surrogatePairToCodePoint(charCode, str.charCodeAt(++i)));
			} else {
				codePoints.push(charCode);
			}
		}
		// console.log(codePoints)
		return codePoints;
	}

	static codePointArrayToString(codePoints) {
		let stringParts = '';
		const len = codePoints.length;
		for (let i = 0; i < len; ++i) {
			let codePointCharCodes = null;
			const codePoint = codePoints[i];
			if (codePoint > 0xffff) {
				const offset = codePoint - 0x10000;
				codePointCharCodes = [0xd800 + (offset >> 10), 0xdc00 + (offset & 0x3ff)];
			} else {
				codePointCharCodes = [codePoint];
			}
			stringParts += String.fromCharCode.apply(String, codePointCharCodes);
		}
		return stringParts;
	}
	static encodeUTF8(str) {
		const codes = UnicodeEncoder.stringToCodePointArray(str);
		const len = codes.length;
		const array = [];
		for (let i = 0; i < len; i++) {
			const c = codes[i];
			if (c <= 0x7f) {
				//1byte
				array.push(c);
			} else if (c <= 0x7ff) {
				//2byte
				array.push(0xc0 | (c >>> 6), 0x80 | (c & 0xbf));
			} else if (c <= 0xffff) {
				//3byte
				array.push(0xe0 | (c >>> 12), 0x80 | ((c >>> 6) & 0xbf), 0x80 | (c & 0xbf));
			} else if (c <= 0x1ffff) {
				//4byte
				array.push(0xf0 | (c >>> 18), 0x80 | ((c >>> 12) & 0xbf), 0x80 | ((c >>> 6) & 0xbf), 0x80 | (c & 0xbf));
			}
		}
		return new Uint8Array(array);
	}
	static encodeUTF16(str, endian) {
		const codes = UnicodeEncoder.stringToCodePointArray(str);
		const len = codes.length;
		const array = endian ? (endian === 'LE' ? [0xff, 0xfe] : [0xfe, 0xff]) : []; //BOM
		for (let i = 0; i < len; i++) {
			const c = codes[i];
			if (endian === 'LE') {
				array.push(c & 0xff, (c >>> 8) & 0xff);
			} else {
				array.push((c >>> 8) & 0xff, c & 0xff);
			}
		}
		return new Uint8Array(array);
	}
	decodeUTF8(array) {
		let str = '';
		const len = array.length;
		for (let i = 0; i < len; i++) {
			const c = array[i];
			if (c <= 0x7f) {
				str += String.fromCharCode(c);
			} else if (c <= 0xdf && c >= 0xc2) {
				str += String.fromCharCode(((c & 31) << 6) | (array[++i] & 63));
			} else if (c <= 0xef && c >= 0xe0) {
				str += String.fromCharCode(((c & 15) << 12) | ((array[++i] & 63) << 6) | (array[++i] & 63));
			} else if (c <= 0xf7 && c >= 0xf0) {
				//utf8   11110uuu  10uuxxxx  10xxxxxx  10xxxxxx
				//utf16  110110wwwwxxxxxx  110111xxxxxxxxxx (wwww = uuuuu-1)
				str += String.fromCharCode(
					0xd800 | ((((c & 7) << 8) | ((array[++i] & 63) << 2) | ((array[++i] >>> 4) & 3)) - 64),
					0xdc00 | ((array[i++] & 15) << 6) | (array[i] & 63)
				);
			} else {
				str += String.fromCharCode(0xfffd);
			}
		}
		return str;
	}
	decodeUTF16(array) {
		let endian = 'BE';
		let i = 0;
		const len = array.length;
		let str = '';
		if (array[0] * array[1] === 0xff * 0xfe) {
			// remove BOM
			endian = array[0] === 0xff ? 'LE' : 'BE';
			i = 2;
		}
		for (; i < len; i += 2) {
			str += String.fromCharCode(
				endian === 'LE' ? (array[i + 1] << 8) | array[i] : (array[i] << 8) | array[i + 1]
			);
		}
		return str;
	}
	static stringToByteArray(str) {
		const len = str.length;
		const array = new Uint8Array(len);

		for (let i = 0; i < len; i++) {
			array[i] = str.charCodeAt(i) & 0xff;
		}
		return array;
	}
}
