import { SettingActionCreator } from '../action/settingActionCreator.js';
import { PageActionCreator } from '../action/pageActionCreator.js';
import { PageProcessor } from '../processor/pageProcessor.js';
import { ImageActionCreator } from '../action/imageActionCreator.js';
import { MainService } from '../../service/mainService.js';
import { BaseReducer } from '../../util/reactive/baseReducer.js';
let settingViewReducer = null;
export class SettingViewReducer extends BaseReducer {
	constructor() {
		super();
		this.ms = MainService.getInstance();
		this.tm = this.ms.tm;
		this.sm = this.ms.sm;
		this.im = this.ms.im;
		this.opm = this.ms.opm;
		this.creatAction = SettingActionCreator.creatAction();
		this.creatRemoveAction = SettingActionCreator.creatRemoveAction();
		this.creatLoadAction = SettingActionCreator.creatLoadAction();
		this.creatUpdateAction = SettingActionCreator.creatUpdateAction();
		this.atatch(this.creatAction);
		this.atatch(this.creatRemoveAction);
		this.atatch(this.creatLoadAction);
		this.atatch(this.creatUpdateAction);
		this.storeKey = SettingActionCreator.getStoreKey();
		this.storeKeyOpm = SettingActionCreator.getStoreKeyOpm();

		this.pp = new PageProcessor();
		this.storeImagesKey = ImageActionCreator.getStoreImagesKey();
		this.storePagesKey = PageActionCreator.getStorePagesKey();
	}
	static register() {
		if (!settingViewReducer) {
			settingViewReducer = new SettingViewReducer();
		}
	}
	async reduce(store, action) {
		if (this.creatAction.type === action.type) {
			store[this.storeKey] = await this.load().catch((e) => {
				console.error(e);
			});
			store[this.storeKeyOpm] = await this.opm.loadAll().catch((e) => {
				console.error(e);
			});
		} else if (this.creatRemoveAction.type === action.type) {
			store[this.storeKey] = await this.reset(action.data).catch((e) => {
				console.error(e);
			});
			store[this.storeKeyOpm] = await this.opm.loadAll().catch((e) => {
				console.error(e);
			});
		} else if (this.creatLoadAction.type === action.type) {
			store[this.storeKey] = await this.load().catch((e) => {
				console.error(e);
			});
			store[this.storeKeyOpm] = await this.opm.loadAll().catch((e) => {
				console.error(e);
			});
		} else if (this.creatUpdateAction.type === action.type) {
			store[this.storeKey] = await this.update(action.data).catch((e) => {
				console.error(e);
			});
			// alert("creatUpdateAction:" + JSON.stringify(store[this.storeKey]));
			store[this.storeKeyOpm] = await this.opm.loadAll().catch((e) => {
				console.error(e);
			});
			const result = await this.pp.resetPagesFull().catch((e) => {
				console.error(e);
			});
			store[this.storePagesKey] = await this.pp.loadPages(result).catch((e) => {
				console.error(e);
			});
			store[this.storeImagesKey] = await this.im.loadImages().catch((e) => {
				console.error(e);
			});
			// console.error("storePagesKey:"+store[this.storePagesKey].length);
		}
	}
	async update(data) {
		const title = await this.tm.load();
		const pk = title.getPk();

		const saved = await this.sm.save(
			pk,
			data.name,
			data.pageNum,
			data.startPage,
			data.pageDirection,
			data.outputProfile,
			data.listing
		);
		const settingEntityLoad = await this.sm.loadByPk(pk);

		if (!settingEntityLoad) {
			const settingEntity = await this.sm.createDefault(pk);
			return settingEntity;
		}
		const savedLoad = await this.tm.loadSettings();
		// console.warn(saved);
		// console.warn(settingEntityLoad);
		// console.warn(savedLoad);
		return saved;
	}
	async reset() {
		const title = await this.tm.load();
		const pk = title.getPk();
		const settingEntity = await this.sm.createDefault(pk);
		return settingEntity;
	}
	async load() {
		return await this.tm.loadSettings();
	}
}
