<template>
  <div id="interactive-particles" ref="particlesContainer"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

export default defineComponent({
  name: 'InteractiveParticles',
  props: {
    particleCount: {
      type: Number,
      default: 2000
    },
    particleSize: {
      type: Number,
      default: 5
    },
    particleColor: {
      type: String,
      default: '#ffffff'
    },
    interactionRadius: {
      type: Number,
      default: 100
    },
    repelStrength: {
      type: Number,
      default: 20
    }
  },
  setup(props) {
    const particlesContainer = ref<HTMLElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Points;
    let raycaster: THREE.Raycaster;
    let mouse = new THREE.Vector2();
    let animationFrameId: number;
    
    // Original positions of particles
    let originalPositions: Float32Array;
    // Current positions of particles
    let positions: Float32Array;
    // Velocities of particles
    let velocities: Float32Array;
    
    const init = () => {
      if (!particlesContainer.value) return;
      
      console.log('Initializing InteractiveParticles');
      
      // Create scene
      scene = new THREE.Scene();
      
      // Set up camera
      const aspect = window.innerWidth / window.innerHeight;
      camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 2000);
      camera.position.z = 800;
      
      // Set up renderer
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      particlesContainer.value.appendChild(renderer.domElement);
      
      // Set up raycaster for mouse interaction
      raycaster = new THREE.Raycaster();
      
      // Create particles
      createParticles();
      
      // Set up event listeners
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchstart', onTouchStart, { passive: false });
      window.addEventListener('resize', onWindowResize);
      window.addEventListener('scroll', onScroll);
      
      // Start animation loop
      animate();
      
      console.log('InteractiveParticles initialization complete');
    };
    
    // Track scroll position to adjust particles
    let scrollPosition = 0;
    
    const onScroll = () => {
      scrollPosition = window.scrollY;
    };
    
    const createParticles = () => {
      const geometry = new THREE.BufferGeometry();
      
      // Create positions, original positions, and velocities arrays
      positions = new Float32Array(props.particleCount * 3);
      originalPositions = new Float32Array(props.particleCount * 3);
      velocities = new Float32Array(props.particleCount * 3);
      
      // Create colors array for varied particle colors
      const colors = new Float32Array(props.particleCount * 3);
      
      // Color palette derived from the main color
      const baseColor = new THREE.Color(props.particleColor);
      const colorVariation = 0.3; // Amount of color variation
      
      for (let i = 0; i < props.particleCount; i++) {
        const i3 = i * 3;
        
        // Random positions in a spherical volume
        const radius = Math.random() * 400 + 200;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i3] = originalPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = originalPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = originalPositions[i3 + 2] = radius * Math.cos(phi);
        
        // Initialize velocities to 0
        velocities[i3] = 0;
        velocities[i3 + 1] = 0;
        velocities[i3 + 2] = 0;
        
        // Varied colors based on the main color
        const colorVar = new THREE.Color(baseColor);
        colorVar.r += (Math.random() * 2 - 1) * colorVariation;
        colorVar.g += (Math.random() * 2 - 1) * colorVariation;
        colorVar.b += (Math.random() * 2 - 1) * colorVariation;
        
        colors[i3] = colorVar.r;
        colors[i3 + 1] = colorVar.g;
        colors[i3 + 2] = colorVar.b;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      // Create material with custom vertex and fragment shaders for better visuals
      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          size: { value: props.particleSize },
          pixelRatio: { value: window.devicePixelRatio }
        },
        vertexShader: `
          precision highp float;
          // Note: 'color' is already defined by THREE.js, so we don't redefine it
          varying vec3 vColor;
          uniform float size;
          uniform float pixelRatio;
          
          void main() {
            // Use the built-in color attribute
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec3 vColor;
          
          void main() {
            // Create a circular particle with soft edges
            vec2 uv = gl_PointCoord.xy - 0.5;
            float dist = length(uv);
            float circle = 1.0 - smoothstep(0.4, 0.5, dist);
            
            if (circle < 0.1) discard;
            
            gl_FragColor = vec4(vColor, circle);
          }
        `,
        transparent: true,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      
      particles = new THREE.Points(geometry, particleMaterial);
      scene.add(particles);
    };
    
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      
      // Update mouse position for raycaster (-1 to +1 for both components)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      
      // Update mouse position for raycaster based on touch
      if (event.touches.length > 0) {
        mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };
    
    const onTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      
      // Update mouse position for raycaster based on initial touch
      if (event.touches.length > 0) {
        mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };
    
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Update particle positions based on mouse interaction
      updateParticles();
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    const updateParticles = () => {
      // Update raycaster from the camera's perspective
      raycaster.setFromCamera(mouse, camera);
      
      // Calculate intersection with a virtual plane
      const planeNormal = new THREE.Vector3(0, 0, 1);
      const planeConstant = 0;
      const plane = new THREE.Plane(planeNormal, planeConstant);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      
      // Update camera position based on scroll
      if (camera) {
        // Subtle parallax effect - camera follows scroll position
        const targetY = scrollPosition * 0.05;
        camera.position.y = camera.position.y + (targetY - camera.position.y) * 0.02;
      }
      
      // Update each particle
      for (let i = 0; i < props.particleCount; i++) {
        const i3 = i * 3;
        
        // Get current position of the particle
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        
        // Calculate distance from particle to mouse intersection
        const dx = x - intersection.x;
        const dy = y - intersection.y;
        const dz = z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Update velocity based on mouse proximity
        if (distance < props.interactionRadius) {
          // Calculate repulsion force
          const force = (props.repelStrength / Math.max(1, distance));
          
          // Apply force to velocity
          velocities[i3] += (dx / distance) * force;
          velocities[i3 + 1] += (dy / distance) * force;
          velocities[i3 + 2] += (dz / distance) * force * 0.5; // Less force in Z direction
        }
        
        // Apply velocity to position
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];
        
        // Apply damping to velocity
        velocities[i3] *= 0.95;
        velocities[i3 + 1] *= 0.95;
        velocities[i3 + 2] *= 0.95;
        
        // Add scroll effect to particle return behavior
        const scrollFactor = scrollPosition * 0.01;
        const originalY = originalPositions[i3 + 1] - scrollFactor * (originalPositions[i3 + 2] / 500);
        
        // Spring force to return to original position (modified by scroll)
        const springFactor = 0.01;
        velocities[i3] += (originalPositions[i3] - positions[i3]) * springFactor;
        velocities[i3 + 1] += (originalY - positions[i3 + 1]) * springFactor;
        velocities[i3 + 2] += (originalPositions[i3 + 2] - positions[i3 + 2]) * springFactor;
      }
      
      // Update the geometry attribute
      particles.geometry.attributes.position.needsUpdate = true;
      
      // Add gentle rotation to the entire particle system
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;
    };
    
    onMounted(() => {
      // Wait a bit for the DOM to be fully ready
      setTimeout(init, 100);
    });
    
    onBeforeUnmount(() => {
      if (particlesContainer.value && renderer) {
        particlesContainer.value.removeChild(renderer.domElement);
      }
      
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('scroll', onScroll);
      
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
      particlesContainer
    };
  }
});
</script>

<style scoped>
#interactive-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}
</style> 