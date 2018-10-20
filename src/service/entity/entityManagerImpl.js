import { StorageService } from "./storageService"
import { Binary } from "./binary";
import { ObjectUtil } from "../../util/objectUtil";
import { PrimaryKey } from "./primaryKey";
import { PrimaryKeyAutoIncrementService } from "./primaryKeyAutoIncrementService";
const title = "CopiBon";
const USER_ID = "default";
const titlePrefix = "title_";
const BINALY_PK_ROW = "BINALY_PK_ROW";
const entityManagerImpls = {};
const binarySizeMap = {};
const binaryEntity = new Binary();
export class EntityManagerImpl {
	constructor(entityManager, entityClass, userId = USER_ID) {
		this.userId = userId;
		this.entityClass = entityClass;
		this.entity = new entityClass();
		this.entityName = this.entity.getEntityName();
		this.isBinary = binaryEntity.getEntityName() === this.entityName;
		this.ss = new StorageService(entityClass);
		this.pkais = new PrimaryKeyAutoIncrementService(userId);
		this.em = entityManager;
	}

	async init() {
		//console.log("init! "+this.entityName);
		return await this.ss.setStore(this.userId);
	}
	async save(data) {
		const result = await this.saveExecute(data, false);
		if (this.isBinary) {
			const currentPK = result.getPk();
			let size = await ObjectUtil.recalcSize(this, result);
			binarySizeMap[currentPK] = size;
		}
		return result;
	}
	async saveWithBinary(data) {
		return await this.saveExecute(data, true);
	}
	async saveExecute(data, isWithBinary) {
		//console.log("EntityManagerImpl save!!A!! data:" + data+"/isWithBinary:"+isWithBinary);
		if (!data || !data.getEntityName || !data.getPk || data.getEntityName() !== this.entityName) {
			console.log("EntityManagerImpl save!!Z!! data:" + data.getEntityName() + "/this.entityName:" + this.entityName + "/data.getPk:" + data.getPk);
			return;
		}
		let currentPK = data.getPk();
		if (!currentPK) {
			currentPK = PrimaryKey.assemblePK(this.entity, await this.pkais.acquirePKNo(this.userId, this.entity));
		}
		if (!isWithBinary) {
			await this.saveArrayBufferCols(data);
		} else {
			// console.log("EntityManagerImpl saveBinary!!A!! data:" + data + "/isWithBinary:" + isWithBinary);
			// console.log(data);
			// console.log("EntityManagerImpl saveBinary!!B!! data:" + data + "/isWithBinary:" + isWithBinary);
		}
		data.setPk(currentPK);
		// console.log(data);
		const savedData = await this.ss.save(currentPK, data);
		// console.log("EntityManagerImpl save!!B!! savedData:" + savedData);
		return savedData;
	}
	async saveArrayBufferCols(data) {
		if (binaryEntity.getEntityName() === data.getEntityName()) {
			return;
		}
		// console.log("saveArrayBufferCols save!!A!! data:" + data);
		// console.log(data);
		// console.log("saveArrayBufferCols save!!B!! data:" + data);
		for (let key in data) {
			const column = data[key];
			if (!column) {
				continue;
			}
			if (Array.isArray(column)) {
				for (let index of column) {
					const item = column[index];
					if (!item || item.byteLength) {
						continue;
					}
					const pk = await this.saveArrayBufferData(item);
					column[index] = new PrimaryKey(pk);
				}
			} else if (column.byteLength) {
				const pk = await this.saveArrayBufferData(column);
				data[key] = new PrimaryKey(pk);
			}
		}
	}
	async saveArrayBufferData(item) {
		// console.log("saveArrayBufferData save!!A!! item:" + item);
		// console.log(item);
		// console.log("saveArrayBufferData save!!B!! item:" + item);
		if (!item.getEntityName && item.byteLength) {
			const data = new Binary(item);
			const newPK = await this.getBinaryPK();
			data.setPk(newPK);
			// console.log("saveArrayBufferData save!!C!! data:" + data);
			// console.log(data);
			await this.em.Binary.saveWithBinary(data);
			return newPK;
		} else if (item.getEntityName && item.getEntityName() === "PrimaryKey") {
			return item;
		} else if (item.getEntityName && item.getEntityName() === "Binary") {
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
		if (isSizeOnly) {
			if (binarySizeMap[pk]) {
				return binarySizeMap[pk] * 1;
			}
		}
		const key = "EntityManagerImpl.get pk:" + pk + "/entityName:" + this.entityName;
		console.time(key)
		const result = await this.ss.get(pk, this.entity);
		// console.log("get this.entityName:" + this.entityName + "/pk:" + pk);
		console.timeEnd(key)
		if (this.isBinary) {
			let size = await ObjectUtil.recalcSize(this, result);
			binarySizeMap[pk] = size;
		}
		return result;
	}
	async delete(pk) {
		if (this.isBinary) {
			delete binarySizeMap[pk];
		}
		return await this.ss.delete(pk);
	}

}