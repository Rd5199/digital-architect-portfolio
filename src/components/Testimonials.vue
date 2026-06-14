<template>
  <section id="testimonials" class="dev-section dev-testimonials">
    <div class="dev-container">
      <div class="dev-work-label">
        <span>Client Work</span>
      </div>
      <h2 class="dev-section-title">Platforms We've Built</h2>
      <p class="dev-work-subtitle">Tap a logo to visit the live platform.</p>

      <div class="dev-work-carousel">
        <div
          class="dev-work-carousel__viewport"
          @mouseenter="pauseAnimation"
          @mouseleave="resumeAnimation"
          @focusin="pauseAnimation"
          @focusout="resumeAnimation"
        >
          <div class="dev-work-carousel__track" :class="{ 'dev-work-carousel__track--paused': isPaused }">
            <a
              v-for="(project, index) in carouselItems"
              :key="`${project.id}-${index}`"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="dev-work-logo-slide"
              :aria-label="`${project.name} — ${project.domain}`"
            >
              <div class="dev-work-logo-slide__ring">
                <img
                  :src="project.logo"
                  :alt="project.logoAlt"
                  class="dev-work-logo-slide__img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span class="dev-work-logo-slide__domain">{{ project.domain }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { featuredWork } from '../data/featuredWork';

export default defineComponent({
  name: 'Testimonials',
  setup() {
    const isPaused = ref(false);

    // Duplicate for seamless infinite scroll (two full sets).
    const carouselItems = computed(() => [...featuredWork, ...featuredWork]);

    const pauseAnimation = () => {
      isPaused.value = true;
    };

    const resumeAnimation = () => {
      isPaused.value = false;
    };

    return {
      carouselItems,
      isPaused,
      pauseAnimation,
      resumeAnimation,
    };
  },
});
</script>

<style scoped>
.dev-work-label {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.34);
  font-weight: 500;
}

.dev-work-subtitle {
  text-align: center;
  margin: 0.5rem auto 0;
  max-width: 32rem;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.dev-work-carousel {
  position: relative;
  margin-top: var(--spacing-lg);
  width: 100%;
  overflow: hidden;
}

.dev-work-carousel__viewport {
  overflow: hidden;
  width: 100%;
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
}

.dev-work-carousel__track {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  width: max-content;
  padding: 0.75rem 0 1rem;
  animation: dev-work-scroll 28s linear infinite;
  will-change: transform;
}

.dev-work-carousel__track--paused {
  animation-play-state: paused;
}

.dev-work-logo-slide {
  flex: 0 0 auto;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  color: inherit;
}

.dev-work-logo-slide__ring {
  width: 4.75rem;
  height: 4.75rem;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem;
  background: transparent;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.dev-work-logo-slide:hover .dev-work-logo-slide__ring,
.dev-work-logo-slide:focus-visible .dev-work-logo-slide__ring {
  border-color: rgba(255, 255, 255, 0.22);
  transform: translateY(-2px);
}

.dev-work-logo-slide__img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  filter: grayscale(100%) brightness(1.15);
  opacity: 0.38;
  transition: opacity 0.2s ease, filter 0.2s ease;
}

.dev-work-logo-slide:hover .dev-work-logo-slide__img,
.dev-work-logo-slide:focus-visible .dev-work-logo-slide__img {
  opacity: 0.68;
  filter: grayscale(100%) brightness(1.35);
}

.dev-work-logo-slide__domain {
  font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.28);
  transition: color 0.2s ease;
}

.dev-work-logo-slide:hover .dev-work-logo-slide__domain,
.dev-work-logo-slide:focus-visible .dev-work-logo-slide__domain {
  color: rgba(255, 255, 255, 0.48);
}

@keyframes dev-work-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@media (max-width: 768px) {
  .dev-work-logo-slide__ring {
    width: 4.25rem;
    height: 4.25rem;
    padding: 0.75rem;
  }

  .dev-work-carousel__track {
    gap: 2rem;
    animation-duration: 22s;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dev-work-carousel__track {
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    padding-bottom: 0;
  }

  .dev-work-logo-slide:nth-child(n + 4) {
    display: none;
  }

  .dev-work-carousel__viewport {
    mask-image: none;
    -webkit-mask-image: none;
  }
}
</style>
