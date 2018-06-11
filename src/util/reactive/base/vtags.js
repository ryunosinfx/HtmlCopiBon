import {patch, h} from './preLoader'
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
const vtags = (tagName, id, classNames, data = {}, children, text) => {
  const id1 = tagName + ("#" + (
    id && typeof id === "string"
    ? id
    : ""));
  const id2 = id1 + (
    classNames
    ? (
      Array.isArray(classNames) && classNames.length > 0 && typeof classNames[0] === "string"
      ? "." + classNames.join(".")
      : (
        Array.isArray(id) && id.length > 0 && typeof id[0] === "string"
        ? "." + id.join(".")
        : "")));
  const childrenArray = children && Array.isArray(children)
    ? children
    : null;
  const currentText = text
    ? text
    : (
      typeof children === "string"
      ? children
      : "");

  let currentData = data；
  if (children !== undefined && text === undefined && classNames && typeof classNames === "object") {
    currentData = classNames;
  } else if (children === undefined && text === undefined && id && typeof id === "object") {
    currentData = id;
  }
  return h(id2, currentData, childrenArray, currentText);
}
//a div span img ul li input label
export const a = (id, classNames, href, data, children) => {
  return vtags("a", id, classNames, setProps(data, {href: href}), children, null);
}
export const div = (id, classNames, data, children, text) => {
  return vtags("div", id, classNames, data, children, text);
}

export const span = (id, classNames, data, children, text) => {
  return vtags("span", id, classNames, data, children, text);
}

export const img = (id, classNames, alt, src, data) => {
  return vtags("img", id, classNames, setProps(data, {
    alt: alt,
    src: src
  }), null, null);
}

export const ul = (id, classNames, data, children, text) => {
  return vtags("ul", id, classNames, data, children, text);
}

export const li = (id, classNames, data, children, text) => {
  return vtags("li", id, classNames, data, children, text);
}

export const input = (id, classNames, data, children, text) => {
  return vtags("input", id, classNames, data, children, text);
}
export const label = (id, classNames, data, children, text) => {
  return vtags("label", id, classNames, data, children, text);
}
