<template>
  <header class="dev-header" :class="{ 'scrolled': scrolled }">
    <div class="dev-container">
      <nav class="dev-nav">
        <div class="dev-logo">Digital<span>Architect</span></div>
        <div class="dev-nav-links">
          <a v-for="link in navLinks" :key="link.id" :href="link.url">{{ link.title }}</a>
          <a href="#contact" class="dev-btn dev-btn-primary">Get a Quote</a>
        </div>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Header',
  props: {
    scrolled: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const navLinks = [
      { id: 1, title: 'About', url: '#about' },
      { id: 2, title: 'Services', url: '#services' },
      { id: 3, title: 'Process', url: '#process' },
      { id: 4, title: 'Portfolio', url: '#portfolio' },
      { id: 5, title: '3D Models', url: '#showcase3d' },
      { id: 6, title: 'Tech Stack', url: '#tech' },
      { id: 7, title: 'Testimonials', url: '#testimonials' },
      { id: 8, title: 'Contact', url: '#contact' }
    ];

    return {
      navLinks
    };
  }
});
</script>

<style scoped>
/* Styles are imported from main.css */
</style> 