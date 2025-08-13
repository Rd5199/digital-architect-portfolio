<template>
  <section id="showcase3d" class="dev-section dev-section-dark">
    <ParallaxScroll 
      :count="120"
      :depth="80"
      color1="#9b59b6"
      color2="#e74c3c"
      :size="2"
    />
    <div class="dev-container">
      <h2 class="dev-section-title">3D Models Showcase</h2>
      <p class="dev-section-subtitle">Explore my 3D modeling skills with these interactive examples.</p>
      
      <div class="showcase-grid">
        <div class="showcase-models">
          <ModelViewer />
        </div>
        
        <div class="showcase-info">
          <h3>About These Models</h3>
          <p>This collection showcases various 3D models created for different projects. These models demonstrate
             my ability to work with 3D graphics, model optimization, and interactive visualization techniques.</p>
          
          <div class="model-info-blocks">
            <div class="info-block">
              <i class="fas fa-cube"></i>
              <h4>Technical Details</h4>
              <ul>
                <li>Created using Blender and Three.js</li>
                <li>Low-poly models optimized for web</li>
                <li>Interactive 360° viewing</li>
                <li>Glb/gltf format for web compatibility</li>
              </ul>
            </div>
            
            <div class="info-block">
              <i class="fas fa-code-branch"></i>
              <h4>Implementation</h4>
              <ul>
                <li>Integrated using Three.js</li>
                <li>Responsive viewport</li>
                <li>Custom lighting setups</li>
                <li>Smooth animations and transitions</li>
              </ul>
            </div>
          </div>
          
          <div class="model-applications">
            <h4>Applications</h4>
            <p>These 3D models can be used in various applications such as:</p>
            <div class="applications-grid">
              <div class="application-card">
                <i class="fas fa-vr-cardboard"></i>
                <span>Virtual Reality</span>
              </div>
              <div class="application-card">
                <i class="fas fa-mobile-alt"></i>
                <span>Mobile Apps</span>
              </div>
              <div class="application-card">
                <i class="fas fa-gamepad"></i>
                <span>Gaming</span>
              </div>
              <div class="application-card">
                <i class="fas fa-globe"></i>
                <span>Web Experiences</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModelViewer from './ModelViewer.vue';
import ParallaxScroll from './ParallaxScroll.vue';

export default defineComponent({
  name: 'Showcase3D',
  components: {
    ModelViewer,
    ParallaxScroll
  }
});
</script>

<style scoped>
.dev-section-dark {
  background-color: #0c0c14;
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

.showcase-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

@media (min-width: 768px) {
  .showcase-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.showcase-models {
  background: rgba(15, 15, 25, 0.5);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.showcase-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.showcase-info h3 {
  font-size: 1.8rem;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.showcase-info p {
  color: #a0a0a0;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.model-info-blocks {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 992px) {
  .model-info-blocks {
    grid-template-columns: 1fr 1fr;
  }
}

.info-block {
  background: rgba(20, 20, 30, 0.5);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.info-block i {
  font-size: 2rem;
  color: #3498db;
  margin-bottom: 1rem;
  display: block;
}

.info-block h4 {
  font-size: 1.2rem;
  color: #ffffff;
  margin-bottom: 1rem;
}

.info-block ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-block ul li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  color: #a0a0a0;
}

.info-block ul li:before {
  content: '→';
  position: absolute;
  left: 0;
  color: #3498db;
}

.model-applications {
  margin-top: 1rem;
}

.model-applications h4 {
  font-size: 1.4rem;
  color: #ffffff;
  margin-bottom: 1rem;
}

.applications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.application-card {
  background: rgba(30, 30, 45, 0.5);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
}

.application-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  background: rgba(40, 40, 60, 0.5);
}

.application-card i {
  font-size: 1.8rem;
  color: #3498db;
  margin-bottom: 0.5rem;
  display: block;
}

.application-card span {
  font-size: 0.9rem;
  color: #a0a0a0;
}
</style> 