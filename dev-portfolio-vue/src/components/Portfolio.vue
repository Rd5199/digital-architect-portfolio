<template>
  <section id="portfolio" class="dev-section">
    <ParallaxScroll 
      :count="80"
      :depth="60"
      color1="#3498db"
      color2="#2ecc71"
      :size="1.5"
    />
    <div class="dev-container">
      <h2 class="dev-section-title">Bringing Ideas to Life</h2>
      <p class="dev-section-subtitle">Explore my recent projects and see how I've helped clients achieve their digital goals.</p>
      
      <div class="dev-portfolio-grid">
        <div v-for="project in projects" :key="project.id" class="dev-portfolio-item">
          <div class="dev-portfolio-image">
            <img :src="project.image" :alt="project.title">
          </div>
          <div class="dev-portfolio-content">
            <h3>{{ project.title }}</h3>
            <span class="dev-portfolio-type">{{ project.type }}</span>
            <div class="dev-portfolio-tags">
              <span v-for="tag in project.tags" :key="tag" class="dev-tag">{{ tag }}</span>
            </div>
            <a href="#" class="dev-btn dev-btn-outline">View Project</a>
          </div>
        </div>
      </div>

      <!-- 3D Models Showcase -->
      <div class="dev-model-showcase">
        <h3 class="dev-section-subtitle">Interactive 3D Model Showcase</h3>
        <p class="dev-section-description">Browse through some of my 3D model creations. Click on different models to explore.</p>
        <ModelViewer />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModelViewer from './ModelViewer.vue';
import ParallaxScroll from './ParallaxScroll.vue';

export default defineComponent({
  name: 'Portfolio',
  components: {
    ModelViewer,
    ParallaxScroll
  },
  setup() {
    const projects = [
      {
        id: 1,
        title: 'E-commerce Platform X',
        type: 'Web Application',
        image: '/assets/images/openart-image_lC1XlWa1_1741449161168_raw.jpg',
        tags: ['Vue.js', 'Node.js', 'Stripe']
      },
      {
        id: 2,
        title: 'Wellness Mobile App',
        type: 'Mobile App (iOS & Android)',
        image: '/assets/images/openart-image_4J3rsNPv_1741447658208_raw.jpg',
        tags: ['React Native', 'Firebase', 'API Integration']
      },
      {
        id: 3,
        title: 'SaaS Dashboard',
        type: 'Web Application',
        image: '/assets/images/space-bg.svg',
        tags: ['Angular', 'Python/Django', 'AWS']
      }
    ];

    return {
      projects
    };
  }
});
</script>

<style scoped>
/* Styles are imported from main.css */
.dev-model-showcase {
  margin-top: 4rem;
  padding: 2rem;
  background: rgba(10, 10, 20, 0);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: none;
  backdrop-filter: none;
}

.dev-section-description {
  margin-bottom: 2rem;
  color: #a0a0a0;
  font-size: 1.1rem;
  text-align: center;
}

.dev-section {
  position: relative;
  overflow: hidden;
}
</style> 