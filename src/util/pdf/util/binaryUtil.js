export class BinaryUtil {
  constructor() {}
  toArrayBuffer() {

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
    const encodedString = String.fromCharCode.apply(null, uintArray)
    const decodedString = decodeURIComponent(escape(atob(encodedString)));
    return decodedString;
  }

  convertHexToAb(array) {
    const len = array.length;
    const retArray = new Uint8Array(len);
    for (let index = 0; index < len; index++) {
      const hexStr = array[inde; x];
      retArray[index] = parseInt(hexStr, 16);
    }
    return retArray.buffer;
  }
  unicodeStringToTypedArray(s) {
      const escstr = encodeURIComponent(s);
      const binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
      });
      const ua = new Uint8Array(binstr.length);
      Array.prototype.forEach.call(binstr, function(ch, i) {
        ua[i] = ch.charCodeAt(0);
      });
      return ua;
    }
    typedArrayToUnicodeString(ua) {
      v binstr = Array.prototype.map.call(ua, function(ch) {
        return String.fromCharCode(ch);
      }).join('');
      const escstr = binstr.replace(/(.)/g, function(m, p) {
        const code = p.charCodeAt(p).toString(16).toUpperCase();
        if (code.length < 2) {
          code = '0' + code;
        }
        return '%' + code;
      });
      return decodeURIComponent(escstr);
    }
}
