import { Images } from '../../entity/images.js';
import { MainService } from '../../service/mainService.js';
import { BinaryCnvtr } from '../../util/binaryConverter.js';
import { PrimaryKey } from '../entity/primaryKey.js';
import { Sorter } from '../../util/sorter.js';
import { FileUploadExecuter } from '../fileUploadExecuter.js';

const loadedImageMap = new Map();
export class ImageManager {
	constructor(entityManager) {
		this.ms = MainService.getInstance();
		this.em = entityManager;
		this.ip = this.ms.ip;
		this.tbm = this.ms.tbm;
	}
	setTitleManager(tm) {
		this.tm = tm;
	}
	async load(pk) {
		const binaryPk = typeof pk !== 'string' ? PrimaryKey.getPrimaryKey(pk) : pk;
		return await this.em.Images.getEntity(binaryPk);
	}
	async reloadLoadedImages() {
		return await this.createRetList(this.getEntitisAsList());
	}
	async loadImages() {
		const title = await this.tm.load(),
			images = title.images,
			imageEntitis = [];
		for (const index in images) {
			const pk = images[index];
			if (pk) imageEntitis.push(await this.em.get(pk));
		}
		return await this.createRetList(imageEntitis);
	}
	async remove(pk) {
		const imageEntity = await this.em.get(pk);
		console.log('removeImage imageEntity.thumbnail:' + imageEntity.thumbnail);
		const binaryPk = PrimaryKey.getPrimaryKey(imageEntity.binary);
		console.log('removeImage binaryPk:' + binaryPk);
		const thumbnailPk = PrimaryKey.getPrimaryKey(imageEntity.thumbnail);
		console.log('removeImage thumbnailPk:' + thumbnailPk);
		if (thumbnailPk) {
			const thumbnailEntity = await this.em.get(thumbnailPk);
			console.log('removeImage thumbnailEntity:' + thumbnailEntity);
			const thumbnailBinaryPk = PrimaryKey.getPrimaryKey(thumbnailEntity.binary);
			console.log('removeImage thumbnailBinaryPk:' + thumbnailBinaryPk);
			await this.em.delete(thumbnailBinaryPk);
			await this.em.delete(thumbnailPk);
		}
		await this.em.delete(binaryPk);
		await this.em.delete(pk);
	}
	async saveImageFile(file, count = 0) {
		const fue = new FileUploadExecuter();
		const arrayBuffer = await fue.readAsArrayBuffer(file);
		const data = {
			name: file.name,
			ab: arrayBuffer,
			type: file.type,
		};
		const imgElm = await this.ip.createImageNodeByData(data);
		const dataURI = await this.ip.createThumbnail(arrayBuffer, 100, 100, file.type);
		const arrayBufferThumbnail = BinaryCnvtr.D2a(dataURI);
		const imgElmThumb = await this.ip.createImageNodeByData({
			name: file.name,
			ab: arrayBufferThumbnail,
			type: file.type,
		});
		const thumbnailEntity = await this.tbm.save(
			null,
			file.name,
			arrayBufferThumbnail,
			file.type,
			imgElmThumb.width,
			imgElmThumb.height,
			0
		);
		console.log('addImageFiles thumbnailEntity:' + thumbnailEntity);
		const thumbnailPk = PrimaryKey.getPrimaryKey(thumbnailEntity);
		console.log('addImageFiles thumbnailPk:' + thumbnailPk);
		const imageEntity = await this.save(
			null,
			file.name,
			arrayBuffer,
			file.type,
			imgElm.width,
			imgElm.height,
			thumbnailPk,
			count
		);
		console.log('addImageFiles imageEntity:' + imageEntity);
		const imagePk = imageEntity.getPk();
		return { imagePk, imageEntity };
	}
	async save(pk, name, binary, type, width, height, thumbnail, listing = 0) {
		let image = null;
		if (pk) image = await this.em.Images.getEntity(pk);
		console.log('ImageManager save!!9!! binary:', binary);
		const binaryPk = PrimaryKey.getPrimaryKey(binary);
		if (!image) image = new Images();
		else image.updateDate = Date.now();
		console.log('ImageManager save!!A!! image:' + image);
		image.name = name || name === null ? name : image.name;
		image.binary = binaryPk ? binaryPk : binary;
		image.type = type || type === null ? type : image.type;
		image.width = width || width === null ? width : image.width;
		image.height = height || height === null ? height : image.height;
		image.thumbnail = thumbnail || thumbnail === null ? thumbnail : PrimaryKey.getPrimaryKey(image.thumbnail);
		image.listing = listing || listing === null ? listing : image.listing;
		const savedData = await this.em.Images.save(image);
		console.log('ImageManager save!!B!! image:', savedData);
		return savedData;
	}

	async loadThumbnails(images) {
		const retList = [],
			imageList = [];
		for (const image of images) {
			const imagePk = PrimaryKey.getPrimaryKey(image),
				imageEntity = await this.load(imagePk);
			imageList.push(imageEntity);
		}
		Sorter.orderBy(imageList, [{ colName: 'listing', isDESC: false }]);
		for (const imageEntity of imageList) {
			const imagePk = PrimaryKey.getPrimaryKey(imageEntity),
				thumbnailEntity = await this.tbm.loadFromImagePk(imagePk);
			retList.push(thumbnailEntity);
		}
		return retList;
	}
	async createRetList(imageEntitis) {
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
		//console.log("=★=showFilesInit imageEntitis:" + imageEntitis.length);
		const retList = [];
		for (const imageEntity of imageEntitis) {
			const pk = imageEntity && imageEntity.getPk ? imageEntity.getPk() : null;
			if (loadedImageMap.has(pk)) retList.push(loadedImageMap.get(pk));
			else if (!pk) retList.push(null);
			else {
				const retObj = await this.processParImage(imageEntity);
				loadedImageMap.set(pk, retObj);
				retList.push(retObj);
			}
		}
		return retList;
	}
	async processParImage(imageEntity) {
		imageEntity.getPk();
		const thumbnailEntity = await this.em.get(imageEntity.thumbnail),
			binaryEntity = await this.em.get(thumbnailEntity.binary);
		console.log('processParImage thumbnailEntity:', thumbnailEntity);
		console.log('processParImage binaryEntity:', binaryEntity);
		if (!thumbnailEntity || !binaryEntity) return null;
		await this.ip.createImageNodeByData({
			name: imageEntity.name,
			ab: binaryEntity.ab,
			type: imageEntity.type,
		});
		const size = binaryEntity.ab ? new Uint8Array(binaryEntity.ab).length : 0,
			imageText = `${escape(imageEntity.name)} (${imageEntity.type || 'n/a'}) - ${size}bytes, last modified: ${
				imageEntity.modifyDate
			} size:${imageEntity.width}x${imageEntity.height}`,
			retObj = {
				imageEntity: imageEntity,
				binaryEntity: binaryEntity,
				size: size,
				imageText: imageText,
				isOnPage: false,
			};
		return retObj;
	}
	removeLoaded(pk) {
		loadedImageMap.delete(pk);
	}
	getRetObjsAsList() {
		const retList = [];
		for (const [key, retObj] of loadedImageMap.entries()) if (retObj) retList.push(retObj);
		return retList;
	}
	getEntitisAsList() {
		const retList = [];
		for (const [key, retObj] of loadedImageMap.entries()) if (retObj) retList.push(retObj.imageEntity);
		return retList;
	}
	getFromLoaded(pk) {
		return loadedImageMap.get(pk);
	}
}
