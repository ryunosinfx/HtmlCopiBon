import StorageService from "./storageService";
import ViewPartsLoader from "./viewPartsLoader"
import ImageProcessService from "./imageProcessService"

const title = "CopiBon";
const titlePrefix = "title_";
export default class MainServiceImpl {
  constructor() {
    this.vpl = new ViewPartsLoader();
    this.ss = new StorageService();
    this.ss.crateTitleStore();
    this.ip = new ImageProcessService();
  }
  async init() {
    await this.ss.loadAllData();
  }
  async save(pk,data) {
    let record = data?data:pk;
    await this.ss.save(data?pk:record.name, record);
  }
  async delete(pk) {
    await this.ss.delete(pk);
  }
  async loadImages() {
    this.ss.crateTitleStore();
    return await this.ss.loadAll();
  }
  async createThumbnail(arrayBuffer,width,height,type){
    const retURI = await this.ip.create(arrayBuffer,width,height,type);
    console.log(retURI);
    return retURI;
  }
  async registerImages(files){
    for (let file of files) {
      if (loaded.has(file.name)) {
        continue;
      }
      loaded.set(file.name, file.name);
      let arrayBuffer = await fue.readAsArrayBuffer(file);
      let arrayBufferA = bc.dataURI2ArrayBuffer(await this.ms.createThumbnail(arrayBuffer,100,100,file.type)) ;
      const data = {
        ab: arrayBufferA,
        name: file.name,
        type: file.type,
        modifyDate: file.lastModifiedDate.toLocaleDateString()
      };
      //console.log(data);
      data.pk = file.name;
      vu.insertFirst(this.elm, await this.crateDataLine(data));
      delete data.pk;
      this.save(data);
    }
  }
  getViewPartsLoader(){
    return this.vpl;
  }

}
