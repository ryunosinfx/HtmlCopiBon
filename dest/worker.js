!function(e){var t={};function r(a){if(t[a])return t[a].exports;var s=t[a]={i:a,l:!1,exports:{}};return e[a].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=e,r.c=t,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)r.d(a,s,function(t){return e[t]}.bind(null,s));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/dest/",r(r.s=25)}({0:function(e,t,r){"use strict";r.d(t,"a",function(){return a});class a{static binaryString2ArrayBuffer(e){return a.binaryString2Uint8Array(e).buffer}static arrayBuffer2BinaryString(e){return a.uint8Array2BinaryString(new Uint8Array(e))}static arrayBuffer2base64(e){return btoa(a.uint8Array2BinaryString(new Uint8Array(e)))}static arrayBuffer2DataURI(e,t="application/octet-stream"){return"data:"+t+";base64,"+btoa(a.arrayBuffer2BinaryString(e))}static binaryString2Uint8Array(e){e.split("");const t=e.length,r=new Uint8Array(new ArrayBuffer(t));for(let a=0;a<t;a++)r[a]=e.charCodeAt(a);return r}static uint8Array2BinaryString(e){let t=[];for(let r of e)t.push(String.fromCharCode(r));return t.join("")}static binaryString2DataURI(e,t="application/octet-stream"){return"data:"+t+";base64,"+btoa(e)}static base642DataURI(e,t="application/octet-stream"){return"data:"+t+";base64,"+e}static base642binaryString(e){return atob(e)}static base642ArrayBuffer(e){return a.binaryString2ArrayBuffer(atob(e))}static dataURI2BinaryString(e){return atob(e.split(",")[1])}static dataURI2ArrayBuffer(e){return a.binaryString2Uint8Array(atob(e.split(",")[1])).buffer}static uintArray2ArrayBuffer(e){return e.buffer}static arrayBuffer2Uint8Array(e){return new Uint8Array(e)}static arrayBuffer2Uint16Array(e){return new Uint16Array(e)}static arrayBuffer2Uint32Array(e){return new Uint32Array(e)}static ArrayBuffer2Blob(e,t="application/octet-stream"){return new Blob([e],{type:t})}static readBlob(e){const t=new FileReader,r=new Promise((e,r)=>{t.onload=(r=>{e(t.result)}),t.onerror=(e=>{r(t.error)})});return{asArrayBuffer:()=>(t.readAsArrayBuffer(e),r),asBinaryString:()=>(t.readAsBinaryString(e),r),asDataURL:()=>(t.readAsDataURL(e),r),asText:()=>(t.readAsText(e),r)}}}},1:function(e,t,r){"use strict";r.d(t,"a",function(){return a});class a{static trimByte(e){const t=Math.floor(e),r=t>255?255:t;return r<0?0:r}}},2:function(e,t,r){"use strict";r.d(t,"a",function(){return s});const a="worker.js";class s{constructor(e=a){this.worker=new Worker(e)}postMessage(e,t){return new Promise((r,a)=>{const{transObject:n,tranceArray:o}=s.buildPostObj(e,t);try{this.worker.postMessage(n,o),this.worker.onmessage=(e=>{const t=e.data;r(t)}),this.worker.onerror=(e=>{console.log(e);const t=e;console.error(t.currentTarget),console.error(t.returnValue),console.error(t.srcElement),console.error(t.target),console.error(t.type),console.error(t.eventPhase),console.error(t.timeStamp),console.error(t.message),console.error(t.lineno),console.error(t.error),a(e)})}catch(e){console.error(e),console.error(e.stack)}})}static buildPostObj(e,t){const r=[];return t?t.key=e:t={key:e},s.buildPostObjExec(t,r),{transObject:t,tranceArray:r}}static buildPostObjExec(e,t){if(e)if(Array.isArray(e)){let r=0;for(let a of e)s.buildPostObjExecParValue(r,a,t),r++}else if("object"==typeof e&&Object.keys(e).length>0)for(let r in e){const a=e[r];void 0!==a&&s.buildPostObjExecParValue(r,a,t)}else s.buildPostObjExecParValue(null,e,t)}static buildPostObjExecParValue(e,t,r){console.log("trance buildPostObjExecParValue currentKey:"+e+"/"+r.length);const a=typeof t;let n=!1;t?t.buffer?(r.push(t.buffer),n=!0):t.byteLength?(r.push(t),n=!0):t instanceof ImageData?(r.push(t.data.buffer),n=!0):"boolean"!==a&&"number"!==a&&"string"!==a||(n=!0):n=!0,!n&&e&&s.buildPostObjExec(t,r)}close(){this.worker.terminate()}}},25:function(e,t,r){"use strict";r.r(t);var a=r(2);const s=new Map,n="DEFAULT_WORKER";class o{static getWorkerInstance(e){return s.has(e)?s.get(e):s.get(n)}constructor(e=n){this.key=e,s.set(this.key,this)}getWorkerKey(){return this.key}async execute(e){const t="hello world! now:"+Date.now();return console.log(t),t}}var i=r(3),c=r(5);const l="ImageWorker";new class extends o{constructor(){super(l);const e=new i.a,t=new c.a;this.classes={},this.classes[e.getClassName()]=e,this.classes[t.getClassName()]=t}static getKey(){return l}async execute(e){return await this.call(e).catch(e=>{console.log(e),console.error(e.stack)})}async call(e){const t=e.className,r=e.methodName,a=this.classes[t];if(a&&a[r])try{await a[r](e)}catch(e){console.erroe(e)}return e}};const u={};u.aWASMcaller||(u.aWASMcaller=new class extends o{constructor(){super("WASMcaller")}async execute(){const e="hello WASMcaller! now:"+Date.now();return console.log(e),this.call().catch(e=>{console.log(e)}),e}async call(){const e=await fetch("./wasm/sum.wasm"),t=await e.arrayBuffer(),r=(await WebAssembly.instantiate(t,{})).instance;console.log(r.exports.sum(21,31));const a="hello WASMcaller! now:"+Date.now();console.log(a)}}),r.d(t,"default",function(){return f});class f extends o{constructor(){super()}}new f;onmessage=(e=>{const t=e.data,r=t?t.key:"";o.getWorkerInstance(r).execute(t).then(e=>{const{transObject:t,tranceArray:s}=a.a.buildPostObj(r,e);postMessage(t,s)},e=>{console.error(e),console.error(e.stack);const t=data,{transObject:s,tranceArray:n}=a.a.buildPostObj(r,t);postMessage(s,n)})})},3:function(e,t,r){"use strict";r.d(t,"a",function(){return s});var a=r(4);class s extends a.a{constructor(){super("ImageMerger"),this.margeReplace=this.margeReplace,this.margeLinninr=this.margeLinninr,this.margeMultiplication=this.margeMultiplication}trimByte(e){const t=Math.floor(e),r=t>255?255:t;return r<0?0:r}async margeReplace(e,t,r,a){await this.margeExc(e,t,r,a,"margeReplace",this.replace())}async margeLinninr(e,t,r,a){await this.margeExc(e,t,r,a,"margeLinninr",this.linier())}async margeMultiplication(e,t,r,a){await this.margeExc(e,t,r,a,"margeMultiplication",this.multiplication())}async margeExc(e,t,r,a,s,n){let o=!0;t||a||(t=e.images,r=e.isBaseWhite,e=e.imageDataBase);const i=[];if(t)for(let e of t)e&&e.data&&e.data.length>0&&(o=!1,i.push(this.convertImageDataToObj(e)));if(!o){if(a){this.threadInit();const t={imageDataBase:e,images:i,isBaseWhite:r};return await this.execute(s,t)}this.beWhiteImage(e,r),this.mergeImages(e,t,n)}}beWhiteImage(e,t){if(t){const t=e.data.length;for(let r=0;r<t;r++)e.data[r]=255}}mergeImages(e,t,r){const{data:a,width:s,height:n}=e;for(let e of t){const t=e.data,o=e.width,i=e.height,c=e.offsetY,l=e.offsetX,u=e.offsetY&&e.offsetY>0&&e.offsetY<n?e.offsetY:!e.offsetY||e.offsetY<n?0:n,f=e.offsetX&&e.offsetX>0&&e.offsetX<s?e.offsetX:!e.offsetX||e.offsetX<s?0:s,h=u+i,g=h>n?n:h,y=f+o,d=y>s?s:y;let m=0,b=0,w=0;for(let e=u;e<g;e++){const n=e-c;m=n;for(let i=f;i<d;i++){const c=i-l;w++,r(a,e*s+i,t,n*o+c),b=c}}}}replace(){return(e,t,r,a)=>{const s=4*t,n=4*a;e[s]=r[n],e[s+1]=r[n+1],e[s+2]=r[n+2],e[s+3]=255}}linier(){return(e,t,r,a)=>{const s=4*t,n=4*a;e[s]=e[s]+addOaddOffsetXne[n],e[s+1]=e[s+1]+r[n+1],e[s+2]=e[s+2]+r[n+2]}}multiplication(){return(e,t,r,a)=>{const s=4*t,n=4*a;e[s]=this.trimByte(e[s]*r[n]/255),e[s+1]=this.trimByte(e[s+1]*r[n+1]/255),e[s+2]=this.trimByte(e[s+2]*r[n+2]/255)}}}},4:function(e,t,r){"use strict";r.d(t,"a",function(){return o});var a=r(2);const s={},n="ImageWorker";class o{constructor(e){this.key=e,s[e]=this,this.workerKey}threadInit(){}async execute(e,t,r){t.methodName=e,t.className=this.key;const s={};for(let e in t){const r=t[e];r instanceof ImageData&&(s[e]=r),t[e]=this.convertImageDataToObj(r)}const o=new a.a,i=await o.postMessage(n,t).catch(e=>{console.error(e)});if(i)for(let e in t){const r=i[e];if(!r||!r.data||void 0===r.data.byteLength)continue;const a=t[e];a&&a.data&&void 0!==a.data.byteLength&&(r.data.byteLength>0&&a.data.byteLength<1&&(a.data=r.data))}return i}getClassName(){return this.key}static loadInstance(e){return s(e)}convertImageDataToObj(e){return e&&e.data&&e.data.length>0&&e instanceof ImageData?{width:e.width,height:e.height,data:e.data,offsetX:e.offsetX,offsetY:e.offsetY}:e}}},5:function(e,t,r){"use strict";r.d(t,"a",function(){return o});var a=r(1),s=r(4);r(0);const n=4;class o extends s.a{constructor(){super("ImageResizer"),this.resizeAsLanczos=this.resizeAsLanczos,this.resizeAsByCubic=this.resizeAsByCubic}culcWeightByCubic(e){return t=>{let r=0;return t<=1?r=(e+2)*t*t*t-(e+3)*t*t+1:t<=2&&(r=e*t*t*t-5*e*t*t+8*e*t-4*e),r}}sincLanczos(e){return Math.sin(e*Math.PI)/(e*Math.PI)}lanczosWeight(e=3){return t=>0===t?1:Math.abs(t)<e?this.sincLanczos(t)*this.sincLanczos(t/e):0}async resizeAsLanczos(e,t,r){return await this.resizeExc(e,t,r,"resizeAsLanczos")}async resizeAsByCubic(e,t,r){return await this.resizeExc(e,t,r,"resizeAsByCubic").catch(e=>{console.error("resizeAsByCubic resizeExcWithThread；iamegData"),console.error(e.stack),console.error(e),console.error(e.currentTarget),console.error(e.returnValue),console.error(e.srcElement),console.error(e.target),console.error(e.type),console.error(e.eventPhase),console.error(e.timeStamp),console.error(e.message),console.error(e.lineno),console.error(e.error)})}async resizeExc(e,t,r,a){if(r){return t||(t=e.distImage,e=e.iamegData),this.threadInit(),await this.execute(a,{iamegData:e,distImage:t})}{let r=null,s=null;if(!t){if(!e.rowCount){return await this.resizeExcWithThread(e,t,a)}r=e.rowCount,s=e.offsetY,t=e.distImage,e=e.iamegData}if("resizeAsByCubic"===a)return this.resizeAsByCubicExe(e,t,s,r);if("resizeAsLanczos"===a)return this.resizeAsLanczosExe(e,t,s,r)}}resizeExcWithThread(e,t,r){return new Promise((a,s)=>{t=e.distImage,e=e.iamegData,this.threadInit();const o=t.data,i=t.width,c=t.height,l=e.data,u=e.width,f=e.height,h=[];let g=0;const y=Math.floor(c/n);for(let e=0;e<n;e++){const t=n-1===e?c-g:y,a={data:new Uint8ClampedArray(4*i*t),width:i,height:c},s=l.length,o=new Uint8ClampedArray(s);for(let e=0;e<s;e++)o[e]=l[e];const d={data:o,width:u,height:f},m=this.execute(r,{iamegData:d,distImage:a,offsetY:g,rowCount:t});g+=t,h.push(m)}Promise.all(h).then(e=>{for(let t of e){const{data:e,width:r,height:a,offsetY:s,rowCount:n}=t.distImage,c=4*s*i;o.set(e,c)}a(o.buffer)}).catch(e=>{console.error(e.stack),console.error(e),console.error(e.currentTarget),console.error(e.returnValue),console.error(e.srcElement),console.error(e.target),console.error(e.type),console.error(e.eventPhase),console.error(e.timeStamp),console.error(e.message),console.error(e.lineno),console.error(e.error),s(e)})})}resizeAsLanczosExe(e,t,r,a){const{data:s,width:n,height:o}=e,i=t.data,c=t.width,l=t.height;t.offsetY=r,t.rowCount=a;new Uint8ClampedArray(this.resizeLanczos(s,n,o,c,l,i,r,a));return t}resizeAsByCubicExe(e,t,r,a){const{data:s,width:n,height:o}=e,i=t.data,c=t.width,l=t.height;t.offsetY=r,t.rowCount=a;new Uint8ClampedArray(this.resizeByCubic(s,n,o,c,l,i,r,a));return t}resize(e,t,r,a){const{data:s,width:n,height:o}=e,i=a.data;new Uint8ClampedArray(this.resizeByCubic(s,n,o,t,r,i));return a}resizeLanczos(e,t,r,a,s,n,o,i){return this.resizeExecute(e,t,r,a,s,this.lanczosWeight(3),6,n,o,i)}resizeByCubic(e,t,r,a,s,n,o,i){return this.resizeExecute(e,t,r,a,s,this.culcWeightByCubic(-1),4,n,o,i)}resizeExecute(e,t,r,s,n,o,i,c,l,u){const f=Math.floor(s),h=Math.floor(n),g=Math.floor(t),y=4*g,d=g-1,m=Math.floor(r),b=m-1,w=g/f,p=m/h,A=e,B=c||new Uint8Array(f*h*4),x=i/2,z=x-1,M=l||0,I=M+(u||h);for(let e=M;e<I;e++){const t=p*e,r=Math.floor(t),s=r-z,n=r+x,i=4*(e-M)*f;for(let e=0;e<f;e++){const c=w*e,l=Math.floor(c);let u=0,f=0,h=0;const g=l-z,m=l+x;for(let e=s;e<=n;e++){const a=o(Math.abs(t-e)),s=y*(e<0||e>b?r:e);for(let e=g;e<=m;e++){const t=o(Math.abs(c-e))*a;if(0===t)continue;const r=s+4*(e<0||e>d?l:e);u+=A[r]*t,f+=A[r+1]*t,h+=A[r+2]*t}}const p=i+4*e;B[p]=a.a.trimByte(u),B[p+1]=a.a.trimByte(f),B[p+2]=a.a.trimByte(h),B[p+3]=255}}return B.buffer}}}});
//# sourceMappingURL=worker.js.map