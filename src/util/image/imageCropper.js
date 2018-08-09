import {ImageMerger} from "./imageMerger";
export class ImageCropper {
  constructor() {
    this.imageMerger = new ImageMerger();
  }

  cropImage(imageData,newWidth,newHieght,offsetX,offsetY){
    const retArray = new Uint8ClampedArray(newWidth*newHieght*4);
    const imagaDataBase = {
      data:retArray,
      width:newWidth,
      height:newHieght
    };
    imageData.offsetX = offsetX;
    imageData.offsetY = offsetY;
    this.imageMerger.maegeReplace(imagaDataBase, [imageData], false)
    return imagaDataBase;
  }
  corpImageToData(imageData,distData,offset){
    imageData.offsetX = offset.x;
    imageData.offsetY = offset.y;
    this.imageMerger.maegeReplace(distData, [imageData], false);
  }
}
