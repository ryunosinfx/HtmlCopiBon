const baseClasses = [];
export class ObjectUtil {
  static addBaseCLassese(baseClassesList) {
    if (baseClassesList) {
      if (Array.isArray(baseClassesList)) {
        for (let baseClass of baseClassesList) {
          baseClasses.push(baseClass);
        }
      } else {
        baseClasses.push(baseClassesList);
      }
    }
  }
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
  static simpleDeepCloneSerialized(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  static simpleDeepClone(obj, newObj, count = 0) {
    const newCount = count+1;
    const output = newObj
      ? newObj
      : Array.isArray(obj)
        ? []
        : {};
    if(newCount>10){
      console.log(obj);
      console.log(newCount);
      return output;
    }
    for (let key in obj) {
      const value = obj[key];
      if (value && typeof value === "object" && !value.byteLength) {
        let baseType = null;
        for (let baseClass of baseClasses) {
          if (value instanceof baseClass) {
            baseType = new baseClass();
            break;
          }
        }
        output[key] = ObjectUtil.simpleDeepClone(value, baseType,newCount);
      } else {
        try {
          output[key] = value;
        } catch (e) {
          console.log(e);
          console.log(output);
          throw e;
        }
      }
    }
    return output;
  }
  static singleDeepClone(obj) {
    const retObj = {};
    for (let key in obj) {
      let value = obj[key];
      retObj[key] = value;
    }
    return retObj;
  }
  static singleDeepCloneWithoutFuncs(obj) {
    const retObj = {};
    for (let key in obj) {
      let value = obj[key];
      if (typeof value === 'function') {
        continue;
      }
      retObj[key] = value;
    }
    return retObj;
  }
  static deepVnodeClone(target) {
    if (!target) {
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
    for (let key in target.data) {
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
