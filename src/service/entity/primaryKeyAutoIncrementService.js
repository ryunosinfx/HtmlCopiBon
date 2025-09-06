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
		// console.log('PrimaryKeyAutoIncrementService A acquirePKNo targetObj', targetObj);
		await this.ss.init(userid, targetObj);
		// const entityName = targetObj.getEntityName();
		// let currentObjectStore = await this.ss.createStoreByName(userid + '_' + PK_INCREMENT_STORE, userid);
		let record = await this.ss.getRow(rowKey);
		// console.log('PrimaryKeyAutoIncrementService B acquirePKNo rowKey:' + rowKey + '/record:', record);
		if (!record) {
			record = {
				data: this.countUpUint32(record ? record.data : 0),
			};
		}
		let { data, keyPath } = await this.ss.save(rowKey, record);
		data = this.countUpUint32(record.data);
		// console.log('PrimaryKeyAutoIncrementService C acquirePKNo rowKey:' + rowKey + '/data:', data);
		return BinaryCnvtr.a2B(data);
	}
	countUpUint32(arrayBuffer) {
		const currentCount = arrayBuffer ? (arrayBuffer.data ? arrayBuffer.data : arrayBuffer) : new ArrayBuffer(4);
		//alert(JSON.stringify(currentCount));
		const dataview = new DataView(currentCount);
		let count = dataview.getUint32(0) | 0; // 0
		// console.log('PrimaryKeyAutoIncrementService A countUpUint32 arrayBuffer:' + arrayBuffer + '/count:', count);
		count++;
		dataview.setInt32(0, count >>> 0);
		// console.log('PrimaryKeyAutoIncrementService B countUpUint32 arrayBuffer:' + arrayBuffer + '/count:', count);
		return dataview.buffer;
	}
}
