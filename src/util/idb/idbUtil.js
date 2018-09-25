export class IdbUtil {
	static currentTables(table, tabels) {
		return tabels ? tabels : [table];
	}
	// static async getTransaction(db,tables,mode,reject,reject){
	//   let transaction = db.transaction(tables, mode);
	//   transaction.oncomplete = (event) => {
	//     db.close();
	//     resolve();
	//   };
	//   transaction.onerror = (event) => {
	//     db.close();
	//     reject();
	//   };
	// }

	//private
	static isMutch(value, condetions) {
		if (condetions === undefined || condetions === null) {
			return false;
		}
		if (Array.isArray(condetions)) {
			for (let condition of condetions) {
				if (IdbUtil.isMutch(value, condition)) {
					return true;
				}
			}
			return false;
		} else {
			for (let key in condetions) {
				let condition = condetions[key];
				if (typeof condition === 'object') {
					if (IdbUtil.isMutch(value, condition)) {
						return true;
					}
				} else {
					let target = value[key];
					if (target !== condition) {
						return false;
					}
				}
			}
			return true;
		}
	};
	static makeKeyRange(start, end, isNotEqualStart, isNotEqualEnd) {
		return (isNotEqualStart === undefined && isNotEqualEnd === undefined) ?
			IDBKeyRange.bound(start, end, false, false) :
			IDBKeyRange.bound(start, end, isNotEqualStart, isNotEqualEnd);
	}
	static makeKeyRangeUpper(start, isNotEqualStart) {
		return (isNotEqualStart !== true) ?
			IDBKeyRange.upperBound(start) :
			IDBKeyRange.upperBound(start, isNotEqualStart);
	}
	static makeKeyRangeLower(end, isNotEqualEnd) {
		return (isNotEqualStart !== true) ?
			KeyRange.lowerBound(end) :
			IDBKeyRange.lowerBound(end, isNotEqualEnd);
	}
	static makeKeyRangeOnly(only) {
		return (isNotEqualStart !== true) ?
			IDBKeyRange.only(only) :
			IDBKeyRange.lowerBound(end, isNotEqualEnd);
	}
	//IDを生成
	static buildKeyPath(key1, key2, key3, key4, key5) {
		let array = [];
		if (key1 !== undefined) {
			array.push((key1 + "")
				.split("&")
				.join("&amp;")
				.split(".")
				.join("&#046;"));
		}
		if (key2 !== undefined) {
			array.push((key2 + "")
				.split("&")
				.join("&amp;")
				.split(".")
				.join("&#046;"));
		}
		if (key3 !== undefined) {
			array.push((key3 + "")
				.split("&")
				.join("&amp;")
				.split(".")
				.join("&#046;"));
		}
		if (key4 !== undefined) {
			array.push((key4 + "")
				.split("&")
				.join("&amp;")
				.split(".")
				.join("&#046;"));
		}
		if (key5 !== undefined) {
			array.push((key5 + "")
				.split("&")
				.join("&amp;")
				.split(".")
				.join("&#046;"));
		}
		return array.join("");
	};
}