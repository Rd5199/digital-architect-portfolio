<template>
  <div class="parallax-scroll" ref="parallaxContainer"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

export default defineComponent({
  name: 'ParallaxScroll',
  props: {
    count: {
      type: Number,
      default: 50
    },
    depth: {
      type: Number,
      default: 50
    },
    color1: {
      type: String,
      default: '#3498db'
    },
    color2: {
      type: String,
      default: '#e74c3c'
    },
    size: {
      type: Number,
      default: 2
    }
  },
  setup(props) {
    const parallaxContainer = ref<HTMLElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Points;
    let animationFrameId: number;
    let scrollY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const init = () => {
      if (!parallaxContainer.value) return;
      
      // Create scene
      scene = new THREE.Scene();
      
      // Set up camera
      const aspect = parallaxContainer.value.clientWidth / parallaxContainer.value.clientHeight;
      camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
      camera.position.z = 20;
      
      // Set up renderer
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(parallaxContainer.value.clientWidth, parallaxContainer.value.clientHeight);
      renderer.setClearColor(0x000000, 0);
      parallaxContainer.value.appendChild(renderer.domElement);
      
      // Create particles
      createParticles();
      
      // Set up event listeners
      document.addEventListener('mousemove', onMouseMove);
      window.addEventListener('scroll', onScroll);
      window.addEventListener('resize', onWindowResize);
      
      // Start animation loop
      animate();
    };
    
    const createParticles = () => {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const colors = [];
      
      const color1 = new THREE.Color(props.color1);
      const color2 = new THREE.Color(props.color2);
      
      for (let i = 0; i < props.count; i++) {
        // Position
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * props.depth;
        
        vertices.push(x, y, z);
        
        // Color (gradient based on z-position)
        const colorMix = (z + props.depth / 2) / props.depth;
        const color = color1.clone().lerp(color2, colorMix);
        
        colors.push(color.r, color.g, color.b);
      }
      
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      
      const material = new THREE.PointsMaterial({
        size: props.size,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });
      
      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    };
    
    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    
    const onWindowResize = () => {
      if (!parallaxContainer.value) return;
      
      camera.aspect = parallaxContainer.value.clientWidth / parallaxContainer.value.clientHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(parallaxContainer.value.clientWidth, parallaxContainer.value.clientHeight);
    };
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      if (particles) {
        // Rotate based on mouse position
        particles.rotation.x = mouseY * 0.1;
        particles.rotation.y = mouseX * 0.1;
        
        // Shift based on scroll position
        const scrollSpeed = 0.001;
        particles.position.y = -scrollY * scrollSpeed;
        
        // Add some gentle wobble
        particles.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
      }
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    onMounted(() => {
      init();
    });
    
    onBeforeUnmount(() => {
      if (parallaxContainer.value && renderer) {
        parallaxContainer.value.removeChild(renderer.domElement);
      }
      
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onWindowResize);
      
      cancelAnimationFrame(animationFrameId);
      
      // Dispose resources
      if (particles) {
        if (particles.geometry) particles.geometry.dispose();
        if (particles.material) {
          if (Array.isArray(particles.material)) {
            particles.material.forEach(material => material.dispose());
          } else {
            particles.material.dispose();
          }
        }
      }
      
      if (renderer) renderer.dispose();
    });
    
    return {
      parallaxContainer
    };
  }
});
</script>

<style scoped>
.parallax-scroll {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}
</style> 