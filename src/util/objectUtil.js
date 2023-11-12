const baseClasses = [];
export class ObjectUtil {
	static addBaseCLassese(baseClassesList) {
		if (baseClassesList) {
			if (Array.isArray(baseClassesList)) {
				for (const baseClass of baseClassesList) {
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

		return new Promise((resolve) => {
			inPort.onmessage = (data) => {
				resolve(data.data);
			};
			outPort.postMessage(obj);
		});
	}
	static simpleDeepCloneSerialized(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	static simpleDeepClone(obj, newObj, count = 0) {
		const newCount = count + 1;
		const output = newObj ? newObj : Array.isArray(obj) ? [] : {};
		if (newCount > 10) {
			console.log(obj);
			console.log(newCount);
			return output;
		}
		for (const key in obj) {
			const value = obj[key];
			if (value && typeof value === 'object' && !value.byteLength) {
				let baseType = null;
				for (const baseClass of baseClasses) {
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
		for (const key in obj) {
			let value = obj[key];
			retObj[key] = value;
		}
		return retObj;
	}
	static singleDeepCloneWithoutFuncs(obj) {
		const retObj = {};
		for (const key in obj) {
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
			key: target.key,
		};
		for (const key in target.data) {
			if (target.data[key]) {
				obj.data[key] = target.data[key];
			}
		}
		if (target.children && target.children.length > 0) {
			obj.children = [];
			for (const childTarget of target.children) {
				obj.children.push(ObjectUtil.deepVnodeClone(childTarget));
			}
		}
		return obj;
	}

	static async recalcSize(em, value, indexSize = 0, delimiterSize = 0, counter) {
		let size = 0;
		// console.warn(indexSize)
		if (!value) {
			return 1;
		} else if (value.byteLength && value.byteLength > 0) {
			const valuseSize = value.byteLength;
			// console.log("====ABvaluseSize:" + valuseSize);
			size += indexSize + valuseSize + 1 + delimiterSize;
		} else if (typeof value === 'function') {
			continu;
		} else if (typeof value === 'number') {
			size += indexSize + 4 + 1 + delimiterSize;
		} else if (typeof value === 'string') {
			const valuseSize = value.length * 1;
			size += indexSize * 1 + valuseSize + 1 + delimiterSize * 1;
			// console.log("====string:valuseSize:" + valuseSize + "/indexSize:"+indexSize+ "/delimiterSize:"+delimiterSize+"/size:" + size+"/value:"+value+"/"+(typeof valuseSize) );
		} else if (typeof value === 'object' && Array.isArray(value)) {
			let tempDerimiterSie = 0;
			size += 2 + delimiterSize;
			for (const i in value) {
				const arrayValue = value[i];
				const itemSize = await ObjectUtil.recalcSize(em, arrayValue, 0, 0, counter);
				// console.log("====arrayValue:" + arrayValue + "/size:" + size + "/itemSize:" + itemSize);
				size += itemSize + tempDerimiterSie;
				tempDerimiterSie = 1;
			}
			size += indexSize + 1 + delimiterSize;
		} else if (typeof value === 'object') {
			const itemSize = await ObjectUtil.calcSize(em, value, counter);
			// console.log("====itemSize:" + itemSize + "/size:" + size);
			size += indexSize + itemSize + 1 + delimiterSize;
		}
		// console.log("====value:" + value + "/size:" + size);
		return size * 1;
	}
	static async calcSize(
		em,
		target,
		counter = {
			size: 0,
		}
	) {
		if (!target) {
			return 1;
		}
		let delimiterSize = 0;
		for (const index in target) {
			const value = target[index];
			if (index === 'pk' && value.indexOf('Binary-') === 0) {
				// console.log("====Binary:" + index);
				const indexSize = (index + '').length * 1;
				const binaryData = await em.get(value);
				counter.size += await ObjectUtil.recalcSize(em, binaryData, indexSize, delimiterSize, counter);
				continue;
			}
			const indexSize = (index + '').length * 1;
			counter.size += await ObjectUtil.recalcSize(em, value, indexSize, delimiterSize, counter);
			delimiterSize = 1;
			// console.log("====index:" + index + "/size:" + counter.size);
		}
		// console.log("====counter.size:" + counter.size);
		return counter.size * 1;
	}
}
