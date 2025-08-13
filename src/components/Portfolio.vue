<template>
  <section id="portfolio" class="dev-section">
    <div class="dev-container">
      <h2 class="dev-section-title">Bringing Ideas to Life</h2>
      <p class="dev-section-subtitle">Explore my recent projects and see how I've helped clients achieve their digital goals.</p>
      
      <div class="dev-portfolio-grid">
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { projectsData } from '../data/projects';
import ProjectCard from './ProjectCard.vue';

export default defineComponent({
  name: 'Portfolio',
  components: {
    ProjectCard
  },
  setup() {
    return {
      projects: projectsData
    };
  }
});
</script>

<style scoped>
/* Styles are imported from main.css */
</style> 