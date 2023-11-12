export class PrefManager {
	constructor(entityManager, opm) {
		this.em = entityManager;
		this.opm = opm;
	}
	async loadByPk(titilePk) {
		const prefarenceEntity = await this.em.Prefarences.get(titilePk);
		return prefarenceEntity;
	}

	async loadAll() {
		const retList = [];
		const prefarences = this.em.Pages.loadAll();
		for (const prefarence of prefarences) {
			retList.push(prefarence);
		}
		return retList;
	}
	async createDefault(titilePk) {
		const prefarence = new Prefarences();
		prefarence.setPk(titilePk);
		prefarence.pageNum = 8;
		prefarence.startPage = 'l';
		prefarence.pageDelection = 'r2l';
		prefarence.outputProfile = this.opm.getDefaultPk();
		prefarence.listing = 0;
		const saved = await this.em.Prefarences.save(prefarence);
		return saved;
	}
	async save(pk, name, pageNum, startPage, pageDirection, outputProfile, listing = 0) {
		let prefarences = null;
		if (pk) {
			prefarences = await this.em.Prefarences.get(pk);
		}
		if (!prefarences) {
			prefarences = new Prefarences();
		} else {
			prefarences.updateDate = Date.now();
		}
		prefarences.name = name || name === null ? name : prefarences.name;
		prefarences.pageNum = pageNum ? pageNum : 8;
		prefarences.startPage = startPage || startPage === null ? startPage : prefarences.startPage;
		prefarences.pageDirection = pageDirection || pageDirection === null ? pageDirection : prefarences.pageDirection;
		prefarences.outputProfile = outputProfile || outputProfile === null ? outputProfile : prefarences.outputProfile;
		prefarences.listing = listing || listing === null ? listing : prefarences.listing;
		return await this.em.Prefarences.save(prefarences);
	}
}
