<template>
  <section id="services" class="dev-section">
    <div class="dev-container">
      <h2 class="dev-section-title">Building Your Vision, Pixel by Pixel</h2>
      <p class="dev-section-subtitle">Comprehensive development services tailored to meet your specific business requirements.</p>
      
      <div class="dev-services-grid">
        <div v-for="service in services" :key="service.id" class="dev-service-card">
          <div class="dev-service-icon">
            <i :class="service.icon"></i>
          </div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Services',
  setup() {
    const services = [
      {
        id: 1,
        title: 'Custom Web Development',
        icon: 'fas fa-laptop-code',
        description: 'Building responsive, high-performance websites and web applications tailored to your specific business needs, from e-commerce to complex SaaS platforms.'
      },
      {
        id: 2,
        title: 'Mobile App Development',
        icon: 'fas fa-mobile-alt',
        description: 'Crafting intuitive and engaging native or cross-platform mobile apps for iOS and Android that delight users and drive growth.'
      },
      {
        id: 3,
        title: 'UI/UX Design & Strategy',
        icon: 'fas fa-drafting-compass',
        description: 'Designing user-centric interfaces that are not only visually stunning but also enhance usability and achieve your strategic objectives.'
      },
      {
        id: 4,
        title: 'API Development & Integration',
        icon: 'fas fa-cogs',
        description: 'Developing robust APIs and seamlessly integrating third-party services to extend functionality and streamline operations.'
      }
    ];

    return {
      services
    };
  }
});
</script>

<style scoped>
/* Styles are imported from main.css */
</style> 