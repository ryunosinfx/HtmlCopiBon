import {
  patch,
  h
} from './preLoader'
export class V {
  static div() {}
}
var vnode = h('div', {
  style: {
    color: '#000'
  }
}, [
  h('h1', 'Headline'),
  h('p', 'A paragraph')
]);
const setProps(data, inputs) {
  let newData = {};
  if (data) {
    if (!data.props) {
      data.props = {};
    }
    newData = data;
  } else {
    newData = {
      props: {}
    };
  }
  for (let key in inputs) {
    newData.props[key] = inputs[key];
  }
  return newData;
}
const vtags = (tagName, id, classNames, text, children, data = {}) => {
  const id1 = tagName + (
    "#" + id ?
    id :
    "");
  const id2 = id1 + (
    classNames ?
    (
      Array.isArray(classNames) ?
      classNames.join(".") :
      classNames) :
    "");
  const childrenArray = children && Array.isArray(children) ?
    children : [];

  return h(id2, data, childrenArray, text);
}
// string array string array object
// string objct array string
const vtagsA = (id, classNames, children, text, data) => {
  let count = 5;
  count += data === undefined ? 0 : -1;
  count += children === undefined ? 0 : -1;
  count += classNames === undefined ? 0 : -1;
  count += text === undefined ? 0 : -1;
  count += id === undefined ? 0 : -1;
  if (count === 4) {
    const currentData = data ? data : {}
    const currentId = Array.isArray(id) ? null : id;
    const currentClasss = Array.isArray(id) ? id : classNames;
    const currentText = typeof text === "string" ? text : "";
      const currentChildren = Array.isArray(text) ? text : children:
  }
  if (count === 3) { //id children data
    const currentData = data ? data : {}
    const currentId = Array.isArray(id) ? null : id;
    const currentClasss = Array.isArray(id) ? id : (Array.isArray(classNames) ? classNames : []);
    const currentText = typeof text === "string" ? text : "";
    const currentChildren = Array.isArray(text) ? text : children:
  }
  if (Array.isArray(id)) {

  }
  return h(id2, data, childrenArray, text);
}
//a div span img ul li input label
export const a = (id, classNames, href, children, data) => {
  return vtags("a", id, classNames, null, children, setProps(data, {
    href: href
  }));
}
export const div = (id, classNames, children, text, data) => {
  return vtags("div", id, classNames, children, text, data);
}

export const span = (id, classNames, children, text, data) => {
  return vtags("span", id, classNames, children, text, data);
}

export const img = (id, classNames, alt, src, data) => {
  return vtags("img", id, classNames, null, null, setProps(data, {
    alt: alt,
    src: src
  }));
}

export const ul = (id, classNames, children, text, data) => {
  return vtags("ul", id, classNames, children, text, data);
}

export const li = (id, classNames, children, text, data) => {
  return vtags("li", id, classNames, children, text, data);
}

export const input = (id, classNames, children, text, data) => {
  return vtags("input", id, classNames, children, text, data);
}
export const label = (id, classNames, children, text, data) => {
  return vtags("label", id, classNames, children, text, data);
}
