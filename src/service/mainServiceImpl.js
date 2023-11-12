import { EntityManager } from './entity/entityManager.js';
import { TitleManager } from './manager/titleManager.js';
import { BinaryManager } from './manager/binaryManager.js';
import { PagesManager } from './manager/pagesManager.js';
import { SettingsManager } from './manager/settingsManager.js';
import { OutputProfilesManager } from './manager/outputProfilesManager.js';
import { ImageOutputsManager } from './manager/imageOutputsManager.js';
import { ImageManager } from './manager/imageManager.js';
import { ThumbnaleManager } from './manager/thumbnailManager.js';
import { Images } from '../entity/images.js';
import { Series } from '../entity/series.js';
import { Thumbnales } from '../entity/thumbnales.js';
import { Title } from '../entity/title.js';
import { Pages } from '../entity/pages.js';
import { Settings } from '../entity/settings.js';
import { OutputProfiles } from '../entity/outputProfiles.js';
import { ImageOutputs } from '../entity/imageOutputs.js';
import { ImageProcessService } from './imageProcessService.js';

const title = 'CopiBon';
const titlePrefix = 'title_';
export class MainServiceImpl {
	constructor() {
		console.log('MainServiceImpl constructor');
		this.em = new EntityManager();
		this.ip = new ImageProcessService();
	}
	async init(appTitle, appVersion) {
		this.appTitle = appTitle;
		this.appVersion = appVersion;
		console.log('MainServiceImpl init 1');
		await this.em.initAsNewUser([Images, Series, Thumbnales, Title, Pages, Settings, OutputProfiles, ImageOutputs]);
		console.log('MainServiceImpl init 2');
		this.ip = new ImageProcessService();
		this.bm = new BinaryManager(this.em);
		this.tbm = new ThumbnaleManager(this.em);
		this.pb = new ThumbnaleManager(this.em);
		this.tbm = new ThumbnaleManager(this.em);
		this.im = new ImageManager(this.em);
		this.pm = new PagesManager(this.em);
		this.opm = new OutputProfilesManager(this.em);
		this.iom = new ImageOutputsManager(this.em);
		this.sm = new SettingsManager(this.em, this.opm);
		this.tm = new TitleManager(this.em);
		this.im.setTitleManager(this.tm);
		this.pm.setTitleManager(this.tm);
		console.log('MainServiceImpl init 3');
		await this.tm.load();
	}
	getAppTitle() {
		return this.appTitle;
	}
	getAppVersion() {
		return this.appVersion;
	}
}
