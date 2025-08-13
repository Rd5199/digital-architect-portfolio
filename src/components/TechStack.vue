<template>
  <section id="tech" class="dev-section dev-section-alt">
    <div class="dev-container">
      <h2 class="dev-section-title">Technologies I Master & Love</h2>
      <p class="dev-section-subtitle">I stay current with the latest technologies to deliver modern, efficient solutions.</p>
      
      <div class="dev-tech-grid">
        <div v-for="category in techCategories" :key="category.id" class="dev-tech-category">
          <h3>{{ category.title }}</h3>
          <div class="dev-tech-icons">
            <div v-for="tech in category.technologies" :key="tech.name" class="dev-tech-icon">
              <i :class="tech.icon" class="dev-tech-icon-img" :style="{ color: tech.color, fontSize: '40px' }"></i>
              <span>{{ tech.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TechStack',
  setup() {
    const techCategories = [
      {
        id: 1,
        title: 'Frontend',
        technologies: [
          { name: 'Vue.js', icon: 'fab fa-vuejs', color: '#42b883' },
          { name: 'React', icon: 'fab fa-react', color: '#61dafb' },
          { name: 'Angular', icon: 'fab fa-angular', color: '#dd0031' },
          { name: 'HTML5', icon: 'fab fa-html5', color: '#e34f26' },
          { name: 'CSS3', icon: 'fab fa-css3-alt', color: '#264de4' },
          { name: 'JavaScript', icon: 'fab fa-js-square', color: '#f7df1e' }
        ]
      },
      {
        id: 2,
        title: 'Backend',
        technologies: [
          { name: 'Node.js', icon: 'fab fa-node-js', color: '#68a063' },
          { name: 'Python', icon: 'fab fa-python', color: '#3776ab' },
          { name: 'PHP', icon: 'fab fa-php', color: '#777bb4' },
          { name: 'Express.js', icon: 'fas fa-cogs', color: '#ce3a55' }
        ]
      },
      {
        id: 3,
        title: 'Mobile',
        technologies: [
          { name: 'React Native', icon: 'fab fa-react', color: '#61dafb' },
          { name: 'Swift', icon: 'fab fa-swift', color: '#f05138' },
          { name: 'Kotlin', icon: 'fab fa-android', color: '#3ddc84' },
          { name: 'Flutter', icon: 'fas fa-mobile-alt', color: '#0175c2' }
        ]
      },
      {
        id: 4,
        title: 'Databases & Cloud',
        technologies: [
          { name: 'PostgreSQL', icon: 'fas fa-database', color: '#336791' },
          { name: 'MongoDB', icon: 'fas fa-database', color: '#4db33d' },
          { name: 'Firebase', icon: 'fas fa-fire', color: '#ffca28' },
          { name: 'Supabase', icon: 'fas fa-database', color: '#3ECF8E' },
          { name: 'AWS', icon: 'fab fa-aws', color: '#ff9900' },
          { name: 'Docker', icon: 'fab fa-docker', color: '#0db7ed' }
        ]
      }
    ];

    return {
      techCategories
    };
  }
});
</script>

<style scoped>
/* Styles are imported from main.css */
</style> 