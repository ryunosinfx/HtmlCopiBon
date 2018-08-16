export class UnicodeEncoder {
  static surrogatePairToCodePoint(charCode1, charCode2) {
    return ((charCode1 & 0x3FF) << 10) + (charCode2 & 0x3FF) + 0x10000;
  }

  static stringToCodePointArray(str) {
    const codePoints = [];
    const len = str.length;
    for (let i = 0; i < len; i++) {
      const charCode = str.charCodeAt(i);
      if ((charCode & 0xF800) == 0xD800) {
        codePoints.push(UnicodeEncoder.surrogatePairToCodePoint(charCode, str.charCodeAt(++i)));
      } else {
        codePoints.push(charCode);
      }
    }
    return codePoints;
  }

  static codePointArrayToString(codePoints) {
    let stringParts = "";
    const len = codePoints.length
    for (let i = 0; i < len; ++i) {
      let codePointCharCodes = null;
      const codePoint = codePoints[i];
      if (codePoint > 0xFFFF) {
        const offset = codePoint - 0x10000;
        codePointCharCodes = [
          0xD800 + (offset >> 10),
          0xDC00 + (offset & 0x3FF)
        ];
      } else {
        codePointCharCodes = [codePoint];
      }
      stringParts += (String.fromCharCode.apply(String, codePointCharCodes));
    }
    return stringParts;
  }
}
