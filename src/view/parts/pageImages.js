import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../../util/reactive/base/vtags";
import {SettingData} from '../../settings/exportSettings'
import {SettingActionCreator} from '../../reduxy/action/settingActionCreator'
import {PageImage} from './pageImage'
import {PageProcessor} from '../../reduxy/processor/pageProcessor'
import {ImageActionCreator} from '../../reduxy/action/imageActionCreator'
import {PageActionCreator} from '../../reduxy/action/pageActionCreator'
export class PageImages extends BaseView {
  constructor() {
    super("PageImages", "PageImages");
    this.storeKey = SettingActionCreator.getStoreKey();
    this.childId = this.id + "child";
    this.thumbnails = {};
    this.dummyClass = "Dummy";
    this.pages = [];
    this.storeImagesKey = ImageActionCreator.getStoreImagesKey();
    this.storePagesKey = PageActionCreator.getStorePagesKey();
    for(let index = 0; index < 32; index++){
      this.pages.push(new PageImage(this.index))
    }
  }
  render() {
    this.setting = div(this.id + "child", ["PageImagesA"], this.id);
    return div(this.id, "PageImages", [this.setting]);
  }
  async onViewShow(store, actionData) {
    let pageFrames = [];
    const pagesData = store[this.storePagesKey];
    const imagesData = store[this.storeImagesKey]
    if(imagesData && pagesData){
      //alert("onViewShow"+imagesData.length+"/"+pagesData.length+"/");
      await this.showPages(pagesData,imagesData);
      //console.log("Pages onViewShow");
    }else if (store[this.storeKey]) {
      pageFrames = this.buildPageFrames(store[this.storeKey]);
      this.prePatch("#" + this.childId, div(this.childId, pageFrames));
    } else {
      return;
    }
  }
  async showPages(pagesData,imagesData) {
    const imageMap = {};
    for(let imageData of imagesData){
      const imageEntity = imageData.imageEntity;
      const imagePk = imageEntity.getPk();
      imageMap[imageMap] = imageData;
    }
    let index =0;
    for (let pageEntity of pagesData) {
      const page = this.pages[index];
      index++;
      if(!pageEntity){
        continue;
      }
      const pk = pageEntity.getPk();
      const imagePk = pageEntity.baseImage;
      const imageData = imageMap[imagePk];
      await page.setPageData(pageEntity,imageData);
      page.renderVnode(this);
    }
  }
  creatPageFrame(pageNo,dummyClass,isRight){
    const frameParts = [];
    if(dummyClass === this.dummyClass){
      return frameParts;
    }
    const sideClass="pageFrameHeader"+(isRight?"Right":"Left");
    frameParts.push(div("",["pageFrameHeader",sideClass],pageNo+""))
    const page = this.pages[pageNo].renderVnode(this);
    frameParts.push(page)
    return frameParts;
  }
  showPreviewSingle(){
    return (event)=>{
      alert("showPreviewSingle");
    }
  }
  showPreviewDual(){
    return (event)=>{
      alert("showPreviewDual");
    }
  }
  buildPreviewButtons(){
    const previewSingle = div("",["previewCallButton"],{on:{click:this.showPreviewSingle()}},"Preview Single");
    const previewDouble = div("",["previewCallButton"],{on:{click:this.showPreviewDual()}},"Preview Dual");
    return div("",["previewFrame"],[previewSingle,previewDouble]);
  }
  buildPageFrames(setting) {
    const frames = [];
    frames.push(this.buildPreviewButtons());
    const startPage = setting.startPage;
    const pageNum = setting.pageNum*1;//SettingData.pageNums[setting.pageNum-1]*1;
    this.pageNum = pageNum;
    const pageDirection = setting.pageDirection;
    const isPageDirectionR2L = pageDirection === "r2l";
    const isPageStartR = startPage === "r";
    const frameNum = Math.ceil(pageNum / 2);
    const isOdd = (pageNum % 2 === 1);
    const isMatchPageStartSide = (pageDirection.indexOf(startPage) === 0);
    const addPageNum = isOdd
      ? 1
      : isMatchPageStartSide
        ? 0
        : 1;
    const totalPageFrame = frameNum*1 + addPageNum*1;
    const dummyClass = this.dummyClass;
    const pageClass = "Page";
    const isStartFull = (isPageDirectionR2L && isPageStartR) || (!isPageDirectionR2L && !isPageStartR)
    const leftStartDummyClass = !isPageStartR || isStartFull
      ? ""
      : dummyClass;
    const rightStartDummyClass = isPageStartR || isStartFull
      ? ""
      : dummyClass;
    const leftEndDummyClass = (isOdd && (!isStartFull || (isStartFull && !isPageDirectionR2L)))
    || (!isOdd && (!isPageDirectionR2L||isStartFull))
      ? ""
      : dummyClass;
    const rightEndDummyClass = (isOdd && (!isStartFull || (isStartFull && isPageDirectionR2L)))
    || (!isOdd && (isPageDirectionR2L||isStartFull))
      ? ""
      : dummyClass;
    const lastIndex = totalPageFrame - 1;
    let pagNo = 0;
    let pageOffset = 0;
    //console.log("★lastIndex:"+lastIndex+"/pageNum:"+pageNum+"/setting.pageNum:"+setting.pageNum);
    for (let index = 0; index < totalPageFrame; index++) {
      const leftPageNo = (
        isPageDirectionR2L
        ? 1
        : 0) + pageOffset + pagNo;
      const rightPageNo = (
        isPageDirectionR2L
        ? 0
        : 1) + pageOffset + pagNo;
      const pagePair = [];
      //////////////////////////////////
      if (index === 0) { //LR
        const leftPageNoFirst = isPageDirectionR2L && isStartFull
          ? 2
          : isPageDirectionR2L
            ? 1
            : isStartFull
              ? 1
              : 0
        const rightPageNoFirst = isPageDirectionR2L && isStartFull
          ? 1
          : isPageDirectionR2L
            ? 0
            : isStartFull
              ? 2
              : 1
        pagePair.push(div("", [
          pageClass, leftStartDummyClass
        ], this.creatPageFrame(leftPageNoFirst,leftStartDummyClass,false),totalPageFrame+"L" + leftPageNoFirst+" "+isMatchPageStartSide));
        pagePair.push(div("", [
          pageClass, rightStartDummyClass
        ], this.creatPageFrame(rightPageNoFirst,rightStartDummyClass,true),frameNum+"R" + rightPageNoFirst+" "+isOdd));
        pageOffset = 1;
        pagNo += isStartFull
          ? 2
          : 1;
      } else if (index === lastIndex) {
        pagePair.push(div("", [
          pageClass, leftEndDummyClass
        ], this.creatPageFrame(leftPageNo,leftEndDummyClass,false),"L" + leftPageNo));
        pagePair.push(div("", [
          pageClass, rightEndDummyClass
        ], this.creatPageFrame(rightPageNo,rightEndDummyClass,true),"R" + rightPageNo));
      } else {
        pagePair.push(div("", [pageClass], this.creatPageFrame(leftPageNo,"",false),"L" + leftPageNo));
        pagePair.push(div("", [pageClass], this.creatPageFrame(rightPageNo,"",true),"R" + rightPageNo));
        pagNo += 2;
      }
      frames.push(div("", ["PageFrame"], pagePair, "pageFrame index:" + index))
    }
    return frames;
  }
}
