import { MainService } from '../../service/mainService.js';
export class PageProcessor {
	constructor() {
		this.ms = MainService.getInstance();
		this.em = this.ms.em;
		this.pm = this.ms.pm;
		this.tm = this.ms.tm;
	}

	async resetPagesFull() {
		const setting = await this.tm.loadSettings();
		const pageNum = setting.pageNum;
		return await this.resetPages(pageNum);
	}
	async resetPages(pageNum) {
		const title = await this.tm.load();
		const pages = title.pages;
		const pageEntitis = [];
		const delPages = [];
		const addPageAsNew = {};
		if (pages.length > pageNum) {
			const pageEntitysMap = await this.em.getAsMap(pages);
			for (const index in pages) {
				const pk = pages[index];
				if (!pk || typeof pk !== 'string') {
					addPageAsNew[index] = true;
					continue;
				}
				const pageEntity = pageEntitysMap[pk]; //await this.em.get(pk);
				if (!pageEntity) {
					addPageAsNew[index] = true;
					continue;
				}
				pageEntitis.push(pageEntity);
				if (index >= pageNum) {
					delPages.push(pk);
				}
			}
			for (const index in delPages) {
				const delTarget = delPages[index];
				for (const i in pages) {
					const current = pages[i];
					if (delTarget === current) {
						delete pages[i];
						this.pm.remove(delTarget);
						break;
					}
				}
			}
			for (const keyIndex in addPageAsNew) {
				const index = keyIndex * 1;
				if (index < pageNum) {
					const addOne = await this.pm.save(null, null, null, null, null, index);
					pages[index] = addOne.getPk();
				}
			}
		} else {
			const addCount = pageNum - pages.length;
			for (let index = pages.length; index < pageNum; index++) {
				const addOne = await this.pm.save(null, null, null, null, null, index);
				pages.push(addOne.getPk());
			}
		}

		for (let index = 0; index < pageNum; index++) {
			if (index >= pages.length) {
				const addOne = await this.pm.save(null, null, null, null, null, index);
				pages.push(addOne.getPk());
				// console.warn("index:"+index+"/pk:"+pk+"/pages[index]:"+pages[index]);
				continue;
			}
			const pk = pages[index];
			if (!pk || typeof pk !== 'string') {
				const addOne = await this.pm.save(null, null, null, null, null, index);
				pages[index] = addOne.getPk();
				// console.warn("index:"+index+"/pk:"+pk+"/pages[index]:"+pages[index]);
				continue;
			}
			const pageEntity = await this.em.get(pk);
			if (!pageEntity) {
				const addOne = await this.pm.save(null, null, null, null, null, index);
				pages[index] = addOne.getPk();
				// console.warn("index:"+index+"/pk:"+pk+"/pages[index]:"+pages[index]);
				continue;
			}
			// console.warn("index:"+index+"/pk:"+pk+"/pages[index]:"+pages[index]+"/pageNum:"+pageNum);
		}
		await this.tm.saveTitle(title);
	}
	async loadPages() {
		const title = await this.tm.load();
		const pages = title.pages;
		const pageEntitis = [];
		for (const index in pages) {
			const pk = pages[index];
			if (!pk) {
				continue;
			}
			const pageEntity = await this.em.get(pk);
			pageEntitis.push(pageEntity);
		}
		return pageEntitis;
	}
	async move(fromPk, toPk) {
		await this.pm.move(fromPk, toPk);
	}
	async add(imagePk, pagePk) {
		await this.pm.addPage(imagePk, pagePk);
	}
	async remove(pagePk) {
		await this.pm.removeImage(pagePk);
	}
}
