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
		for (const outputProfile of outputProfiles) retList.push(outputProfile);
		if (retList.length < 1) retList.push(await this.createDefault());
		return retList;
	}
	async loadByPk(pk) {
		const outputProfilePK = PrimaryKey.getPrimaryKey(pk);
		return !outputProfilePK
			? await this.em.OutputProfiles.getEntity(pk)
			: await this.em.OutputProfiles.getEntity(outputProfilePK);
	}
	async createDefault() {
		const savedOne = await this.loadByPk(defaultPk);
		if (savedOne) return savedOne;
		const outputProfiles = new OutputProfiles();
		outputProfiles.setPk(defaultPk);
		return await this.em.OutputProfiles.save(outputProfiles);
	}
	async save(pk, name, binary, type, width, height, listing = 0) {
		let img = pk ? await this.em.OutputProfiles.getEntity(pk) : null;
		let binaryPk = PrimaryKey.getPrimaryKey(binary);
		if (!img) img = new Setting();
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
