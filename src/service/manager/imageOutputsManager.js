import { ImageOutputs } from '../../entity/imageOutputs.js';
import { PrimaryKey } from '../entity/primaryKey.js';
export class ImageOutputsManager {
	constructor(entityManager) {
		this.em = entityManager;
	}
	async load(pk) {
		let binaryPk = pk;
		if (!pk) binaryPk = PrimaryKey.getPrimaryKey(pk);
		return await this.em.ImageOutputs.getEntity(binaryPk);
	}
	async remove(pk) {
		const target = await this.em.ImageOutputs.getEntity(pk);
		if (target) {
			if (target.binary) await this.em.Binary.delete(target.binary);
			await this.em.ImageOutputs.delete(pk);
		}
	}
	async save(pk, name, binary, type, orderName, size, listing = 0) {
		let ios = null;
		if (pk) ios = await this.em.ImageOutputs.getEntity(pk);
		let binaryPk = PrimaryKey.getPrimaryKey(binary);
		if (!ios) ios = new ImageOutputs();
		else ios.updateDate = Date.now();
		ios.name = name || name === null ? name : ios.name;
		ios.binary = binaryPk ? binaryPk : binary;
		ios.type = type || type === null ? type : ios.type;
		ios.orderName = orderName || orderName === null ? orderName : ios.orderName;
		ios.size = size || size === null ? size : ios.size;
		ios.listing = listing || listing === null ? listing : ios.listing;
		const imageEntitySaved = await this.em.ImageOutputs.save(ios);
		return PrimaryKey.getPrimaryKey(imageEntitySaved);
	}
}
