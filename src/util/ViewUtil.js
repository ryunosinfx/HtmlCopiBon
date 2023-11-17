export class ViewUtil {
	constructor() {}

	static getCurrentPointedElm(event) {
		const touches = event.touches;
		const ex = touches ? (touches[0] ? touches[0].pageX : 0) : event.pageX;
		const ey = touches ? (touches[0] ? touches[0].pageY : 0) : event.pageY;
		const wox = window.pageXOffset;
		const woy = window.pageYOffset;
		// console.log("event.name+:" + event.name + "/ex:" + ex + "/ey:" + ey + "/wox:" + wox + "/woy:" + woy);
		const elm = document.elementFromPoint(ex - wox, ey - woy);
		// console.log(elm);
		return elm;
	}
	static clearSideElmClass(elm, className) {
		if (!elm || !elm.style) return;
		elm.style.opacity = '1';
		const childNodes = elm.parentNode.childNodes;
		for (const col of childNodes) col.classList.remove(className);
	}
	static create = (id, className, text) => ViewUtil.ce('div', id, className, text);
	static createInput = (id, className, text) => ViewUtil.ce('input', id, className, text);
	static createText = (id, className, text) => ViewUtil.ce('text', id, className, text);
	static createFile = (id, className, text) => ViewUtil.ce('input', id, className, text, 'file');
	static createCanvas = (id, className, text) => ViewUtil.ce('canvas', id, className, text);
	static createImage = (id, className, text) => ViewUtil.ce('img', id, className, text);
	static createUl = (id, className, text) => ViewUtil.ce('ul', id, className, text);
	static createLabel(id, className, text, forId) {
		const elm = ViewUtil.ce('label', id, className, text);
		elm.setAttribute('for', forId);
		return elm;
	}
	static createLi = (id, className, text) => ViewUtil.ce('li', id, className, text);
	static createSpan = (id, className, text) => ViewUtil.ce('span', id, className, text);
	static createStrong = (id, className, text) => ViewUtil.ce('strong', id, className, text);
	static createA = (id, className, text) => ViewUtil.ce('a', id, className, text);
	static ce(tagName, id, className, text, type) {
		const elm = document.createElement(tagName);
		elm.className = className;
		if (id) {
			elm.id = id;
		}
		if (tagName === 'input' && text) {
			elm.setAttribute('value', text);
			if (type) {
				elm.setAttribute('type', type);
			}
		} else if (text) {
			elm.textContent = text;
		}
		return elm;
	}
	static on = (elm, eventType, eventHandler) => elm.addEventListener(eventType, eventHandler, false);
	static off = (elm, eventType, eventHandler) => elm.removeEventListener(eventType, eventHandler, false);
	static append = (parent, child) => parent.appendChild(child);
	static insertFirst = (parent, child) =>
		parent.hasChildNodes() ? parent.insertBefore(child, parent.childNodes[0]) : parent.appendChild(child);
	static getBodyElm = () => document.getElementsByTagName('body')[0];
	static attachBody = (elm) => document.getElementsByTagName('body')[0].appendChild(elm);
	static detacthBodyById = (id) => document.getElementsByTagName('body')[0].removeChild(documet.getElementById(id));
	static removeChild = (child) => child.parentNode.removeChild(child);
	static remove(id) {
		const child = documet.getElementById(id);
		if (child.parentNode) child.parentNode.removeChild(child);
	}
	static removeChildren(id) {
		const elm = documet.getElementById(id);
		while (elm.firstChild) elm.removeChild(elm.firstChild);
	}
	static setStyles(elm, styleObj) {
		for (const name in styleObj) elm.style[name] = styleObj[name];
	}
	static text = (elm, text) => (elm.textContent = text);

	static emit(elm, eventType, isBubbling = true, isCancelable = true) {
		const event = document.createEvent('HTMLEvents');
		event.initEvent(eventType, isBubbling, isCancelable);
		return elm.dispatchEvent(event);
	}
}
