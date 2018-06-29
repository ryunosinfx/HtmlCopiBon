import snabbdomClass from 'snabbdom/modules/class'
import snabbdomStyle from 'snabbdom/modules/style'
import snabbdomProps from 'snabbdom/modules/props'
import snabbdomDataset from 'snabbdom/modules/dataset'
import snabbdomEventlisteners from 'snabbdom/modules/eventlisteners'
import hz from 'snabbdom/h'
import toVNodez from 'snabbdom/tovnode'
let snabbdom = require('snabbdom');
console.log(snabbdom);
export const h = hz;
export const toVNode = toVNodez;
export const patch = snabbdom.init([snabbdomClass, snabbdomStyle, snabbdomProps, snabbdomEventlisteners])
