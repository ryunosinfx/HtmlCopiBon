export class PrefManager {
	constructor(entityManager, opm) {
		this.em = entityManager;
		this.opm = opm;
	}
	async loadByPk(titilePk) {
		return await this.em.Prefarences.getEntity(titilePk);
	}

	async loadAll() {
		const retList = [];
		const prefarences = this.em.Pages.loadAll();
		for (const pref of prefarences) retList.push(pref);
		return retList;
	}
	async createDefault(titilePk) {
		const pref = new Prefarences();
		pref.setPk(titilePk);
		pref.pageNum = 8;
		pref.startPage = 'l';
		pref.pageDelection = 'r2l';
		pref.outputProfile = this.opm.getDefaultPk();
		pref.listing = 0;
		const saved = await this.em.Prefarences.save(pref);
		return saved;
	}
	async save(pk, name, pageNum, startPage, pageDirection, outputProfile, listing = 0) {
		let pref = pk ? await this.em.Prefarences.getEntity(pk) : null;
		if (!pref) pref = new Prefarences();
		else pref.updateDate = Date.now();
		pref.name = name || name === null ? name : pref.name;
		pref.pageNum = pageNum ? pageNum : 8;
		pref.startPage = startPage || startPage === null ? startPage : pref.startPage;
		pref.pageDirection = pageDirection || pageDirection === null ? pageDirection : pref.pageDirection;
		pref.outputProfile = outputProfile || outputProfile === null ? outputProfile : pref.outputProfile;
		pref.listing = listing || listing === null ? listing : pref.listing;
		return await this.em.Prefarences.save(pref);
	}
}
