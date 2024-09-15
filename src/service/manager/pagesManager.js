import { Pages } from '../../entity/pages.js';
import { PrimaryKey } from '../entity/primaryKey.js';
export class PagesManager {
	constructor(entityManager) {
		this.em = entityManager;
	}
	setTitleManager(tm) {
		this.tm = tm;
	}
	async loadFromImagePk(pk) {
		const pagePk = PrimaryKey.getPrimaryKey(pk);
		const pageEntity = await this.em.get(pagePk);
		if (!pageEntity || !pageEntity.thumbnail) return null;
		const thumbnailPk = PrimaryKey.getPrimaryKey(pageEntity.thumbnail);
		const thumbnailEntity = await this.em.get(thumbnailPk);
		thumbnailEntity.parentPk = pagePk;
		return thumbnailEntity;
	}
	async remove(pk) {
		const target = await this.em.Pages.getEntity(pk);
		if (target) {
			if (target.previewThumbnail) await this.em.Binary.delete(target.previewThumbnail);
			if (target.outputImage) await this.em.Binary.delete(target.outputImage);
			await this.em.Pages.delete(pk);
		}
	}
	async removeImage(pk) {
		const target = await this.em.Pages.getEntity(pk);
		if (target) {
			if (target.previewThumbnail) await this.em.Binary.delete(target.previewThumbnail);
			if (target.outputImage) await this.em.Binary.delete(target.outputImage);
			if (target.outputDualImage) await this.em.Binary.delete(target.outputDualImage);
			if (target.outputExpandImage) await this.em.Binary.delete(target.outputExpandImage);
			target.baseImage = null;
			target.thumbnail = null;
			target.outputDualImage = null;
			target.outputExpandImage = null;
			target.previewThumbnail = null;
			target.outputImage = null;
			await this.em.Pages.save(target);
		}
	}

	async addPage(imagePk, pagePk) {
		const title = await this.tm.load();
		const pages = title.pages;
		const pageEntitis = [];
		for (const index in pages) {
			const pk = pages[index];
			if (!pk) continue;
			const pageEntity = await this.em.get(pk);
			if (pk === pagePk) {
				const imageEntity = await this.em.get(imagePk);
				const thumbnailEntity = await this.em.get(imageEntity.thumbnail);
				const binaryEntity = await this.em.get(thumbnailEntity.binary);
				pageEntity.thumbnail = imageEntity.thumbnail;
				pageEntity.baseImage = imagePk;
				await this.em.Pages.save(pageEntity);
				//alert("pagePk:"+pagePk+"/imagePｋ:"+imagePk+JSON.stringify(pageEntity));
			}
			pageEntitis.push(pageEntity);
		}
		return pageEntitis;
	}
	async move(fromPk, toPk) {
		const targetFrom = await this.em.Pages.getEntity(fromPk);
		const targetTo = await this.em.Pages.getEntity(toPk);
		if (!targetFrom || !targetTo) return;
		const previewThumbnailFrom = targetFrom.previewThumbnail;
		const previewThumbnailTo = targetTo.previewThumbnail;
		const outputImageFrom = targetFrom.outputImage;
		const outputImageTo = targetTo.outputImage;
		const thumbnailFrom = targetFrom.thumbnail;
		const thumbnailTo = targetTo.thumbnail;
		const baseImageFrom = targetFrom.baseImage;
		const baseImageTo = targetTo.baseImage;
		targetFrom.previewThumbnail = previewThumbnailTo;
		targetTo.previewThumbnail = previewThumbnailFrom;
		targetFrom.outputImage = outputImageTo;
		targetTo.outputImage = outputImageFrom;
		targetFrom.thumbnail = thumbnailTo;
		targetTo.thumbnail = thumbnailFrom;
		targetFrom.baseImage = baseImageTo;
		targetTo.baseImage = baseImageFrom;
		await this.em.Pages.save(targetFrom);
		await this.em.Pages.save(targetTo);
	}
	async loadAll() {
		const retList = [];
		const pages = this.em.Pages.loadAll();
		for (const page of pages) retList.push(page);
		return retList;
	}
	async load(pk) {
		return await this.em.Pages.getEntity(pk);
	}
	/*
	 */
	async save(
		pk,
		previewThumbnail = null,
		outputImage = null,
		thumbnail = null,
		baseImage = null,
		listing = 0,
		binary = null
	) {
		let page = pk ? await this.em.Pages.getEntity(pk) : null;
		let binaryPk = binary ? PrimaryKey.getPrimaryKey(binary) : null;
		if (!page) page = new Pages();
		else page.updateDate = Date.now();
		page.previewThumbnail =
			previewThumbnail || previewThumbnail === null ? previewThumbnail : page.previewThumbnail;
		page.outputImage = binaryPk ? binaryPk : binary;
		page.outputImage = outputImage || outputImage === null ? outputImage : page.outputImage;
		page.thumbnail = thumbnail || thumbnail === null ? thumbnail : page.thumbnail;
		page.baseImage = baseImage || baseImage === null ? baseImage : page.baseImage;
		page.listing = listing || listing === null ? listing : page.listing;
		return await this.em.Pages.save(page);
	}
}
