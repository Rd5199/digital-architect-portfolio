<template>
  <div class="project-detail">
    <div class="dev-container">
      <div v-if="project" class="project-content">
        <h1 class="project-title">{{ project.title }}</h1>
        <span class="project-type">{{ project.type }}</span>
        
        <div class="project-tags">
          <span v-for="tag in project.tags" :key="tag" class="dev-tag">{{ tag }}</span>
        </div>
        
        <div class="project-demo-main">
          <component :is="getDemoComponent(project.id)" v-if="getDemoComponent(project.id)" />
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
import EcommercePlatform from './mini-projects/EcommercePlatform.vue';
import WellnessSuite from './mini-projects/WellnessSuite.vue';
import SaasDashboard from './mini-projects/SaasDashboard.vue';
import SavourSocieties from './mini-projects/SavourSocieties.vue';
import NonLeagueNetwork from './mini-projects/NonLeagueNetwork.vue';
import TheraMate from './mini-projects/TheraMate.vue';

export default defineComponent({
  name: 'ProjectDetail',
  components: {
    EcommercePlatform,
    WellnessSuite,
    SaasDashboard,
    SavourSocieties,
    NonLeagueNetwork,
    TheraMate
  },
  setup() {
    const route = useRoute();
    const projectId = computed(() => Number(route.params.id));
    
    const project = computed(() => {
      return projectsData.find(p => p.id === projectId.value);
    });
    
    const getDemoComponent = (id: number) => {
      switch (id) {
        case 1:
          return 'EcommercePlatform';
        case 2:
          return 'WellnessSuite';
        case 3:
          return 'SaasDashboard';
        case 4:
          return 'SavourSocieties';
        case 5:
          return 'NonLeagueNetwork';
        case 6:
          return 'TheraMate';
        default:
          return null;
      }
    };
    
    return {
      project,
      getDemoComponent
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

.project-demo-main {
  width: 100%;
  min-height: 500px;
  border-radius: 10px;
  margin: 60px 0;
  padding: 40px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.3s ease-in-out;
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
  .project-detail {
    padding-top: var(--spacing-md);
  }
  
  .project-title {
    font-size: 1.75rem;
    line-height: 1.3;
    margin-bottom: 0.5rem;
  }
  
  .project-type {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
  
  .project-tags {
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-md);
  }
  
  .dev-tag {
    font-size: 0.85rem;
    padding: 0.4rem 0.75rem;
  }
  
  .project-demo-main {
    min-height: 400px;
    padding: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }
  
  .project-info {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .project-description h2 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-sm);
    margin-top: var(--spacing-md);
  }
  
  .project-description p {
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: var(--spacing-sm);
  }
  
  .project-details {
    gap: var(--spacing-sm);
  }
  
  .project-detail-item {
    padding: var(--spacing-sm);
  }
  
  .project-detail-item h3 {
    font-size: 1.1rem;
    margin-bottom: var(--spacing-xs);
  }
  
  .project-detail-item p,
  .project-detail-item li {
    font-size: 0.9rem;
    line-height: 1.5;
  }
}

@media (max-width: 576px) {
  .project-title {
    font-size: 1.5rem;
  }
  
  .project-demo-main {
    min-height: 350px;
    padding: var(--spacing-xs);
  }
  
  .project-description h2 {
    font-size: 1.3rem;
  }
  
  .project-description p {
    font-size: 0.9rem;
  }
  
  .project-detail-item h3 {
    font-size: 1rem;
  }
}
</style> 