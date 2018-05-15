export default class BiaryConverter {
  static binaryString2ArrayBuffer(binaryString) {
    return BiaryConverter.binaryString2Uint8Array(binaryString).buffer;
  }
  static arrayBuffer2BinaryString(buffer) {
    return BiaryConverter.uint8Array2BinaryString(new Uint8Array(buffer));
  }
  static arrayBuffer2base64(buffer) {
    return btoa(BiaryConverter.uint8Array2BinaryString(new Uint8Array(buffer)));
  }
  static arrayBuffer2DataURI(buffer, type = "application/octet-stream") {
    const base64 = btoa(BiaryConverter.arrayBuffer2BinaryString(buffer));
    return "data:" + type + ";base64," + base64;
  }

  static binaryString2Uint8Array(binaryString) {
    const list = binaryString.split("");
    const rawLength = binaryString.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
      array[i] = binaryString.charCodeAt(i);
    }
    return array;
  }

  static uint8Array2BinaryString(u8a) {
    let retList = [];
    for (let e of u8a) {
      retList.push(String.fromCharCode(e));
    }
    return retList.join("");
  }

  static binaryString2DataURI(binaryString, type = "application/octet-stream") {
    return "data:" + type + ";base64," + btoa(binaryString);
  }
  static base642DataURI(base64, type = "application/octet-stream") {
    return "data:" + type + ";base64," + base64;
  }
  static base642binaryString(base64) {
    return atob(base64);
  }
  static base642ArrayBuffer(base64) {
    return BiaryConverter.binaryString2ArrayBuffer(atob(base64));
  }

  static dataURI2binaryString(dataURI) {
    return atob(dataURI.split(",")[1]);
  }

  static uintArray2ArrayBuffer(uintArray) {
    return uintArray.buffer;
  }

  static arrayBuffer2Uint8Array(arrayBuffer) {
    return new Uint8Array(arrayBuffer);
  }

  static arrayBuffer2Uint16Array(arrayBuffer) {
    return new Uint16Array(arrayBuffer);
  }
  static arrayBuffer2Uint32Array(arrayBuffer) {
    return new Uint32Array(arrayBuffer)
  }

  static ArrayBuffer2Blob(val, type = "application/octet-stream") {
    return new Blob([val], {type: type});
  }
  static readBlob(blob) {
    const reader = new FileReader();
    const promise = new Promise((resolve, reject) => {
      reader.onload = eve => {
        resolve(reader.result);
      }
      reader.onerror = eve => {
        reject(reader.error);
      }
    })

    return {
      asArrayBuffer() {
        reader.readAsArrayBuffer(blob);
        return promise;
      },
      asBinaryString() {
        reader.readAsBinaryString(blob);
        return promise;
      },
      asDataURL() {
        reader.readAsDataURL(blob);
        return promise;
      },
      asText() {
        reader.readAsText(blob);
        return promise;
      }
    }
  }
}
