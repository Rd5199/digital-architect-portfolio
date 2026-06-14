<template>
  <section id="home" class="dev-hero hero">
    <div class="dev-container hero-inner">
      <p class="hero-eyebrow hero-stagger">
        Custom AI systems for service businesses
      </p>

      <h1 class="hero-display hero-stagger">
        Grow your business
        <span class="hero-display-accent">with custom AI</span>
      </h1>

      <p class="hero-sub hero-stagger">
        We partner with service-based businesses to cut costs and move faster — building the
        AI systems that quietly do the work in the background.
      </p>

      <div class="hero-actions hero-stagger">
        <a href="#about" class="hero-btn hero-btn-primary">
          <span>See how it works</span>
        </a>
        <a href="#ai-audit" class="hero-btn hero-btn-ghost">
          <span>Free audit</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import gsap from 'gsap';

export default defineComponent({
  name: 'Hero',
  setup() {
    const playEntrance = () => {
      gsap.fromTo(
        '.hero-stagger',
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.1,
          clearProps: 'transform'
        }
      );
    };

    onMounted(() => {
      playEntrance();
    });
  }
});
</script>

<style scoped>
.dev-hero.hero {
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: calc(var(--site-header-offset) + var(--spacing-lg)) var(--spacing-md) var(--spacing-lg);
  overflow: hidden;
}

.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 1080px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-eyebrow {
  margin: 0 0 1.4rem;
  color: var(--text-muted);
  font-size: 0.92rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}

/* Oversized condensed display headline (Modash-style) */
.hero-display {
  font-family: 'Anton', 'Poppins', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  font-size: clamp(3rem, 8.5vw, 7rem);
  line-height: 0.92;
  letter-spacing: 0.005em;
  margin: 0 0 1.6rem;
  color: var(--text-white);
}
.hero-display-accent {
  display: block;
  color: rgba(255, 255, 255, 0.58);
  background: none;
  -webkit-text-fill-color: currentColor;
}

.hero-sub {
  max-width: 600px;
  margin: 0 0 2rem;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: clamp(1.02rem, 1.5vw, 1.2rem);
  line-height: 1.6;
  color: var(--text-light);
}

.hero-actions {
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
  justify-content: center;
}
.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.95rem 1.9rem;
  border-radius: var(--border-radius-pill);
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 1.02rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s var(--ease-out-expo), box-shadow 0.3s ease, background 0.3s ease;
}
.hero-btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: #fff;
  box-shadow: 0 10px 30px rgba(110, 68, 255, 0.35);
}
.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(110, 68, 255, 0.5);
}
.hero-btn-ghost {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: var(--text-white);
  backdrop-filter: blur(8px);
}
.hero-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .hero-actions {
    width: 100%;
  }
  .hero-btn {
    flex: 1 1 auto;
    justify-content: center;
  }
}
</style>
