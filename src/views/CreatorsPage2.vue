<template>
  <div class="creators-sticky-page">
    <section class="sticky-hero" ref="heroRef">
      <div class="grain-layer sticky-hero__grain" aria-hidden="true" />

      <div class="sticky-hero-content">
        <div class="sticky-hero-copy">
          <p class="sticky-kicker">{{ hero.kicker }}</p>
          <h1 class="sticky-hero-title">{{ hero.headline }}</h1>
          <p class="sticky-hero-lead">{{ hero.lead }}</p>
        </div>
      </div>

      <div class="sticky-cards">
        <div class="sticky-card sticky-card-front">
          <p class="sticky-card-kicker">{{ hero.kicker }}</p>
          <h3 class="sticky-card-title">{{ hero.headline }}</h3>
          <span class="sticky-card-badge">{{ hero.scrollBadge }}</span>
          <p class="sticky-card-body">
            Your audience, your app — membership, community, and products under your name.
          </p>
          <div class="sticky-card-icon sticky-card-icon--ring">
            <ion-icon name="caret-down" />
          </div>
        </div>

        <div
          v-for="(card, index) in journeyCards"
          :key="card.id"
          :id="card.id"
          class="sticky-card sticky-card-back"
          :class="`sticky-card--${index + 1}`"
        >
          <p class="sticky-card-kicker">{{ card.kicker }}</p>
          <h3 class="sticky-card-title">{{ card.title }}</h3>
          <div class="sticky-card-icon sticky-card-icon--filled">
            <ion-icon :name="card.icon" />
          </div>
          <p class="sticky-card-body">{{ card.body }}</p>
        </div>
      </div>
    </section>

    <section id="apply" class="sticky-apply">
      <div class="grain-layer sticky-apply__grain" aria-hidden="true" />
      <div class="creator-container sticky-apply__inner">
        <p class="creator-section-kicker">{{ applyCopy.kicker }}</p>
        <h2 class="creator-section-title">{{ applyCopy.title }}</h2>
        <p class="creator-apply-lead">{{ applyCopy.lead }}</p>
        <CreatorContactForm :show-intro="false" variant="elevated" />
      </div>
    </section>

    <Footer />
  </div>
</template>

<script lang="ts">
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import CreatorContactForm from '../components/CreatorContactForm.vue';
import Footer from '../components/Footer.vue';
import {
  creatorsApply,
  creatorsHero,
  creatorsJourneyCards,
} from '../data/creatorsContent';

gsap.registerPlugin(ScrollTrigger);

const CARD_FLIP_TILTS = [-10, -18, -5, 12, 8, -6];
const CARD_DISMISS_TILTS = [-50, -58, -42, 48, 40, -35];

function loadIonicons() {
  if (customElements.get('ion-icon')) return;

  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js';
  document.head.appendChild(script);
}

export default defineComponent({
  name: 'CreatorsPage2',
  components: { CreatorContactForm, Footer },
  setup() {
    const heroRef = ref<HTMLElement | null>(null);
    let stickyScrollTrigger: ScrollTrigger | null = null;
    let isFlipped = false;

    const hero = creatorsHero;
    const journeyCards = creatorsJourneyCards;
    const applyCopy = creatorsApply;

    const initStickyCards = () => {
      const heroEl = heroRef.value;
      if (!heroEl) return;

      const stickyCards = heroEl.querySelectorAll('.sticky-card');
      const frontStickyCard = heroEl.querySelector('.sticky-card-front');
      const backStickyCards = heroEl.querySelectorAll('.sticky-card-back');
      const heroHeadline = heroEl.querySelector('.sticky-hero-content');

      if (!frontStickyCard || !heroHeadline || backStickyCards.length === 0) return;

      const stickyCardCount = backStickyCards.length;
      const CARDS_ENTER_END = 100;
      const CARD_FLIP_TRIGGER = 200;
      const CARD_DISMISS_START = 300;
      const CARD_DISMISS_DURATION = 100;
      const TOTAL_SCROLL_SVH =
        CARD_DISMISS_START + stickyCardCount * CARD_DISMISS_DURATION;

      const svhToProgress = (svh: number) => svh / TOTAL_SCROLL_SVH;
      const totalScroll = window.innerHeight * (TOTAL_SCROLL_SVH / 100);

      const cardFlipTiltAngles = CARD_FLIP_TILTS.slice(0, stickyCardCount);
      const cardDismissTiltAngles = CARD_DISMISS_TILTS.slice(0, stickyCardCount);

      const cardDismissRanges = Array.from({ length: stickyCardCount }, (_, i) => {
        const dismissOrder = stickyCardCount - 1 - i;
        return [
          svhToProgress(CARD_DISMISS_START + dismissOrder * CARD_DISMISS_DURATION),
          svhToProgress(CARD_DISMISS_START + (dismissOrder + 1) * CARD_DISMISS_DURATION),
        ];
      });

      gsap.set(frontStickyCard, { rotationY: 0 });
      gsap.set(backStickyCards, { rotationY: -180 });

      const revealBackCards = () => {
        gsap.to(frontStickyCard, {
          rotationY: 180,
          duration: 1,
          ease: 'elastic.out(1,0.5)',
        });
        backStickyCards.forEach((card, i) => {
          gsap.to(card, {
            rotationY: 0,
            rotationZ: cardFlipTiltAngles[i] ?? 0,
            duration: 1,
            ease: 'elastic.out(1,0.5)',
          });
        });
      };

      const concealBackCards = () => {
        gsap.to(frontStickyCard, {
          rotationY: 0,
          duration: 1,
          ease: 'elastic.out(1,0.5)',
        });
        backStickyCards.forEach((card) => {
          gsap.to(card, {
            rotationY: -180,
            rotationZ: 0,
            duration: 1,
            ease: 'elastic.out(1,0.5)',
          });
        });
      };

      stickyScrollTrigger = ScrollTrigger.create({
        trigger: heroEl,
        start: 'top top',
        end: `+=${totalScroll}px`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        onUpdate: ({ progress }) => {
          const enterProgress = gsap.utils.clamp(
            0,
            1,
            gsap.utils.mapRange(0, svhToProgress(CARDS_ENTER_END), 0, 1, progress),
          );

          gsap.set(stickyCards, {
            y: `${gsap.utils.mapRange(0, 1, 50, -50, enterProgress)}%`,
          });
          gsap.set(heroHeadline, {
            y: `${gsap.utils.mapRange(0, 1, 0, -100, enterProgress)}%`,
          });

          if (progress > svhToProgress(CARD_FLIP_TRIGGER) && !isFlipped) {
            revealBackCards();
            isFlipped = true;
          } else if (progress <= svhToProgress(CARD_FLIP_TRIGGER) && isFlipped) {
            concealBackCards();
            isFlipped = false;
          }

          backStickyCards.forEach((card, i) => {
            const [dismissStart, dismissEnd] = cardDismissRanges[i];
            const dismissProgress = gsap.utils.clamp(
              0,
              1,
              gsap.utils.mapRange(dismissStart, dismissEnd, 0, 1, progress),
            );
            gsap.set(card, {
              y: `${gsap.utils.mapRange(0, 1, -50, -250, dismissProgress)}%`,
              rotation: gsap.utils.mapRange(
                0,
                1,
                cardFlipTiltAngles[i] ?? 0,
                cardDismissTiltAngles[i] ?? 0,
                dismissProgress,
              ),
            });
          });
        },
      });

      ScrollTrigger.refresh();
    };

    onMounted(() => {
      loadIonicons();
      nextTick(() => {
        requestAnimationFrame(() => initStickyCards());
      });
    });

    onBeforeUnmount(() => {
      stickyScrollTrigger?.kill();
      stickyScrollTrigger = null;
      isFlipped = false;
      ScrollTrigger.refresh();
    });

    return {
      heroRef,
      hero,
      journeyCards,
      applyCopy,
    };
  },
});
</script>

<style scoped>
.creators-sticky-page {
  /* MaximaTherapy sticky-cards palette */
  --sticky-base-100: #fff;
  --sticky-base-200: #fbfff2;
  --sticky-base-300: #e7ebdf;
  --sticky-base-400: #fd4400;
  --sticky-base-500: #e7ebdf;
  --sticky-base-600: #2668fd;
  --sticky-base-700: #fdcb40;
  --sticky-base-800: #0f0f0f;

  --creator-text: rgba(255, 255, 255, 0.92);
  --creator-muted: rgba(255, 255, 255, 0.52);
  --creator-faint: rgba(255, 255, 255, 0.32);
  --creator-line: rgba(255, 255, 255, 0.1);

  position: relative;
  z-index: 1;
  width: 100%;
  font-family: 'Anton', 'Poppins', sans-serif;
  font-weight: 400;
  letter-spacing: 0.015em;
  background-color: var(--editorial-surface, #070707);
}

.creators-sticky-page :is(h1, h2, h3, h4, h5) {
  font-family: 'Anton', 'Poppins', sans-serif;
  font-weight: 400;
}

.creators-sticky-page :deep(.pin-spacer) {
  background-color: var(--editorial-surface, #070707);
}

.sticky-hero {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: calc(-1 * var(--site-header-offset));
  padding-top: var(--site-header-offset);
  height: calc(100svh + var(--site-header-offset));
  background-color: var(--editorial-surface, #070707);
  color: var(--creator-text);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  isolation: isolate;
}

.sticky-hero__grain {
  z-index: 0;
}

.sticky-hero-content {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  will-change: transform;
  pointer-events: none;
  z-index: 1;
}

.sticky-hero-copy {
  width: min(42rem, 85%);
  text-align: center;
}

.sticky-kicker {
  margin: 0 0 1rem;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--creator-faint);
}

.creator-section-kicker {
  margin: 0 0 1rem;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--creator-faint);
}

.sticky-hero-title {
  margin: 0 0 1rem;
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  line-height: 0.92;
  letter-spacing: 0.005em;
  text-transform: uppercase;
  color: var(--creator-text);
}

.sticky-hero-lead {
  margin: 0;
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  line-height: 1.55;
  text-transform: none;
  color: rgba(255, 255, 255, 0.58);
}

.sticky-cards {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
  z-index: 1;
}

.sticky-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 25%;
  min-width: 300px;
  max-width: none;
  padding: 4rem 2rem;
  aspect-ratio: 4/5;
  border-radius: 1rem;
  border: none;
  background-color: var(--sticky-base-400);
  color: var(--sticky-base-100);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  will-change: transform;
  gap: 0.5rem;
}

.sticky-card-kicker {
  margin: 0;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
}

.sticky-card-title {
  margin: 0;
  font-size: clamp(1.5rem, 2.4vw, 2.15rem);
  line-height: 1.05;
  letter-spacing: 0.01em;
  text-transform: none;
  color: inherit;
}

.sticky-card-body {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 450;
  line-height: 1.15;
  text-transform: none;
  color: rgba(255, 255, 255, 0.92);
}

.sticky-card-badge {
  text-transform: uppercase;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: var(--sticky-base-100);
  color: var(--sticky-base-800);
  font-family: 'Anton', 'Poppins', sans-serif;
}

.sticky-card-icon--ring {
  width: 4rem;
  height: 4rem;
  border: 0.125rem solid var(--sticky-base-100);
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--sticky-base-100);
  margin-top: 0.25rem;
  font-size: 1.25rem;
}

.sticky-card-front {
  transform: translate(-50%, 50%) rotateY(0deg);
  backface-visibility: hidden;
  background-color: var(--sticky-base-400);
  color: var(--sticky-base-100);
}

.sticky-card-icon--filled {
  width: 5rem;
  height: 5rem;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: var(--sticky-base-100);
  color: var(--sticky-base-400);
  border: none;
}

.sticky-card--1,
.sticky-card--5 {
  background-color: var(--sticky-base-400);
  color: var(--sticky-base-100);
}

.sticky-card--2 {
  background-color: var(--sticky-base-500);
  color: var(--sticky-base-800);
}

.sticky-card--3 {
  background-color: var(--sticky-base-600);
  color: var(--sticky-base-100);
}

.sticky-card--4 {
  background-color: var(--sticky-base-700);
  color: var(--sticky-base-800);
}

.sticky-card--2 .sticky-card-kicker,
.sticky-card--4 .sticky-card-kicker {
  color: rgba(15, 15, 15, 0.45);
}

.sticky-card--2 .sticky-card-body,
.sticky-card--4 .sticky-card-body {
  color: rgba(15, 15, 15, 0.72);
}

.sticky-card-back {
  transform: translate(-50%, 50%) rotateY(180deg);
  backface-visibility: hidden;
}

.sticky-apply {
  position: relative;
  padding: 5rem 0 6rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: var(--editorial-surface, #070707);
  isolation: isolate;
}

.sticky-apply__grain {
  z-index: 0;
}

.sticky-apply__inner {
  position: relative;
  z-index: 1;
}

.sticky-apply__inner :deep(.creator-form-wrap) {
  position: relative;
  z-index: 2;
}

.creators-sticky-page :deep(.site-footer) {
  margin-top: 0;
}

.creator-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.creator-section-title {
  margin: 0 0 1.5rem;
  font-size: clamp(1.65rem, 3.2vw, 2.35rem);
  letter-spacing: 0.01em;
  text-transform: none;
  color: var(--creator-text);
  max-width: 36rem;
  line-height: 1.12;
}

.creator-apply-lead {
  margin: 0 0 2rem;
  font-size: clamp(1rem, 1.4vw, 1.12rem);
  line-height: 1.55;
  text-transform: none;
  color: var(--creator-muted);
  max-width: 560px;
}

@media (max-width: 1000px) {
  .sticky-hero-copy {
    width: 85%;
  }

  .sticky-card {
    min-width: 300px;
    padding: 3.5rem 1.75rem;
  }
}

@media (max-width: 640px) {
  .sticky-hero-title {
    font-size: clamp(2rem, 9vw, 2.75rem);
  }

  .sticky-card-title {
    font-size: 1.35rem;
  }

  .sticky-card-body {
    font-size: 0.95rem;
  }

  .creator-container {
    padding: 0 0.75rem;
  }
}
</style>
