<template>
  <footer class="dev-footer">
    <div class="dev-container">
      <div class="dev-footer-content">
        <div class="dev-footer-logo">Digital<span>Architect</span></div>
        
        <div class="dev-social-links">
          <a v-for="link in socialLinks" :key="link.id" :href="link.url" class="dev-social-link">
            <i :class="link.icon"></i>
          </a>
        </div>
        
        <div class="dev-footer-nav">
          <a v-for="navItem in footerNavItems" :key="navItem.id" :href="navItem.url">
            {{ navItem.title }}
          </a>
        </div>
        
        <div class="dev-copyright">
          &copy; {{ currentYear }} DigitalArchitect. All Rights Reserved.
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'Footer',
  setup() {
    const currentYear = computed(() => new Date().getFullYear());
    
    const socialLinks = [
      { id: 1, icon: 'fab fa-github', url: '#' },
      { id: 2, icon: 'fab fa-linkedin-in', url: '#' },
      { id: 3, icon: 'fab fa-twitter', url: '#' },
      { id: 4, icon: 'fab fa-dribbble', url: '#' }
    ];
    
    const footerNavItems = [
      { id: 1, title: 'About', url: '#about' },
      { id: 2, title: 'Services', url: '#services' },
      { id: 3, title: 'Process', url: '#process' },
      { id: 4, title: 'Portfolio', url: '#portfolio' },
      { id: 5, title: 'Contact', url: '#contact' }
    ];
    
    return {
      currentYear,
      socialLinks,
      footerNavItems
    };
  }
});
</script>

<style scoped>
/* Styles are imported from main.css */
</style> 