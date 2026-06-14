<template>
  <div
    class="app"
    :class="{
      'app--immersive': isImmersiveLanding,
      'app--editorial': isBusinessEditorial,
    }"
  >
    <GradientBackground3D v-if="showGradientBackground" />

    <div class="app-foreground">
      <Cursor3D v-if="!isImmersiveLanding" style="pointer-events: none;" />

      <LoadingScreen v-if="isLoading && !isImmersiveLanding" />
      <Header v-if="!isImmersiveLanding && !isLoading" :scrolled="scrolled" />

      <router-view v-if="!isLoading || isImmersiveLanding" />
    </div>

    <NoiseOverlay v-if="showNoiseOverlay" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Import components
import Cursor3D from './components/Cursor3D.vue';
import GradientBackground3D from './components/GradientBackground3D.vue';
import NoiseOverlay from './components/NoiseOverlay.vue';
import LoadingScreen from './components/LoadingScreen.vue';
import Header from './components/Header.vue';
import AnimationManager from './utils/AnimationManager';
import { initSmoothExperience, refreshSmoothExperience } from './utils/smoothExperience';

export default defineComponent({
  name: 'App',
  components: {
    Cursor3D,
    GradientBackground3D,
    NoiseOverlay,
    LoadingScreen,
    Header
  },
  setup() {
    const isLoading = ref(true);
    const scrolled = ref(false);
    const router = useRouter();
    const route = useRoute();

    const isImmersiveLanding = computed(() => route.meta.immersiveLanding === true);
    const isBusinessEditorial = computed(
      () => route.meta.audience === 'business' && !isImmersiveLanding.value
    );
    const showGradientBackground = computed(
      () => !isImmersiveLanding.value && !isBusinessEditorial.value
    );
    const showNoiseOverlay = computed(
      () => !isImmersiveLanding.value && !isBusinessEditorial.value
    );

    onMounted(() => {
      if (isImmersiveLanding.value) {
        isLoading.value = false;
      }

      AnimationManager.start();
      console.log('Animation manager started in App.vue');

      if (!isImmersiveLanding.value) {
        setTimeout(() => {
          isLoading.value = false;
          nextTick(() => initSmoothExperience());
        }, 2000);
      }

      router.afterEach((to) => {
        if (to.meta.immersiveLanding) {
          isLoading.value = false;
          return;
        }
        setTimeout(() => refreshSmoothExperience(), 400);
      });
      window.addEventListener('scroll', () => {
        scrolled.value = window.scrollY > 100;
      });
    });

    return {
      isLoading,
      scrolled,
      isImmersiveLanding,
      isBusinessEditorial,
      showGradientBackground,
      showNoiseOverlay,
    };
  }
});
</script>

<style>
@import './assets/main.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';

/* Adding a gradient overlay to enhance space background visibility with content */
.app {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  min-height: 100dvh;
  min-height: -webkit-fill-available;
}

.app-foreground {
  position: relative;
  z-index: 3;
}

/* Vignette scrim — below grain, above page content */
.app::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  height: -webkit-fill-available;
  background: linear-gradient(to bottom,
    rgba(0,0,0,0.35) 0%,
    rgba(0,0,0,0.08) 22%,
    rgba(0,0,0,0.0) 45%,
    rgba(0,0,0,0.12) 70%,
    rgba(0,0,0,0.45) 100%);
  pointer-events: none;
  z-index: 450;
}

.app--immersive::after,
.app--editorial::after {
  display: none;
}
</style> 