import idb from "../util/idb/idbRapper"
const title = "CopiBon";
const titlePrefix="title_";
export default class StrageService {
  constructor(){
    this.idbAccessors = new Map();
  }
  async crateTitleStore(title ="default"){
    const storeNameKey = titlePrefix+title;
    this.idbAccessor = this.idbAccessors.has(storeNameKey)? this.idbAccessors.get(storeNameKey):new  idb(storeNameKey);
    this.idbAccessors.set(storeNameKey,this.idbAccessor);
  }
  async save(fileName,data){
    await this.idbAccessor.saveDataDefault(fileName,data);
  }
  async loadAll(){
    return await this.idbAccessor.loadAllData();
  }
  async get(key){
    return await this.idbAccessor.loadData(key);
  }
  async delete(key){
    return await this.idbAccessor.deleteData(key);
  }
}
