import{n as e}from"./nav-X2u_QlN1.js";import{i as t}from"./lenis-scroll-CDQ6_tbv.js";t.registerPlugin(e);var n=[{name:`Radio Radio`,image:`/work/work1.jpg`,accentColor:`#ffd601`,ringColor:`#0f0f0f`,url:`/sample-project`},{name:`Unravel Van Gogh`,image:`/work/work2.jpg`,accentColor:`#0f0f0f`,ringColor:`#ffd601`,url:`/sample-project`},{name:`N=5`,image:`/work/work3.jpg`,accentColor:`#ffd601`,ringColor:`#0f0f0f`,url:`/sample-project`},{name:`Forma Studio`,image:`/work/work4.jpg`,accentColor:`#0f0f0f`,ringColor:`#ffd601`,url:`/sample-project`},{name:`Solenne Fields`,image:`/work/work5.jpg`,accentColor:`#ffd601`,ringColor:`#0f0f0f`,url:`/sample-project`},{name:`Forma Studio`,image:`/work/work6.jpg`,accentColor:`#0f0f0f`,ringColor:`#ffd601`,url:`/sample-project`}],r=1e3,i=1e3,a=r/2,o=`M0,${i} Q${a},${i} ${r},${i} L${r},${i} L0,${i} Z`,s=`M0,${i*.52} Q${a},${i*.26} ${r},${i*.52} L${r},${i} L0,${i} Z`,c=`M0,0 Q${a},0 ${r},0 L${r},${i} L0,${i} Z`;function l(e){t.set(e,{xPercent:-50,yPercent:-50})}function u(e){t.set(e,{xPercent:-50,yPercent:150})}function d(e){t.set(e,{xPercent:-50,yPercent:150})}function f(e,t,n){let a=document.createElement(`div`);a.className=`work-slide`+(n?` is-current`:``),a.dataset.index=t,a.innerHTML=`
    <svg
      class="work-slide-svg"
      viewBox="0 0 ${r} ${i}"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path class="work-slide-path" fill="${e.accentColor}" d="${n?c:o}" />
    </svg>
    <div class="work-slide-card-wrap">
      <div class="work-slide-card">
        <div class="work-slide-img" style="background-image: url('${e.image}')"></div>
        <div class="work-slide-scrim"></div>
        <a class="work-slide-link" href="${e.url}"></a>
      </div>
    </div>
    <div class="work-slide-title-wrap">
      <h1 class="work-slide-title">${e.name}</h1>
    </div>
  `;let s=a.querySelector(`.work-slide-card-wrap`),f=a.querySelector(`.work-slide-title-wrap`);return n?(l(s),l(f)):(u(s),d(f)),a}var p=document.querySelector(`.work-carousel`);p.innerHTML=`
  <div class="work-slides" id="workSlides"></div>
  <aside class="work-sidebar">
    <div class="work-sidebar-inner" id="workSidebar"></div>
  </aside>
  <span class="work-slider-meta">The Archive</span>
  <div class="work-counter">
    <span class="work-counter-current" id="workCounterCurrent">01</span>
  </div>
`;var m=document.getElementById(`workSlides`),h=document.getElementById(`workSidebar`),g=document.getElementById(`workCounterCurrent`);p.style.setProperty(`--thumb-ring`,n[0].ringColor);var _=f(n[0],0,!0);m.appendChild(_);var v=e.create(_.querySelector(`.work-slide-title`),{type:`words`,mask:`words`,wordsClass:`word`});t.set(v.words,{yPercent:0}),n.forEach((e,t)=>{let n=document.createElement(`div`);n.className=`work-thumb`+(t===0?` is-active`:``),n.dataset.index=t,n.innerHTML=`<img src="${e.image}" alt="${e.name}" />`,n.addEventListener(`click`,()=>{b||t===y||x(t)}),h.appendChild(n)});var y=0,b=!1;function x(r){if(b)return;b=!0;let i=m.querySelector(`.work-slide[data-index="${y}"]`),a=[...h.querySelectorAll(`.work-thumb`)],o=a.find(e=>+e.dataset.index===y),l=a.find(e=>+e.dataset.index===r),u=i.querySelector(`.work-slide-card-wrap`),d=i.querySelector(`.work-slide-title-wrap`),_=f(n[r],r,!1);t.set(_,{zIndex:2}),t.set(i,{zIndex:1}),m.appendChild(_),_.classList.add(`is-current`);let v=_.querySelector(`.work-slide-path`),x=_.querySelector(`.work-slide-card-wrap`),S=_.querySelector(`.work-slide-title`),C=_.querySelector(`.work-slide-title-wrap`),w=e.create(S,{type:`words`,mask:`words`,wordsClass:`word`});t.set(w.words,{yPercent:-100}),g.textContent=String(r+1).padStart(2,`0`),y=r;let T=t.timeline({onComplete:()=>{i.remove(),b=!1}});T.to(u,{xPercent:-50,yPercent:-100,duration:1,ease:`power4.inOut`},0),T.to(d,{xPercent:-50,yPercent:25,duration:.75,ease:`power3.in`},0),T.to(v,{duration:.5,attr:{d:s},ease:`power4.in`},0),T.to(v,{duration:.5,attr:{d:c},ease:`power4.out`},.5),T.to(x,{xPercent:-50,yPercent:-50,duration:.75,ease:`power3.out`},.5),T.to(C,{xPercent:-50,yPercent:-50,duration:.75,ease:`power3.out`},.5),T.to(w.words,{yPercent:0,duration:.75,ease:`power3.out`,stagger:.1},.75),T.add(()=>{o?.classList.remove(`is-active`),l?.classList.add(`is-active`),p.style.setProperty(`--thumb-ring`,n[r].ringColor)},.5)}var S=!1;window.addEventListener(`wheel`,e=>{b||S||(S=!0,setTimeout(()=>S=!1,1100),x(e.deltaY>0?y<n.length-1?y+1:0:y>0?y-1:n.length-1))},{passive:!0});var C=0;window.addEventListener(`touchstart`,e=>{C=e.touches[0].clientY},{passive:!0}),window.addEventListener(`touchend`,e=>{if(b)return;let t=C-e.changedTouches[0].clientY;Math.abs(t)<40||x(t>0?y<n.length-1?y+1:0:y>0?y-1:n.length-1)},{passive:!0});