<template>
  <div class="dev-portfolio-item">
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

export default defineComponent({
  name: 'ProjectCard',
  props: {
    project: {
      type: Object as PropType<Project>,
      required: true
    }
  }
});
</script>

<style scoped>
/* Styles are imported from main.css */
</style> 