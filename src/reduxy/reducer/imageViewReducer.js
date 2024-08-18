import { ImageActionCreator } from '../action/imageActionCreator.js';
import { PageActionCreator } from '../action/pageActionCreator.js';
import { Sorter } from '../../util/sorter.js';
import { MainService } from '../../service/mainService.js';
import { BaseReducer } from '../../util/reactive/baseReducer.js';
import { PageProcessor } from '../processor/pageProcessor.js';
let imageViewReducer = null;
export class ImageViewReducer extends BaseReducer {
	constructor() {
		super();
		this.ms = MainService.getInstance();
		this.em = this.ms.em;
		this.im = this.ms.im;
		this.tm = this.ms.tm;
		this.imagAddAction = ImageActionCreator.creatAddAction();
		this.imageRemoveAction = ImageActionCreator.creatRemoveAction();
		this.imagesLoadAction = ImageActionCreator.creatLoadImagesAction();
		this.imagesSortAction = ImageActionCreator.creatSortImagesAction();
		this.imagesChangeTitleAction = ImageActionCreator.creatChangeTitleImagesAction();
		this.imagesDetailAction = ImageActionCreator.creatDetailAction();
		this.atatch(this.imagAddAction);
		this.atatch(this.imageRemoveAction);
		this.atatch(this.imagesLoadAction);
		this.atatch(this.imagesSortAction);
		this.atatch(this.imagesChangeTitleAction);
		this.atatch(this.imagesDetailAction);
		this.pp = new PageProcessor();
		this.storeImagesKey = ImageActionCreator.getStoreImagesKey();
		this.storePagesKey = PageActionCreator.getStorePagesKey();
	}
	static register() {
		if (!imageViewReducer) imageViewReducer = new ImageViewReducer();
	}
	async reduce(store, action) {
		if (this.imagAddAction.type === action.type) {
			store[this.storeImagesKey] = await this.saveFiles(action.data.files);
			store[this.storePagesKey] = await this.loadPages();
		} else if (this.imageRemoveAction.type === action.type) {
			store[this.storeImagesKey] = await this.remove(action.data.imagePKforDelete);
			store[this.storePagesKey] = await this.loadPages();
		} else if (this.imagesLoadAction.type === action.type) {
			store[this.storeImagesKey] = await this.loadImages();
			store[this.storePagesKey] = await this.loadPages();
			//alert(store[this.storePagesKey]);
		} else if (this.imagesSortAction.type === action.type) {
			store[this.storeImagesKey] = await this.sort(action.data.imagePKmove, action.data.imagePKdrop);
			store[this.storePagesKey] = await this.loadPages();
		} else if (this.imagesChangeTitleAction.type === action.type) {
			store[this.storePagesKey] = await this.loadPages();
		} else if (this.imagesDetailAction.type === action.type) {
			store['imagesDetailData'] = await this.loadAImage(action.data.imagePK);
		}
		return store;
	}
	async loadPages() {
		return await this.pp.loadPages();
	}
	async saveFiles(files) {
		const imageEntitis = await this.tm.addImageFiles(files);
		const retList = this.im.getEntitisAsList();
		for (const imageEntity of imageEntitis) retList.unshift(imageEntity);
		return await this.im.createRetList(retList);
	}

	async sort(movePk, dropPk) {
		//console.log('sort movePk:' + movePk + '/dropPk:' + dropPk+"/this.em.save:"+this.em)
		// console.log(this.em)
		const imageEntitis = this.im.getEntitisAsList();

		for (const index in imageEntitis) {
			const imageEntity = imageEntitis[index];
			const pk = imageEntity.getPk();
			imageEntity.listing = index;
			//console.log('sort pk:' + pk + '/index:' + index + '/imageEntity.listing:' + imageEntity.listing)
		}
		Sorter.orderBy(imageEntitis, [
			{
				colName: 'listing',
				isDESC: false,
			},
			{
				colName: 'updateDate',
				isDESC: true,
			},
		]);
		const converterMap = {};
		converterMap[movePk] = dropPk;
		converterMap[dropPk] = movePk;
		for (const index in imageEntitis) {
			const imageEntity = imageEntitis[index];
			const pk = imageEntity.getPk();
			console.log('sort pk:' + pk + '/index:' + index + '/imageEntity.listing:' + imageEntity.listing);
			const convertedPk = converterMap[pk] ? converterMap[pk] : pk;
			if (convertedPk !== pk) {
				const imageEntityConverted = this.im.getFromLoaded(convertedPk).imageEntity;
				imageEntityConverted.listing = index;
				imageEntityConverted.updateDate = Date.now();
				await this.em.Images.save(imageEntityConverted);
			} else {
				imageEntity.listing = index;
			}
		}
		return await this.im.createRetList(imageEntitis);
	}

	async loadAImage(pk) {
		if (!pk) return;
		const imageEntity = await this.em.get(pk);
		if (!imageEntity) return;
		const binaryEntity = await this.em.get(imageEntity.binary);
		if (!binaryEntity) return;
		const size = binaryEntity._ab.byteLength;
		const imageText = `${escape(imageEntity.name)} (${imageEntity.type || 'n/a'}) - ${size}bytes, last modified: ${
			imageEntity.modifyDate
		} size:${imageEntity.width}x${imageEntity.height}`;
		return { imageEntity: imageEntity, binaryEntity: binaryEntity, imageText: imageText };
	}
	async loadImages() {
		const a = await this.pp.resetPagesFull();
		return await this.im.loadImages();
	}

	async remove(pk) {
		await this.tm.removeImage(pk);
		this.im.removeLoaded(pk);
		return this.im.getRetObjsAsList();
	}
}
