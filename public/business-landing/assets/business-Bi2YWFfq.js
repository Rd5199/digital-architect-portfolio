import"./nav-CJL3crHT.js";import"./preloader-Naoqprfw.js";import"./clients-DAwdXEVP.js";/* empty css               */import"./footer-DHGMSLtS.js";import"./lenis-scroll-CDQ6_tbv.js";var e=`/api/audit`,t=`b4e46767-36a0-4855-94f9-7b006ace25ed`,n=850,r=[`Scanning your website`,`Identifying your industry`,`Mapping workflows & bottlenecks`,`Matching off-the-shelf AI tools`,`Estimating time & cost savings`,`Compiling your report`];function i(e){return document.getElementById(e)}function a(e,t=!0){e&&(e.hidden=!t)}function o(e){return e.trim().replace(/^https?:\/\//i,``).replace(/^www\./i,``).split(`/`)[0]||`your site`}function s(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())}function c(e){let t=e.replace(/\D/g,``);return t.length>=10&&t.length<=15}function l(e){let t=e.trim();return t&&(s(t)||c(t))}function u(e,n){let r=n.contact.trim(),i=s(r),a=new FormData;a.append(`access_key`,t),a.append(`subject`,`New AI Audit lead — ${e.businessName}`),a.append(`from_name`,`AI Audit`),i?a.append(`email`,r):(a.append(`phone`,r),a.append(`email`,`info@mydigitalarchitect.com`)),a.append(`website`,n.url.trim()),a.append(`business`,e.businessName),a.append(`industry`,e.industry),a.append(`message`,`Contact (${i?`email`:`phone`}): ${r}\n\nSummary: ${e.summary}\n\nBottlenecks: ${e.bottlenecks.map(e=>e.title).join(`, `)}\n\nTools: ${e.recommendations.map(e=>e.tool).join(`, `)}`),fetch(`https://api.web3forms.com/submit`,{method:`POST`,body:a}).catch(()=>{})}function d(e,t){let n=t.recommendations.map(e=>`<article class="audit-rx"><span class="audit-rx-cat">${e.category}</span><h5>${e.tool}</h5><p>${e.whatItDoes}</p><span class="audit-rx-saved">${e.timeSaved}</span></article>`).join(``),r=t.bottlenecks.map(e=>`<li><strong>${e.title}</strong><span>${e.description}</span></li>`).join(``);e.innerHTML=`
    <div class="audit-report">
      <header class="audit-report-head">
        <h4>${t.businessName}</h4>
        <span class="audit-chip">${t.industry}</span>
      </header>
      <p class="audit-summary">${t.summary}</p>
      <div class="audit-impact">
        <div class="audit-stat"><span class="audit-stat-value">${t.impact.hoursPerWeek}</span><span class="audit-stat-label">hrs saved / week</span></div>
        <div class="audit-stat"><span class="audit-stat-value">$${t.impact.costPerMonth.toLocaleString()}</span><span class="audit-stat-label">value / month</span></div>
      </div>
      <div class="audit-block">
        <h5>What's slowing you down</h5>
        <ul class="audit-bottlenecks">${r}</ul>
      </div>
      <div class="audit-block">
        <h5>The AI tools we'd prescribe</h5>
        <div class="audit-rx-grid">${n}</div>
      </div>
      <p class="audit-quickwin"><span>Start here</span> ${t.quickWin}</p>
      <div class="audit-report-actions">
        <a class="business-form__submit" href="/#contact" target="_parent">Apply to work with us</a>
        <button type="button" class="business-form__ghost" id="audit-reset">Audit another site</button>
      </div>
    </div>
  `,i(`audit-reset`)?.addEventListener(`click`,()=>{a(i(`audit-report`),!1),a(i(`audit-form`),!0),i(`audit-error`).textContent=``})}async function f(t){let s=i(`audit-form`),c=i(`audit-scanning`),l=i(`audit-report`),f=i(`audit-error`),p=i(`audit-progress`),m=i(`audit-stage-label`),h=i(`audit-domain`);f.textContent=``,a(f,!1),a(s,!1),a(l,!1),a(c,!0),h.textContent=o(t.url);let g=fetch(e,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({url:t.url.trim(),businessName:t.businessName.trim()||void 0})}).then(async e=>{if(!e.ok){let t=await e.json().catch(()=>({}));throw Error(t.error||`We couldn't complete your audit. Please try again.`)}return e.json()});for(let e=0;e<r.length-1;e++)m.textContent=r[e],p.textContent=`${Math.round((e+1)/r.length*88)}%`,await new Promise(e=>setTimeout(e,n));m.textContent=r[r.length-1];try{let e=await g;p.textContent=`100%`,await new Promise(e=>setTimeout(e,450)),u(e,t),a(c,!1),a(l,!0),d(l,e)}catch(e){a(c,!1),a(s,!0),f.textContent=e.message||`Something went wrong. Please try again.`,a(f,!0)}}function p(){i(`business-audit-root`)&&i(`audit-form`)?.addEventListener(`submit`,e=>{e.preventDefault();let t=i(`audit-url`).value,n=i(`audit-contact`).value;if(!t.trim()){let e=i(`audit-error`);e.textContent=`Please enter your website address.`,a(e,!0);return}if(!l(n)){let e=i(`audit-error`);e.textContent=`Please enter a valid email address or phone number.`,a(e,!0);return}f({url:t,businessName:i(`audit-name`).value,contact:n})})}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,p):p();