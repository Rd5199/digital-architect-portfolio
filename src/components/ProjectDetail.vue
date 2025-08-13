<template>
  <div class="project-detail">
    <div class="dev-container">
      <router-link to="/#portfolio" class="back-link">
        <i class="fas fa-arrow-left"></i> Back to projects
      </router-link>
      
      <div v-if="project" class="project-content">
        <h1 class="project-title">{{ project.title }}</h1>
        <span class="project-type">{{ project.type }}</span>
        
        <div class="project-tags">
          <span v-for="tag in project.tags" :key="tag" class="dev-tag">{{ tag }}</span>
        </div>
        
        <div class="project-image-main">
          <img v-if="!project.animation3d" :src="project.image" :alt="project.title">
          <div v-else class="animation-wrapper">
            <component :is="getAnimationComponent(project.id)" />
          </div>
        </div>
        
        <div class="project-info">
          <div class="project-description">
            <h2>Project Overview</h2>
            <p>{{ project.description }}</p>
            
            <h2>Challenge</h2>
            <p>{{ project.challenge }}</p>
            
            <h2>Solution</h2>
            <p>{{ project.solution }}</p>
          </div>
          
          <div class="project-details">
            <div class="project-detail-item">
              <h3>Duration</h3>
              <p>{{ project.duration }}</p>
            </div>
            
            <div class="project-detail-item">
              <h3>Technologies</h3>
              <ul>
                <li v-for="tech in project.technologies" :key="tech">{{ tech }}</li>
              </ul>
            </div>
            
            <div class="project-detail-item" v-if="project.liveUrl">
              <h3>Live Project</h3>
              <router-link :to="getFirstMiniProjectRoute()" class="dev-btn dev-btn-primary">
                View Demo
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="project-not-found">
        <h1>Project Not Found</h1>
        <p>Sorry, the project you're looking for doesn't exist or has been moved.</p>
        <router-link to="/#portfolio" class="dev-btn dev-btn-primary">Go to Portfolio</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import { projectsData } from '../data/projects';
import EcommerceAnimation from './animations/EcommerceAnimation.vue';
import WellnessAnimation from './animations/WellnessAnimation.vue';
import SaasAnimation from './animations/SaasAnimation.vue';
import SavourSocietiesAnimation from './animations/SavourSocietiesAnimation.vue';
import NonLeagueAnimation from './animations/NonLeagueAnimation.vue';

export default defineComponent({
  name: 'ProjectDetail',
  components: {
    EcommerceAnimation,
    WellnessAnimation,
    SaasAnimation,
    SavourSocietiesAnimation,
    NonLeagueAnimation
  },
  setup() {
    const route = useRoute();
    const projectId = computed(() => Number(route.params.id));
    
    const project = computed(() => {
      return projectsData.find(p => p.id === projectId.value);
    });
    
    const getAnimationComponent = (id: number) => {
      switch (id) {
        case 1:
          return 'EcommerceAnimation';
        case 2:
          return 'WellnessAnimation';
        case 3:
          return 'SaasAnimation';
        case 4:
          return 'SavourSocietiesAnimation';
        case 5:
          return 'NonLeagueAnimation';
        default:
          return null;
      }
    };
    
    const getFirstMiniProjectRoute = () => {
      if (project.value && project.value.miniProjects && project.value.miniProjects.length > 0) {
        return project.value.miniProjects[0].route;
      }
      return '/';
    };
    
    return {
      project,
      getAnimationComponent,
      getFirstMiniProjectRoute
    };
  }
});
</script>

<style scoped>
.project-detail {
  padding: 80px 0;
  background-color: var(--bg-color);
  min-height: 100vh;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: var(--text-color);
  margin-bottom: 30px;
  font-weight: 500;
  transition: color 0.3s;
}

.back-link:hover {
  color: var(--primary-color);
}

.back-link i {
  margin-right: 8px;
}

.project-title {
  font-size: 3rem;
  margin-bottom: 10px;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.project-type {
  display: block;
  font-size: 1.2rem;
  color: var(--accent-color);
  margin-bottom: 15px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.project-image-main {
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 40px;
}

.project-image-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-info {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 50px;
  margin-bottom: 60px;
}

.project-description h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: var(--heading-color);
}

.project-description p {
  margin-bottom: 30px;
  line-height: 1.7;
}

.project-details {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 30px;
}

.project-detail-item {
  margin-bottom: 25px;
}

.project-detail-item:last-child {
  margin-bottom: 0;
}

.project-detail-item h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: var(--heading-color);
}

.project-detail-item ul {
  list-style: none;
  padding: 0;
}

.project-detail-item li {
  margin-bottom: 5px;
  position: relative;
  padding-left: 15px;
}

.project-detail-item li:before {
  content: "";
  position: absolute;
  left: 0;
  top: 10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary-color);
}

.project-not-found {
  text-align: center;
  padding: 100px 0;
}

@media (max-width: 768px) {
  .project-info {
    grid-template-columns: 1fr;
  }
  
  .project-image-main {
    height: 300px;
  }
}

.animation-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
}
</style> 