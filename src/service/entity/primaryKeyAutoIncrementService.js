import { BinaryCnvtr } from '../../util/binaryConverter.js';
import { StorageService } from './storageService.js';
const USER_ID = 'default';
const PK_INCREMENT_STORE = 'pk_increment';
const PK_ROW = 'pk_row';
export class PrimaryKeyAutoIncrementService {
	constructor(userid) {
		this.ss = new StorageService(userid + '_' + PK_INCREMENT_STORE);
	}
	async acquirePKNo(userid = USER_ID, targetObj, rowKey = PK_ROW) {
		console.log('acquirePKNo targetObj', targetObj);
		await this.ss.init(userid, targetObj);
		// const entityName = targetObj.getEntityName();
		// let currentObjectStore = await this.ss.createStoreByName(userid + '_' + PK_INCREMENT_STORE, userid);
		let record = await this.ss.get(rowKey);
		let nextCountAB = this.countUpUint32(record ? record.data : 0);
		if (!record) {
			record = {
				data: nextCountAB,
			};
		}
		let { data, keyPath } = await this.ss.save(rowKey, record, (result, record) => {
			let nextCountAB = this.countUpUint32(record.data);
			result.data = nextCountAB;
		});
		return BinaryCnvtr.a2B(data);
	}
	countUpUint32(arrayBuffer) {
		let currentCount = arrayBuffer;
		if (!currentCount) {
			currentCount = new ArrayBuffer(4);
		}
		if (currentCount.data) {
			currentCount = currentCount.data;
		} else {
		}
		//alert(JSON.stringify(currentCount));
		let dataview = new DataView(currentCount);
		let count = dataview.getUint32(0) | 0; // 0
		count++;
		dataview.setInt32(0, count >>> 0);
		return dataview.buffer;
	}
}
