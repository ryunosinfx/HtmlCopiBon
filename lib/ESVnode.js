/**es ported form snabbdom/snabbdom */
export class ESVnode {
	static h = (sel, b, c) => H.h(sel, b, c);
	static init(options) {
		ESVnU.init(modules, options);
		return (currentVnode, newVnode) => ESVnU.patch(currentVnode, newVnode);
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
		let data = {},
			children,
			text;
		if (U.isDef(c)) {
			if (b !== null) data = b;
			if (U.isArray(c)) children = c;
			else if (U.isPrimitive(c)) text = typeof c === 'string' ? c : c.toString();
			else if (c && c.sel) children = [c];
		} else if (U.isDef(b) && b !== null)
			if (U.isArray(b)) children = b;
			else if (U.isPrimitive(b)) text = b.toString();
			else if (b && b.sel) children = [b];
			else data = b;
		if (U.isArray(children))
			for (let i = 0; i < children.length; ++i)
				if (U.isPrimitive(children[i])) children[i] = new VNode(void 0, void 0, void 0, children[i], void 0);
		if (U.isSVG(sel)) H.addNS(data, children, sel);
		return new VNode(sel, data, children, text, void 0);
	}
	static fragment(children) {
		let c, text;
		if (U.isArray(children)) c = children;
		else if (U.isPrimitive(children)) text = children;
		else if (children && children.sel) c = [children];
		if (U.isArray(c))
			for (let i = 0; i < c.length; ++i)
				if (U.isPrimitive(c[i])) c[i] = new VNode(void 0, void 0, void 0, c[i], void 0);
		return new VNode(void 0, {}, c, text, void 0);
	}
	static toVNode(node, api = HtmlDomApi) {
		if (api.isElement(node)) {
			const id = node.id ? '#' + node.id : '',
				cn = node.getAttribute('class'),
				c = cn ? '.' + cn.split(' ').join('.') : '',
				sel = api.tagName(node).toLowerCase() + id + c,
				attrs = {},
				dataset = {},
				elmAttrs = node.attributes,
				elmChildren = node.childNodes,
				children = [],
				data = {};
			for (let i = 0, n = elmAttrs.length; i < n; i++) {
				const name = elmAttrs[i].nodeName;
				if (name.indexOf('data-') === 0) dataset[name.slice(5)] = elmAttrs[i].nodeValue || '';
				else if (name !== 'id' && name !== 'class') attrs[name] = elmAttrs[i].nodeValue;
			}
			for (let i = 0, n = elmChildren.length; i < n; i++) children.push(toVNode(elmChildren[i], domApi));
			if (Object.keys(attrs).length > 0) data.attrs = attrs;
			if (Object.keys(dataset).length > 0) data.dataset = dataset;
			if (U.isSVG(sel)) H.addNS(data, children, sel);
			return new VNode(sel, data, children, void 0, node);
		}
		return api.isText(node)
			? new VNode(void 0, void 0, void 0, api.getTextContent(node), node)
			: api.isComment(node)
			? new VNode('!', {}, [], api.getTextContent(node), node)
			: new VNode('', {}, [], void 0, node);
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
	static options = null;
	static init(modules, options = null) {
		for (const hook in ESVnU.cbs)
			for (const m of modules) {
				const h = m[hook];
				if (U.isDef(h)) ESVnU.cbs[hook].push(h);
			}
		ESVnU.options = options;
	}
	static patch(cVN, nVN) {
		const insertedVnQ = [],
			cbs = ESVnU.cbs;
		for (const pre of cbs.pre) pre();
		if (HtmlDomApi.isElement(cVN)) {
			cVN = ESVnU.emptyNodeAt(cVN);
		} else if (HtmlDomApi.isDocumentFragment(cVN)) cVN = ESVnU.emptyDocumentFragmentAt(cVN);
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
		const id = elm.id ? '#' + elm.id : '',
			classes = elm.getAttribute('class'),
			c = classes ? '.' + classes.split(' ').join('.') : '';
		return new VNode(HtmlDomApi.tagName(elm).toLowerCase() + id + c, {}, [], void 0, elm);
	}
	static isSameVnode(vn1, vn2) {
		const sel1 = vn1.sel,
			sel2 = vn2.sel,
			isSameKey = vn1.key === vn2.key,
			isSameIs = vn1.data?.is === vn2.data?.is,
			isSameSel = sel1 === sel2,
			isSameTextOrFragment = !sel1 && sel1 === sel2 ? typeof vn1.text === typeof vn2.text : true;
		return isSameSel && isSameKey && isSameIs && isSameTextOrFragment;
	}
	static emptyDocumentFragmentAt = (frag) => new VNode(void 0, {}, [], void 0, frag);
	static patchVnode(oVN, nVN, insertedVnQ) {
		const hook = nVN.data?.hook;
		hook?.prepatch?.(oVN, nVN);
		const elm = (nVN.elm = oVN.elm);
		if (oVN === nVN) return;
		if (nVN.data !== void 0 || (U.isDef(nVN.text) && nVN.text !== oVN.text)) {
			nVN.data ??= {};
			oVN.data ??= {};
			for (const updateCB of ESVnU.cbs.update) updateCB(oVN, nVN);
			nVN.data?.hook?.update?.(oVN, nVN);
		}
		const oldCh = oVN.children,
			ch = nVN.children;
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
		let oStartIdx = 0,
			nStartIdx = 0,
			oEndIdx = oldCh.length - 1,
			oStartVn = oldCh[0],
			oEndVn = oldCh[oEndIdx],
			nEndIdx = newCh.length - 1,
			nStartVn = newCh[0],
			nEndVn = newCh[nEndIdx],
			oKeyToIdx;
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
						oldCh[idxInOld] = void 0;
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
		const sel = vn.sel,
			cbs = ESVnU.cbs;
		if (sel === '!') {
			if (U.isUndef(vn.text)) vn.text = '';
			vn.elm = HtmlDomApi.createComment(vn.text);
		} else if (U.isDef(sel)) {
			const emptyNode = new VNode('', {}, [], void 0, void 0),
				hashIdx = sel.indexOf('#'), // Parse selector
				dotIdx = sel.indexOf('.', hashIdx),
				hash = hashIdx > 0 ? hashIdx : sel.length,
				dot = dotIdx > 0 ? dotIdx : sel.length,
				tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel,
				elm =
					U.isDef(data) && U.isDef(data.ns)
						? HtmlDomApi.createElementNS(data.ns, tag, data)
						: HtmlDomApi.createElement(tag, data),
				hook = vn.data.hook;
			vn.elm = elm;
			if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot));
			if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
			for (const createCB of cbs.create) createCB(emptyNode, vn);
			if (U.isArray(vn.children)) {
				for (const ch of vn.children) if (ch) HtmlDomApi.appendChild(elm, ESVnU.createElm(ch, insertedVnQ));
			} else if (U.isPrimitive(vn.text)) HtmlDomApi.appendChild(elm, HtmlDomApi.createTextNode(vn.text));
			if (U.isDef(hook)) {
				hook.create?.(emptyNode, vn);
				if (hook.insert) insertedVnQ.push(vn);
			}
		} else if (ESVnU.options?.experimental?.fragments && U.isArray(vn.children)) {
			const emptyNode = new VNode('', {}, [], void 0, void 0);
			vn.elm = (HtmlDomApi.createDocumentFragment ?? documentFragmentIsNotSupported)();
			for (const createCB of cbs.create) createCB(emptyNode, vn);
			for (const ch of vn.children) if (ch) HtmlDomApi.appendChild(vn.elm, ESVnU.createElm(ch, insertedVnQ));
		} else vn.elm = HtmlDomApi.createTextNode(vn.text);
		return vn.elm;
	}
	static invokeDestroyHook(vn) {
		const data = vn.data,
			c = vn.children;
		if (U.isUndef(data)) return;
		data?.hook?.destroy?.(vn);
		for (const destroyCB of ESVnU.cbs.destroy) destroyCB(vn);
		if (U.isArray(c)) for (const ch of c) if (ch && typeof ch !== 'string') ESVnU.invokeDestroyHook(ch);
	}
	static addVnodes(parentElm, before = null, vnodes, startIdx, endIdx, insertedVnQ) {
		for (let i = startIdx; i <= endIdx; ++i) {
			const ch = vnodes[i];
			if (ch) HtmlDomApi.insertBefore(parentElm, ESVnU.createElm(ch, insertedVnQ), before);
		}
	}
	static removeVnodes(parentElm, vnodes, startIdx, endIdx) {
		for (let i = startIdx; i <= endIdx; ++i) {
			const ch = vnodes[i],
				cbs = ESVnU.cbs,
				r = cbs.remove,
				c = ch.children;
			if (ch)
				if (U.isDef(ch.sel)) {
					ESVnU.invokeDestroyHook(ch);
					const rm = ESVnU.createRmCb(ch.elm, r.length + 1),
						removeHook = ch?.data?.hook?.remove;
					for (const removeCB of r) removeCB(ch, rm);
					if (U.isDef(removeHook)) removeHook(ch, rm);
					else rm();
				} else if (c) {
					ESVnU.invokeDestroyHook(ch); // Fragment node
					ESVnU.removeVnodes(parentElm, c, 0, c.length - 1);
				} else HtmlDomApi.removeChild(parentElm, ch.elm); // Text node
		}
	}
	static createRmCb = (childElm, listenersCount) => () => {
		if (--listenersCount === 0) HtmlDomApi.removeChild(HtmlDomApi.parentNode(childElm), childElm);
	};
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
	static isUndef = (s) => s === void 0;
	static isDef = (s) => s !== void 0;
	static isNotNull = (s) => s !== null;
	static isPrimitive = (s) =>
		typeof s === 'string' || typeof s === 'number' || s instanceof String || s instanceof Number;
	static isArray = (a) => Array.isArray(a);
	static isSVG = (s) => s.indexOf('svg') === 0 && (s.length === 3 || s[3] === '.' || s[3] === '#');
}
const d = document;
class HtmlDomApi {
	static NODE_TYPE = {
		ELEMNT: 1,
		TEXT: 3,
		COMMENT: 8,
		DOCUMENTFRAGMENT: 11,
	};
	static createElement = (tagName = '', options = {}) => d.createElement(tagName, options);
	static createElementNS = (namespaceURI = '', qualifiedName = '', options = {}) =>
		d.createElementNS(namespaceURI, qualifiedName, options);
	static createDocumentFragment = () => HtmlDomApi.parseFragment(d.createDocumentFragment());
	static createTextNode = (text = '') => d.createTextNode(text);
	static createComment = (text = '') => d.createComment(text);
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
	static removeChild = (node, child) => node.removeChild(child);
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
	static tagName = (elm) => elm.tagName;
	static setTextContent(node, text = null) {
		node.textContent = text;
	}
	static getTextContent = (node) => node.textContent;
	static isElement = (node) => node.nodeType === HtmlDomApi.NODE_TYPE.ELEMNT;
	static isText = (node) => node.nodeType === HtmlDomApi.NODE_TYPE.TEXT;
	static isComment = (node) => node.nodeType === HtmlDomApi.NODE_TYPE.COMMENT;
	static isDocumentFragment = (node) => node.nodeType === HtmlDomApi.NODE_TYPE.DOCUMENTFRAGMENT;
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
		this.key = data === void 0 ? void 0 : data.key;
		this.sel = sel;
		this.data = data;
		this.children = children;
		this.text = text;
		this.elm = elm;
	}
}
class ESVclassM {
	static updateClass(cVN, nVN) {
		const elm = nVN.elm,
			oClassP = cVN.data.class,
			nClassP = nVN.data.class,
			oClass = oClassP || {},
			nClass = nClassP || {};
		if ((!oClassP && !nClassP) || oClassP === nClassP) return;
		for (const name in oClass)
			if (oClass[name] && !Object.prototype.hasOwnProperty.call(nClass, name)) elm.classList.remove(name); // was `true` and now not provided
		for (const name in nClass) {
			const cur = nClass[name];
			if (cur !== oClass[name]) elm.classList[cur ? 'add' : 'remove'](name);
		}
	}
	static create = (cVN, nVN) => ESVclassM.updateClass(cVN, nVN);
	static update = (cVN, nVN) => ESVclassM.updateClass(cVN, nVN);
}
class ESVstyleM {
	static nextFrame(fn) {
		const raf = (typeof window !== 'undefined' && window.requestAnimationFrame.bind(window)) || setTimeout;
		raf(() => raf(fn));
	}
	static reflowForced = false;
	static setNextFrame(obj, prop, val) {
		ESVstyleM.nextFrame(function () {
			obj[prop] = val;
		});
	}
	static updateStyle(cVN, nVN) {
		const elm = nVN.elm,
			oldStyleP = cVN.data.style,
			styleP = nVN.data.style,
			oldStyle = oldStyleP || {},
			style = styleP || {},
			oldHasDel = 'delayed' in oldStyle;
		if ((!oldStyleP && !styleP) || oldStyleP === styleP) return;
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
	static applyDestroyStyle(vn) {
		const elm = vn.elm,
			s = vn.data.style,
			style = s ? s.destroy : null;
		if (!style) return;
		for (const name in style) elm.style[name] = style[name];
	}
	static applyRemoveStyle(vn, rm = () => {}) {
		const s = vn.data.style,
			elm = vn.elm,
			style = s ? s.remove : null,
			applied = [];
		if (!style) return rm();
		if (!ESVstyleM.reflowForced) {
			vn.elm.offsetLeft; // eslint-disable-next-line @typescript-eslint/no-unused-expressions
			ESVstyleM.reflowForced = true;
		}
		for (const name in style) {
			applied.push(name);
			elm.style[name] = style[name];
		}
		const compStyle = getComputedStyle(elm),
			props = compStyle['transition-property'].split(', ');
		let amount = 0;
		for (const prop of props) if (applied.indexOf(prop) !== -1) amount++;
		elm.addEventListener('transitionend', function (ev) {
			if (ev.target === elm) --amount;
			if (amount === 0) rm();
		});
	}
	static forceReflow = () => (ESVstyleM.reflowForced = false);
	static pre = () => ESVstyleM.forceReflow();
	static create = (cVN, nVN) => ESVstyleM.updateStyle(cVN, nVN);
	static update = (cVN, nVN) => ESVstyleM.updateStyle(cVN, nVN);
	static destroy = (vn, rm) => ESVstyleM.applyDestroyStyle(vn, rm);
	static remove = (vn, rm) => ESVstyleM.applyRemoveStyle(vn, rm);
}
class ESVpropM {
	static updateProps(cVN, nVN) {
		const elm = nVN.elm,
			oldPropsP = cVN.data.props,
			propsP = nVN.data.props;
		if ((!oldPropsP && !propsP) || oldPropsP === propsP) return;
		const oldProps = oldPropsP || {},
			props = propsP || {};
		for (const k in props) {
			const cur = props[k];
			if (oldProps[k] !== cur && (k !== 'value' || elm[k] !== cur)) elm[k] = cur;
		}
	}
	static create = (cVN, nVN) => ESVpropM.updateProps(cVN, nVN);
	static update = (cVN, nVN) => ESVpropM.updateProps(cVN, nVN);
}
class ESVattrM {
	static xlinkNS = 'http://www.w3.org/1999/xlink';
	static xmlNS = 'http://www.w3.org/XML/1998/namespace';
	static colonChar = 58;
	static xChar = 120;
	static updateAttrs(cVN, nVN) {
		const elm = nVN.elm,
			oldAttrsP = cVN.data.attrs,
			attrsP = nVN.data.attrs,
			oldAttrs = oldAttrsP || {},
			attrs = attrsP || {};
		if ((!oldAttrsP && !attrsP) || oldAttrsP === attrsP) return;
		for (const k in attrs) {
			const cur = attrs[k], // update modified attributes, add new attributes
				old = oldAttrs[k];
			if (old !== cur)
				if (cur === true) elm.setAttribute(k, '');
				else if (cur === false) elm.removeAttribute(k);
				else if (k.charCodeAt(0) !== ESVattrM.xChar) elm.setAttribute(k, cur);
				else if (k.charCodeAt(3) === ESVattrM.colonChar)
					elm.setAttributeNS(ESVattrM.xmlNS, k, cur); // Assume xml namespace
				else if (k.charCodeAt(5) === ESVattrM.colonChar)
					elm.setAttributeNS(ESVattrM.xlinkNS, k, cur); // Assume xlink namespace
				else elm.setAttribute(k, cur);
		}
		for (const k in oldAttrs) if (!(k in attrs)) elm.removeAttribute(k);
	}
	static create = (cVN, nVN) => ESVattrM.updateAttrs(cVN, nVN);
	static update = (cVN, nVN) => ESVattrM.updateAttrs(cVN, nVN);
}
class ESVdatasetM {
	static CAPS_REGEX = /[A-Z]/g;
	static updateDataset(cVN, nVN) {
		if (!nVN) return;
		const elm = nVN.elm,
			oldDatasetP = cVN.data.dataset,
			datasetP = nVN.data.dataset;
		if (!oldDatasetP && !datasetP) return;
		if (oldDatasetP === datasetP) return;
		const oldDataset = oldDatasetP || {},
			dataset = datasetP || {},
			d = elm.dataset;
		for (const k in oldDataset)
			if (!dataset[k])
				if (d)
					if (k in d) delete d[k];
					else elm.removeAttribute('data-' + k.replace(CAPS_REGEX, '-$&').toLowerCase());
		for (const k in dataset)
			if (oldDataset[k] !== dataset[k])
				if (d) d[k] = dataset[k];
				else elm.setAttribute('data-' + k.replace(CAPS_REGEX, '-$&').toLowerCase(), dataset[k]);
	}
	static create = (cVN, nVN) => ESVdatasetM.updateDataset(cVN, nVN);
	static update = (cVN, nVN) => ESVdatasetM.updateDataset(cVN, nVN);
}
class ESVeventlistenerM {
	constructor(vn) {
		this.vnode = vn;
		this.listener = (evt) => ESVeventlistenerM.handleEvent(evt, this.vnode);
	}
	static invokeHandler(handler, vn, evt) {
		if (typeof handler === 'function') handler.call(vn, evt, vn); // call function handler
		else if (U.isArray(handler)) for (const h of handler) ESVeventlistenerM.invokeHandler(h, vn, evt); // call multiple handlers
	}
	static handleEvent(evt, vn) {
		const name = evt.type,
			on = vn.data.on;
		if (on && on[name]) ESVeventlistenerM.invokeHandler(on[name], vn, evt); // call event handler(s) if exists
	}
	static updateEventListeners(cVN, nVN) {
		const oOn = cVN.data.on,
			oLstnr = cVN.listener ? cVN.listener.listener : null,
			oElm = cVN.elm,
			nOn = nVN && nVN.data.on,
			nElm = nVN && nVN.elm; // remove existing listeners which no longer used// if element changed or deleted we remove all existing listeners unconditionally
		if (oOn === nOn) return; // optimization for reused immutable handlers
		if (oOn && oLstnr)
			if (!nOn) for (const name in oOn) oElm.removeEventListener(name, oLstnr, false);
			else for (const name in oOn) if (!nOn[name]) oElm.removeEventListener(name, oLstnr, false); // remove listener if element was changed or existing listeners removed// remove listener if existing listener removed
		if (nOn) {
			const listener = cVN.listener ? cVN.listener : new ESVeventlistenerM(nVN);
			nVN.listener = listener; // add new listeners which has not already attached// reuse existing listener or create new
			listener.vnode = nVN; // update vnode for listener // if element changed or added we add all needed listeners unconditionally // add listener if element was changed or new listeners added
			if (!oOn) for (const name in nOn) nElm.addEventListener(name, listener.listener, false);
			else for (const name in nOn) if (!oOn[name]) nElm.addEventListener(name, listener.listener, false); // add listener if new listener added
		}
	}
	static create = (cVN, nVN) => ESVeventlistenerM.updateEventListeners(cVN, nVN);
	static update = (cVN, nVN) => ESVeventlistenerM.updateEventListeners(cVN, nVN);
	static destroy = (cVN, nVN) => ESVeventlistenerM.updateEventListeners(cVN, nVN);
}
const modules = [ESVclassM, ESVstyleM, ESVpropM, ESVattrM, ESVdatasetM, ESVeventlistenerM];
