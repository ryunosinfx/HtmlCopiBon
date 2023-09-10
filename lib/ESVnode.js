/**es ported form snabbdom/snabbdom */
export class ESVnode {
	static h(sel, b, c) {
		return H.h(sel, b, c);
	}
	static init() {
		ESVnU.init(modules);
		return (currentVnode, newVnode) => {
			return ESVnU.patch(currentVnode, newVnode);
		};
	}
}
const SVG_NS = 'http://www.w3.org/2000/svg';
class H {
	static addNS(data, children, sel) {
		data.ns = SVG_NS;
		if (sel !== 'foreignObject' && U.isArray(children))
			for (const ch of children)
				if (typeof ch === 'string') continue;
				else if (U.isDef(ch.data)) H.addNS(ch.data, ch.children, ch.sel);
	}
	static h(sel, b, c) {
		let data = {};
		let children;
		let text;
		if (U.isDef(c) && b) data = b;
		if (U.isArray(c)) children = c;
		else if (U.isPrimitive(c)) text = c.toString();
		else if (c && c.sel) children = [c];
		else if (b !== undefined && b !== null)
			if (U.isArray(b)) children = b;
			else if (U.isPrimitive(b)) text = b.toString();
			else if (b && b.sel) children = [b];
			else data = b;
		if (U.isArray(children))
			for (let i = 0; i < children.length; ++i)
				if (U.isPrimitive(children[i]))
					children[i] = new VNode(undefined, undefined, undefined, children[i], undefined);
		if (sel.indexOf('svg') === 0 && (sel.length === 3 || sel[3] === '.' || sel[3] === '#'))
			H.addNS(data, children, sel);
		return new VNode(sel, data, children, text, undefined);
	}
	static fragment(children) {
		let c;
		let text;
		if (U.isArray(children)) c = children;
		else if (U.isPrimitive(children)) text = children;
		else if (children && children.sel) c = [children];
		if (U.isArray(c))
			for (let i = 0; i < c.length; ++i)
				if (U.isPrimitive(c[i])) c[i] = new VNode(undefined, undefined, undefined, c[i], undefined);
		return new VNode(undefined, {}, c, text, undefined);
	}
	static toVNode(node, api = HtmlDomApi) {
		if (api.isElement(node)) {
			const id = node.id ? '#' + node.id : '';
			const cn = node.getAttribute('class');
			const c = cn ? '.' + cn.split(' ').join('.') : '';
			const sel = api.tagName(node).toLowerCase() + id + c;
			const attrs = {};
			const dataset = {};
			let name;
			const elmAttrs = node.attributes;
			const elmChildren = node.childNodes;
			for (let i = 0, n = elmAttrs.length; i < n; i++) {
				name = elmAttrs[i].nodeName;
				if (name.indexOf('data-') === 0) dataset[name.slice(5)] = elmAttrs[i].nodeValue || '';
				else if (name !== 'id' && name !== 'class') attrs[name] = elmAttrs[i].nodeValue;
			}
			const children = [];
			for (let i = 0, n = elmChildren.length; i < n; i++) children.push(toVNode(elmChildren[i], domApi));
			const data = {};
			if (Object.keys(attrs).length > 0) data.attrs = attrs;
			if (Object.keys(dataset).length > 0) data.dataset = dataset;
			if (name.indexOf('svg') === 0 && (sel.length === 3 || sel[3] === '.' || sel[3] === '#'))
				H.addNS(data, children, sel);
			return new VNode(sel, data, children, undefined, node);
		} else if (api.isText(node)) return new VNode(undefined, undefined, undefined, api.getTextContent(node), node);
		else if (api.isComment(node)) return new VNode('!', {}, [], api.getTextContent(node), node);
		else return new VNode('', {}, [], undefined, node);
	}
}
class ESVnU {
	static cbs = {
		create: [],
		update: [],
		remove: [],
		destroy: [],
		pre: [],
		post: [],
	};
	static init(modules, options = null) {
		for (const hook in ESVnU.cbs) for (const m of modules) if (U.isDef(m[hook])) ESVnU.cbs[hook].push(m[hook]);
	}
	static patch(cVN, nVN) {
		const insertedVnQ = [];
		for (const pre of cbs.pre) pre();
		if (HtmlDomApi.isElement(cVN)) cVN = ESVnU.emptyNodeAt(cVN);
		else if (HtmlDomApi.isDocumentFragment(cVN)) cVN = ESVnU.emptyDocumentFragmentAt(cVN);
		if (ESVnU.isSameVnode(cVN, nVN)) ESVnU.patchVnode(cVN, nVN, insertedVnQ);
		else {
			const parent = HtmlDomApi.parentNode(cVN.elm);
			ESVnU.createElm(nVN, insertedVnQ);
			if (parent !== null) {
				HtmlDomApi.insertBefore(parent, nVN.elm, HtmlDomApi.nextSibling(cVN.elm));
				ESVnU.removeVnodes(parent, [cVN], 0, 0);
			}
		}
		for (const iq of insertedVnQ) iq.data.hook.insert(iq);
		for (const post of cbs.post) post();
		return nVN;
	}
	static emptyNodeAt(elm) {
		const id = elm.id ? '#' + elm.id : '';
		const classes = elm.getAttribute('class');
		const c = classes ? '.' + classes.split(' ').join('.') : '';
		return new VNode(HtmlDomApi.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
	}
	static isSameVnode(vn1, vn2) {
		const isSameKey = vn1.key === vn2.key;
		const isSameIs = vn1.data?.is === vn2.data?.is;
		const isSameSel = vn1.sel === vn2.sel;
		const isSameTextOrFragment = !vn1.sel && vn1.sel === vn2.sel ? typeof vn1.text === typeof vn2.text : true;
		return isSameSel && isSameKey && isSameIs && isSameTextOrFragment;
	}
	static emptyDocumentFragmentAt(frag) {
		return new VNode(undefined, {}, [], undefined, frag);
	}
	static patchVnode(oVN, nVN, insertedVnQ) {
		const hook = nVN.data?.hook;
		hook?.prepatch?.(oVN, nVN);
		const elm = (nVN.elm = oVN.elm);
		if (oVN === nVN) return;
		if (nVN.data !== undefined || (U.isDef(nVN.text) && nVN.text !== oVN.text)) {
			nVN.data ??= {};
			oVN.data ??= {};
			for (const updateCallBack of ESVnU.cbs.update) updateCallBack(oVN, nVN);
			nVN.data?.hook?.update?.(oVN, nVN);
		}
		const oldCh = oVN.children;
		const ch = nVN.children;
		if (U.isUndef(nVN.text)) {
			if (U.isDef(oldCh) && U.isDef(ch)) {
				if (oldCh !== ch) ESVnU.updateChildren(elm, oldCh, ch, insertedVnQ);
			} else if (U.isDef(ch)) {
				if (U.isDef(oVN.text)) HtmlDomApi.setTextContent(elm, '');
				ESVnU.addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnQ);
			} else if (U.isDef(oldCh)) ESVnU.removeVnodes(elm, oldCh, 0, oldCh.length - 1);
			else if (U.isDef(oVN.text)) HtmlDomApi.setTextContent(elm, '');
		} else if (oVN.text !== nVN.text) {
			if (U.isDef(oldCh)) ESVnU.removeVnodes(elm, oldCh, 0, oldCh.length - 1);
			HtmlDomApi.setTextContent(elm, nVN.text);
		}
		hook?.postpatch?.(oVN, nVN);
	}
	static updateChildren(pElm, oldCh, newCh, insertedVnQ) {
		let oStartIdx = 0;
		let nStartIdx = 0;
		let oEndIdx = oldCh.length - 1;
		let oStartVn = oldCh[0];
		let oEndVn = oldCh[oEndIdx];
		let nEndIdx = newCh.length - 1;
		let nStartVn = newCh[0];
		let nEndVn = newCh[nEndIdx];
		let oKeyToIdx;
		while (oStartIdx <= oEndIdx && nStartIdx <= nEndIdx) {
			if (!oStartVn) oStartVn = oldCh[++oStartIdx]; // Vnode might have been moved left
			else if (!oEndVn) oEndVn = oldCh[--oEndIdx];
			else if (!nStartVn) nStartVn = newCh[++nStartIdx];
			else if (!nEndVn) nEndVn = newCh[--nEndIdx];
			else if (ESVnU.isSameVnode(oStartVn, nStartVn)) {
				ESVnU.patchVnode(oStartVn, nStartVn, insertedVnQ);
				oStartVn = oldCh[++oStartIdx];
				nStartVn = newCh[++nStartIdx];
			} else if (ESVnU.isSameVnode(oEndVn, nEndVn)) {
				ESVnU.patchVnode(oEndVn, nEndVn, insertedVnQ);
				oEndVn = oldCh[--oEndIdx];
				nEndVn = newCh[--nEndIdx];
			} else if (ESVnU.isSameVnode(oStartVn, nEndVn)) {
				ESVnU.patchVnode(oStartVn, nEndVn, insertedVnQ); // Vnode moved right
				HtmlDomApi.insertBefore(pElm, oStartVn.elm, HtmlDomApi.nextSibling(oEndVn.elm));
				oStartVn = oldCh[++oStartIdx];
				nEndVn = newCh[--nEndIdx];
			} else if (ESVnU.isSameVnode(oEndVn, nStartVn)) {
				ESVnU.patchVnode(oEndVn, nStartVn, insertedVnQ); // Vnode moved left
				HtmlDomApi.insertBefore(pElm, oEndVn.elm, oStartVn.elm);
				oEndVn = oldCh[--oEndIdx];
				nStartVn = newCh[++nStartIdx];
			} else {
				if (U.isUndef(oKeyToIdx)) oKeyToIdx = ESVnU.createKeyToOldIdx(oldCh, oStartIdx, oEndIdx);
				const idxInOld = oKeyToIdx[nStartVn.key];
				if (U.isUndef(idxInOld))
					HtmlDomApi.insertBefore(pElm, ESVnU.createElm(nStartVn, insertedVnQ), oStartVn.elm);
				else {
					const elmToMove = oldCh[idxInOld]; // New element
					if (elmToMove.sel !== nStartVn.sel)
						HtmlDomApi.insertBefore(pElm, ESVnU.createElm(nStartVn, insertedVnQ), oStartVn.elm);
					else {
						ESVnU.patchVnode(elmToMove, nStartVn, insertedVnQ);
						oldCh[idxInOld] = undefined;
						HtmlDomApi.insertBefore(pElm, elmToMove.elm, oStartVn.elm);
					}
				}
				nStartVn = newCh[++nStartIdx];
			}
		}
		if (nStartIdx <= nEndIdx) {
			const b = newCh[nEndIdx + 1];
			ESVnU.addVnodes(pElm, b ? b.elm : null, newCh, nStartIdx, nEndIdx, insertedVnQ);
		}
		if (oStartIdx <= oEndIdx) ESVnU.removeVnodes(pElm, oldCh, oStartIdx, oEndIdx);
	}
	static createElm(vn, insertedVnQ) {
		let data = vn.data;
		const initHook = U.isDef(data) ? data.hook?.init : null;
		if (U.isDef(initHook)) {
			initHook(vn);
			data = vn.data;
		}
		const sel = vn.sel;
		if (sel === '!') {
			if (U.isUndef(vn.text)) vn.text = '';
			vn.elm = HtmlDomApi.createComment(vn.text);
		} else if (U.isDef(sel)) {
			const emptyNode = new VNode('', {}, [], undefined, undefined);
			const hashIdx = sel.indexOf('#'); // Parse selector
			const dotIdx = sel.indexOf('.', hashIdx);
			const hash = hashIdx > 0 ? hashIdx : sel.length;
			const dot = dotIdx > 0 ? dotIdx : sel.length;
			const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
			const elm = (vn.elm =
				U.isDef(data) && U.isDef(data.ns)
					? HtmlDomApi.createElementNS(data.ns, tag, data)
					: HtmlDomApi.createElement(tag, data));
			if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot));
			if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
			for (const createCallBack of ESVnU.cbs.create) createCallBack(emptyNode, vn);
			if (U.isArray(vn.children))
				for (const ch of vn.children)
					if (ch) HtmlDomApi.appendChild(elm, ESVnU.createElm(ch, insertedVnQ));
					else if (U.isPrimitive(vn.text)) HtmlDomApi.appendChild(elm, HtmlDomApi.createTextNode(vn.text));
			const hook = vn.data.hook;
			if (U.isDef(hook)) {
				hook.create?.(emptyNode, vn);
				if (hook.insert) insertedVnQ.push(vn);
			}
		} else if (options?.experimental?.fragments && U.isArray(vn.children)) {
			const emptyNode = new VNode('', {}, [], undefined, undefined);
			vn.elm = (HtmlDomApi.createDocumentFragment ?? documentFragmentIsNotSupported)();
			for (const createCallBack of ESVnU.cbs.create) createCallBack(emptyNode, vn);
			for (const ch of vn.children) if (ch) HtmlDomApi.appendChild(vn.elm, ESVnU.createElm(ch, insertedVnQ));
		} else vn.elm = HtmlDomApi.createTextNode(vn.text);
		return vn.elm;
	}
	static invokeDestroyHook(vn) {
		const data = vn.data;
		if (U.isUndef(data)) return;
		data?.hook?.destroy?.(vn);
		for (const destroyCallBack of ESVnU.cbs.destroy) destroyCallBack(vn);
		if (U.isArray(vn.children))
			for (const ch of vn.children) if (ch && typeof ch !== 'string') ESVnU.invokeDestroyHook(ch);
	}
	static addVnodes(parentElm, before = null, vnodes, startIdx, endIdx, insertedVnQ) {
		for (let i = startIdx; i <= endIdx; ++i) {
			const ch = vnodes[i];
			if (ch) HtmlDomApi.insertBefore(parentElm, ESVnU.createElm(ch, insertedVnQ), before);
		}
	}
	static removeVnodes(parentElm, vnodes, startIdx, endIdx) {
		for (let i = startIdx; i <= endIdx; ++i) {
			const ch = vnodes[i];
			if (ch)
				if (U.isDef(ch.sel)) {
					ESVnU.invokeDestroyHook(ch);
					const rm = ESVnU.createRmCb(ch.elm, cbs.remove.length + 1);
					for (const removeCallBack of ESVnU.cbs.remove) removeCallBack(ch, rm);
					const removeHook = ch?.data?.hook?.remove;
					if (U.isDef(removeHook)) removeHook(ch, rm);
					else rm();
				} else if (ch.children) {
					ESVnU.invokeDestroyHook(ch); // Fragment node
					ESVnU.removeVnodes(parentElm, ch.children, 0, ch.children.length - 1);
				} else HtmlDomApi.removeChild(parentElm, ch.elm); // Text node
		}
	}
	static createRmCb(childElm, listenersCount) {
		return () => {
			if (--listenersCount === 0) HtmlDomApi.removeChild(HtmlDomApi.parentNode(childElm), childElm);
		};
	}
	static createKeyToOldIdx(children, beginIdx, endIdx) {
		const map = {};
		for (let i = beginIdx; i <= endIdx; ++i) {
			const key = children[i]?.key;
			if (U.isDef(key)) map[key] = i;
		}
		return map;
	}
}
class U {
	static isUndef(s) {
		return s === undefined;
	}
	static isDef(s) {
		return s !== undefined;
	}
	static isPrimitive(s) {
		return typeof s === 'string' || typeof s === 'number' || s instanceof String || s instanceof Number;
	}
	static isArray(a) {
		return Array.isArray(a);
	}
}
const d = document;
class HtmlDomApi {
	static NODE_TYPE = {
		ELEMNT: 1,
		TEXT: 3,
		COMMENT: 8,
		DOCUMENTFRAGMENT: 11,
	};
	static createElement(tagName = '', options = {}) {
		return d.createElement(tagName, options);
	}
	static createElementNS(namespaceURI = '', qualifiedName = '', options = {}) {
		return d.createElementNS(namespaceURI, qualifiedName, options);
	}
	static createDocumentFragment() {
		return HtmlDomApi.parseFragment(d.createDocumentFragment());
	}
	static createTextNode(text = '') {
		return d.createTextNode(text);
	}
	static createComment(text = '') {
		return d.createComment(text);
	}
	static insertBefore(parentNode, newNode, refNode = null) {
		if (HtmlDomApi.isDocumentFragment(parentNode)) {
			let node = parentNode;
			while (node && HtmlDomApi.isDocumentFragment(node)) {
				const fragment = HtmlDomApi.parseFragment(node);
				node = fragment.parent;
			}
			parentNode = node ?? parentNode;
		}
		if (HtmlDomApi.isDocumentFragment(newNode)) newNode = HtmlDomApi.parseFragment(newNode, parentNode);
		if (refNode && HtmlDomApi.isDocumentFragment(refNode))
			refNode = HtmlDomApi.parseFragment(refNode).firstChildNode;
		parentNode.insertBefore(newNode, refNode);
	}
	static removeChild(node, child) {
		node.removeChild(child);
	}
	static appendChild(node, child) {
		if (HtmlDomApi.isDocumentFragment(child)) child = parseFragment(child, node);
		node.appendChild(child);
	}
	static parentNode(node) {
		if (!HtmlDomApi.isDocumentFragment(node)) return node.parentNode;
		while (node && HtmlDomApi.isDocumentFragment(node)) {
			const fragment = HtmlDomApi.parseFragment(node);
			node = fragment.parent;
		}
		return node ?? null;
	}
	static nextSibling(node) {
		if (!HtmlDomApi.isDocumentFragment(node)) return node.nextSibling;
		const fragment = HtmlDomApi.parseFragment(node);
		const parent = HtmlDomApi.parentNode(fragment);
		if (parent && fragment.lastChildNode) {
			const children = Array.from(parent.childNodes);
			const index = children.indexOf(fragment.lastChildNode);
			return children[index + 1] ?? null;
		}
		return null;
	}
	static tagName(elm) {
		return elm.tagName;
	}
	static setTextContent(node, text = null) {
		node.textContent = text;
	}
	static getTextContent(node) {
		return node.textContent;
	}
	static isElement(node) {
		return node.nodeType === HtmlDomApi.NODE_TYPE.ELEMNT;
	}
	static isText(node) {
		return node.nodeType === HtmlDomApi.NODE_TYPE.TEXT;
	}
	static isComment(node) {
		return node.nodeType === HtmlDomApi.NODE_TYPE.COMMENT;
	}
	static isDocumentFragment(node) {
		return node.nodeType === HtmlDomApi.NODE_TYPE.DOCUMENTFRAGMENT;
	}
	static parseFragment(fragmentNode, parentNode = null) {
		const fragment = fragmentNode;
		fragment.parent ??= !!parentNode ? parentNode : null;
		fragment.firstChildNode ??= fragmentNode.firstChild;
		fragment.lastChildNode ??= fragmentNode.lastChild;
		return fragment;
	}
}
class VNode {
	constructor(sel, data = {}, children = [], text, elm) {
		this.key = data === undefined ? undefined : data.key;
		this.sel = sel;
		this.data = data;
		this.children = children;
		this.text = text;
		this.elm = elm;
	}
}
class ESVclassM {
	static updateClass(oldVnode, vnode) {
		const elm = vnode.elm;
		const oldClassP = oldVnode.data.class;
		const klassP = vnode.data.class;
		if (!oldClassP && !klassP) return;
		if (oldClassP === klassP) return;
		const oldClass = oldClassP || {};
		const klass = klassP || {};
		for (const name in oldClass)
			if (oldClass[name] && !Object.prototype.hasOwnProperty.call(klass, name)) elm.classList.remove(name); // was `true` and now not provided
		for (const name in klass) {
			const cur = klass[name];
			if (cur !== oldClass[name]) elm.classList[cur ? 'add' : 'remove'](name);
		}
	}
	static create(oldVnode, vnode) {
		return ESVclassM.updateClass(oldVnode, vnode);
	}
	static update(oldVnode, vnode) {
		return ESVclassM.updateClass(oldVnode, vnode);
	}
}
class ESVstyleM {
	static nextFrame(fn) {
		const raf = (typeof window !== 'undefined' && window.requestAnimationFrame.bind(window)) || setTimeout;
		raf(function () {
			raf(fn);
		});
	}
	static reflowForced = false;
	static setNextFrame(obj, prop, val) {
		ESVstyleM.nextFrame(function () {
			obj[prop] = val;
		});
	}
	static updateStyle(oldVnode, vnode) {
		const elm = vnode.elm;
		const oldStyleP = oldVnode.data.style;
		const styleP = vnode.data.style;
		if (!oldStyleP && !styleP) return;
		if (oldStyleP === styleP) return;
		const oldStyle = oldStyleP || {};
		const style = styleP || {};
		const oldHasDel = 'delayed' in oldStyle;
		for (const name in oldStyle)
			if (!style[name])
				if (name[0] === '-' && name[1] === '-') elm.style.removeProperty(name);
				else elm.style[name] = '';
		for (const name in style) {
			const cur = style[name];
			if (name === 'delayed' && style.delayed) {
				for (const name2 in style.delayed) {
					cur = style.delayed[name2];
					if (!oldHasDel || cur !== oldStyle.delayed[name2]) ESVstyleM.setNextFrame(elm.style, name2, cur);
				}
			} else if (name !== 'remove' && cur !== oldStyle[name])
				if (name[0] === '-' && name[1] === '-') elm.style.setProperty(name, cur);
				else elm.style[name] = cur;
		}
	}
	static applyDestroyStyle(vnode) {
		let style;
		const elm = vnode.elm;
		const s = vnode.data.style;
		if (!s || !(style = s.destroy)) return;
		for (const name in style) elm.style[name] = style[name];
	}
	static applyRemoveStyle(vnode, rm = () => {}) {
		const s = vnode.data.style;
		if (!s || !s.remove) return rm();
		if (!ESVstyleM.reflowForced) {
			vnode.elm.offsetLeft; // eslint-disable-next-line @typescript-eslint/no-unused-expressions
			ESVstyleM.reflowForced = true;
		}
		const elm = vnode.elm;
		const style = s.remove;
		let amount = 0;
		const applied = [];
		for (const name in style) {
			applied.push(name);
			elm.style[name] = style[name];
		}
		const compStyle = getComputedStyle(elm);
		const props = compStyle['transition-property'].split(', ');
		for (const prop of props) if (applied.indexOf(prop) !== -1) amount++;
		elm.addEventListener('transitionend', function (ev) {
			if (ev.target === elm) --amount;
			if (amount === 0) rm();
		});
	}
	static forceReflow() {
		ESVstyleM.reflowForced = false;
	}
	static pre() {
		ESVstyleM.forceReflow();
	}
	static create(oldVnode, vnode) {
		ESVstyleM.updateStyle(oldVnode, vnode);
	}
	static update(oldVnode, vnode) {
		ESVstyleM.updateStyle(oldVnode, vnode);
	}
	static destroy(vnode, rm) {
		ESVstyleM.applyDestroyStyle(vnode, rm);
	}
	static remove(vnode, rm) {
		ESVstyleM.applyDestroyStyle(vnode, rm);
	}
}
class ESVpropM {
	static updateProps(oldVnode, vnode) {
		const elm = vnode.elm;
		const oldPropsP = oldVnode.data.props;
		const propsP = vnode.data.props;
		if (!oldPropsP && !propsP) return;
		if (oldPropsP === propsP) return;
		const oldProps = oldPropsP || {};
		const props = propsP || {};
		for (const key in props) {
			const cur = props[key];
			if (oldProps[key] !== cur && (key !== 'value' || elm[key] !== cur)) elm[key] = cur;
		}
	}
	static create(oldVnode, vnode) {
		ESVstyleM.updateStyle(oldVnode, vnode);
	}
	static update(oldVnode, vnode) {
		ESVstyleM.updateStyle(oldVnode, vnode);
	}
}
class ESVattrM {
	static xlinkNS = 'http://www.w3.org/1999/xlink';
	static xmlNS = 'http://www.w3.org/XML/1998/namespace';
	static colonChar = 58;
	static xChar = 120;
	static updateAttrs(oldVnode, vnode) {
		const elm = vnode.elm;
		const oldAttrsP = oldVnode.data.attrs;
		const attrsP = vnode.data.attrs;
		if (!oldAttrsP && !attrsP) return;
		if (oldAttrsP === attrsP) return;
		const oldAttrs = oldAttrsP || {};
		const attrs = attrsP || {};
		for (const key in attrs) {
			const cur = attrs[key]; // update modified attributes, add new attributes
			const old = oldAttrs[key];
			if (old !== cur)
				if (cur === true) elm.setAttribute(key, '');
				else if (cur === false) elm.removeAttribute(key);
				else if (key.charCodeAt(0) !== ESVattrM.xChar) elm.setAttribute(key, cur);
				else if (key.charCodeAt(3) === ESVattrM.colonChar)
					elm.setAttributeNS(ESVattrM.xmlNS, key, cur); // Assume xml namespace
				else if (key.charCodeAt(5) === ESVattrM.colonChar)
					elm.setAttributeNS(ESVattrM.xlinkNS, key, cur); // Assume xlink namespace
				else elm.setAttribute(key, cur);
		}
		for (const key in oldAttrs) if (!(key in attrs)) elm.removeAttribute(key);
	}
	static create(oldVnode, vnode) {
		ESVattrM.updateAttrs(oldVnode, vnode);
	}
	static update(oldVnode, vnode) {
		ESVattrM.updateAttrs(oldVnode, vnode);
	}
}
class ESVdatasetM {
	static CAPS_REGEX = /[A-Z]/g;
	static updateDataset(oldVnode, vnode) {
		const elm = vnode.elm;
		const oldDatasetP = oldVnode.data.dataset;
		const datasetP = vnode.data.dataset;
		if (!oldDatasetP && !datasetP) return;
		if (oldDatasetP === datasetP) return;
		const oldDataset = oldDatasetP || {};
		const dataset = datasetP || {};
		const d = elm.dataset;
		for (const key in oldDataset)
			if (!dataset[key])
				if (d)
					if (key in d) delete d[key];
					else elm.removeAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase());
		for (const key in dataset)
			if (oldDataset[key] !== dataset[key])
				if (d) d[key] = dataset[key];
				else elm.setAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(), dataset[key]);
	}
	static create(oldVnode, vnode) {
		ESVdatasetM.updateDataset(oldVnode, vnode);
	}
	static update(oldVnode, vnode) {
		ESVdatasetM.updateDataset(oldVnode, vnode);
	}
}
class ESVeventlistenerM {
	static invokeHandler(handler, vnode, event) {
		if (typeof handler === 'function') handler.call(vnode, event, vnode); // call function handler
		else if (U.isArray(handler)) for (const h of handler) ESVeventlistenerM.invokeHandler(h, vnode, event); // call multiple handlers
	}
	static handleEvent(event, vnode) {
		const name = event.type;
		const on = vnode.data.on;
		if (on && on[name]) ESVeventlistenerM.invokeHandler(on[name], vnode, event); // call event handler(s) if exists
	}
	static createListener() {
		return function handler(event) {
			handleEvent(event, handler.vnode);
		};
	}
	static updateEventListeners(oldVnode, vnode) {
		const oldOn = oldVnode.data.on;
		const oldListener = oldVnode.listener;
		const oldElm = oldVnode.elm;
		const on = vnode && vnode.data.on;
		const elm = vnode && vnode.elm; // remove existing listeners which no longer used// if element changed or deleted we remove all existing listeners unconditionally
		if (oldOn === on) return; // optimization for reused immutable handlers
		if (oldOn && oldListener)
			if (!on) for (const name in oldOn) oldElm.removeEventListener(name, oldListener, false);
			else for (const name in oldOn) if (!on[name]) oldElm.removeEventListener(name, oldListener, false); // remove listener if element was changed or existing listeners removed// remove listener if existing listener removed
		if (on) {
			const listener = (vnode.listener = oldVnode.listener || createListener()); // add new listeners which has not already attached// reuse existing listener or create new
			listener.vnode = vnode; // update vnode for listener // if element changed or added we add all needed listeners unconditionally // add listener if element was changed or new listeners added
			if (!oldOn) for (const name in on) elm.addEventListener(name, listener, false);
			else for (const name in on) if (!oldOn[name]) elm.addEventListener(name, listener, false); // add listener if new listener added
		}
	}
	static create(oldVnode, vnode) {
		ESVdatasetM.updateDataset(oldVnode, vnode);
	}
	static update(oldVnode, vnode) {
		ESVdatasetM.updateDataset(oldVnode, vnode);
	}
	static destroy(oldVnode, vnode) {
		ESVdatasetM.updateDataset(oldVnode, vnode);
	}
}
const modules = [ESVclassM, ESVstyleM, ESVpropM, ESVattrM, ESVdatasetM, ESVeventlistenerM];
