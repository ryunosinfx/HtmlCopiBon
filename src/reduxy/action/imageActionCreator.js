import { ActionCreator } from '../../util/reactive/actionCreator.js';
const baseActions = ['addImage', 'removeImage', 'sortImages', 'loadImages'];
export class ImageActionCreator {
	constructor() {}
	static creatAddAction = (targetView, data, storeKey = null) =>
		ActionCreator.createBaseAction('addImage', targetView, data, storeKey);
	static creatRemoveAction = (targetView, data, storeKey = null) =>
		ActionCreator.createBaseAction('removeImage', targetView, data, storeKey);
	static creatLoadImagesAction = (targetView, data, storeKey = null) =>
		ActionCreator.createBaseAction('loadImages', targetView, data, storeKey);
	static creatSortImagesAction = (targetView, data, storeKey = null) =>
		ActionCreator.createBaseAction('sortImages', targetView, data, storeKey);
	static creatChangeTitleImagesAction = (targetView, data, storeKey = null) =>
		ActionCreator.createBaseAction('changeTitle', targetView, data, storeKey);
	static creatDetailAction = (targetView, data, storeKey = null) =>
		ActionCreator.createBaseAction('detail', targetView, data, storeKey);
	static getStoreImagesKey = () => 'imagesData';
}
