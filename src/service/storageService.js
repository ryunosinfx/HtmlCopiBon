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
  async changeStore(title ="default"){
    const storeNameKey = titlePrefix+title;
    this.idbAccessor = this.idbAccessors.has(storeNameKey)? this.idbAccessors.get(storeNameKey):new  idb(storeNameKey);
    this.idbAccessors.set(storeNameKey,this.idbAccessor);
  }
  async save(pk,data){
    let saveData = data;
    if(data.toObj){
      saveData = data.toObj();
    }
    await this.idbAccessor.saveDataDefault(pk,saveData);
  }
  async loadAll(targetObj){
    const list = await this.idbAccessor.loadAllData();
    if(targetObj && targetObj.deepClone && targetObj.load){
      const retList = [];
      for(let row of list){

      }
    }else{
      return list;
    }
    return
  }
  async get(key,targetObj){
    return await this.idbAccessor.loadData(key);
  }
  async delete(key){
    return await this.idbAccessor.deleteData(key);
  }
}
