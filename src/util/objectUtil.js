export class ObjectUtil {
  static deepClone(obj) {
    const channel = new MessageChannel();
    const inPort = channel.port1;
    const outPort = channel.port2;

    return new Promise(resolve => {
      inPort.onmessage = data => {
        resolve(data.data);
      }
      outPort.postMessage(obj);
    });
  }
  static simpleDeepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  static singleDeepClone(obj) {
    const retObj = {};
    for(let key in obj){
      let value = obj[key];
      retObj[key] = value;
    }
    return retObj;
  }
  static singleDeepCloneWithoutFuncs(obj) {
    const retObj = {};
    for(let key in obj){
      let value = obj[key];
      if(typeof value === 'function'){
        continue;
      }
      retObj[key] = value;
    }
    return retObj;
  }
}
