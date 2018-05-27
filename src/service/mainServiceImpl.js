import EntityManager from "./entity/entityManager";
import ViewPartsLoader from "./viewPartsLoader";
import TitleManager from "./manager/titleManager";
import BinaryManager from "./manager/binaryManager";
import ImageManager from "./manager/imageManager";
import ThumbnaleManager from "./manager/thumbnailManager";
import Images from "../entity/images";
import Pdfs from "../entity/pdfs";
import Series from "../entity/series";
import Thumbnales from "../entity/thumbnales";
import Title from "../entity/title";
import ImageProcessService from "./imageProcessService"

const title = "CopiBon";
const titlePrefix = "title_";
export default class MainServiceImpl {
  constructor() {
    this.vpl = new ViewPartsLoader();
    this.em = new EntityManager();
  }
  async init() {
    await this.em.initAsNewUser([new Images(),new Pdfs(),new Series(),new Thumbnales(),new Title()]);
    this.ip = new ImageProcessService();
    this.tm = new TitleManager(this.em);
    this.bm = new BinaryManager(this.em);
    this.im = new ImageManager(this.em);
    this.tbm = new ThumbnaleManager(this.em);
    await this.tm.load();
  }

  getViewPartsLoader(){
    return this.vpl;
  }
}
