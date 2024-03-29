export class BinaryUtil {
	constructor() {}
	toArrayBuffer() {}
	static joinU8as(u8as) {
		let len = 0;
		let index = 0;
		const u8aEdge = [];
		for (const u8a of u8as) {
			const start = len;
			len += u8a.byteLength;
			const end = len;
			u8aEdge.push({
				start,
				end,
			});
		}
		// console.log("joinU8as.len:" + len);
		const retU8a = new Uint8Array(len);
		for (const u8a of u8as) {
			const edge = u8aEdge[index];
			const start = edge.start;
			const end = edge.end;
			for (let i = start; i < end; i++) {
				retU8a[i] = u8a[i - start];
			}
			index++;
		}
		return retU8a;
	}
	static hexString2U8a(hexStr) {
		const retArrray = [];
		const hexList = hexStr.split(',');
		// console.log("BinaryUtil.hexString2U8a hexStr:" + hexStr + " /len:" + hexList.length)
		// console.log(hexList)
		for (const hex of hexList) {
			if (hex && !Number.isNaN(parseInt(hex, 16))) {
				retArrray.push(parseInt(hex, 16));
			}
		}
		return new Uint8Array(retArrray);
	}
	static convertDataUri2U8a(dataUri) {
		const dataUriParts = dataUri.split(',');
		const base64 = dataUriParts[1];
		const binStr = atob(base64);
		const binLen = binStr.length;
		const u8a = new Uint8Array(new ArrayBuffer(binLen));
		for (let i = 0; i < binLen; i++) {
			u8a[i] = binStr.charCodeAt(i);
		}
		return u8a;
	}
	convertStr2Ab(str) {
		const string = btoa(unescape(encodeURIComponent(str)));
		const charList = string.split('');
		const len = charList.length;
		const ua = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			ua[i] = charList[i].charCodeAt(0);
		}
		return ua.buffer;
	}
	uintToString(ab) {
		const ua = new Uint8Array(ab);
		for (let i = 0; i < len; i++) {
			ua[i] = charList[i].charCodeAt(0);
		}
		const encodedString = String.fromCharCode.apply(null, uintArray);
		const decodedString = decodeURIComponent(escape(atob(encodedString)));
		return decodedString;
	}

	convertHexToAb(array) {
		const len = array.length;
		const retArray = new Uint8Array(len);
		for (let index = 0; index < len; index++) {
			const hexStr = array[index];
			retArray[index] = parseInt(hexStr, 16);
		}
		return retArray.buffer;
	}
	unicodeStringToTypedArray(s) {
		const escstr = encodeURIComponent(s);
		const binstr = escstr.replace(/%([0-9A-F]{2})/g, function (match, p1) {
			return String.fromCharCode('0x' + p1);
		});
		const ua = new Uint8Array(binstr.length);
		Array.prototype.forEach.call(binstr, function (ch, i) {
			ua[i] = ch.charCodeAt(0);
		});
		return ua;
	}
	typedArrayToUnicodeString(ua) {
		const binstr = Array.prototype.map
			.call(ua, function (ch) {
				return String.fromCharCode(ch);
			})
			.join('');
		const escstr = binstr.replace(/(.)/g, function (m, p) {
			const code = p.charCodeAt(p).toString(16).toUpperCase();
			if (code.length < 2) {
				code = '0' + code;
			}
			return '%' + code;
		});
		return decodeURIComponent(escstr);
	}
}
