import { Settings } from '../../entity/settings.js';
export class SettingsManager {
	constructor(entityManager, opm) {
		this.em = entityManager;
		this.opm = opm;
	}
	async loadByPk(titilePk) {
		return await this.em.Settings.getEntity(titilePk);
	}

	async loadAll() {
		const retList = [];
		const settings = this.em.Pages.loadAll();
		for (const setting of settings) retList.push(setting);
		return retList;
	}
	async createDefault(titilePk) {
		const setting = new Settings();
		setting.setPk(titilePk);
		setting.pageNum = 8;
		setting.startPage = 'l';
		setting.pageDelection = 'r2l';
		setting.outputProfile = this.opm.getDefaultPk();
		setting.listing = 0;
		return await this.em.Settings.save(setting);
	}
	async save(pk, name, pageNum, startPage, pageDirection, outputProfile, listing = 0) {
		let settings = pk ? await this.em.Settings.getEntity(pk) : null;
		if (!settings) settings = new Settings();
		else settings.updateDate = Date.now();
		settings.name = name || name === null ? name : settings.name;
		settings.pageNum = pageNum ? pageNum : 8;
		settings.startPage = startPage || startPage === null ? startPage : settings.startPage;
		settings.pageDirection = pageDirection || pageDirection === null ? pageDirection : settings.pageDirection;
		settings.outputProfile = outputProfile || outputProfile === null ? outputProfile : settings.outputProfile;
		settings.listing = listing || listing === null ? listing : settings.listing;
		return await this.em.Settings.save(settings);
	}
}
