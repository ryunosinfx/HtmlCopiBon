import {EntityManager} from "./entity/entityManager";
import {TitleManager} from "./manager/titleManager";
import {BinaryManager} from "./manager/binaryManager";
import {PagesManager} from "./manager/pagesManager";
import {SettingsManager} from "./manager/settingsManager";
import {OutputProfilesManager} from "./manager/outputProfilesManager";
import {ImageOutputsManager} from "./manager/imageOutputsManager";
import {ImageManager} from "./manager/imageManager";
import {ThumbnaleManager} from "./manager/thumbnailManager";
import {Images} from "../entity/images";
import {Series} from "../entity/series";
import {Thumbnales} from "../entity/thumbnales";
import {Title} from "../entity/title";
import {Pages} from "../entity/pages";
import {Settings} from "../entity/settings";
import {OutputProfiles} from "../entity/outputProfiles";
import {ImageOutputs} from "../entity/imageOutputs";
import {ImageProcessService} from "./imageProcessService"

const title = "CopiBon";
const titlePrefix = "title_";
export class MainServiceImpl {
  constructor() {
    this.em = new EntityManager();
    this.ip = new ImageProcessService();
  }
  async init(appTitle,appVersion) {
    this.appTitle = appTitle;
    this.appVersion = appVersion;
    await this.em.initAsNewUser([Images, Series, Thumbnales, Title, Pages, Settings, OutputProfiles,ImageOutputs]);
    this.ip = new ImageProcessService();
    this.bm = new BinaryManager(this.em);
    this.tbm = new ThumbnaleManager(this.em);
    this.pb = new ThumbnaleManager(this.em);
    this.tbm = new ThumbnaleManager(this.em);
    this.im = new ImageManager(this.em);
    this.pm = new PagesManager(this.em);
    this.opm = new OutputProfilesManager(this.em);
    this.iom = new ImageOutputsManager(this.em);
    this.sm = new SettingsManager(this.em,this.opm );
    this.tm = new TitleManager(this.em);
    this.im.setTitleManager(this.tm);
    this.pm.setTitleManager(this.tm);
    await this.tm.load();
  }
  getAppTitle(){
    return this.appTitle;
  }
  getAppVersion(){
    return this.appVersion;
  }
}
