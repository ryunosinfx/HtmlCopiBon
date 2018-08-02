import {Sorter} from "../../util/sorter";
import {ImageResizer} from "../../util/image/imageResizer";
import {MainService} from "../../service/mainService"
export class PreviewProcessor {
  constructor() {
    this.ms = MainService.getInstance();
    this.em = this.ms.em;
    this.tm = this.ms.tm;
    this.ip = this.ms.ip;
    this.imageResizer = new ImageResizer();
    this.previewMaxWidth = 100;
    this.previewMaxHeight = 100;
  }

  async loadPreviews() {
    const title = await this.tm.load();
    const pages = title.pages;
    const retPreviews = [];
    for (let pagePk of pages) {
      const pageEnitity = await this.em.get(pagePk);
      const previewThumbnail = pageEnitity.previewThumbnail;
      const baseImage = pageEnitity.baseImage;
      if (baseImage) {
        if (previewThumbnail) {
          const binaryEntity = await this.em.get(previewThumbnail);
          retPreviews.push(binaryEntity);
        } else {
          const imageEntity = await this.em.get(baseImage);
          const binaryEntity = await this.em.get(imageEntity.binary);
          //TODO mk previews
          const data = await this.ip.getImageDataFromArrayBuffer(binaryEntity._ab);
          const newData = this.imageResizer.resizeInMaxSize(data,this.previewMaxWidth,this.previewMaxHeight);
           binaryEntity._ab =this.ip.getArrayBufferFromPixcelData(newData);
           // console.log(newData.data);
           // console.log(binaryEntity._ab);
           // alert(newData.data);
          retPreviews.push(binaryEntity);
        }
      } else {
        retPreviews.push(null);
      }
    }
    return retPreviews;
  }
  shapeListBySets(previews, isSingle, setting) {
    if (isSingle) {
      const retSetLis = [];
      for (let index in previews) {
        retSetLis.push(this.cratePageData(index*1+1, false, false, previews));
      }
      return retSetLis;
    } else {
      return this.buildPageFrames(setting, previews);
    }
  }
  cratePageData(pageNo, className, isRight, binaries) {
    return {
      pageNo: pageNo,
      isDummy: className === this.dummyClass,
      isRight: isRight,
      binary: binaries[pageNo - 1]
    }
  }
  buildPageFrames(setting, binaries) {
    const retFrames = [];
    const startPage = setting.startPage;
    const pageNum = setting.pageNum * 1; //SettingData.pageNums[setting.pageNum-1]*1;
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
    const totalPageFrame = frameNum * 1 + addPageNum * 1;
    const dummyClass = this.dummyClass;
    const pageClass = "Page";
    const isStartFull = (isPageDirectionR2L && isPageStartR) || (!isPageDirectionR2L && !isPageStartR)
    const leftStartDummyClass = !isPageStartR || isStartFull
      ? ""
      : dummyClass;
    const rightStartDummyClass = isPageStartR || isStartFull
      ? ""
      : dummyClass;
    const leftEndDummyClass = (isOdd && (!isStartFull || (isStartFull && !isPageDirectionR2L))) || (!isOdd && (!isPageDirectionR2L || isStartFull))
      ? ""
      : dummyClass;
    const rightEndDummyClass = (isOdd && (!isStartFull || (isStartFull && isPageDirectionR2L))) || (!isOdd && (isPageDirectionR2L || isStartFull))
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
      retFrames.push(pagePair);
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
        pagePair.push(this.cratePageData(leftPageNoFirst, leftStartDummyClass, false, binaries));
        pagePair.push(this.cratePageData(rightPageNoFirst, rightStartDummyClass, true, binaries));
        pageOffset = 1;
        pagNo += isStartFull
          ? 2
          : 1;
      } else if (index === lastIndex) {
        pagePair.push(this.cratePageData(leftPageNo, leftEndDummyClass, false, binaries));
        pagePair.push(this.cratePageData(rightPageNo, rightEndDummyClass, true, binaries));
      } else {
        pagePair.push(this.cratePageData(leftPageNo, "", false, binaries));
        pagePair.push(this.cratePageData(rightPageNo, "", true, binaries));
        pagNo += 2;
      }
    }
    return retFrames;
  }
}
