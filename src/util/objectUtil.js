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
  static deepVnodeClone(target) {
    if(!target){
      return target;
    }
    const obj = {
      sel: target.sel,
      data: ObjectUtil.simpleDeepClone(target.data),
      children: undefined,
      text: target.text,
      elm: target.elm,
      key: target.key
    };
    for(let key in target.data){
      if (target.data[key]) {
        obj.data[key] = target.data[key];
      }
    }
    if (target.children && target.children.length > 0) {
      obj.children = [];
      for (let childTarget of target.children) {
        obj.children.push(ObjectUtil.deepVnodeClone(childTarget));
      }
    }
    return obj;
  }
}
