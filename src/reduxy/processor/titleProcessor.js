import { ActionDispatcher } from '../../util/reactive/actionDispatcher.js';
import { ObjectUtil } from '../../util/objectUtil.js';
export class TitleProcessor {
	constructor(em, tm) {
		this.em = em;
		this.tm = tm;
		this.actionDispatcher = ActionDispatcher.createStandAlone();
		this.totalSize = 0;
	}
	async loadAll() {
		console.time('TitleProcessor.loadAll');
		const titles = await this.tm.loadTitleList();
		this.totalSize = 0;
		const keys = [];
		for (const title of titles) {
			this.titleSizeCache = {};
			const size = await this.getSizes(title);
			title.size = size;
			this.totalSize += size;
		}
		console.timeEnd('TitleProcessor.loadAll');
		return { list: titles, totalSize: this.totalSize };
	}
	getTotalSum() {
		return this.totalSize;
	}
	async getSizes(target) {
		if (!target || !target.getRefCols) return 1;
		console.warn('calcSize this.em:', this.em, target);
		let size = await ObjectUtil.calcSize(this.em[target.entitiyName], target);
		const refCols = target.getRefCols();
		for (const colName of refCols) {
			const colValue = target[colName];
			if (!colValue) continue;
			if (Array.isArray(colValue)) {
				for (const pk of colValue) {
					if (!pk) {
						size += 2;
						continue;
					}
					if (this.titleSizeCache[pk] === undefined) {
						const entity = await this.em.get(pk, true);
						const currentSize = Number.isInteger(entity) ? entity : await this.getSizes(entity);
						this.titleSizeCache[pk] = true;
						size += currentSize;
					}
				}
			} else if (typeof colValue === 'string') {
				if (this.titleSizeCache[colValue] === undefined) {
					const entity = await this.em.get(colValue, true);
					const currentSize = Number.isInteger(entity) ? entity : await this.getSizes(entity);
					this.titleSizeCache[colValue] = true;
					size += currentSize;
				}
			}
		}
		return size;
	}
	async clearAll() {
		const titles = await this.tm.loadTitleList();
		for (const title of titles) await this.removeDescendant(title);
		//dual!
		for (const title of titles) await this.removeDescendant(title);
		return await this.loadAll();
	}
	async removeDescendant(target) {
		if (!target || !target.getRefCols) return;
		const refCols = target.getRefCols();
		for (const colName of refCols) {
			const colValue = target[colName];
			if (!colValue) continue;
			if (Array.isArray(colValue)) {
				for (const pk of colValue) await this.removeExecute(pk);

				for (const index in colValue) delete colValue[index];
			} else if (typeof colValue === 'string') await this.removeExecute(colValue);
		}
	}
	async removeExecute(pk) {
		if (!pk) return this.tm.loadCurrent();
		const entity = await this.em.get(pk);
		if (entity) {
			await this.removeDescendant(entity);
			if (entity.pages) for (const index in entity.pages) delete entity.pages[index];
			await this.em.delete(pk);
			const titles = await this.tm.loadTitleList();
			return titles && titles.length > 0 ? titles[0] : null;
		}
		return this.tm.loadCurrent();
	}
	async create(titleId, titlePrefix, name) {
		if (await this.tm.isExist(titleId)) return await this.tm.load(titleId);
		return await this.tm.createTitle(titleId, titlePrefix, name);
	}
	async remove(titleId) {
		return (await this.tm.isExist(titleId)) ? await this.removeExecute(titleId) : this.tm.loadCurrent();
	}
	async changeTtitle(titleId) {
		return await this.tm.changeTitle(titleId);
	}
	async update(titleId, name) {
		const current = await this.tm.load(titleId);
		current.name = name;
		await this.tm.saveTitle(current);
		return this.tm.loadCurrent();
	}
}
