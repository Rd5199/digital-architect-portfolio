<template>
  <div class="noise-overlay" aria-hidden="true" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

/**
 * Film-grain overlay using the CSS-Tricks / grainy-gradients technique:
 * tiled SVG feTurbulence noise + contrast boost + soft-light blend.
 * @see https://css-tricks.com/grainy-gradients/
 * @see https://grainy-gradients.vercel.app/
 */
export default defineComponent({
  name: 'NoiseOverlay',
});
</script>

<style scoped>
.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--grain-z-index);
  pointer-events: none;
  background-image: var(--grain-image);
  background-repeat: repeat;
  background-size: var(--grain-size);
  opacity: var(--grain-opacity);
  mix-blend-mode: var(--grain-blend-mode);
  filter: var(--grain-filter);
}

</style>
