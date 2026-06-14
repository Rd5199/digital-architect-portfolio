const AUDIT_ENDPOINT = "/api/audit";
const WEB3FORMS_KEY = "b4e46767-36a0-4855-94f9-7b006ace25ed";
const STAGE_MS = 850;

const STAGES = [
  "Scanning your website",
  "Identifying your industry",
  "Mapping workflows & bottlenecks",
  "Matching off-the-shelf AI tools",
  "Estimating time & cost savings",
  "Compiling your report",
];

function el(id) {
  return document.getElementById(id);
}

function show(elm, on = true) {
  if (!elm) return;
  elm.hidden = !on;
}

function scanningDomain(url) {
  const raw = url.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  return raw.split("/")[0] || "your site";
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isPhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function isValidContact(value) {
  const v = value.trim();
  return v && (isEmail(v) || isPhone(v));
}

function sendLead(report, form) {
  const contact = form.contact.trim();
  const contactIsEmail = isEmail(contact);
  const fd = new FormData();
  fd.append("access_key", WEB3FORMS_KEY);
  fd.append("subject", `New AI Audit lead — ${report.businessName}`);
  fd.append("from_name", "AI Audit");
  if (contactIsEmail) {
    fd.append("email", contact);
  } else {
    fd.append("phone", contact);
    fd.append("email", "info@mydigitalarchitect.com");
  }
  fd.append("website", form.url.trim());
  fd.append("business", report.businessName);
  fd.append("industry", report.industry);
  fd.append(
    "message",
    `Contact (${contactIsEmail ? "email" : "phone"}): ${contact}\n\nSummary: ${report.summary}\n\nBottlenecks: ${report.bottlenecks
      .map((b) => b.title)
      .join(", ")}\n\nTools: ${report.recommendations.map((r) => r.tool).join(", ")}`,
  );
  fetch("https://api.web3forms.com/submit", { method: "POST", body: fd }).catch(() => {});
}

function renderReport(container, report) {
  const rx = report.recommendations
    .map(
      (r) =>
        `<article class="audit-rx"><span class="audit-rx-cat">${r.category}</span><h5>${r.tool}</h5><p>${r.whatItDoes}</p><span class="audit-rx-saved">${r.timeSaved}</span></article>`,
    )
    .join("");

  const bottlenecks = report.bottlenecks
    .map((b) => `<li><strong>${b.title}</strong><span>${b.description}</span></li>`)
    .join("");

  container.innerHTML = `
    <div class="audit-report">
      <header class="audit-report-head">
        <h4>${report.businessName}</h4>
        <span class="audit-chip">${report.industry}</span>
      </header>
      <p class="audit-summary">${report.summary}</p>
      <div class="audit-impact">
        <div class="audit-stat"><span class="audit-stat-value">${report.impact.hoursPerWeek}</span><span class="audit-stat-label">hrs saved / week</span></div>
        <div class="audit-stat"><span class="audit-stat-value">$${report.impact.costPerMonth.toLocaleString()}</span><span class="audit-stat-label">value / month</span></div>
      </div>
      <div class="audit-block">
        <h5>What's slowing you down</h5>
        <ul class="audit-bottlenecks">${bottlenecks}</ul>
      </div>
      <div class="audit-block">
        <h5>The AI tools we'd prescribe</h5>
        <div class="audit-rx-grid">${rx}</div>
      </div>
      <p class="audit-quickwin"><span>Start here</span> ${report.quickWin}</p>
      <div class="audit-report-actions">
        <a class="business-form__submit" href="/#contact" target="_parent">Apply to work with us</a>
        <button type="button" class="business-form__ghost" id="audit-reset">Audit another site</button>
      </div>
    </div>
  `;

  el("audit-reset")?.addEventListener("click", () => {
    show(el("audit-report"), false);
    show(el("audit-form"), true);
    el("audit-error").textContent = "";
  });
}

async function runAudit(formData) {
  const formEl = el("audit-form");
  const scanningEl = el("audit-scanning");
  const reportEl = el("audit-report");
  const errorEl = el("audit-error");
  const progressEl = el("audit-progress");
  const stageEl = el("audit-stage-label");
  const domainEl = el("audit-domain");

  errorEl.textContent = "";
  show(errorEl, false);
  show(formEl, false);
  show(reportEl, false);
  show(scanningEl, true);

  domainEl.textContent = scanningDomain(formData.url);

  const apiPromise = fetch(AUDIT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: formData.url.trim(),
      businessName: formData.businessName.trim() || undefined,
    }),
  }).then(async (res) => {
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "We couldn't complete your audit. Please try again.");
    }
    return res.json();
  });

  for (let i = 0; i < STAGES.length - 1; i++) {
    stageEl.textContent = STAGES[i];
    progressEl.textContent = `${Math.round(((i + 1) / STAGES.length) * 88)}%`;
    await new Promise((r) => setTimeout(r, STAGE_MS));
  }
  stageEl.textContent = STAGES[STAGES.length - 1];

  try {
    const report = await apiPromise;
    progressEl.textContent = "100%";
    await new Promise((r) => setTimeout(r, 450));
    sendLead(report, formData);
    show(scanningEl, false);
    show(reportEl, true);
    renderReport(reportEl, report);
  } catch (err) {
    show(scanningEl, false);
    show(formEl, true);
    errorEl.textContent =
      err.message || "Something went wrong. Please try again.";
    show(errorEl, true);
  }
}

function initBusinessAuditForm() {
  const root = el("business-audit-root");
  if (!root) return;

  const form = el("audit-form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = el("audit-url").value;
    const contact = el("audit-contact").value;
    if (!url.trim()) {
      const err = el("audit-error");
      err.textContent = "Please enter your website address.";
      show(err, true);
      return;
    }
    if (!isValidContact(contact)) {
      const err = el("audit-error");
      err.textContent = "Please enter a valid email address or phone number.";
      show(err, true);
      return;
    }
    runAudit({
      url,
      businessName: el("audit-name").value,
      contact,
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBusinessAuditForm);
} else {
  initBusinessAuditForm();
}
