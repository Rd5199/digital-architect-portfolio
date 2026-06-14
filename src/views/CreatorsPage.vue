<template>
  <div class="creators-page">
    <!-- Hero -->
    <section class="creator-hero">
      <div class="creator-container">
        <p class="creator-kicker">Creator app development</p>
        <h1 class="creator-headline">
          Stop renting your audience on social.
          <span ref="typedRef" class="creator-headline-accent" />
        </h1>
        <p class="creator-lead">
          We design and ship branded apps for creators and influencers — membership tiers,
          fan communities, courses, and digital products under your name. You bring the audience
          and content; we handle design, build, App Store launch, and payments.
        </p>

        <ul class="creator-hero-notes">
          <li>Revenue split or pay upfront — you choose</li>
          <li>8–14 weeks from kickoff to launch</li>
          <li>Your brand on the App Store listing</li>
        </ul>

        <div class="creator-hero-actions">
          <a href="#apply" class="creator-btn creator-btn-primary">Apply for a build</a>
          <a href="#how" class="creator-btn creator-btn-ghost">How it works</a>
        </div>
      </div>
    </section>

    <!-- What we build -->
    <section id="ideas" class="creator-section">
      <div class="creator-container">
        <p class="creator-section-kicker">What we build</p>
        <h2 class="creator-section-title">Membership apps, communities, and stores fans return to.</h2>

        <div class="creator-ideas-grid">
          <article v-for="idea in appIdeas" :key="idea.title" class="creator-idea-card">
            <h3>{{ idea.title }}</h3>
            <p>{{ idea.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="how" class="creator-section creator-section--muted">
      <div class="creator-container">
        <p class="creator-section-kicker">How it works</p>
        <h2 class="creator-section-title">Three steps from idea to App Store.</h2>

        <ol class="creator-steps">
          <li v-for="(step, index) in steps" :key="step.title" class="creator-step">
            <span class="creator-step-num">{{ String(index + 1).padStart(2, '0') }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Pricing models -->
    <section id="pricing" class="creator-section">
      <div class="creator-container">
        <p class="creator-section-kicker">Ways to work together</p>
        <h2 class="creator-section-title">Pick what fits your stage.</h2>

        <div class="creator-pricing-grid">
          <article class="creator-pricing-card">
            <h3>Revenue split</h3>
            <p class="creator-pricing-tagline">Lower risk. Shared upside.</p>
            <p>
              We invest in the build alongside you. You share a percentage of app revenue —
              ideal if you want to launch without a large upfront cost.
            </p>
            <ul>
              <li>Minimal upfront investment</li>
              <li>Aligned incentives on growth</li>
              <li>Best for established audiences</li>
            </ul>
          </article>

          <article class="creator-pricing-card creator-pricing-card--featured">
            <h3>Pay upfront</h3>
            <p class="creator-pricing-tagline">Full ownership. Fixed fee.</p>
            <p>
              You own the app outright from day one. One project fee, full control —
              ideal if you want a clean cap on spend and maximum ownership.
            </p>
            <ul>
              <li>100% ownership from launch</li>
              <li>Predictable project cost</li>
              <li>Best when budget is ready</li>
            </ul>
          </article>
        </div>

        <p class="creator-pricing-note">
          Not sure which fits? Choose your preference in the application — we'll recommend the best path after we learn about your audience.
        </p>
      </div>
    </section>

    <!-- Why apps -->
    <section class="creator-section creator-section--muted">
      <div class="creator-container creator-split">
        <div>
          <p class="creator-section-kicker">Why an app</p>
          <h2 class="creator-section-title">When reach drops, your app still pays.</h2>
          <p class="creator-body">
            Social platforms control discovery, fees, and reach. A branded app gives you
            push notifications, subscriptions, and a home screen presence — a direct line
            to the people who already follow you.
          </p>
        </div>
        <ul class="creator-benefits">
          <li v-for="benefit in benefits" :key="benefit">{{ benefit }}</li>
        </ul>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="creator-section">
      <div class="creator-container creator-faq-wrap">
        <p class="creator-section-kicker">FAQ</p>
        <h2 class="creator-section-title">Common questions.</h2>

        <div class="creator-faq-list">
          <details
            v-for="(item, index) in faqItems"
            :key="item.question"
            class="creator-faq-item"
            :open="index === 0"
          >
            <summary>{{ item.question }}</summary>
            <p>{{ item.answer }}</p>
          </details>
        </div>
      </div>
    </section>

    <!-- Apply -->
    <section id="apply" class="creator-section creator-section--apply">
      <div class="creator-container">
        <p class="creator-section-kicker">Apply</p>
        <h2 class="creator-section-title">{{ applyCopy.title }}</h2>
        <p class="creator-apply-lead">
          {{ applyCopy.lead }}
        </p>

        <CreatorContactForm :show-intro="false" />
      </div>
    </section>

    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import Typed from 'typed.js';
import CreatorContactForm from '../components/CreatorContactForm.vue';
import Footer from '../components/Footer.vue';
import {
  appIdeas,
  creatorsApply,
  creatorsBenefits,
  creatorsFaqItems,
  creatorsSteps,
} from '../data/creatorsContent';

export default defineComponent({
  name: 'CreatorsPage',
  components: {
    CreatorContactForm,
    Footer
  },
  setup() {
    const typedRef = ref<HTMLElement | null>(null);
    let typed: Typed | null = null;

    const applyCopy = creatorsApply;

    onMounted(() => {
      if (typedRef.value) {
        typed = new Typed(typedRef.value, {
          strings: [
            'LAUNCH YOUR MEMBERSHIP APP.',
            'PUT YOUR BRAND ON THE HOME SCREEN.',
            'TURN FOLLOWERS INTO SUBSCRIBERS.',
            'OWN THE REVENUE, NOT THE ALGORITHM.',
          ],
          typeSpeed: 45,
          backSpeed: 28,
          backDelay: 2800,
          loop: true
        });
      }
    });

    return {
      typedRef,
      applyCopy,
      appIdeas,
      steps: creatorsSteps,
      benefits: creatorsBenefits,
      faqItems: creatorsFaqItems,
    };
  }
});
</script>

<style scoped>
.creators-page {
  --creator-text: rgba(255, 255, 255, 0.92);
  --creator-muted: rgba(255, 255, 255, 0.52);
  --creator-faint: rgba(255, 255, 255, 0.32);
  --creator-line: rgba(255, 255, 255, 0.1);
  --creator-surface: rgba(255, 255, 255, 0.03);
  width: 100%;
  font-family: 'Anton', 'Poppins', sans-serif;
  font-weight: 400;
  letter-spacing: 0.015em;
}

/* Override global Poppins heading rule — creators page is Anton throughout */
.creators-page :is(h1, h2, h3, h4, h5) {
  font-family: 'Anton', 'Poppins', sans-serif;
  font-weight: 400;
}

.creator-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.creator-hero {
  min-height: 85vh;
  display: flex;
  align-items: center;
  padding: calc(var(--site-header-offset) + 3rem) 0 4rem;
}

.creator-hero .creator-container {
  max-width: 1080px;
}

.creator-kicker,
.creator-section-kicker {
  margin: 0 0 1rem;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--creator-faint);
}

.creator-headline {
  margin: 0 0 1.6rem;
  font-family: 'Anton', 'Poppins', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  font-size: clamp(3rem, 8.5vw, 7rem);
  line-height: 0.92;
  letter-spacing: 0.005em;
  color: var(--creator-text);
}

.creator-headline-accent {
  display: block;
  margin-top: 0;
  color: rgba(255, 255, 255, 0.58);
  background: none;
  -webkit-text-fill-color: currentColor;
  font-weight: 400;
}

.creator-headline-accent :deep(.typed-cursor) {
  color: rgba(255, 255, 255, 0.58);
}

.creator-lead {
  margin: 0;
  max-width: 42rem;
  font-size: clamp(1.05rem, 1.6vw, 1.28rem);
  line-height: 1.55;
  text-transform: none;
  color: rgba(255, 255, 255, 0.58);
}

.creator-body,
.creator-apply-lead {
  margin: 0;
  font-size: clamp(1rem, 1.4vw, 1.12rem);
  line-height: 1.55;
  text-transform: none;
  color: var(--creator-muted);
  max-width: 560px;
}

.creator-hero-notes {
  list-style: none;
  margin: 1.75rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.creator-hero-notes li {
  position: relative;
  padding-left: 1rem;
  font-size: clamp(0.95rem, 1.4vw, 1.12rem);
  line-height: 1.45;
  text-transform: none;
  color: rgba(255, 255, 255, 0.58);
}

.creator-hero-notes li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--creator-faint);
}

.creator-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.creator-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.5rem;
  border-radius: var(--border-radius-pill, 9999px);
  font-size: clamp(0.92rem, 1.2vw, 1.02rem);
  text-transform: none;
  text-decoration: none;
  transition: opacity 0.2s ease, transform 0.2s ease, background 0.2s ease;
}

.creator-btn:hover {
  transform: translateY(-1px);
}

.creator-btn-primary {
  background: rgba(255, 255, 255, 0.96);
  color: #111;
  border: 1px solid rgba(255, 255, 255, 0.85);
}

.creator-btn-ghost {
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  border: 1px solid var(--creator-line);
}

.creator-section {
  padding: 5rem 0;
  border-top: 1px solid var(--creator-line);
}

.creator-section--muted {
  background: rgba(255, 255, 255, 0.015);
}

.creator-section--apply {
  padding-bottom: 6rem;
}

.creator-section-title {
  margin: 0 0 2.5rem;
  font-family: 'Anton', 'Poppins', sans-serif;
  font-weight: 400;
  font-size: clamp(1.65rem, 3.2vw, 2.35rem);
  letter-spacing: 0.01em;
  text-transform: none;
  color: var(--creator-text);
  max-width: 36rem;
  line-height: 1.12;
}

.creator-ideas-grid {
  display: grid;
  gap: 1px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.75rem;
  overflow: hidden;
}

.creator-idea-card {
  background: rgba(4, 4, 4, 0.82);
  padding: 1.5rem 1.35rem;
}

.creator-idea-card h3 {
  margin: 0 0 0.5rem;
  font-size: clamp(1rem, 1.4vw, 1.15rem);
  text-transform: none;
  color: var(--creator-text);
}

.creator-idea-card p {
  margin: 0;
  font-size: clamp(0.92rem, 1.2vw, 1.02rem);
  line-height: 1.55;
  text-transform: none;
  color: var(--creator-muted);
}

.creator-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.creator-step {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.creator-step-num {
  flex-shrink: 0;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: var(--creator-faint);
  padding-top: 0.15rem;
}

.creator-step h3 {
  margin: 0 0 0.4rem;
  font-size: clamp(1.02rem, 1.4vw, 1.15rem);
  text-transform: none;
  color: var(--creator-text);
}

.creator-step p {
  margin: 0;
  font-size: clamp(0.92rem, 1.2vw, 1.02rem);
  line-height: 1.55;
  text-transform: none;
  color: var(--creator-muted);
}

.creator-pricing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.creator-pricing-card {
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.75rem;
  background: rgba(4, 4, 4, 0.82);
}

.creator-pricing-card--featured {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(8, 8, 8, 0.9);
}

.creator-pricing-card h3 {
  margin: 0 0 0.35rem;
  font-size: clamp(1.02rem, 1.4vw, 1.15rem);
  text-transform: none;
  color: var(--creator-text);
}

.creator-pricing-tagline {
  margin: 0 0 0.85rem;
  font-size: clamp(0.82rem, 1.1vw, 0.95rem);
  color: var(--creator-faint);
  letter-spacing: 0.06em;
  text-transform: none;
}

.creator-pricing-card > p {
  margin: 0 0 1rem;
  font-size: clamp(0.92rem, 1.2vw, 1.02rem);
  line-height: 1.55;
  text-transform: none;
  color: var(--creator-muted);
}

.creator-pricing-card ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.creator-pricing-card li {
  position: relative;
  padding-left: 0.9rem;
  font-size: clamp(0.88rem, 1.1vw, 0.98rem);
  text-transform: none;
  color: var(--creator-muted);
}

.creator-pricing-card li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--creator-faint);
}

.creator-pricing-note {
  margin: 1.5rem 0 0;
  font-size: clamp(0.88rem, 1.1vw, 0.98rem);
  line-height: 1.55;
  text-transform: none;
  color: var(--creator-faint);
}

.creator-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.creator-benefits {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.creator-benefits li {
  position: relative;
  padding-left: 1rem;
  font-size: clamp(0.92rem, 1.2vw, 1.02rem);
  line-height: 1.5;
  text-transform: none;
  color: var(--creator-muted);
}

.creator-benefits li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--creator-faint);
}

.creator-faq-wrap {
  max-width: 720px;
}

.creator-faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.creator-faq-item {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.75rem;
  background: rgba(4, 4, 4, 0.82);
  padding: 1.25rem 1.35rem;
}

.creator-faq-item summary {
  cursor: pointer;
  font-size: clamp(0.98rem, 1.3vw, 1.1rem);
  text-transform: none;
  color: var(--creator-text);
  list-style: none;
  padding-right: 1.5rem;
  position: relative;
}

.creator-faq-item summary::after {
  content: '+';
  position: absolute;
  right: 0;
  top: 0;
  color: rgba(255, 255, 255, 0.35);
  font-size: 1.1rem;
  line-height: 1;
  transition: color 0.2s ease;
}

.creator-faq-item[open] summary::after {
  content: '−';
  color: rgba(255, 255, 255, 0.55);
}

.creator-faq-item summary::-webkit-details-marker {
  display: none;
}

.creator-faq-item p {
  margin: 0.85rem 0 0;
  font-size: clamp(0.92rem, 1.2vw, 1.02rem);
  line-height: 1.55;
  text-transform: none;
  color: var(--creator-muted);
  max-width: 38rem;
}

.creator-section--apply .creator-apply-lead {
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .creator-pricing-grid,
  .creator-split {
    grid-template-columns: 1fr;
  }

  .creator-split {
    gap: 2rem;
  }

  .creator-section {
    padding: 3.5rem 0;
  }

  .creator-section--apply .creator-container {
    padding: 0 0.75rem;
  }

  .creator-section--apply .creator-apply-lead {
    margin-bottom: 1.25rem;
  }
}
</style>
