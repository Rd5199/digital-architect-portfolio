<template>
  <div class="not-found">
    <div class="not-found-container">
      <h1 class="not-found-title">404</h1>
      <h2 class="not-found-subtitle">Page Not Found</h2>
      <p class="not-found-message">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <router-link to="/" class="not-found-button">Return to Home</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NotFound'
});
</script>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1a1a2e;
  color: #fff;
  text-align: center;
}

.not-found-container {
  max-width: 600px;
  padding: 2rem;
}

.not-found-title {
  font-size: 8rem;
  margin: 0;
  color: #ff6b6b;
  font-weight: 900;
  text-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
}

.not-found-subtitle {
  font-size: 2.5rem;
  margin: 0;
  margin-bottom: 1rem;
}

.not-found-message {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #ccc;
}

.not-found-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #4361ee;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
}

.not-found-button:hover {
  background-color: #3a56d4;
  transform: translateY(-3px);
}
</style> 