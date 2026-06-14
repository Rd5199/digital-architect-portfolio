<template>
  <div class="home home-editorial">
    <div class="grain-layer home-editorial__grain" aria-hidden="true" />

    <div class="home-editorial__inner">
      <Hero />
      <About />
      <AiAudit />
      <Portfolio />
      <Testimonials />
      <TechStack />
      <Contact />
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Hero from './Hero.vue';
import About from './About.vue';
import AiAudit from './AiAudit.vue';
import Portfolio from './Portfolio.vue';
import TechStack from './TechStack.vue';
import Testimonials from './Testimonials.vue';
import Contact from './Contact.vue';
import Footer from './Footer.vue';

export default defineComponent({
  name: 'Home',
  components: {
    Hero,
    About,
    AiAudit,
    Portfolio,
    TechStack,
    Testimonials,
    Contact,
    Footer
  }
});
</script>

<style scoped>
.home-editorial {
  position: relative;
  width: 100%;
  background: var(--editorial-surface);
  isolation: isolate;
  /* Stronger film grain — default vars read too flat on #070707 */
  --grain-opacity: 0.58;
  --grain-size: 140px 140px;
  --grain-filter: contrast(195%) brightness(128%);
  --grain-blend-mode: overlay;
}

.home-editorial__grain {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.home-editorial__inner {
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .home-editorial {
    --grain-opacity: 0.52;
    --grain-size: 120px 120px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-editorial {
    --grain-opacity: 0.4;
    --grain-filter: contrast(165%) brightness(118%);
  }
}
</style>
