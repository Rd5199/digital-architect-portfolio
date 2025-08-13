<template>
  <div class="app">
    <!-- Dedicated container for the main SharedWebGL canvas (site backgrounds) -->
    <div id="main-webgl-canvas-container" ref="mainWebGLCanvasContainer"></div>
    
    <!-- 3D cursor is moved outside normal document flow for site-wide coverage -->
    <Cursor3D />
    
    <!-- Background elements -->
    <Background3D />
    <InteractiveParticles
      :particle-count="1500"
      particle-color="#4a90e2"
      :interaction-radius="150"
      :repel-strength="25"
    />
    <LoadingScreen v-if="isLoading" />
    
    <!-- Site content starts here -->
    <Header :scrolled="scrolled" />
    <Hero />
    
    <!-- About section with dedicated 3D background -->
    <SectionBackground3D sectionId="about" color="#e74c3c" :density="8" />
    <About />
    
    <!-- Services section with dedicated 3D background -->
    <SectionBackground3D sectionId="services" color="#2ecc71" :density="5" />
    <Services />
    
    <!-- Process section with dedicated 3D background -->
    <SectionBackground3D sectionId="process" color="#9b59b6" :density="12" />
    <Process />
    
    <!-- Portfolio section with dedicated 3D background -->
    <SectionBackground3D sectionId="portfolio" color="#f39c12" :density="7" />
    <Portfolio />
    
    <Showcase3D />
    
    <!-- Tech stack section with dedicated 3D background -->
    <SectionBackground3D sectionId="tech-stack" color="#1abc9c" :density="10" />
    <TechStack />
    
    <!-- Testimonials section with dedicated 3D background -->
    <SectionBackground3D sectionId="testimonials" color="#3498db" :density="6" />
    <Testimonials />
    
    <!-- Contact section with dedicated 3D background -->
    <SectionBackground3D sectionId="contact" color="#8e44ad" :density="9" />
    <Contact />
    
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

// Import components
import Cursor3D from './components/Cursor3D.vue';
import Background3D from './components/Background3D.vue';
import InteractiveParticles from './components/InteractiveParticles.vue';
import LoadingScreen from './components/LoadingScreen.vue';
import Header from './components/Header.vue';
import Hero from './components/Hero.vue';
import About from './components/About.vue';
import Services from './components/Services.vue';
import Process from './components/Process.vue';
import Portfolio from './components/Portfolio.vue';
import Showcase3D from './components/Showcase3D.vue';
import TechStack from './components/TechStack.vue';
import Testimonials from './components/Testimonials.vue';
import Contact from './components/Contact.vue';
import Footer from './components/Footer.vue';
import SectionBackground3D from './components/SectionBackground3D.vue';

// Import shared WebGL context and animation manager
import SharedWebGL from './utils/SharedWebGL';
import AnimationManager from './utils/AnimationManager';

export default defineComponent({
  name: 'App',
  components: {
    Cursor3D,
    Background3D,
    InteractiveParticles,
    LoadingScreen,
    Header,
    Hero,
    About,
    Services,
    Process,
    Portfolio,
    Showcase3D,
    TechStack,
    Testimonials,
    Contact,
    Footer,
    SectionBackground3D
  },
  setup() {
    const isLoading = ref(true);
    const scrolled = ref(false);
    const mainWebGLCanvasContainer = ref<HTMLElement | null>(null); // Ref for the new container

    onMounted(() => {
      if (!mainWebGLCanvasContainer.value) {
        console.error("App.vue: mainWebGLCanvasContainer not found!");
        return;
      }
      // Initialize the shared WebGL context
      const sharedWebGL = SharedWebGL.getInstance();
      // Mount the main WebGL canvas INTO the new dedicated container
      sharedWebGL.mount(mainWebGLCanvasContainer.value);
      
      // Start the animation manager to run all 3D animations
      AnimationManager.start();
      console.log("Animation manager started in App.vue");
      
      // Control WebGL context suspension based on page visibility
      window.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          // Pause animations when tab not visible
          AnimationManager.togglePause(true);
        } else {
          // Resume animations when tab becomes visible
          AnimationManager.togglePause(false);
        }
      });
      
      // Simulate loading screen for 2 seconds
      setTimeout(() => {
        isLoading.value = false;
        console.log("Loading completed");
      }, 2000);

      // Handle scroll event for header
      window.addEventListener('scroll', () => {
        scrolled.value = window.scrollY > 100;
      });
      
      // Force a window resize event to fix any sizing issues
      window.dispatchEvent(new Event('resize'));
    });

    return {
      isLoading,
      scrolled,
      mainWebGLCanvasContainer
    };
  }
});
</script>

<style>
@import './assets/main.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';

/* Proper z-index stacking for 3D components */
.app {
  position: relative;
  z-index: 1;
}

/* Add styles for interactive elements */
a, button, .dev-btn, .model-button {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 5; /* Ensure interactive elements are above 3D components */
}

a:hover, button:hover, .dev-btn:hover, .model-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Make all sections transparent to show the background */
section {
  position: relative;
  z-index: 2;
  background-color: transparent;
}

/* Add glass-like effect to containers to make content readable */
.dev-container {
  background-color: rgba(10, 10, 20, 0);
  backdrop-filter: none;
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: none;
  transition: all 0.3s ease;
}

.dev-container:hover {
  background-color: rgba(15, 15, 25, 0);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
}

/* Special styling for cards to work with the 3D background */
.dev-card {
  background-color: rgba(20, 20, 40, 0);
  backdrop-filter: none;
  border: none;
  transition: all 0.3s ease;
}

.dev-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  background-color: rgba(30, 30, 60, 0);
}

/* Styles for the main WebGL canvas container */
#main-webgl-canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1; /* Ensure it's behind all other content */
  pointer-events: none; /* Should not interfere with interactions */
  overflow: hidden; /* Just in case */
}

/* The canvas *inside* this container will be styled by SharedWebGL.ts to fill it */
#main-webgl-canvas-container > canvas {
  width: 100% !important;
  height: 100% !important;
}

/* Styles for SectionBackground3D containers */
.section-bg-3d {
  /* position: absolute is set by the component's JS */
  z-index: 1; /* Above main background (-1), below section content (2) and cursor (max) */
  pointer-events: none; /* These are backgrounds, should not capture mouse events */
  overflow: hidden; /* Prevent its content from unexpectedly overflowing */
}
</style>
