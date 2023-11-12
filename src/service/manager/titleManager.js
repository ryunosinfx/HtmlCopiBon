import { Title } from '../../entity/title.js';
// import {Images} from "../../entity/images";
// import {Thumbnales} from "../../entity/thumbnales";
// import { Series } from '../../entity/series';
import { PrimaryKey } from '../entity/primaryKey.js';
import { Sorter } from '../../util/sorter.js';
import { MainService } from '../../service/mainService.js';
// import { FileUploadExecuter } from '../../service/fileUploadExecuter';

const TITLE_STORE_NAME = 'CopiBonTitles';
const defaultTitle = 'CopiBon';
const defaultName = 'DefaultName';
const defaultTitlePrefix = 'title_';
export class TitleManager {
	constructor(entityManager, titleId) {
		this.em = entityManager;
		this.ms = MainService.getInstance();
		this.ip = this.ms.ip;
		this.im = this.ms.im;
		this.tbm = this.ms.tbm;
		this.sm = this.ms.sm;
		console.log('title is new!!' + this.tbm);
		//this.load(titleId).then((title)=>{this.currentTitle=title;console.log("title is new!")});
	}
	async loadCurrent() {
		return this.currentTitle;
	}
	async isExist(titleId) {
		return titleId ? !!(await this.em.Title.get(titleId)) : false;
	}
	async load(titleId = defaultTitle) {
		if (!titleId) {
			return null;
		}
		if (this.currentTitle && this.currentTitle.getPk() === titleId) {
			return this.currentTitle;
		}
		let title = await this.em.Title.get(titleId);
		if (!title) {
			title = await this.createTitle(titleId);
		}
		this.currentTitle = title;
		return title;
	}

	async createTitle(titleId = defaultTitle, titlePrefix = defaultTitlePrefix, name = defaultName) {
		const title = new Title(titleId, titlePrefix, name);
		title.setPk(titleId);
		title.setting = titleId;
		await this.sm.createDefault(titleId);
		await this.em.Title.save(title);
		return title;
	}

	async changeTitle(newTitleId) {
		this.currentTitle = await this.loadTitle(newTitleId);
		if (!this.currentTitle) {
			this.currentTitle = await this.createTitle(defaultTitle, defaultTitlePrefix, defaultName);
		}
	}
	async loadTitleList() {
		return await this.em.Title.loadAll();
	}
	async saveTitle(title) {
		if (title) {
			title.updateDate = Date.now();
			const images = title.images;
			Sorter.thinningNullData(images);
			for (const index in images) {
				const image = images[index];
				if (!PrimaryKey.isPrimaryKey(image)) {
					images[index] = PrimaryKey.getPrimaryKey(image);
				}
			}
			this.currentTitle = await this.em.Title.save(title);
		}
	}
	async deleteTitleCascade() {
		const titelId = this.titelId;
		const titelPrefix = this.titelPrefix;
	}
	async addImageFiles(files) {
		const title = await this.loadCurrent();
		const images = title.images;
		Sorter.thinningNullData(images);
		const iamageEntitis = [];
		let count = images.length;
		for (const file of files) {
			let { imagePk, imageEntity } = await this.im.saveImageFile(file, count);
			count++;
			images.push(imagePk);
			iamageEntitis.push(imageEntity);
		}
		//console.log(images);
		await this.saveTitle(title);
		return iamageEntitis;
	}
	async addImage(name, dataURI) {}
	async removeImage(pk) {
		const title = await this.load();
		const images = title.images;
		for (const index in images) {
			const imageEntityPk = images[index];
			if (PrimaryKey.getPrimaryKey(imageEntityPk) === pk) {
				await this.im.remove(pk);
				delete images[index];
			}
		}
		// console.log(images);
		await this.saveTitle(title);
	}
	async getExports() {
		const title = await this.loadCurrent();
		if (title && title.exports && Array.isArray(title.exports)) {
			return title.exports;
		} else {
			title.exports = [];
			await this.saveTitle(title);
			return title.exports;
		}
	}
	async getCurrentTitleName() {
		const title = await this.loadCurrent();
		return title.name;
	}
	async saveCurrent() {
		const title = await this.loadCurrent();
		await this.saveTitle(title);
	}

	async loadSettings() {
		const title = await this.loadCurrent();
		const pk = title.getPk();
		const settingEntityLoad = await this.sm.loadByPk(pk);
		if (!settingEntityLoad) {
			const settingEntity = await this.sm.createDefault(pk);
			return settingEntity;
		}
		return settingEntityLoad;
	}
	async loadThumbnails() {
		const title = await this.loadCurrent();
		return await this.im.loadThumbnails(title.images);
	}
	async updateImagesListing(newList) {
		const title = await this.loadCurrent();
		return await this.im.updateImagesListing(title.images, newList);
	}
}
