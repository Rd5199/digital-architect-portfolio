<template>
  <section id="process" class="dev-section dev-section-alt">
    <div class="dev-container">
      <h2 class="dev-section-title">From Concept to Creation: A Transparent Journey</h2>
      <p class="dev-section-subtitle">My comprehensive development process ensures quality results and a smooth experience from start to finish.</p>
      
      <div class="dev-process-steps">
        <div v-for="step in processSteps" :key="step.id" class="dev-process-step">
          <div class="dev-step-number">{{ step.id }}</div>
          <div class="dev-step-icon">
            <i :class="step.icon"></i>
          </div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Process',
  setup() {
    const processSteps = [
      {
        id: 1,
        title: 'Discovery & Strategy',
        icon: 'fas fa-search',
        description: 'Understanding your vision, goals, and target audience to define a clear project roadmap.'
      },
      {
        id: 2,
        title: 'Design & Prototyping',
        icon: 'fas fa-palette',
        description: 'Crafting intuitive user experiences and visually appealing interfaces, iterated through feedback.'
      },
      {
        id: 3,
        title: 'Development & Coding',
        icon: 'fas fa-code',
        description: 'Writing clean, efficient, and scalable code using modern technologies and best practices.'
      },
      {
        id: 4,
        title: 'Testing & QA',
        icon: 'fas fa-check-double',
        description: 'Rigorous testing across devices and scenarios to ensure a flawless, bug-free product.'
      },
      {
        id: 5,
        title: 'Deployment & Launch',
        icon: 'fas fa-rocket',
        description: 'Seamless deployment to your chosen environment and support through the launch process.'
      },
      {
        id: 6,
        title: 'Ongoing Support',
        icon: 'fas fa-life-ring',
        description: 'Providing continued maintenance, updates, and future enhancements as your needs grow.'
      }
    ];

    return {
      processSteps
    };
  }
});
</script>

<style scoped>
/* Styles are imported from main.css */
</style> 