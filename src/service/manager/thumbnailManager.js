import { Thumbnales } from '../../entity/thumbnales.js';
import { PrimaryKey } from '../entity/primaryKey.js';
export class ThumbnaleManager {
	constructor(entityManager) {
		this.em = entityManager;
	}
	async loadFromImagePk(pk) {
		const imagePk = PrimaryKey.getPrimaryKey(pk);
		const imageEntity = await this.em.get(imagePk);
		if (!imageEntity || !imageEntity.thumbnail) return null;
		const thumbnailPk = PrimaryKey.getPrimaryKey(imageEntity.thumbnail);
		const thumbnailEntity = await this.em.get(thumbnailPk);
		thumbnailEntity.parentPk = imagePk;
		return thumbnailEntity;
	}
	async load(pk) {
		let binaryPk = pk ? pk : PrimaryKey.getPrimaryKey(pk);
		return await this.em.Thumbnales.getEntity(binaryPk);
	}
	async save(pk, name, binary, type, width, height, listing = 0) {
		let img = pk ? await this.em.Thumbnales.getEntity(pk) : null;
		let binaryPk = PrimaryKey.getPrimaryKey(binary);
		if (!img) img = new Thumbnales();
		else img.updateDate = Date.now();
		img.name = name || name === null ? name : img.name;
		img.binary = binaryPk ? binaryPk : binary;
		img.type = type || type === null ? type : img.type;
		img.width = width || width === null ? width : img.width;
		img.height = height || height === null ? height : img.height;
		img.listing = listing || listing === null ? listing : img.listing;
		return await this.em.Thumbnales.save(img);
	}
}
