export class ImageMerger {
  trimByte(byteX) {
    const x = Math.floor(byteX);
    const maxByte = x > 255 ?
      255 :
      x;
    const minByte = maxByte < 0 ?
      0 :
      maxByte;
    return minByte;
  }
  maegeReplace(imageDataBase, images, isBaseWhite) {
    this.beWhiteImage(imageDataBase, isBaseWhite);
    this.mergeImages(imageDataBase, images, this.replace());
  }
  maegeLinninr(imageDataBase, images, isBaseWhite) {
    this.beWhiteImage(imageDataBase, isBaseWhite);
    this.mergeImages(imageDataBase, images, this.linier());
  }
  maegeMultiplication(imageDataBase, images, isBaseWhite) {
    this.beWhiteImage(imageDataBase, isBaseWhite);
    this.mergeImages(imageDataBase, images, this.multiplication());
  }
  beWhiteImage(imageDataBase, isBaseWhite) {
    if (isBaseWhite) {
      const length = imageDataBase.data.length;
      for (let i = 0; i < length; i++) {
        imageDataBase.data[i] = 255;
      }
    }
  }
  mergeImages(imageDataBase, images, func) {
    const {
      data,
      width,
      height
    } = imageDataBase;
    for (let imageData of images) {
      const addData = imageData.data;
      const addWidth = imageData.width;
      const addHeight = imageData.height;
      //console.log(width+"*"+height+"*4="+data.length+"/"+width+"*"+height+"*4="+data.length)
      const offsetY = imageData.offsetY && imageData.offsetY > 0 && imageData.offsetY < height ?
        imageData.offsetY :
        imageData.offsetY < height ? 0 : height;
      const offsetX = imageData.offsetX && imageData.offsetX > 0 && imageData.offsetX < width ?
        imageData.offsetX :
        imageData.offsetX < width ? 0 : width;
      const addOffsetY = offsetY + addHeight;
      const endY = addOffsetY > height ?
        height :
        addOffsetY;
      const addOffsetX = offsetX + addWidth;
      const endX = addOffsetX > width ?
        width :
        addOffsetX;
      let maxY = 0;
      let maxX = 0;
      let count = 0;
      for (let iy = offsetY; iy < endY; iy++) {
        const addPixcelIndexY = iy - offsetY;
        maxY = addPixcelIndexY;
        for (let ix = offsetX; ix < endX; ix++) {
          const addPixcelIndexX = ix - offsetX;
          const basePixcelIndex = iy * width + ix;
          const addPixcelIndex = addPixcelIndexY * addWidth + addPixcelIndexX;
          count++;
          func(data, basePixcelIndex, addData, addPixcelIndex);
          maxX = addPixcelIndexX;
        }
      }
      //console.log("count:"+count+"/maxX:"+maxX+"/maxY:"+maxY+"/w:"+addWidth+"/h:"+addHeight+"/offsetX:"+offsetX+"/offsetY:"+offsetY+"/endX:"+endX+"/endY:"+endY+"/width:"+width+"/height:"+height)
    }
  }

  replace() {
    return (base, basePixcelIndex, addOne, addPixcelIndex) => {
      const index = basePixcelIndex * 4;
      const indexAdd = addPixcelIndex * 4;
      base[index] = addOne[indexAdd]
      base[index + 1] = addOne[indexAdd + 1]
      base[index + 2] = addOne[indexAdd + 2]
      base[index + 3] = 255 //addOne[addPixcelIndex + 2]
    }
  }
  linier() {
    return (base, basePixcelIndex, addOne, addPixcelIndex) => {
      const index = basePixcelIndex * 4;
      const indexAdd = addPixcelIndex * 4;
      base[index] = base[index] + addOaddOffsetXne[indexAdd]
      base[index + 1] = base[index + 1] + addOne[indexAdd + 1]
      base[index + 2] = base[index + 2] + addOne[indexAdd + 2]
    }
  }
  multiplication() {
    return (base, basePixcelIndex, addOne, addPixcelIndex) => {
      const index = basePixcelIndex * 4;
      const indexAdd = addPixcelIndex * 4;
      base[index] = this.trimByte(base[index] * addOne[indexAdd] / 255);
      base[index + 1] = this.trimByte(base[index + 1] * addOne[indexAdd + 1] / 255);
      base[index + 2] = this.trimByte(base[index + 2] * addOne[indexAdd + 2] / 255);
    }
  }
}
