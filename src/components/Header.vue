<template>
  <header class="dev-header" :class="{ 'scrolled': scrolled }">
    <div class="dev-container">
      <nav class="dev-nav">
        <router-link to="/" class="dev-logo-link">
          <div class="dev-logo">Digital<span>Architect</span></div>
        </router-link>
        <div class="dev-nav-links">
          <router-link 
            v-for="link in navLinks" 
            :key="link.id" 
            :to="link.url" 
            class="nav-link"
            active-class="active"
          >
            {{ link.title }}
          </router-link>
          <router-link to="/3d-models" class="dev-nav-3d">3D Models</router-link>
          <router-link :to="{ path: '/', hash: '#contact' }" class="dev-btn dev-btn-primary">Get a Quote</router-link>
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
      { id: 1, title: 'About', url: { path: '/', hash: '#about' } },
      { id: 2, title: 'Services', url: { path: '/', hash: '#services' } },
      { id: 3, title: 'Process', url: { path: '/', hash: '#process' } },
      { id: 4, title: 'Portfolio', url: { path: '/', hash: '#portfolio' } },
      { id: 5, title: 'TechStack', url: { path: '/', hash: '#tech' } },
      { id: 6, title: 'Testimonials', url: { path: '/', hash: '#testimonials' } },
      { id: 7, title: 'Contact', url: { path: '/', hash: '#contact' } }
    ];

    return {
      navLinks
    };
  }
});
</script>

<style scoped>
/* Styles are imported from main.css */
.dev-logo-link {
  text-decoration: none;
  color: inherit;
  transition: opacity 0.3s ease;
}

.dev-logo-link:hover {
  opacity: 0.9;
}

.nav-link {
  position: relative;
  color: var(--text-color);
  text-decoration: none;
  margin-left: 1.5rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 0;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary-color);
}

.nav-link:hover::after, .nav-link.active::after {
  width: 100%;
}

.dev-nav-3d {
  position: relative;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  margin-left: 1.5rem;
  transition: color 0.3s ease;
  background: linear-gradient(45deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-right: 0.5rem;
}

.dev-nav-3d::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 0;
  background: linear-gradient(45deg, #3498db, #9b59b6);
  transition: width 0.3s ease;
}

.dev-nav-3d:hover::after {
  width: 100%;
}

.dev-btn-primary {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dev-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style> 