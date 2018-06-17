import {patch, h} from './base/preLoader'
import {ObjectUtil} from '../objectUtil'
export class ElementSelector {
  constructor() {
    this.selectorMap = new Map()
  }
  getElementById(vnode, id) {
    let result = this.getElements(vnode, "#" + id);
    return result.length < 1
      ? null
      : result[0];
  }
  getElementsByClass(vnode, className) {
    return this.getElements(vnode, "." + className);
  }
  patch(vnode, selector, newNode) {
    console.log('patch00 START of Patch newNode:' + newNode);

    if (!newNode && typeof selector==="string") {
      console.log('patch00a ★ERROR★ of Patch newNode:' + newNode+"/selector:"+selector);
      return vnode;
    }
    if (!newNode ) {
      console.log('patch01a of Patch newNode:' + newNode);
      this.isValidNode(vnode, "vnode");
      const re = patch(vnode, selector);
      return selector;
    }
    if (!selector ) {
      console.log('patch01b of Patch newNode:' + newNode);
      this.isValidNode(vnode, "vnode");
      const re = patch(vnode, newNode);
      return newNode;
    }
    const cloneNode = this.prePatch(vnode, selector, newNode);
    const re = patch(vnode, cloneNode);
    const nodes = this.getElements(cloneNode, selector, false, new Map(), null);
    console.log('patch02 END of Patch ====' + "/node:" + newNode.elm + "/parent:" + (
      newNode.elm
      ? newNode.elm.parentNode
      : null) + "/count:" + nodes.length + "/" + (
      nodes.length > 0
      ? nodes[0].elm.parentNode
      : null));
    this.isValidNode(cloneNode, "cloneNode");
    return cloneNode;
  }

  isValidNode(vnode, name, parentNode, index) {
    if (!vnode) {
      console.log("★★null node!" + name + "/parentNode:" + parentNode);
      return;
    }
    if (vnode.elm && !vnode.elm.parentNode) {
      console.log(vnode.elm);
      if (parentNode) {
        const length = parentNode.childNodes.length;
        if (length > index) {
          vnode.elm = parentNode.childNodes[index];
        } else {
          parentNode.appendChild(vnode.elm);
        }
      }
      console.log("★★★invalid node!" + name);
    } else if (!vnode.elm) {
      if (parentNode) {
        const length = parentNode.childNodes.length;
        if (length > index) {
          vnode.elm = parentNode.childNodes[index];
        } else {
          console.log("★★★invalid parent index!" + index + "/length:" + length + "/vnode.sel:" + vnode.sel);
        }
      }
    }
    if (vnode.children) {
      for (let indexA in vnode.children) {
        let child = vnode.children[indexA];
        if (!child) {
          continue;
        }
        this.isValidNode(child, name + "_c_", (
          vnode.elm
          ? vnode.elm.parentNode
          : null), indexA)
      }
    }
  }
  // Not cloneNode
  prePatch(vnode, selector, newNode) {
    const cloneNode = ObjectUtil.deepVnodeClone(vnode);
    const parentMap = new Map();
    console.log('prepatch01aa:' + JSON.stringify(vnode));
    const nodes = this.getElements(cloneNode, selector, false, parentMap, null);
    let isShouldPatch = false;
    for (let node of nodes) {
      console.log('prepatch01a');
      let newOne = ObjectUtil.deepVnodeClone(newNode);
      console.log('prepatch01b');

      for (let [key, parentNode] of parentMap) {
        if (key === node) {
          let children = parentNode.children;
          for (let index in children) {
            let target = children[index];
            if (target === node) {
              children[index] = newOne;
              //newOne.text = newOne.text+"/"+Date.now();
              isShouldPatch = true;
              console.log('★patch01c AS REPLACE! children.length:' + children.length + "/index:" + index + "/target.sel:" + target.sel + "/newOne.sel:" + newOne.sel + "/text:" + newOne.text);
              break;
            } else {
              console.log('-patch01d ! children.length:' + children.length + "/index:" + index + "/target.sel:" + target.sel);
            }
          }
          break;
        }
      }
    }
    console.log('patch02 END of prePatch');
    return isShouldPatch
      ? cloneNode
      : vnode;
  }
  getElements(vnode, selector, isEnd = false, parentMap = new Map(), parentVnode) {
    let result = [];
    if (!selector || typeof selector !== 'string') {
      console.log('getElements selector:'+selector);
      return result;
    }
    let selectors = selector.split(/ |>/);
    let nextSelector = selector;
    if (selectors.length >= 1) {
      let firstOne = selectors.shift();
      if (!firstOne) {
        return result;
      }
      if (this.isMatch(vnode.sel, firstOne)) {
        if (selectors.length < 1) {
          result.push(vnode);
          if (parentVnode) {
            parentMap.set(vnode, parentVnode);
          }
          return result;
        }
        nextSelector = selector.substring(firstOne.length + 1, selector.length);
      } else if (isEnd) {
        return result;
      } else {
        nextSelector = selector;
      }

      if (!vnode.children) {
        return result;
      }
      let delimiter = selector.substring(firstOne.length, firstOne.length + 1);
      let isNextEnd = delimiter === '>';

      for (let child of vnode.children) {
        result = result.concat(this.getElements(child, nextSelector, isNextEnd, parentMap, vnode));
      }
    }
    return result;
  }

  getSelectorMap(selector) {
    let map = this.selectorMap.get(selector);
    if (map) {
      return map;
    }
    map = new Map();
    if (!selector) {
      return map;
    }
    let tokens = selector.split(/\.|#/g);
    let classes = [];
    let id = "";
    let tag = "";
    for (let token of tokens) {
      if (selector.indexOf("#" + token) >= 0) {
        id = token;
      } else if (selector.indexOf("." + token) >= 0) {
        classes.push(token);
      } else {
        tag = token;
      }
    }
    map.set("id", id);
    map.set("class", classes);
    map.set("tag", tag);
    this.selectorMap.set(selector, map);
    return map;
  }
  isMatch(sel, selector) {
    //console.log("sel:" + sel + "/selector:" + selector);
    let mapA = this.getSelectorMap(sel);
    let mapB = this.getSelectorMap(selector);
    let tagName = mapB.get("tag");
    let id = mapB.get("id");
    if (tagName !== "" && mapA.get("tag") !== tagName) {
      return false;
    }
    if (id !== "" && mapA.get("id") !== id) {
      return false;
    }

    let classesA = mapA.get("class");
    let classesB = mapB.get("class");
    for (let classB of classesB) {
      let isMatched = false;
      for (let classA of classesA) {
        if (classB === classA) {
          isMatched = true;
        }
      }
      if (isMatched === false) {
        return false;
      }
    }
    if (selector === "") {
      return false;
    }
    return true;
  }
}
