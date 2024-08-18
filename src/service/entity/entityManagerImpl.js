import { StorageService } from './storageService.js';
import { Binary } from './binary.js';
import { ObjectUtil } from '../../util/objectUtil.js';
import { PrimaryKey } from './primaryKey.js';
import { PrimaryKeyAutoIncrementService } from './primaryKeyAutoIncrementService.js';
const USER_ID = 'default';
const BINALY_PK_ROW = 'BINALY_PK_ROW';
const binarySizeMap = {};
const binaryEntity = new Binary();
export class EntityManagerImpl {
	constructor(entityManager, entityClass, userId = USER_ID, closeTimeout) {
		this.userId = userId;
		this.entityClass = entityClass;
		this.entity = new entityClass();
		this.entityName = this.entity.getEntityName();
		this.isBinary = binaryEntity.getEntityName() === this.entityName;
		this.ss = new StorageService(entityClass);
		this.pkais = new PrimaryKeyAutoIncrementService(userId);
		this.em = entityManager;
		this.ct = closeTimeout;
	}
	async init() {
		console.log('init! ' + this.entityName);
		return await this.ss.setStore(this.userId, undefined, this.ct);
	}
	async save(data) {
		const result = await this.saveExecute(data, false);
		if (this.isBinary) binarySizeMap[result.getPk()] = await ObjectUtil.recalcSize(this, result);
		return result;
	}
	async saveWithBinary(data) {
		return await this.saveExecute(data, true);
	}
	async saveExecute(data, isWithBinary) {
		console.log(
			`EntityManagerImpl save!!A!! this.entityName:${this.entityName}/data:${data}/isWithBinary:${isWithBinary}`
		);
		if (!data || !data.getEntityName || !data.getPk || data.getEntityName() !== this.entityName) {
			return console.log(
				`EntityManagerImpl save!!Z!! this.entityName:${
					this.entityName
				}/data:${data.getEntityName()}/this.entityName:${this.entityName}/data.getPk:${data.getPk}`
			);
		}
		const currentPK = data.getPk()
			? data.getPk()
			: PrimaryKey.assemblePK(this.entity, await this.pkais.acquirePKNo(this.userId, this.entity));
		if (!isWithBinary) await this.saveArrayBufferCols(data);
		data.setPk(currentPK);
		console.log('EntityManagerImpl save!!B!! this.entityName:' + this.entityName + '/data:', data);
		const savedData = await this.ss.save(currentPK, data);
		console.log('EntityManagerImpl save!!C!! this.entityName:' + this.entityName + '/savedData:', savedData);
		return savedData;
	}
	async saveArrayBufferCols(data) {
		if (binaryEntity.getEntityName() === data.getEntityName()) return;
		// console.log("saveArrayBufferCols save!!A!! data:" + data,data);
		for (const key in data) {
			const column = data[key];
			if (!column) continue;
			if (Array.isArray(column)) {
				for (const index of column) {
					const item = column[index];
					if (!item || item.byteLength) continue;
					column[index] = new PrimaryKey(await this.saveArrayBufferData(item));
				}
			} else if (column.byteLength) data[key] = new PrimaryKey(await this.saveArrayBufferData(column));
		}
	}
	async saveArrayBufferData(item) {
		// console.log("saveArrayBufferData save!!A!! item:" + item,item);
		if (!item.getEntityName && item.byteLength) {
			const data = new Binary(item);
			const newPK = await this.getBinaryPK();
			data.setPk(newPK);
			// console.log("saveArrayBufferData save!!C!! data:" + data,data);
			await this.em.Binary.saveWithBinary(data);
			return newPK;
		} else if (item.getEntityName && item.getEntityName() === 'PrimaryKey') return item;
		else if (item.getEntityName && item.getEntityName() === 'Binary') {
			const currentPK = item.getPk();
			if (currentPK) {
				item.setPk(currentPK);
				// console.log("saveArrayBufferData save!!D!! item:" + item);
				await this.em.Binary.saveWithBinary(item);
				return currentPK;
			} else {
				// console.log("saveArrayBufferData save!!E!! item:" + item);
				const newPK = await this.getBinaryPK();
				item.setPk(newPK);
				await this.em.Binary.saveWithBinary(item);
				return newPK;
			}
		}
	}
	async getBinaryPK() {
		const newNumber = await this.pkais.acquirePKNo(this.userId, binaryEntity, BINALY_PK_ROW);
		return PrimaryKey.assemblePK(binaryEntity, newNumber);
	}
	async loadAll() {
		return await this.ss.loadAll(this.entity);
	}
	async getAsMap(keys) {
		return await this.ss.getAsMap(keys, this.entity);
	}
	async get(pk, isSizeOnly) {
		if (isSizeOnly) if (binarySizeMap[pk]) return binarySizeMap[pk] * 1;
		const key = 'EntityManagerImpl.get pk:' + pk + '/entityName:' + this.entityName;
		console.time(key);
		const result = await this.ss.get(pk, this.entity);
		// console.log('get this.entityName:' + this.entityName + '/pk:' + pk, result);
		console.timeEnd(key);
		if (this.isBinary) binarySizeMap[pk] = await ObjectUtil.recalcSize(this, result);
		return result;
	}
	async delete(pk) {
		if (this.isBinary) delete binarySizeMap[pk];
		return await this.ss.delete(pk);
	}
}
