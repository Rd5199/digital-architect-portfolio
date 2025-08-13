<template>
  <div id="particle-wave-background" ref="backgroundContainer"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import type { PropType } from 'vue';
import * as THREE from 'three';
import AnimationManager from '../utils/AnimationManager';

export default defineComponent({
  name: 'ParticleWaveBackground3D',
  props: {
    particleCount: {
      type: Number,
      default: 5000
    },
    particleColors: {
      type: Array as PropType<string[]>,
      default: () => [
        '#3498db', // Blue
        '#2ecc71', // Green
        '#9b59b6', // Purple
        '#e74c3c', // Red
        '#f39c12'  // Yellow
      ]
    },
    waveAmplitude: {
      type: Number,
      default: 4
    },
    waveSpeed: {
      type: Number,
      default: 0.5
    },
    backgroundColor: {
      type: String,
      default: '#0a0a24' // Dark blue
    }
  },
  setup(props) {
    const backgroundContainer = ref<HTMLElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Points;
    let particlePositions: Float32Array;
    let clock: THREE.Clock;
    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const init = () => {
      if (!backgroundContainer.value) return;
      
      // Setup scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(props.backgroundColor);
      
      // Setup camera
      camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        1, 
        10000
      );
      camera.position.z = 1000;

      // Initialize clock for animation timing
      clock = new THREE.Clock();
      
      // Create particles
      createParticles();
      
      // Setup renderer
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Add renderer's canvas to DOM
      backgroundContainer.value.appendChild(renderer.domElement);
      
      // Add event listeners
      document.addEventListener('mousemove', onDocumentMouseMove);
      window.addEventListener('resize', onWindowResize);
      
      // Start animation using AnimationManager
      AnimationManager.addAnimation(animate, 0);
      
      console.log("Particle wave background initialized");
    };
    
    const createParticles = () => {
      // Create geometry for particles
      const geometry = new THREE.BufferGeometry();
      particlePositions = new Float32Array(props.particleCount * 3);
      const colors = new Float32Array(props.particleCount * 3);
      const sizes = new Float32Array(props.particleCount);

      // Create array of THREE.Color objects from props.particleColors
      const colorPalette = props.particleColors.map(color => new THREE.Color(color));
      
      // Generate particles in a grid formation
      const width = 60;
      const height = 60;
      const depth = 60;
      const stepX = 120 / width;
      const stepY = 120 / height;
      const stepZ = 120 / depth;
      
      let p = 0;
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          for (let k = 0; k < depth; k++) {
            if (p < props.particleCount) {
              const x = (i - width/2) * stepX;
              const y = (j - height/2) * stepY;
              const z = (k - depth/2) * stepZ;
              
              particlePositions[p*3] = x;
              particlePositions[p*3 + 1] = y;
              particlePositions[p*3 + 2] = z;
              
              // Random particle sizes
              sizes[p] = 0.5 + Math.random() * 2.5;
              
              // Assign random color from palette
              const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
              colors[p*3] = color.r;
              colors[p*3 + 1] = color.g;
              colors[p*3 + 2] = color.b;
              
              p++;
            }
          }
        }
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      // Custom shader material for better particle rendering
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pixelRatio: { value: window.devicePixelRatio }
        },
        vertexShader: `
          attribute float size;
          varying vec3 vColor;
          uniform float time;
          uniform float pixelRatio;
          
          void main() {
            vColor = color;
            
            // Pulsating effect
            float pulse = 1.0 + 0.2 * sin(time * 3.0 + position.x * 0.3 + position.z * 0.2);
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            gl_PointSize = size * pulse * pixelRatio * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            // Create a circular gradient particle
            vec2 center = gl_PointCoord - 0.5;
            float dist = length(center);
            float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
            
            if (alpha < 0.05) discard;
            
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        vertexColors: true,
        depthWrite: false
      });
      
      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    };
    
    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.05;
      mouseY = (event.clientY - windowHalfY) * 0.05;
    };
    
    const onWindowResize = () => {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    const animate = () => {
      const time = clock.getElapsedTime();
      
      // Update shader time uniform for effects
      if (particles && particles.material instanceof THREE.ShaderMaterial) {
        particles.material.uniforms.time.value = time;
      }
      
      // Add wave animation to particles
      if (particles && particles.geometry.attributes.position) {
        const positions = particles.geometry.attributes.position.array as Float32Array;
        
        for (let i = 0; i < props.particleCount; i++) {
          const i3 = i * 3;
          const x = particlePositions[i3];
          const y = particlePositions[i3 + 1];
          const z = particlePositions[i3 + 2];
          
          // Create wave motion
          positions[i3 + 1] = y + Math.sin(time * props.waveSpeed + x * 0.05 + z * 0.05) * props.waveAmplitude;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
      }
      
      // Rotate the entire particle system slightly based on mouse position
      if (particles) {
        particles.rotation.x += (mouseY * 0.0003 - particles.rotation.x) * 0.05;
        particles.rotation.y += (mouseX * 0.0003 - particles.rotation.y) * 0.05;
      }
      
      // Render the scene
      renderer.render(scene, camera);
    };
    
    onMounted(() => {
      init();
    });
    
    onBeforeUnmount(() => {
      // Remove event listeners
      document.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('resize', onWindowResize);
      
      // Remove animation from AnimationManager
      AnimationManager.removeAnimation(animate);
      
      // Clean up THREE.js resources
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
      
      if (renderer) {
        if (backgroundContainer.value && renderer.domElement.parentElement === backgroundContainer.value) {
          backgroundContainer.value.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      
      console.log("Particle wave background cleaned up");
    });
    
    return {
      backgroundContainer
    };
  }
});
</script>

<style scoped>
#particle-wave-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -10;
  pointer-events: none;
  overflow: hidden;
}
</style> 