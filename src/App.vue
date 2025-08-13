<template>
  <div class="app">
    <!-- Re-enabled cursor with pointer-events: none -->
    <Cursor3D style="pointer-events: none;"/>
    
    <!-- 3D space background -->
    <SpaceBackground3D />
    
    <LoadingScreen v-if="isLoading" />
    <Header :scrolled="scrolled" />
    
    <!-- Router view will display the current route's component -->
    <router-view v-if="!isLoading" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

// Import components
import Cursor3D from './components/Cursor3D.vue';
import SpaceBackground3D from './components/SpaceBackground3D.vue';
import LoadingScreen from './components/LoadingScreen.vue';
import Header from './components/Header.vue';
import AnimationManager from './utils/AnimationManager';

export default defineComponent({
  name: 'App',
  components: {
    Cursor3D,
    SpaceBackground3D,
    LoadingScreen,
    Header
  },
  setup() {
    const isLoading = ref(true);
    const scrolled = ref(false);

    onMounted(() => {
      // Start the animation manager to ensure cursor and background animations run
      AnimationManager.start();
      console.log('Animation manager started in App.vue');
      
      // Simulate loading screen for 2 seconds
      setTimeout(() => {
        isLoading.value = false;
      }, 2000);

      // Handle scroll event for header
      window.addEventListener('scroll', () => {
        scrolled.value = window.scrollY > 100;
      });
    });

    return {
      isLoading,
      scrolled
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
  min-height: 100vh;
}

/* Add a subtle gradient overlay to improve content legibility over the space background */
.app::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, 
    rgba(0,0,0,0.7) 0%, 
    rgba(0,0,0,0.3) 20%, 
    rgba(0,0,0,0.2) 40%, 
    rgba(0,0,0,0.3) 60%, 
    rgba(0,0,0,0.7) 100%);
  pointer-events: none;
  z-index: -5;
}
</style> 