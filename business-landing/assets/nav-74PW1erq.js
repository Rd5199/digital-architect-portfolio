const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/lenis-scroll-C1XLsgGn.js","assets/lenis-scroll-CDQ6_tbv.js"])))=>i.map(i=>d[i]);
import{i as e,n as t}from"./lenis-scroll-CDQ6_tbv.js";if((function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})(),matchMedia(`(pointer: fine)`).matches){let e=Object.assign(document.createElement(`div`),{id:`custom-cursor`});document.body.appendChild(e);let t=-100,n=-100,r=t,i=n,a,o=.1,s=()=>{r+=(t-r)*o,i+=(n-i)*o,e.style.setProperty(`--x`,`${r}px`),e.style.setProperty(`--y`,`${i}px`),a=requestAnimationFrame(s)};addEventListener(`pointermove`,r=>{t=r.clientX,n=r.clientY,e.classList.add(`is-visible`),a??=requestAnimationFrame(s)},{passive:!0}),addEventListener(`mouseleave`,()=>e.classList.remove(`is-visible`))}var n,r,i=typeof Symbol==`function`?Symbol():`_split`,a,o=()=>a||T.register(window.gsap),s=typeof Intl<`u`&&`Segmenter`in Intl?new Intl.Segmenter:0,c=e=>e?typeof e==`string`?c(document.querySelectorAll(e)):`length`in e?Array.from(e).reduce((e,t)=>(typeof t==`string`?e.push(...c(t)):e.push(t),e),[]):[e]:[],l=e=>c(e).filter(e=>e&&e.nodeType===1),u=[],d=function(){},f={add:e=>e()},p=/\s+/g,m=RegExp(`\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*|.`,`gu`),h={left:0,top:0,width:0,height:0},g=(e,t)=>{for(;++t<e.length&&e[t]===h;);return e[t]||h},_=({element:e,html:t,ariaL:n,ariaH:r})=>{e.innerHTML=t,n?e.setAttribute(`aria-label`,n):e.removeAttribute(`aria-label`),r?e.setAttribute(`aria-hidden`,r):e.removeAttribute(`aria-hidden`)},v=(e,t)=>{if(t){let n=new Set(e.join(``).match(t)||u),r=e.length,i,a,o,s;if(n.size)for(;--r>-1;){a=e[r];for(o of n)if(o.startsWith(a)&&o.length>a.length){for(i=0,s=a;o.startsWith(s+=e[r+ ++i])&&s.length<o.length;);if(i&&s.length===o.length){e[r]=o,e.splice(r+1,i);break}}}}return e},y=e=>window.getComputedStyle(e).display===`inline`&&(e.style.display=`inline-block`),b=(e,t,n)=>t.insertBefore(typeof e==`string`?document.createTextNode(e):e,n),x=(e,t,n)=>{let r=t[e+`sClass`]||``,{tag:i=`div`,aria:a=`auto`,propIndex:o=!1}=t,s=e===`line`?`block`:`inline-block`,c=r.indexOf(`++`)>-1,l=t=>{let l=document.createElement(i),u=n.length+1;return r&&(l.className=r+(c?` `+r+u:``)),o&&l.style.setProperty(`--`+e,u+``),a!==`none`&&l.setAttribute(`aria-hidden`,`true`),i!==`span`&&(l.style.position=`relative`,l.style.display=s),l.textContent=t,n.push(l),l};return c&&(r=r.replace(`++`,``)),l.collection=n,l},S=(e,t,n,r)=>{let i=x(`line`,n,r),a=window.getComputedStyle(e).textAlign||`left`;return(n,r)=>{let o=i(``);for(o.style.textAlign=a,e.insertBefore(o,t[n]);n<r;n++)o.appendChild(t[n]);o.normalize()}},C=(e,t,n,r,i,a,o,c,l,d)=>{var f;let m=Array.from(e.childNodes),h=0,{wordDelimiter:g,reduceWhiteSpace:_=!0,prepareText:x}=t,S=e.getBoundingClientRect(),w=S,T=!_&&window.getComputedStyle(e).whiteSpace.substring(0,3)===`pre`,E=0,D=n.collection,O,k,A,j,M,N,P,ee,F,I,L,R,z,B,V,H,U,W;for(typeof g==`object`?(A=g.delimiter||g,k=g.replaceWith||``):k=g===``?``:g||` `,O=k!==` `;h<m.length;h++)if(j=m[h],j.nodeType===3){for(V=j.textContent||``,_?V=V.replace(p,` `):T&&(V=V.replace(/\n/g,k+`
`)),x&&(V=x(V,e)),j.textContent=V,M=k||A?V.split(A||k):V.match(c)||u,U=M[M.length-1],ee=O?U.slice(-1)===` `:!U,U||M.pop(),w=S,P=O?M[0].charAt(0)===` `:!M[0],P&&b(` `,e,j),M[0]||M.shift(),v(M,l),a&&d||(j.textContent=``),F=1;F<=M.length;F++)if(H=M[F-1],!_&&T&&H.charAt(0)===`
`&&((f=j.previousSibling)==null||f.remove(),b(document.createElement(`br`),e,j),H=H.slice(1)),!_&&H===``)b(k,e,j);else if(H===` `)e.insertBefore(document.createTextNode(` `),j);else{if(O&&H.charAt(0)===` `&&b(` `,e,j),E&&F===1&&!P&&D.indexOf(E.parentNode)>-1?(N=D[D.length-1],N.appendChild(document.createTextNode(r?``:H))):(N=n(r?``:H),b(N,e,j),E&&F===1&&!P&&N.insertBefore(E,N.firstChild)),r)for(L=s?v([...s.segment(H)].map(e=>e.segment),l):H.match(c)||u,W=0;W<L.length;W++)N.appendChild(L[W]===` `?document.createTextNode(` `):r(L[W]));if(a&&d){if(V=j.textContent=V.substring(H.length+1,V.length),I=N.getBoundingClientRect(),I.top>w.top&&I.left<=w.left){for(R=e.cloneNode(),z=e.childNodes[0];z&&z!==N;)B=z,z=z.nextSibling,R.appendChild(B);e.parentNode.insertBefore(R,e),i&&y(R)}w=I}(F<M.length||ee)&&b(F>=M.length?` `:O&&H.slice(-1)===` `?` `+k:k,e,j)}e.removeChild(j),E=0}else j.nodeType===1&&(o&&o.indexOf(j)>-1?(D.indexOf(j.previousSibling)>-1&&D[D.length-1].appendChild(j),E=j):(C(j,t,n,r,i,a,o,c,l,!0),E=0),i&&y(j))},w=class e{constructor(e,t){this.isSplit=!1,o(),this.elements=l(e),this.chars=[],this.words=[],this.lines=[],this.masks=[],this.vars=t,this.elements.forEach(e=>{var n;t.overwrite!==!1&&((n=e[i])==null||n._data.orig.filter(({element:t})=>t===e).forEach(_)),e[i]=this}),this._split=()=>this.isSplit&&this.split(this.vars);let n=[],r,a=()=>{let e=n.length,t;for(;e--;){t=n[e];let r=t.element.offsetWidth;if(r!==t.width){t.width=r,this._split();return}}};this._data={orig:n,obs:typeof ResizeObserver<`u`&&new ResizeObserver(()=>{clearTimeout(r),r=setTimeout(a,200)})},d(this),this.split(t)}split(e){return(this._ctx||f).add(()=>{this.isSplit&&this.revert(),this.vars=e=e||this.vars||{};let{type:t=`chars,words,lines`,aria:n=`auto`,deepSlice:i=!0,smartWrap:a,onSplit:o,autoSplit:s=!1,specialChars:u,mask:d}=this.vars,f=t.indexOf(`lines`)>-1,p=t.indexOf(`chars`)>-1,_=t.indexOf(`words`)>-1,v=p&&!_&&!f,y=u&&(`push`in u?RegExp(`(?:`+u.join(`|`)+`)`,`gu`):u),b=y?RegExp(y.source+`|`+m.source,`gu`):m,w=!!e.ignore&&l(e.ignore),{orig:T,animTime:E,obs:D}=this._data,O;(p||_||f)&&(this.elements.forEach((t,r)=>{T[r]={element:t,html:t.innerHTML,ariaL:t.getAttribute(`aria-label`),ariaH:t.getAttribute(`aria-hidden`)},n===`auto`?t.setAttribute(`aria-label`,(t.textContent||``).trim()):n===`hidden`&&t.setAttribute(`aria-hidden`,`true`);let o=[],s=[],l=[],u=p?x(`char`,e,o):null,d=x(`word`,e,s),m,E,D,O;if(C(t,e,d,u,v,i&&(f||v),w,b,y,!1),f){let n=c(t.childNodes),r=S(t,n,e,l),i,a=[],o=0,s=n.map(e=>e.nodeType===1?e.getBoundingClientRect():h),u=h,d;for(m=0;m<n.length;m++)i=n[m],i.nodeType===1&&(i.nodeName===`BR`?((!m||n[m-1].nodeName!==`BR`)&&(a.push(i),r(o,m+1)),o=m+1,u=g(s,m)):(d=s[m],m&&d.top>u.top&&d.left<u.left+u.width-1&&(r(o,m),o=m),u=d));o<m&&r(o,m),a.forEach(e=>e.parentNode?.removeChild(e))}if(!_){for(m=0;m<s.length;m++)if(E=s[m],p||!E.nextSibling||E.nextSibling.nodeType!==3)if(a&&!f){for(D=document.createElement(`span`),D.style.whiteSpace=`nowrap`;E.firstChild;)D.appendChild(E.firstChild);E.replaceWith(D)}else E.replaceWith(...E.childNodes);else O=E.nextSibling,O&&O.nodeType===3&&(O.textContent=(E.textContent||``)+(O.textContent||``),E.remove());s.length=0,t.normalize()}this.lines.push(...l),this.words.push(...s),this.chars.push(...o)}),d&&this[d]&&this.masks.push(...this[d].map(e=>{let t=e.cloneNode();return e.replaceWith(t),t.appendChild(e),e.className&&(t.className=e.className.trim().split(` `).map(e=>e+`-mask`).join(` `)),t.style.overflow=`clip`,t}))),this.isSplit=!0,r&&f&&s&&r.addEventListener(`loadingdone`,this._split),(O=o&&o(this))&&O.totalTime&&(this._data.anim=E?O.totalTime(E):O),f&&s&&this.elements.forEach((e,t)=>{T[t].width=e.offsetWidth,D&&D.observe(e)})}),this}kill(){let{obs:e}=this._data;e&&e.disconnect(),r?.removeEventListener(`loadingdone`,this._split)}revert(){var e,t;if(this.isSplit){let{orig:n,anim:r}=this._data;this.kill(),n.forEach(_),this.chars.length=this.words.length=this.lines.length=n.length=this.masks.length=0,this.isSplit=!1,r&&(this._data.animTime=r.totalTime(),r.revert()),(t=(e=this.vars).onRevert)==null||t.call(e,this)}return this}static create(t,n){return new e(t,n)}static register(e){n=n||e||window.gsap,n&&(c=n.utils.toArray,d=n.core.context||d),!a&&window.innerWidth>0&&(r=document.fonts,a=!0)}};w.version=`3.15.0`;var T=w;e.registerPlugin(t,T);var E=`preloaderSeen`,D=3.25;function O(e){document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,e,{once:!0}):e()}function k(e){let t=(e.getAttribute(`data-animate-variant`)||``).trim();return t===`slide-words`?`words`:t===`slide-lines`?`lines`:(e.getAttribute(`data-animate-split`)||``).trim()===`words`?`words`:`lines`}function A(n,{isPreloaderShowing:r,hero:i}){let a=n.getAttribute(`data-animate-on-scroll`)===`true`,o=parseFloat(n.getAttribute(`data-animate-delay`))||0;r&&!a&&i&&i.contains(n)&&(o+=D);let s=parseFloat(n.getAttribute(`data-animate-duration`))||.75,c=parseFloat(n.getAttribute(`data-animate-stagger`))||.1,l=(n.getAttribute(`data-animate-start`)||`top 70%`).trim(),u=k(n);T.create(n,{type:u,mask:u,autoSplit:!0,linesClass:`line`,wordsClass:`word`,onSplit(r){let i=u===`words`?r.words:r.lines;e.set(i,{yPercent:100});let d=e.to(i,{yPercent:0,duration:s,ease:`power3.out`,delay:o,stagger:c,paused:a});a&&t.create({trigger:n,start:l,animation:d,toggleActions:`play none none none`})}})}function j(){let e=document.querySelector(`.preloader`),t=sessionStorage.getItem(E)===`true`,n=!!e&&!t,r=document.querySelector(`.hero`);document.querySelectorAll(`[data-animate-variant]`).forEach(e=>{let t=e.getAttribute(`data-animate-variant`);(t===`slide`||t===`slide-lines`||t===`slide-words`)&&A(e,{isPreloaderShowing:n,hero:r})})}O(()=>{let e=document.fonts?.ready;e&&typeof e.then==`function`?e.then(()=>j()):j()});var M=document.createElement(`canvas`),N=!1,P=M.getContext(`webgl`,{alpha:!0,depth:!1,antialias:!1,powerPreference:`high-performance`}),ee=P.getExtension(`OES_texture_half_float`);P.getExtension(`OES_texture_half_float_linear`);var F={TEXTURE_DOWNSAMPLE:2,VELOCITY_DISSIPATION:.925,DENSITY_DISSIPATION:.95,CURL:50,PRESSURE_DISSIPATION:.75,PRESSURE_ITERATIONS:50,SPLAT_RADIUS:.0075,DISPLAY_SHADER:.75,SMOOTHING:1,SPLAT_DYE_SCALE:.85,STROKE_SCALE:25,splatDyeR:1,splatDyeG:214/255,splatDyeB:1/255,invertVelocityX:!1,invertVelocityY:!1,invertPointerY:!1,inkR:1,inkG:214/255,inkB:1/255,clearR:.05,clearG:.05,clearB:.05,clearA:0,mixBlendMode:`difference`,canvasOpacity:1,zIndex:2e4,pointerEvents:`none`,flipCanvasY:!1,blendPreset:`one_oneMinusSrcAlpha`,paused:!1,maxDt:.016,dprCap:2},I=0,L=0,R=P.createBuffer();P.bindBuffer(P.ARRAY_BUFFER,R),P.bufferData(P.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),P.STATIC_DRAW);var z=`precision highp float;
attribute vec2 aPosition;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;function B(e){let t=P.createShader(P.VERTEX_SHADER);P.shaderSource(t,z),P.compileShader(t);let n=P.createShader(P.FRAGMENT_SHADER);P.shaderSource(n,e),P.compileShader(n);let r=P.createProgram();P.attachShader(r,t),P.attachShader(r,n),P.linkProgram(r);let i={},a=P.getProgramParameter(r,P.ACTIVE_UNIFORMS);for(let e=0;e<a;e++){let{name:t}=P.getActiveUniform(r,e);i[t]=P.getUniformLocation(r,t)}return{p:r,u:i}}function V(e,t,n){let r=ee?ee.HALF_FLOAT_OES:P.FLOAT,i=P.createTexture();P.bindTexture(P.TEXTURE_2D,i),P.texParameteri(P.TEXTURE_2D,P.TEXTURE_MIN_FILTER,n),P.texParameteri(P.TEXTURE_2D,P.TEXTURE_MAG_FILTER,n),P.texParameteri(P.TEXTURE_2D,P.TEXTURE_WRAP_S,P.CLAMP_TO_EDGE),P.texParameteri(P.TEXTURE_2D,P.TEXTURE_WRAP_T,P.CLAMP_TO_EDGE),P.texImage2D(P.TEXTURE_2D,0,P.RGBA,e,t,0,P.RGBA,r,null);let a=P.createFramebuffer();return P.bindFramebuffer(P.FRAMEBUFFER,a),P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,i,0),P.viewport(0,0,e,t),P.clear(P.COLOR_BUFFER_BIT),{tex:i,fb:a,w:e,h:t,bind(e){return P.activeTexture(P.TEXTURE0+e),P.bindTexture(P.TEXTURE_2D,i),e}}}function H(e,t,n){let r=V(e,t,n),i=V(e,t,n);return{w:e,h:t,get read(){return r},get write(){return i},swap(){[r,i]=[i,r]}}}function U(e,t){e&&P.deleteTexture(e),t&&P.deleteFramebuffer(t)}function W(e){e&&U(e.tex,e.fb)}function te(e){e&&(W(e.read),W(e.write))}var G=null;function K(e){P.bindFramebuffer(P.FRAMEBUFFER,e?e.fb:null),P.viewport(0,0,e?e.w:X,e?e.h:Z),P.drawArrays(P.TRIANGLE_FAN,0,4)}function q({p:e,u:t}){P.useProgram(e);let n=P.getAttribLocation(e,`aPosition`);return P.enableVertexAttribArray(n),P.vertexAttribPointer(n,2,P.FLOAT,!1,0,0),t}var J={clear:B(`precision highp float;
precision mediump sampler2D;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float value;
void main () {
  vec4 tex = texture2D(uTexture, vUv);
  gl_FragColor = vec4(mix(vec3(0.0), tex.rgb, value), 0.0);
}`),display:B(`precision highp float;
precision mediump sampler2D;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uDisplayCutoff;
uniform float uSmoothing;
uniform vec3 uInk;
uniform vec3 uBg;
void main () {
  vec4 tex = texture2D(uTexture, vUv);
  float lo = uDisplayCutoff * uSmoothing;
  float hi = uDisplayCutoff;
  float a = smoothstep(lo, hi, clamp(length(tex.rgb), 0.0, 1.0));
  gl_FragColor = vec4(mix(uBg, uInk, a), 1.0);
}`),splat:B(`precision highp float;
precision mediump sampler2D;
varying vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}`),advection:B(`precision highp float;
precision mediump sampler2D;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  gl_FragColor = dissipation * texture2D(uSource, coord);
}`),divergence:B(`precision highp float;
precision mediump sampler2D;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
vec2 sampleVelocity (in vec2 uv) {
  vec2 multiplier = vec2(1.0, 1.0);
  if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }
  if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }
  if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }
  if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }
  return multiplier * texture2D(uVelocity, uv).xy;
}
void main () {
  float L = sampleVelocity(vL).x;
  float R = sampleVelocity(vR).x;
  float T = sampleVelocity(vT).y;
  float B = sampleVelocity(vB).y;
  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}`),curl:B(`precision highp float;
precision mediump sampler2D;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
}`),vorticity:B(`precision highp float;
precision mediump sampler2D;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main () {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L));
  force *= 1.0 / length(force + 0.00001) * curl * C;
  vec2 vel = texture2D(uVelocity, vUv).xy;
  gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
}`),pressure:B(`precision highp float;
precision mediump sampler2D;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
vec2 boundary (in vec2 uv) {
  return min(max(uv, 0.0), 1.0);
}
void main () {
  float L = texture2D(uPressure, boundary(vL)).x;
  float R = texture2D(uPressure, boundary(vR)).x;
  float T = texture2D(uPressure, boundary(vT)).x;
  float B = texture2D(uPressure, boundary(vB)).x;
  float divergence = texture2D(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}`),gradSub:B(`precision highp float;
precision mediump sampler2D;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
vec2 boundary (in vec2 uv) {
  return min(max(uv, 0.0), 1.0);
}
void main () {
  float L = texture2D(uPressure, boundary(vL)).x;
  float R = texture2D(uPressure, boundary(vR)).x;
  float T = texture2D(uPressure, boundary(vT)).x;
  float B = texture2D(uPressure, boundary(vB)).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`)},Y=Math.min(window.devicePixelRatio||1,F.dprCap),X=M.width=window.innerWidth*Y,Z=M.height=window.innerHeight*Y;function ne(){M.style.width=window.innerWidth+`px`,M.style.height=window.innerHeight+`px`}function re(){let e=F.flipCanvasY?`scaleY(-1)`:`none`;M.style.cssText=`
    mix-blend-mode: ${F.mixBlendMode};
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: ${F.pointerEvents};
    z-index: ${F.zIndex};
    opacity: ${F.canvasOpacity};
    transform: ${e};
    transform-origin: center center;
  `}function ie(){switch(P.enable(P.BLEND),F.blendPreset){case`additive`:P.blendFunc(P.ONE,P.ONE);break;case`srcAlpha_oneMinusSrcAlpha`:P.blendFunc(P.SRC_ALPHA,P.ONE_MINUS_SRC_ALPHA);break;default:P.blendFunc(P.ONE,P.ONE_MINUS_SRC_ALPHA)}}function ae(){let e=F.TEXTURE_DOWNSAMPLE|0;I=Math.max(1,X>>e),L=Math.max(1,Z>>e)}function oe(){ae(),G&&(te(G.vel),te(G.dye),W(G.div),W(G.curl),te(G.pres)),G={vel:H(I,L,P.LINEAR),dye:H(I,L,P.LINEAR),div:V(I,L,P.NEAREST),curl:V(I,L,P.NEAREST),pres:H(I,L,P.NEAREST)}}function se(){Y=Math.min(window.devicePixelRatio||1,F.dprCap),X=M.width=Math.max(1,Math.floor(window.innerWidth*Y)),Z=M.height=Math.max(1,Math.floor(window.innerHeight*Y)),ne();let e=I,t=L;ae(),(I!==e||L!==t)&&oe()}function ce(){N||(N=!0,document.body.appendChild(M),M.style.opacity=`0`,M.style.mixBlendMode=`normal`,ae(),oe(),re(),ne(),requestAnimationFrame(()=>{M.style.opacity=String(F.canvasOpacity)}))}function le(e,t,n,r){let i=M.getBoundingClientRect(),a=(e-i.left)/i.width,o=1-(t-i.top)/i.height;F.invertPointerY&&(o=1-o);let s=n,c=r;F.invertVelocityX&&(s=-s),F.invertVelocityY&&(c=-c),P.disable(P.BLEND);let l=q(J.splat);P.uniform2f(l.texelSize,1/I,1/L),P.uniform1f(l.aspectRatio,X/Z),P.uniform2f(l.point,a,o),P.uniform1f(l.radius,F.SPLAT_RADIUS),P.uniform1i(l.uTarget,G.vel.read.bind(0)),P.uniform3f(l.color,s,-c,1),K(G.vel.write),G.vel.swap(),P.uniform1i(l.uTarget,G.dye.read.bind(0)),P.uniform3f(l.color,F.SPLAT_DYE_SCALE*F.splatDyeR,F.SPLAT_DYE_SCALE*F.splatDyeG,F.SPLAT_DYE_SCALE*F.splatDyeB),K(G.dye.write),G.dye.swap()}function ue(e){P.disable(P.BLEND),P.viewport(0,0,I,L);let t=q(J.advection);P.uniform2f(t.texelSize,1/I,1/L),P.uniform1i(t.uVelocity,G.vel.read.bind(0)),P.uniform1i(t.uSource,G.vel.read.bind(0)),P.uniform1f(t.dt,e),P.uniform1f(t.dissipation,F.VELOCITY_DISSIPATION),K(G.vel.write),G.vel.swap(),P.uniform1i(t.uVelocity,G.vel.read.bind(0)),P.uniform1i(t.uSource,G.dye.read.bind(1)),P.uniform1f(t.dissipation,F.DENSITY_DISSIPATION),K(G.dye.write),G.dye.swap()}function de(e){P.disable(P.BLEND),P.viewport(0,0,I,L);let t=q(J.curl);P.uniform2f(t.texelSize,1/I,1/L),P.uniform1i(t.uVelocity,G.vel.read.bind(0)),K(G.curl),t=q(J.vorticity),P.uniform2f(t.texelSize,1/I,1/L),P.uniform1i(t.uVelocity,G.vel.read.bind(0)),P.uniform1i(t.uCurl,G.curl.bind(1)),P.uniform1f(t.curl,F.CURL),P.uniform1f(t.dt,e),K(G.vel.write),G.vel.swap(),t=q(J.divergence),P.uniform2f(t.texelSize,1/I,1/L),P.uniform1i(t.uVelocity,G.vel.read.bind(0)),K(G.div),t=q(J.clear),P.uniform2f(t.texelSize,1/I,1/L),P.uniform1i(t.uTexture,G.pres.read.bind(0)),P.uniform1f(t.value,F.PRESSURE_DISSIPATION),K(G.pres.write),G.pres.swap(),t=q(J.pressure),P.uniform2f(t.texelSize,1/I,1/L),P.uniform1i(t.uDivergence,G.div.bind(0));for(let e=0;e<F.PRESSURE_ITERATIONS;e++)P.uniform1i(t.uPressure,G.pres.read.bind(1)),K(G.pres.write),G.pres.swap();t=q(J.gradSub),P.uniform2f(t.texelSize,1/I,1/L),P.uniform1i(t.uPressure,G.pres.read.bind(0)),P.uniform1i(t.uVelocity,G.vel.read.bind(1)),K(G.vel.write),G.vel.swap()}function fe(){ie(),P.bindFramebuffer(P.FRAMEBUFFER,null),P.viewport(0,0,X,Z),P.clearColor(F.clearR,F.clearG,F.clearB,F.clearA),P.clear(P.COLOR_BUFFER_BIT);let e=q(J.display);P.uniform2f(e.texelSize,1/X,1/Z),P.uniform1i(e.uTexture,G.dye.read.bind(0)),P.uniform1f(e.uDisplayCutoff,F.DISPLAY_SHADER),P.uniform1f(e.uSmoothing,F.SMOOTHING),P.uniform3f(e.uInk,F.inkR,F.inkG,F.inkB),P.uniform3f(e.uBg,0,0,0),K(null)}var Q={x:0,y:0,dx:0,dy:0,moved:!1,down:!1,initialized:!1};function pe(e,t){Q.initialized?(Q.dx=F.STROKE_SCALE*(e-Q.x),Q.dy=F.STROKE_SCALE*(t-Q.y),Q.moved=!0):Q.initialized=!0,Q.x=e,Q.y=t}var me=e=>pe(e.clientX,e.clientY),he=e=>{e.preventDefault();let t=e.touches[0];pe(t.clientX,t.clientY)},ge,_e=()=>{clearTimeout(ge),ge=setTimeout(se,50)},ve=Date.now(),ye=0;function be(){let e=Date.now(),t=Math.min((e-ve)/1e3,F.maxDt);ve=e,F.paused||(ue(t),Q.moved&&=(le(Q.x,Q.y,Q.dx,Q.dy),!1),de(t)),fe(),ye=requestAnimationFrame(be)}window.fluidSim={C:F,gl:P,canvas:M,rebuildFramebuffers:oe,resizeCanvasDimensions:se,applyCanvasStyle:re};function xe(){ce(),window.addEventListener(`mousemove`,me),window.addEventListener(`touchmove`,he,{passive:!1}),window.addEventListener(`resize`,_e),ye=requestAnimationFrame(be),window.__lbRegisterCleanup?.(()=>{F.paused=!0,ye&&cancelAnimationFrame(ye),window.removeEventListener(`mousemove`,me),window.removeEventListener(`touchmove`,he),window.removeEventListener(`resize`,_e),clearTimeout(ge),M.remove(),N=!1})}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,xe,{once:!0}):xe();var Se=[{name:`BrandReppd`,logo:`/assets/logos/brandreppd.png`,url:`https://brandreppd.com`},{name:`Localito`,logo:`/assets/logos/localito.png`,url:`https://localito.com`},{name:`TheraMate`,logo:`/assets/logos/theramate.png`,url:`https://theramate.co.uk`}],Ce={studio:`Custom AI studio`,location:`Web & Mobile Apps`,edition:`Service businesses`,email:`info@mydigitalarchitect.com`},we=`modulepreload`,Te=function(e){return`/business-landing/`+e},Ee={},De=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=Te(t,n),t in Ee)return;Ee[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:we,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},Oe=`/business-landing/`,$=null;try{let e=await De(()=>import(`./lenis-scroll-C1XLsgGn.js`),__vite__mapDeps([0,1]));$=e.default||e.lenis||null}catch{}e.registerPlugin(T);var ke=[{label:`Home`,route:`/business-landing/business.html`},{label:`Studio`,route:`/business-landing/studio.html`},{label:`Work`,route:`/business-landing/work.html`},{label:`Project`,route:`/business-landing/sample-project.html`},{label:`Contact`,route:`/business-landing/contact.html`}];function Ae(){let e=document.querySelector(`nav`);if(!e)return;let t=document.querySelector(`.menu-overlay`);t&&t.remove();let n=e.querySelector(`.nav-toggler`);n&&(n.innerHTML=`
      <div class="nav-toggle-wrapper">
        <p class="open-label">Menu</p>
        <p class="close-label">Close</p>
      </div>
    `);let r=document.createElement(`div`);r.className=`menu-overlay`,r.innerHTML=`
    <div class="menu-content">
      <div class="menu-col" data-col="0">
        <div class="menu-content-group">
          <p>&copy; MyDigitalArchitect</p>
          <p>${Ce.studio}</p>
          <p>${Ce.location}</p>
        </div>
        <div class="menu-content-group">
          <p>Focus</p>
          <p>${Ce.edition}</p>
        </div>
        <div class="menu-content-group">
          <p>Say Hello</p>
          <p>${Ce.email}</p>
        </div>
        <div class="menu-content-group">
          <p>Free audit</p>
          <p>No sign-up required</p>
        </div>
      </div>
      <div class="menu-col" data-col="1">
        <div class="menu-content-group">
          <p>Socials</p>
          <a href="mailto:info@mydigitalarchitect.com">Email</a>
          <a href="/#ai-audit" target="_parent">Free AI audit</a>
        </div>
        <div class="menu-content-group">
          <p>Language</p>
          <p>Human</p>
        </div>
        <div class="menu-content-group">
          <p>Credits</p>
          <p>Made by MyDigitalArchitect</p>
          <p>Web &amp; Mobile Apps</p>
        </div>
      </div>
    </div>

    <div class="menu-img">
      <img src="${Oe}menu/menu-img.jpg" alt="" />
    </div>

    <div class="menu-links-wrapper">
      ${ke.map(e=>`
        <div class="menu-link" data-route="${e.route}">
          <a href="${e.route}">
            <span>${e.label}</span>
            <span>${e.label}</span>
          </a>
        </div>
      `).join(``)}
      <div class="link-highlighter"></div>
    </div>
  `,document.body.appendChild(r)}function je(){Ae();let t=document.querySelector(`.nav-toggler`),n=document.querySelector(`.menu-overlay`),r=document.querySelector(`.menu-overlay .menu-img img`),i=document.querySelector(`.menu-links-wrapper`),a=document.querySelector(`.link-highlighter`),o=Array.from(document.querySelectorAll(`.menu-link a`)),s=Array.from(document.querySelectorAll(`.menu-link`)),c=document.querySelector(`.open-label`),l=document.querySelector(`.close-label`),u=Array.from(document.querySelectorAll(`.menu-col`)),d=!1,f=!1,p=[];function m(){p.forEach(e=>e.revert&&e.revert()),p.length=0,o.forEach(t=>{t.querySelectorAll(`span`).forEach((t,n)=>{let r=new T(t,{type:`chars`});p.push(r),r.chars.forEach(e=>e.classList.add(`char`)),n===1&&e.set(r.chars,{y:`110%`})})})}let h=[];function g(){d||(h.forEach(e=>e.revert&&e.revert()),h.length=0,u.forEach(t=>{t.querySelectorAll(`p, a`).forEach(t=>{let n=T.create(t,{type:`lines`,mask:`lines`,linesClass:`split-line`});h.push(n),e.set(n.lines,{y:`100%`})})}))}function _(){e.set(r,{y:0,scale:.5,opacity:.25}),e.set(o,{y:`150%`}),e.set(a,{y:`150%`});let t=s[0],n=t?t.querySelector(`a span`):null;if(n){let e=n.offsetWidth;a.style.width=e+`px`,C=e,w=e;let r=t.getBoundingClientRect(),o=i.getBoundingClientRect(),s=r.left-o.left;x=s,S=s}}let v=0,y=0,b=.05,x=0,S=0,C=0,w=0,E=null;function D(){v+=(y-v)*b,x+=(S-x)*b,C+=(w-C)*b,e.set(i,{x:v}),e.set(a,{x,width:C}),E=requestAnimationFrame(D)}function O(){window.innerWidth<1e3||(E||=(n.addEventListener(`mousemove`,A),i.addEventListener(`mouseleave`,N),requestAnimationFrame(D)))}function k(){E&&cancelAnimationFrame(E),E=null,n.removeEventListener(`mousemove`,A),i.removeEventListener(`mouseleave`,N)}function A(e){if(window.innerWidth<1e3)return;let t=e.clientX,n=window.innerWidth,r=n-i.offsetWidth,a=n*.5,o=(n-a)/2,s=o+a,c;c=t<=o?0:t>=s?1:(t-o)/a,y=0+c*(r-0)}function j(t){if(window.innerWidth<1e3)return;let n=t.querySelectorAll(`a span`);if(!n||n.length<2)return;let r=n[0].querySelectorAll(`.char`),a=n[1].querySelectorAll(`.char`);e.to(r,{y:`-110%`,stagger:.05,duration:.5,ease:`expo.inOut`}),e.to(a,{y:`0%`,stagger:.05,duration:.5,ease:`expo.inOut`});let o=t.getBoundingClientRect(),s=i.getBoundingClientRect();S=o.left-s.left;let c=t.querySelector(`a span`);w=c?c.offsetWidth:t.offsetWidth}function M(t){if(window.innerWidth<1e3)return;let n=t.querySelectorAll(`a span`);if(!n||n.length<2)return;let r=n[0].querySelectorAll(`.char`),i=n[1].querySelectorAll(`.char`);e.to(i,{y:`110%`,stagger:.05,duration:.5,ease:`expo.inOut`}),e.to(r,{y:`0%`,stagger:.05,duration:.5,ease:`expo.inOut`})}function N(){let e=s[0];if(!e)return;let t=e.querySelector(`a span`);if(!t)return;let n=e.getBoundingClientRect(),r=i.getBoundingClientRect();S=n.left-r.left,w=t.offsetWidth}s.forEach(e=>{e.addEventListener(`mouseenter`,()=>j(e)),e.addEventListener(`mouseleave`,()=>M(e));let t=e.querySelector(`a`);t&&t.addEventListener(`click`,e=>{let n=t.getAttribute(`href`)||``,r=window.location.pathname;n&&r===n&&e.preventDefault()})});function P(){f||(f=!0,d?(e.to(c,{y:`0%`,duration:1,ease:`power3.out`}),e.to(l,{y:`0%`,duration:1,ease:`power3.out`}),e.to(r,{y:`-25svh`,opacity:.5,duration:1.25,ease:`expo.out`}),u.forEach(t=>{let n=t.querySelectorAll(`.split-line`);e.to(n,{y:`-100%`,duration:1,stagger:0,ease:`expo.out`})}),e.to(n,{clipPath:`polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)`,duration:1.25,ease:`expo.out`,onComplete:()=>{k(),e.set(n,{clipPath:`polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)`}),e.set(o,{y:`150%`}),e.set(a,{y:`150%`}),e.set(r,{y:`0`,scale:.5,opacity:.25}),s.forEach(e=>e.style.overflow=`hidden`),u.forEach(t=>{let n=t.querySelectorAll(`.split-line`);e.set(n,{y:`100%`})}),e.set(i,{x:0}),v=0,y=0,g(),d=!1,f=!1,$&&$.start()}})):($&&$.stop(),O(),e.to(c,{y:`-100%`,duration:1,ease:`power3.out`}),e.to(l,{y:`-100%`,duration:1,ease:`power3.out`}),e.to(n,{clipPath:`polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)`,duration:1.25,ease:`expo.out`,onComplete:()=>{s.forEach(e=>e.style.overflow=`visible`),d=!0,f=!1}}),e.to(r,{scale:1,opacity:1,duration:1.5,ease:`expo.out`}),e.to(o,{y:`0%`,duration:1.25,stagger:.1,delay:.25,ease:`expo.out`}),e.to(a,{y:`0%`,duration:1,delay:1,ease:`expo.out`}),u.forEach(t=>{let n=t.querySelectorAll(`.split-line`);e.to(n,{y:`0%`,duration:1,stagger:.05,delay:.5,ease:`expo.out`})})))}t.addEventListener(`click`,P),m(),g(),_()}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,je):je();export{T as n,Se as t};