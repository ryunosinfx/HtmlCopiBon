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
    const newCount = count + 1;
    const output = newObj ?
      newObj :
      Array.isArray(obj) ?
      [] :
      {};
    if (newCount > 10) {
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
        output[key] = ObjectUtil.simpleDeepClone(value, baseType, newCount);
      } else {
        try {
          output[key] = value;
        } catch (e) {
          console.error(e);
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

  static recalcSize(value, indexSize = 0, delimiterSize = 0) {
    let size = 0;

    if (!value) {
      return 1;
    } else if (value.byteLength && value.byteLength > 0) {
      const valuseSize = value.byteLength;
      size += (indexSize + valuseSize + 1 + delimiterSize)
    } else if (typeof value === "function") {
      continu;
    } else if (typeof value === "number") {
      size += (indexSize + 4 + 1 + delimiterSize)
    } else if (typeof value === "string") {
      const valuseSize = value.length;
      size += (indexSize + valuseSize + 1 + delimiterSize)
    } else if (typeof value === "object" && Array.isArray(value)) {
      let tempDerimiterSie = 0
      size += 2 + delimiterSize;
      for (let i in value) {
        const arrayValue = value[i];
        const itemSize = ObjectUtil.recalcSize(arrayValue);
        size += itemSize + tempDerimiterSie;
        tempDerimiterSie = 1;
      }
      size += (indexSize + 1 + delimiterSize)
    } else if (typeof value === "object") {
      const itemSize = ObjectUtil.calcSize(value);
        size += (indexSize + itemSize + 1 + delimiterSize)
    }
    return size;

  }
  static calcSize(target) {
    if (!target) {
      return 1;
    }
    let size = 0;
    let delimiterSize = 0;
    for (let index in target) {
      const indexSize = (index + "").length;
      const value = target[index];
      size += ObjectUtil.recalcSize(value, indexSize, delimiterSize)
      delimiterSize = 1;
    }
    return size;
  }
}
