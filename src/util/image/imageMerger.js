export class ImageMerger {
  trimByte(byteX) {
    const x = Math.floor(byteX);
    const maxByte = x > 255
      ? 255
      : x;
    const minByte = maxByte < 0
      ? 0
      : maxByte;
    return minByte;
  }
  maegeReplace(imageDataBase, images){
    mergeImages(imageDataBase, images, this.replace());
  }
  maegeLinninr(imageDataBase, images){
    mergeImages(imageDataBase, images, this.linier());
  }
  maegeMultiplication(imageDataBase, images){
    mergeImages(imageDataBase, images, this.multiplication());
  }
  mergeImages(imageDataBase, images, func) {
    const {data, width, height} = imageDataBase;
    for (let imageData of images) {
      const addData = imageData.data;
      const addWidth = imageData.width;
      const addHeight = imageData.height;
      const offsetY = imageData.offsetY
        ? imageData.offsetY
        : 0;
      const offsetX = imageData.offsetX
        ? imageData.offsetX
        : 0;
      const addOffsetY = offsetY + addHeight;
      const endY = addOffsetY > height
        ? height
        : addOffsetY;
      const addOffsetX = offsetX + addHeight;
      const endX = addOffsetX > width
        ? width
        : addOffsetX;
      for (let iy = offsetY; iy < endY; iy++) {
        const addPixcelIndexY = iy-offsetY;
        for (let ix = offsetX; ix < endX; ix++) {{
          const addPixcelIndexX = ix-offsetX;
          const basePixcelIndex = iy*width+ix;
          const addPixcelIndex = addPixcelIndexY* addWidth+addPixcelIndexX;
          func(data,basePixcelIndex,addData,addPixcelIndex);
        }
      }
    }
  }
  replace(){
    return(base, basePixcelIndex, addOne, addPixcelIndex) => {
      base[basePixcelIndex] = base[basePixcelIndex] + addOne[addPixcelIndex]
      base[basePixcelIndex + 1] = addOne[addPixcelIndex + 1]
      base[basePixcelIndex + 2] = addOne[addPixcelIndex + 2]
    }
  }
  linier() {
    return(base, basePixcelIndex, addOne, addPixcelIndex) => {
      base[basePixcelIndex] = base[basePixcelIndex] + addOne[addPixcelIndex]
      base[basePixcelIndex + 1] = base[basePixcelIndex + 1] + addOne[addPixcelIndex + 1]
      base[basePixcelIndex + 2] = base[basePixcelIndex + 2] + addOne[addPixcelIndex + 2]
    }
  }
  multiplication() {
    return(base, basePixcelIndex, addOne, addPixcelIndex) => {
      base[basePixcelIndex] = this.trimByte(base[basePixcelIndex] * addOne[addPixcelIndex] / 255);
      base[basePixcelIndex + 1] = this.trimByte(base[basePixcelIndex + 1] * addOne[addPixcelIndex + 1] / 255);
      base[basePixcelIndex + 2] = this.trimByte(base[basePixcelIndex + 2] * addOne[addPixcelIndex + 2] / 255);
    }
  }
}
