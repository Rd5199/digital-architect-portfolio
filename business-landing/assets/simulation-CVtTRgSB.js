var e=document.createElement(`canvas`),t=!1,n=e.getContext(`webgl`,{alpha:!0,depth:!1,antialias:!1,powerPreference:`high-performance`}),r=n.getExtension(`OES_texture_half_float`);n.getExtension(`OES_texture_half_float_linear`);var i={TEXTURE_DOWNSAMPLE:2,VELOCITY_DISSIPATION:.925,DENSITY_DISSIPATION:.95,CURL:50,PRESSURE_DISSIPATION:.75,PRESSURE_ITERATIONS:50,SPLAT_RADIUS:.0075,DISPLAY_SHADER:.75,SMOOTHING:1,SPLAT_DYE_SCALE:.85,STROKE_SCALE:25,splatDyeR:1,splatDyeG:214/255,splatDyeB:1/255,invertVelocityX:!1,invertVelocityY:!1,invertPointerY:!1,inkR:1,inkG:214/255,inkB:1/255,clearR:.05,clearG:.05,clearB:.05,clearA:0,mixBlendMode:`difference`,canvasOpacity:1,zIndex:2e4,pointerEvents:`none`,flipCanvasY:!1,blendPreset:`one_oneMinusSrcAlpha`,paused:!1,maxDt:.016,dprCap:2},a=0,o=0,s=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,s),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),n.STATIC_DRAW);var c=`precision highp float;
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
}`;function l(e){let t=n.createShader(n.VERTEX_SHADER);n.shaderSource(t,c),n.compileShader(t);let r=n.createShader(n.FRAGMENT_SHADER);n.shaderSource(r,e),n.compileShader(r);let i=n.createProgram();n.attachShader(i,t),n.attachShader(i,r),n.linkProgram(i);let a={},o=n.getProgramParameter(i,n.ACTIVE_UNIFORMS);for(let e=0;e<o;e++){let{name:t}=n.getActiveUniform(i,e);a[t]=n.getUniformLocation(i,t)}return{p:i,u:a}}function u(e,t,i){let a=r?r.HALF_FLOAT_OES:n.FLOAT,o=n.createTexture();n.bindTexture(n.TEXTURE_2D,o),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,i),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,i),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,e,t,0,n.RGBA,a,null);let s=n.createFramebuffer();return n.bindFramebuffer(n.FRAMEBUFFER,s),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,o,0),n.viewport(0,0,e,t),n.clear(n.COLOR_BUFFER_BIT),{tex:o,fb:s,w:e,h:t,bind(e){return n.activeTexture(n.TEXTURE0+e),n.bindTexture(n.TEXTURE_2D,o),e}}}function d(e,t,n){let r=u(e,t,n),i=u(e,t,n);return{w:e,h:t,get read(){return r},get write(){return i},swap(){[r,i]=[i,r]}}}function f(e,t){e&&n.deleteTexture(e),t&&n.deleteFramebuffer(t)}function p(e){e&&f(e.tex,e.fb)}function m(e){e&&(p(e.read),p(e.write))}var h=null;function g(e){n.bindFramebuffer(n.FRAMEBUFFER,e?e.fb:null),n.viewport(0,0,e?e.w:b,e?e.h:x),n.drawArrays(n.TRIANGLE_FAN,0,4)}function _({p:e,u:t}){n.useProgram(e);let r=n.getAttribLocation(e,`aPosition`);return n.enableVertexAttribArray(r),n.vertexAttribPointer(r,2,n.FLOAT,!1,0,0),t}var v={clear:l(`precision highp float;
precision mediump sampler2D;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float value;
void main () {
  vec4 tex = texture2D(uTexture, vUv);
  gl_FragColor = vec4(mix(vec3(0.0), tex.rgb, value), 0.0);
}`),display:l(`precision highp float;
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
}`),splat:l(`precision highp float;
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
}`),advection:l(`precision highp float;
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
}`),divergence:l(`precision highp float;
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
}`),curl:l(`precision highp float;
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
}`),vorticity:l(`precision highp float;
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
}`),pressure:l(`precision highp float;
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
}`),gradSub:l(`precision highp float;
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
}`)},y=Math.min(window.devicePixelRatio||1,i.dprCap),b=e.width=window.innerWidth*y,x=e.height=window.innerHeight*y;function S(){e.style.width=window.innerWidth+`px`,e.style.height=window.innerHeight+`px`}function C(){let t=i.flipCanvasY?`scaleY(-1)`:`none`;e.style.cssText=`
    mix-blend-mode: ${i.mixBlendMode};
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: ${i.pointerEvents};
    z-index: ${i.zIndex};
    opacity: ${i.canvasOpacity};
    transform: ${t};
    transform-origin: center center;
  `}function w(){switch(n.enable(n.BLEND),i.blendPreset){case`additive`:n.blendFunc(n.ONE,n.ONE);break;case`srcAlpha_oneMinusSrcAlpha`:n.blendFunc(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA);break;default:n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA)}}function T(){let e=i.TEXTURE_DOWNSAMPLE|0;a=Math.max(1,b>>e),o=Math.max(1,x>>e)}function E(){T(),h&&(m(h.vel),m(h.dye),p(h.div),p(h.curl),m(h.pres)),h={vel:d(a,o,n.LINEAR),dye:d(a,o,n.LINEAR),div:u(a,o,n.NEAREST),curl:u(a,o,n.NEAREST),pres:d(a,o,n.NEAREST)}}function D(){y=Math.min(window.devicePixelRatio||1,i.dprCap),b=e.width=Math.max(1,Math.floor(window.innerWidth*y)),x=e.height=Math.max(1,Math.floor(window.innerHeight*y)),S();let t=a,n=o;T(),(a!==t||o!==n)&&E()}function O(){t||(t=!0,document.body.appendChild(e),e.style.opacity=`0`,e.style.mixBlendMode=`normal`,T(),E(),C(),S(),requestAnimationFrame(()=>{e.style.opacity=String(i.canvasOpacity)}))}function k(t,r,s,c){let l=e.getBoundingClientRect(),u=(t-l.left)/l.width,d=1-(r-l.top)/l.height;i.invertPointerY&&(d=1-d);let f=s,p=c;i.invertVelocityX&&(f=-f),i.invertVelocityY&&(p=-p),n.disable(n.BLEND);let m=_(v.splat);n.uniform2f(m.texelSize,1/a,1/o),n.uniform1f(m.aspectRatio,b/x),n.uniform2f(m.point,u,d),n.uniform1f(m.radius,i.SPLAT_RADIUS),n.uniform1i(m.uTarget,h.vel.read.bind(0)),n.uniform3f(m.color,f,-p,1),g(h.vel.write),h.vel.swap(),n.uniform1i(m.uTarget,h.dye.read.bind(0)),n.uniform3f(m.color,i.SPLAT_DYE_SCALE*i.splatDyeR,i.SPLAT_DYE_SCALE*i.splatDyeG,i.SPLAT_DYE_SCALE*i.splatDyeB),g(h.dye.write),h.dye.swap()}function A(e){n.disable(n.BLEND),n.viewport(0,0,a,o);let t=_(v.advection);n.uniform2f(t.texelSize,1/a,1/o),n.uniform1i(t.uVelocity,h.vel.read.bind(0)),n.uniform1i(t.uSource,h.vel.read.bind(0)),n.uniform1f(t.dt,e),n.uniform1f(t.dissipation,i.VELOCITY_DISSIPATION),g(h.vel.write),h.vel.swap(),n.uniform1i(t.uVelocity,h.vel.read.bind(0)),n.uniform1i(t.uSource,h.dye.read.bind(1)),n.uniform1f(t.dissipation,i.DENSITY_DISSIPATION),g(h.dye.write),h.dye.swap()}function j(e){n.disable(n.BLEND),n.viewport(0,0,a,o);let t=_(v.curl);n.uniform2f(t.texelSize,1/a,1/o),n.uniform1i(t.uVelocity,h.vel.read.bind(0)),g(h.curl),t=_(v.vorticity),n.uniform2f(t.texelSize,1/a,1/o),n.uniform1i(t.uVelocity,h.vel.read.bind(0)),n.uniform1i(t.uCurl,h.curl.bind(1)),n.uniform1f(t.curl,i.CURL),n.uniform1f(t.dt,e),g(h.vel.write),h.vel.swap(),t=_(v.divergence),n.uniform2f(t.texelSize,1/a,1/o),n.uniform1i(t.uVelocity,h.vel.read.bind(0)),g(h.div),t=_(v.clear),n.uniform2f(t.texelSize,1/a,1/o),n.uniform1i(t.uTexture,h.pres.read.bind(0)),n.uniform1f(t.value,i.PRESSURE_DISSIPATION),g(h.pres.write),h.pres.swap(),t=_(v.pressure),n.uniform2f(t.texelSize,1/a,1/o),n.uniform1i(t.uDivergence,h.div.bind(0));for(let e=0;e<i.PRESSURE_ITERATIONS;e++)n.uniform1i(t.uPressure,h.pres.read.bind(1)),g(h.pres.write),h.pres.swap();t=_(v.gradSub),n.uniform2f(t.texelSize,1/a,1/o),n.uniform1i(t.uPressure,h.pres.read.bind(0)),n.uniform1i(t.uVelocity,h.vel.read.bind(1)),g(h.vel.write),h.vel.swap()}function M(){w(),n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,b,x),n.clearColor(i.clearR,i.clearG,i.clearB,i.clearA),n.clear(n.COLOR_BUFFER_BIT);let e=_(v.display);n.uniform2f(e.texelSize,1/b,1/x),n.uniform1i(e.uTexture,h.dye.read.bind(0)),n.uniform1f(e.uDisplayCutoff,i.DISPLAY_SHADER),n.uniform1f(e.uSmoothing,i.SMOOTHING),n.uniform3f(e.uInk,i.inkR,i.inkG,i.inkB),n.uniform3f(e.uBg,0,0,0),g(null)}var N={x:0,y:0,dx:0,dy:0,moved:!1,down:!1,initialized:!1};function P(e,t){N.initialized?(N.dx=i.STROKE_SCALE*(e-N.x),N.dy=i.STROKE_SCALE*(t-N.y),N.moved=!0):N.initialized=!0,N.x=e,N.y=t}var F=e=>P(e.clientX,e.clientY),I=e=>{e.preventDefault();let t=e.touches[0];P(t.clientX,t.clientY)},L,R=()=>{clearTimeout(L),L=setTimeout(D,50)},z=Date.now(),B=0;function V(){let e=Date.now(),t=Math.min((e-z)/1e3,i.maxDt);z=e,i.paused||(A(t),N.moved&&=(k(N.x,N.y,N.dx,N.dy),!1),j(t)),M(),B=requestAnimationFrame(V)}window.fluidSim={C:i,gl:n,canvas:e,rebuildFramebuffers:E,resizeCanvasDimensions:D,applyCanvasStyle:C};function H(){document.body.classList.contains(`business-theme`)||(O(),window.addEventListener(`mousemove`,F),window.addEventListener(`touchmove`,I,{passive:!1}),window.addEventListener(`resize`,R),B=requestAnimationFrame(V),window.__lbRegisterCleanup?.(()=>{i.paused=!0,B&&cancelAnimationFrame(B),window.removeEventListener(`mousemove`,F),window.removeEventListener(`touchmove`,I),window.removeEventListener(`resize`,R),clearTimeout(L),e.remove(),t=!1}))}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,H,{once:!0}):H();