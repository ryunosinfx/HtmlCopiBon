import { OutputProfiles } from '../../entity/outputProfiles.js';
import { PrimaryKey } from '../entity/primaryKey.js';
const defaultPk = 'copibondefa';
export class OutputProfilesManager {
	constructor(entityManager) {
		this.em = entityManager;
		this.createDefault();
	}
	getDefaultPk() {
		return defaultPk;
	}
	async loadAll() {
		const retList = [];
		const outputProfiles = await this.em.OutputProfiles.loadAll();
		for (const outputProfile of outputProfiles) {
			retList.push(outputProfile);
		}
		if (retList.length < 1) {
			retList.push(await this.createDefault());
		}
		return retList;
	}
	async loadByPk(pk) {
		const outputProfilePK = PrimaryKey.getPrimaryKey(pk);
		if (!outputProfilePK) {
			const outputProfileEntity = await this.em.OutputProfiles.get(pk);
			return outputProfileEntity;
		} else {
			const outputProfileEntity = await this.em.OutputProfiles.get(outputProfilePK);
			return outputProfileEntity;
		}
	}
	async createDefault() {
		const savedOne = await this.loadByPk(defaultPk);
		if (savedOne) {
			return savedOne;
		}
		const outputProfiles = new OutputProfiles();
		outputProfiles.setPk(defaultPk);
		const saved = await this.em.OutputProfiles.save(outputProfiles);
		return saved;
	}
	async save(pk, name, binary, type, width, height, listing = 0) {
		let image = null;
		if (pk) {
			image = await this.em.OutputProfiles.get(pk);
		}
		let binaryPk = PrimaryKey.getPrimaryKey(binary);
		if (!image) {
			image = new Setting();
		} else {
			image.updateDate = Date.now();
		}
		image.name = name || name === null ? name : image.name;
		image.binary = binaryPk ? binaryPk : binary;
		image.type = type || type === null ? type : image.type;
		image.width = width || width === null ? width : image.width;
		image.height = height || height === null ? height : image.height;
		image.listing = listing || listing === null ? listing : image.listing;
		return await this.em.Thumbnales.save(image);
	}
}
