<template>
  <footer class="dev-footer">
    <div class="dev-container">
      <div class="dev-footer-content">
        <div class="dev-footer-logo">Digital<span>Architect</span></div>
        
        <div class="dev-footer-nav">
          <a v-for="navItem in footerNavItems" :key="navItem.id" :href="navItem.url">
            {{ navItem.title }}
          </a>
        </div>
        
        <div class="dev-footer-legal">
          <router-link to="/privacy-policy" class="dev-footer-legal-link">Privacy Policy</router-link>
          <span class="dev-footer-legal-separator">|</span>
          <router-link to="/terms-of-service" class="dev-footer-legal-link">Terms of Service</router-link>
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
    
    const footerNavItems = [
      { id: 1, title: 'About', url: '#about' },
      { id: 2, title: 'Services', url: '#services' },
      { id: 3, title: 'Process', url: '#process' },
      { id: 4, title: 'Portfolio', url: '#portfolio' },
      { id: 5, title: 'Contact', url: '#contact' }
    ];
    
    return {
      currentYear,
      footerNavItems
    };
  }
});
</script>

<style scoped>
/* Styles are imported from main.css */
.dev-footer-legal {
  margin: var(--spacing-sm) 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dev-footer-legal-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color var(--transition-speed) ease;
}

.dev-footer-legal-link:hover {
  color: var(--primary-color);
}

.dev-footer-legal-separator {
  margin: 0 var(--spacing-xs);
  color: var(--text-muted);
}
</style> 