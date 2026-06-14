<template>
  <section id="portfolio" class="dev-section">
    <div class="dev-container">
      <h2 class="dev-section-title">Sample Projects</h2>
      <p class="dev-section-subtitle">Interactive demos across web and mobile — tap a project to explore.</p>
      
      <div class="dev-portfolio-carousel">
        <div class="dev-carousel-wrapper" @mouseenter="pauseAnimation" @mouseleave="resumeAnimation">
          <div class="dev-carousel-track" :class="{ 'paused': isPaused }">
            <!-- First set of projects -->
            <div 
              v-for="project in projects" 
              :key="`first-${project.id}`" 
              class="dev-carousel-slide"
            >
              <ProjectCard :project="project" />
            </div>
            <!-- Duplicate set for seamless loop -->
            <div 
              v-for="project in projects" 
              :key="`second-${project.id}`" 
              class="dev-carousel-slide"
            >
              <ProjectCard :project="project" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { projectsData } from '../data/projects';
import ProjectCard from './ProjectCard.vue';

export default defineComponent({
  name: 'Portfolio',
  components: {
    ProjectCard
  },
  setup() {
    const isPaused = ref(false);
    const projects = projectsData;

    const pauseAnimation = () => {
      isPaused.value = true;
    };

    const resumeAnimation = () => {
      isPaused.value = false;
    };

    return {
      projects,
      isPaused,
      pauseAnimation,
      resumeAnimation
    };
  }
});
</script>

<style scoped>
.dev-portfolio-carousel {
  position: relative;
  margin-top: var(--spacing-lg);
  overflow: hidden;
  width: 100%;
}

.dev-carousel-wrapper {
  overflow: hidden;
  position: relative;
  width: 100%;
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
}

.dev-carousel-track {
  display: flex;
  gap: var(--spacing-md);
  width: fit-content;
  animation: scroll 30s linear infinite;
  will-change: transform;
}

.dev-carousel-track.paused {
  animation-play-state: paused;
}

.dev-carousel-slide {
  flex-shrink: 0;
  width: 350px;
  max-width: 90vw;
}

/* Continuous scroll animation */
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Responsive Design */
@media (max-width: 992px) {
  .dev-carousel-slide {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .dev-carousel-slide {
    width: 280px;
  }
  
  .dev-carousel-track {
    gap: var(--spacing-sm);
    animation-duration: 25s;
  }
}

@media (max-width: 480px) {
  .dev-carousel-slide {
    width: 85vw;
  }
  
  .dev-carousel-track {
    animation-duration: 20s;
  }
}
</style> 