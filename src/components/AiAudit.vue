<template>
  <section id="ai-audit" ref="rootEl" class="dev-section dev-section-alt dev-audit">
    <div class="dev-container">
      <div class="dev-audit-badge">
        <span class="dev-audit-badge-dot"></span>
        {{ content.badge }}
      </div>
      <h2 class="dev-section-title">{{ content.title }}</h2>
      <p class="dev-section-subtitle">{{ content.subtitle }}</p>

      <div class="dev-audit-stage">
        <!-- ───────────────── Input ───────────────── -->
        <transition name="audit-fade" mode="out-in">
          <!-- PHASE: idle / form -->
          <div v-if="phase === 'idle'" key="form" class="dev-audit-card dev-audit-form">
            <div v-if="errorMessage" class="dev-audit-error">
              <span>{{ errorMessage }}</span>
            </div>

            <form @submit.prevent="startAudit">
              <div class="dev-form-group">
                <label for="audit-url">{{ content.form.urlLabel }}</label>
                <div class="dev-audit-url-field">
                  <input
                    id="audit-url"
                    v-model="form.url"
                    type="text"
                    inputmode="url"
                    class="dev-form-control"
                    :placeholder="content.form.urlPlaceholder"
                    autocomplete="url"
                    required
                  />
                </div>
              </div>

              <div class="dev-audit-form-row">
                <div class="dev-form-group">
                  <label for="audit-name">
                    {{ content.form.nameLabel }} <span class="dev-audit-opt">{{ content.form.nameOptional }}</span>
                  </label>
                  <input
                    id="audit-name"
                    v-model="form.businessName"
                    type="text"
                    class="dev-form-control"
                    :placeholder="content.form.namePlaceholder"
                    autocomplete="organization"
                  />
                </div>
                <div class="dev-form-group">
                  <label for="audit-email">
                    {{ content.form.emailLabel }} <span class="dev-audit-opt">{{ content.form.emailHint }}</span>
                  </label>
                  <input
                    id="audit-email"
                    v-model="form.email"
                    type="email"
                    class="dev-form-control"
                    :placeholder="content.form.emailPlaceholder"
                    autocomplete="email"
                    required
                  />
                </div>
              </div>

              <button type="submit" class="dev-btn dev-btn-primary dev-audit-submit">
                {{ content.form.submit }}
              </button>
              <p class="dev-audit-fineprint">{{ content.form.fineprint }}</p>
            </form>
          </div>

          <!-- PHASE: scanning -->
          <div v-else-if="phase === 'scanning'" key="scanning" class="dev-audit-card dev-audit-scanning">
            <div class="dev-audit-scanner">
              <svg class="dev-audit-ring" viewBox="0 0 120 120">
                <circle class="dev-audit-ring-track" cx="60" cy="60" r="54" />
                <circle
                  class="dev-audit-ring-progress"
                  cx="60"
                  cy="60"
                  r="54"
                  :stroke-dasharray="ringCircumference"
                  :stroke-dashoffset="ringOffset"
                />
              </svg>
              <div class="dev-audit-ring-center">
                <span class="dev-audit-percent">{{ progress }}%</span>
                <span class="dev-audit-scanning-domain">{{ scanningDomain }}</span>
              </div>
              <span class="dev-audit-pulse"></span>
              <span class="dev-audit-pulse dev-audit-pulse-2"></span>
            </div>

            <ul class="dev-audit-stages">
              <li
                v-for="(stage, i) in content.stages"
                :key="stage.label"
                class="dev-audit-stage-item"
                :class="{
                  'is-active': i === stageIndex,
                  'is-done': i < stageIndex
                }"
              >
                <span class="dev-audit-stage-marker">{{ i < stageIndex ? 'Done' : i + 1 }}</span>
                <span class="dev-audit-stage-label">{{ stage.label }}</span>
              </li>
            </ul>
          </div>

          <!-- PHASE: report -->
          <div v-else key="report" class="dev-audit-report">
            <header class="dev-audit-report-head">
              <div>
                <h3 class="dev-audit-report-title">{{ report?.businessName }}</h3>
                <span class="dev-audit-chip">{{ report?.industry }}</span>
              </div>
            </header>

            <p class="dev-audit-report-summary">{{ report?.summary }}</p>
            <p v-if="report?.inferred" class="dev-audit-inferred">
              {{ content.report.inferredNote }}
            </p>

            <!-- Impact stats -->
            <div class="dev-audit-impact" data-audit-reveal>
              <div class="dev-audit-stat">
                <span class="dev-audit-stat-value">{{ displayHours }}<span class="dev-audit-stat-unit">{{ content.report.statHoursUnit }}</span></span>
                <span class="dev-audit-stat-label">{{ content.report.statHoursLabel }}</span>
              </div>
              <div class="dev-audit-stat">
                <span class="dev-audit-stat-value"><span class="dev-audit-stat-unit">{{ content.report.statCostUnit }}</span>{{ displayCost.toLocaleString() }}</span>
                <span class="dev-audit-stat-label">{{ content.report.statCostLabel }}</span>
              </div>
              <div class="dev-audit-stat dev-audit-stat-headline">
                <span>{{ report?.impact.headline }}</span>
              </div>
            </div>

            <!-- Bottlenecks -->
            <div class="dev-audit-block" data-audit-reveal>
              <h4 class="dev-audit-block-title">{{ content.report.bottlenecksTitle }}</h4>
              <ul class="dev-audit-bottlenecks">
                <li v-for="b in report?.bottlenecks" :key="b.title">
                  <strong>{{ b.title }}</strong>
                  <span>{{ b.description }}</span>
                </li>
              </ul>
            </div>

            <!-- Prescriptions -->
            <div class="dev-audit-block" data-audit-reveal>
              <h4 class="dev-audit-block-title">{{ content.report.prescriptionsTitle }}</h4>
              <div class="dev-audit-rx-grid">
                <div v-for="(r, i) in report?.recommendations" :key="i" class="dev-audit-rx" data-audit-reveal>
                  <span class="dev-audit-rx-cat">{{ r.category }}</span>
                  <h5 class="dev-audit-rx-tool">{{ r.tool }}</h5>
                  <p class="dev-audit-rx-fixes"><span>{{ content.report.rxFixesLabel }}</span> {{ r.bottleneck }}</p>
                  <p class="dev-audit-rx-does">{{ r.whatItDoes }}</p>
                  <span class="dev-audit-rx-saved">{{ r.timeSaved }}</span>
                </div>
              </div>
            </div>

            <!-- Quick win -->
            <div class="dev-audit-quickwin" data-audit-reveal>
              <span class="dev-audit-quickwin-tag">{{ content.report.quickWinTag }}</span>
              <p>{{ report?.quickWin }}</p>
            </div>

            <!-- CTA -->
            <div class="dev-audit-cta" data-audit-reveal>
              <h4>{{ content.report.ctaTitle }}</h4>
              <p>
                {{ content.report.ctaBodyBefore }}<strong>{{ content.report.ctaBodyStrong }}</strong>{{ content.report.ctaBodyAfter }}
              </p>
              <div class="dev-audit-cta-actions">
                <button class="dev-btn dev-btn-primary" @click="bookCall">
                  {{ content.report.ctaBook }}
                </button>
                <button class="dev-btn dev-btn-outline" @click="resetAudit">
                  {{ content.report.ctaReset }}
                </button>
              </div>
              <p v-if="leadSent" class="dev-audit-emailed">
                {{ content.report.emailedPrefix }}{{ form.email }}.
              </p>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onBeforeUnmount, nextTick } from 'vue';
import gsap from 'gsap';
import { scrollToTarget } from '../utils/smoothExperience';
import { auditConfig, auditContent } from '../config/audit';

interface Recommendation {
  bottleneck: string;
  tool: string;
  category: string;
  whatItDoes: string;
  timeSaved: string;
}
interface AuditReport {
  businessName: string;
  industry: string;
  summary: string;
  bottlenecks: { title: string; description: string }[];
  recommendations: Recommendation[];
  impact: { hoursPerWeek: number; costPerMonth: number; headline: string };
  quickWin: string;
  inferred: boolean;
}

export default defineComponent({
  name: 'AiAudit',
  setup() {
    const content = auditContent;
    const rootEl = ref<HTMLElement | null>(null);
    const phase = ref<'idle' | 'scanning' | 'report'>('idle');
    const errorMessage = ref('');
    const report = ref<AuditReport | null>(null);
    const leadSent = ref(false);

    const form = reactive({ url: '', businessName: '', email: '' });

    const stageCount = content.stages.length;
    const stageIndex = ref(0);

    // Progress ring
    const progress = ref(0);
    const progressObj = { v: 0 };
    const ringCircumference = 2 * Math.PI * 54;
    const ringOffset = computed(() => ringCircumference * (1 - progress.value / 100));

    const displayHours = ref(0);
    const displayCost = ref(0);
    const hoursObj = { v: 0 };
    const costObj = { v: 0 };

    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        const id = window.setTimeout(res, ms);
        timers.push(id);
      });

    const scanningDomain = computed(() => {
      const raw = form.url.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '');
      return raw.split('/')[0] || 'your site';
    });

    function animateProgressTo(target: number, durationMs: number) {
      gsap.to(progressObj, {
        v: target,
        duration: durationMs / 1000,
        ease: 'power2.out',
        onUpdate: () => {
          progress.value = Math.round(progressObj.v);
        }
      });
    }

    async function callApi(): Promise<AuditReport> {
      const res = await fetch(auditConfig.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: form.url.trim(),
          businessName: form.businessName.trim() || undefined
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || content.errors.generic);
      }
      return (await res.json()) as AuditReport;
    }

    function sendLead(r: AuditReport) {
      // Fire-and-forget lead capture so every audit becomes a contact.
      if (!auditConfig.web3formsKey) return;
      const fd = new FormData();
      fd.append('access_key', auditConfig.web3formsKey);
      fd.append('subject', `${content.leadSubjectPrefix}${r.businessName}`);
      fd.append('from_name', 'AI Audit');
      fd.append('email', form.email.trim());
      fd.append('website', form.url.trim());
      fd.append('business', r.businessName);
      fd.append('industry', r.industry);
      fd.append(
        'message',
        `Summary: ${r.summary}\n\nTop bottlenecks: ${r.bottlenecks
          .map((b) => b.title)
          .join(', ')}\n\nPrescribed: ${r.recommendations
          .map((x) => x.tool)
          .join(', ')}\n\nEstimated impact: ${r.impact.hoursPerWeek} hrs/week, $${r.impact.costPerMonth}/month.`
      );
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
        .then(() => {
          leadSent.value = true;
        })
        .catch(() => {
          /* non-blocking */
        });
    }

    function revealReport() {
      nextTick(() => {
        const els = rootEl.value?.querySelectorAll('[data-audit-reveal]');
        if (els && els.length) {
          gsap.fromTo(
            els,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.09 }
          );
        }
        // Count up the headline numbers.
        const target = report.value?.impact;
        if (target) {
          hoursObj.v = 0;
          costObj.v = 0;
          gsap.to(hoursObj, {
            v: target.hoursPerWeek,
            duration: 1.1,
            ease: 'power1.out',
            onUpdate: () => {
              displayHours.value = Math.round(hoursObj.v);
            }
          });
          gsap.to(costObj, {
            v: target.costPerMonth,
            duration: 1.3,
            ease: 'power1.out',
            onUpdate: () => {
              displayCost.value = Math.round(costObj.v);
            }
          });
        }
      });
    }

    async function startAudit() {
      errorMessage.value = '';
      if (!form.url.trim()) {
        errorMessage.value = content.errors.noUrl;
        return;
      }
      phase.value = 'scanning';
      stageIndex.value = 0;
      progress.value = 0;
      progressObj.v = 0;
      displayHours.value = 0;
      displayCost.value = 0;
      leadSent.value = false;

      // Kick off the real audit immediately; wrap so it never rejects unhandled.
      const apiResult = callApi()
        .then((r) => ({ ok: true as const, r }))
        .catch((e: Error) => ({ ok: false as const, e }));

      // Walk the scanning stages while the model works.
      for (let i = 0; i < stageCount - 1; i++) {
        stageIndex.value = i;
        animateProgressTo(((i + 1) / stageCount) * 88, auditConfig.stageMs);
        await wait(auditConfig.stageMs);
      }
      stageIndex.value = stageCount - 1;

      const result = await apiResult;
      if (!result.ok) {
        errorMessage.value = result.e.message;
        phase.value = 'idle';
        progress.value = 0;
        return;
      }

      animateProgressTo(100, 400);
      await wait(450);
      report.value = result.r;
      phase.value = 'report';
      sendLead(result.r);
      revealReport();
    }

    function resetAudit() {
      report.value = null;
      phase.value = 'idle';
      progress.value = 0;
      errorMessage.value = '';
    }

    function bookCall() {
      if (auditConfig.bookingUrl) {
        window.open(auditConfig.bookingUrl, '_blank', 'noopener');
      } else {
        scrollToTarget('#contact');
      }
    }

    onBeforeUnmount(() => {
      timers.forEach((id) => clearTimeout(id));
      gsap.killTweensOf(progressObj);
      gsap.killTweensOf(hoursObj);
      gsap.killTweensOf(costObj);
    });

    return {
      content,
      rootEl,
      phase,
      errorMessage,
      report,
      leadSent,
      form,
      stageIndex,
      progress,
      ringCircumference,
      ringOffset,
      scanningDomain,
      displayHours,
      displayCost,
      startAudit,
      resetAudit,
      bookCall
    };
  }
});
</script>

<style scoped>
.dev-audit {
  position: relative;
  overflow: hidden;
}

.dev-audit-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto 1.25rem;
  padding: 0.4rem 1rem;
  border-radius: var(--border-radius-pill);
  background: rgba(0, 255, 204, 0.08);
  border: 1px solid rgba(0, 255, 204, 0.25);
  color: var(--secondary-color);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-align: center;
}
.dev-audit-badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--secondary-color);
  box-shadow: 0 0 0 0 rgba(0, 255, 204, 0.6);
  animation: audit-dot 1.8s ease-out infinite;
}
@keyframes audit-dot {
  0% { box-shadow: 0 0 0 0 rgba(0, 255, 204, 0.5); }
  100% { box-shadow: 0 0 0 10px rgba(0, 255, 204, 0); }
}

/* Center the badge + heading block */
.dev-audit .dev-section-title,
.dev-audit .dev-section-subtitle {
  text-align: center;
}
.dev-audit-badge {
  display: flex;
  width: max-content;
}

.dev-audit-stage {
  max-width: 880px;
  margin: 2.5rem auto 0;
}

.dev-audit-card {
  background: var(--bg-card);
  border: 1px solid rgba(110, 68, 255, 0.18);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  padding: 2.5rem;
}

/* ---------- Form ---------- */
.dev-audit-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.dev-audit-opt {
  color: var(--text-muted);
  font-weight: 400;
  font-size: 0.85em;
}
.dev-audit-url-field {
  position: relative;
}
.dev-audit-url-field .dev-form-control {
  font-size: 1.05rem;
}
.dev-audit-submit {
  width: 100%;
  margin-top: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-size: 1.05rem;
  padding: 0.95rem 2rem;
}
.dev-audit-fineprint {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 1rem 0 0;
}
.dev-audit-error {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
  padding: 0.85rem 1rem;
  border-radius: var(--border-radius);
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ff8a8a;
  font-size: 0.92rem;
}

/* ---------- Scanning ---------- */
.dev-audit-scanning {
  display: flex;
  align-items: center;
  gap: 3rem;
}
.dev-audit-scanner {
  position: relative;
  flex: 0 0 200px;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dev-audit-ring {
  width: 200px;
  height: 200px;
  transform: rotate(-90deg);
}
.dev-audit-ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 6;
}
.dev-audit-ring-progress {
  fill: none;
  stroke: var(--primary-color);
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.2s linear;
  filter: drop-shadow(0 0 6px rgba(110, 68, 255, 0.7));
}
.dev-audit-ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dev-audit-percent {
  font-family: 'Poppins', sans-serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-white);
  line-height: 1;
}
.dev-audit-scanning-domain {
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dev-audit-pulse {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 1px solid rgba(110, 68, 255, 0.4);
  animation: audit-pulse 2.4s ease-out infinite;
}
.dev-audit-pulse-2 {
  animation-delay: 1.2s;
}
@keyframes audit-pulse {
  0% { transform: scale(0.7); opacity: 0.8; }
  100% { transform: scale(1.3); opacity: 0; }
}

.dev-audit-stages {
  flex: 1;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.dev-audit-stage-item {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.6rem 0.4rem;
  color: var(--text-muted);
  opacity: 0.55;
  transform: translateX(-4px);
  transition: all 0.4s var(--ease-out-expo);
}
.dev-audit-stage-item.is-active {
  opacity: 1;
  transform: translateX(0);
  color: var(--text-white);
}
.dev-audit-stage-item.is-done {
  opacity: 0.9;
  color: var(--secondary-color);
}
.dev-audit-stage-marker {
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.dev-audit-stage-item.is-active .dev-audit-stage-marker {
  background: rgba(110, 68, 255, 0.18);
  border-color: var(--primary-color);
  color: var(--primary-light);
  box-shadow: 0 0 14px rgba(110, 68, 255, 0.4);
}
.dev-audit-stage-item.is-done .dev-audit-stage-marker {
  background: rgba(0, 255, 204, 0.15);
  border-color: var(--secondary-color);
  color: var(--secondary-color);
  font-size: 0.58rem;
}
.dev-audit-stage-label {
  font-size: 0.98rem;
  font-weight: 500;
}

/* ---------- Report ---------- */
.dev-audit-report {
  background: var(--bg-card);
  border: 1px solid rgba(110, 68, 255, 0.18);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  padding: 2.5rem;
}
.dev-audit-report-head {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.dev-audit-report-title {
  margin: 0 0 0.35rem;
  font-size: 1.6rem;
}
.dev-audit-chip {
  display: inline-block;
  padding: 0.25rem 0.8rem;
  border-radius: var(--border-radius-pill);
  background: rgba(110, 68, 255, 0.15);
  border: 1px solid rgba(110, 68, 255, 0.3);
  color: var(--primary-light);
  font-size: 0.82rem;
  font-weight: 600;
}
.dev-audit-report-summary {
  color: var(--text-light);
  font-size: 1.05rem;
  line-height: 1.65;
  margin: 0 0 1rem;
}
.dev-audit-inferred {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  font-size: 0.88rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.03);
  padding: 0.7rem 0.9rem;
  border-radius: var(--border-radius);
  margin: 0 0 1.5rem;
}

.dev-audit-impact {
  display: grid;
  grid-template-columns: repeat(2, auto) 1fr;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: var(--border-radius-lg);
  background: linear-gradient(135deg, rgba(110, 68, 255, 0.12), rgba(0, 255, 204, 0.08));
  border: 1px solid rgba(110, 68, 255, 0.25);
}
.dev-audit-stat {
  display: flex;
  flex-direction: column;
}
.dev-audit-stat-value {
  font-family: 'Poppins', sans-serif;
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1;
  color: var(--text-white);
}
.dev-audit-stat-unit {
  font-size: 1.1rem;
  color: var(--primary-light);
  margin: 0 0.15rem;
}
.dev-audit-stat-label {
  margin-top: 0.35rem;
  font-size: 0.82rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.dev-audit-stat-headline {
  flex-direction: row;
  align-items: center;
  gap: 0.7rem;
  color: var(--text-light);
  font-size: 1rem;
  line-height: 1.5;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  padding-left: 1.5rem;
}

.dev-audit-block {
  margin-bottom: 2rem;
}
.dev-audit-block-title {
  font-size: 1.15rem;
  margin: 0 0 1rem;
}
.dev-audit-bottlenecks {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.dev-audit-bottlenecks li {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.9rem 1rem;
  border-radius: var(--border-radius);
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid var(--accent-color);
}
.dev-audit-bottlenecks strong {
  color: var(--text-white);
}
.dev-audit-bottlenecks span {
  color: var(--text-muted);
  font-size: 0.92rem;
}

.dev-audit-rx-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.dev-audit-rx {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  border-radius: var(--border-radius-lg);
  background: rgba(10, 10, 18, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.3s var(--ease-out-expo), border-color 0.3s ease;
}
.dev-audit-rx:hover {
  transform: translateY(-4px);
  border-color: rgba(110, 68, 255, 0.45);
}
.dev-audit-rx-cat {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--secondary-color);
  font-weight: 700;
}
.dev-audit-rx-tool {
  margin: 0.4rem 0 0.6rem;
  font-size: 1.15rem;
  color: var(--text-white);
}
.dev-audit-rx-fixes {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin: 0 0 0.6rem;
}
.dev-audit-rx-fixes span {
  color: var(--accent-color);
  font-weight: 600;
}
.dev-audit-rx-does {
  font-size: 0.92rem;
  color: var(--text-light);
  line-height: 1.55;
  margin: 0 0 1rem;
  flex: 1;
}
.dev-audit-rx-saved {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  align-self: flex-start;
  padding: 0.35rem 0.75rem;
  border-radius: var(--border-radius-pill);
  background: rgba(0, 255, 204, 0.1);
  color: var(--secondary-color);
  font-size: 0.82rem;
  font-weight: 600;
}

.dev-audit-quickwin {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  margin-bottom: 2rem;
  border-radius: var(--border-radius-lg);
  background: rgba(255, 68, 124, 0.08);
  border: 1px solid rgba(255, 68, 124, 0.3);
}
.dev-audit-quickwin-tag {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.8rem;
  border-radius: var(--border-radius-pill);
  background: var(--accent-color);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}
.dev-audit-quickwin p {
  margin: 0;
  color: var(--text-light);
  line-height: 1.55;
}

.dev-audit-cta {
  text-align: center;
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  background: linear-gradient(135deg, rgba(110, 68, 255, 0.15), rgba(85, 52, 204, 0.1));
  border: 1px solid rgba(110, 68, 255, 0.3);
}
.dev-audit-cta h4 {
  font-size: 1.4rem;
  margin: 0 0 0.6rem;
}
.dev-audit-cta p {
  color: var(--text-light);
  max-width: 540px;
  margin: 0 auto 1.5rem;
  line-height: 1.65;
}
.dev-audit-cta-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.dev-audit-cta-actions .dev-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.dev-audit-emailed {
  margin: 1.25rem 0 0;
  color: var(--secondary-color);
  font-size: 0.9rem;
}

/* ---------- Transitions ---------- */
.audit-fade-enter-active,
.audit-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s var(--ease-out-expo);
}
.audit-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.audit-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* ---------- Responsive ---------- */
@media (max-width: 768px) {
  .dev-audit-card,
  .dev-audit-report {
    padding: 1.5rem;
  }
  .dev-audit-form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .dev-audit-scanning {
    flex-direction: column;
    gap: 2rem;
  }
  .dev-audit-impact {
    grid-template-columns: 1fr 1fr;
  }
  .dev-audit-stat-headline {
    grid-column: 1 / -1;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-left: 0;
    padding-top: 1rem;
  }
  .dev-audit-rx-grid {
    grid-template-columns: 1fr;
  }
  .dev-audit-quickwin {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
