<template>
  <div class="dev-portfolio-item">
    <div class="dev-portfolio-image">
      <img v-if="!project.animation3d" :src="project.image" :alt="project.title">
      <div v-else class="animation-wrapper">
        <component :is="getAnimationComponent(project.id)" />
      </div>
    </div>
    <div class="dev-portfolio-content">
      <h3>{{ project.title }}</h3>
      <span class="dev-portfolio-type">{{ project.type }}</span>
      <div class="dev-portfolio-tags">
        <span v-for="tag in project.tags" :key="tag" class="dev-tag">{{ tag }}</span>
      </div>
      <router-link :to="`/project/${project.id}`" class="dev-btn dev-btn-outline">View Project</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { Project } from '../data/projects';
import EcommerceAnimation from './animations/EcommerceAnimation.vue';
import WellnessAnimation from './animations/WellnessAnimation.vue';
import SaasAnimation from './animations/SaasAnimation.vue';
import SavourSocietiesAnimation from './animations/SavourSocietiesAnimation.vue';
import NonLeagueAnimation from './animations/NonLeagueAnimation.vue';

export default defineComponent({
  name: 'ProjectCard',
  components: {
    EcommerceAnimation,
    WellnessAnimation,
    SaasAnimation,
    SavourSocietiesAnimation,
    NonLeagueAnimation
  },
  props: {
    project: {
      type: Object as PropType<Project>,
      required: true
    }
  },
  setup() {
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
    
    return {
      getAnimationComponent
    };
  }
});
</script>

<style scoped>
.animation-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
}
</style> 