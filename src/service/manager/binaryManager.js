import { Binary } from '../entity/binary.js';
import { PrimaryKey } from '../entity/primaryKey.js';
export class BinaryManager {
	constructor(entityManager) {
		this.em = entityManager;
	}
	async load(pk) {
		console.time('BinaryManager.load');
		let binaryPk = pk;
		if (!pk) binaryPk = PrimaryKey.getPrimaryKey(pk);
		const result = await this.em.Binary.get(binaryPk);
		const ab = result._ab;
		result._ab = ab.buffer ? ab.buffer : ab;
		console.timeEnd('BinaryManager.load');
		return result;
	}
	async remove(pk) {
		let binaryPk = pk;
		if (!pk) binaryPk = PrimaryKey.getPrimaryKey(pk);
		return await this.em.Binary.delete(binaryPk);
	}
	async save(pk, name, ab, addDataMap) {
		console.time('BinaryManager.save');
		// console.log("BinaryManager save!!A!! pk:" + pk);
		// console.log(binary);
		// console.log("BinaryManager save!!B!! name:" + name);
		let binEntity = null;
		if (pk) binEntity = await this.em.Binary.get(pk);
		const u8a = new Uint8Array(ab);
		// console.log(binary);
		//alert(binary);
		// let binaryPk = PrimaryKey.getPrimaryKey(binary);
		if (!binEntity) binEntity = new Binary(u8a);
		else {
			binEntity.updateDate = Date.now();
			binEntity._ab = u8a;
		}
		if (addDataMap && typeof addDataMap === 'object')
			for (const key in addDataMap) binEntity[key] = addDataMap[key];
		const binaryEntitySaved = await this.em.Binary.save(binEntity);
		console.timeEnd('BinaryManager.save');
		return PrimaryKey.getPrimaryKey(binaryEntitySaved);
	}
}
