<template>
  <div id="three-background" ref="threeContainer"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

export default defineComponent({
  name: 'Background3D',
  setup() {
    const threeContainer = ref<HTMLElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Points;
    let connectionLines: THREE.LineSegments | null = null;
    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let animationFrameId: number;
    let scrollPosition = 0;
    let positions: Float32Array;
    let originalPositions: Float32Array;
    let particleCount = 1500; // Increased from 1000

    const init = () => {
      if (!threeContainer.value) return;

      // Create scene
      scene = new THREE.Scene();
      
      // Set up camera
      camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        1, 
        10000
      );
      camera.position.z = 1000;
      
      // Create particles
      const particlesGeometry = new THREE.BufferGeometry();
      positions = new Float32Array(particleCount * 3);
      originalPositions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      const colorPalette = [
        new THREE.Color(0x3498db), // Blue
        new THREE.Color(0x2ecc71), // Green
        new THREE.Color(0x9b59b6), // Purple
        new THREE.Color(0xe74c3c),  // Red
        new THREE.Color(0xf39c12)   // Yellow
      ];
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Position - spread particles in a more interesting 3D cloud
        const radius = 800 + Math.random() * 1200;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i3] = originalPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = originalPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = originalPositions[i3 + 2] = radius * Math.cos(phi);
        
        // Vary particle sizes
        sizes[i] = 2 + Math.random() * 4;
        
        // Color
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      // Particle material with custom shader for better visuals
      const particlesMaterial = new THREE.ShaderMaterial({
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
            
            // Add subtle movement
            vec3 pos = position;
            pos.x += sin(time * 0.2 + position.z * 0.01) * 5.0;
            pos.y += cos(time * 0.2 + position.x * 0.01) * 5.0;
            pos.z += sin(time * 0.2 + position.y * 0.01) * 5.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            // Size attenuation
            gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            // Create a circular particle
            vec2 uv = gl_PointCoord.xy - 0.5;
            float circle = 1.0 - smoothstep(0.4, 0.5, length(uv));
            
            if (circle < 0.1) discard;
            
            gl_FragColor = vec4(vColor, circle);
          }
        `,
        transparent: true,
        vertexColors: true,
        depthWrite: false
      });
      
      particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);
      
      // Create connection lines between close particles
      createConnectionLines();
      
      // Set up renderer
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      threeContainer.value.appendChild(renderer.domElement);
      
      // Set up event listeners
      document.addEventListener('mousemove', onDocumentMouseMove);
      window.addEventListener('scroll', onScroll);
      window.addEventListener('resize', onWindowResize);
      
      // Start animation loop
      animate();
    };
    
    const createConnectionLines = () => {
      // Remove existing lines
      if (connectionLines) {
        scene.remove(connectionLines);
        if (connectionLines.geometry) connectionLines.geometry.dispose();
        if (connectionLines.material && !Array.isArray(connectionLines.material)) {
          connectionLines.material.dispose();
        }
      }
      
      // Connection line material
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        depthWrite: false
      });
      
      // Create geometry for lines - just prepare the buffer
      const lineGeometry = new THREE.BufferGeometry();
      const linePositions = new Float32Array(particleCount * 2 * 3); // Each line connects 2 points with 3 coordinates each
      
      // Initially set all line positions to zero - we'll update them dynamically
      for (let i = 0; i < linePositions.length; i++) {
        linePositions[i] = 0;
      }
      
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
      
      // Create mesh
      connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
      scene.add(connectionLines);
    };
    
    const updateConnections = () => {
      if (!connectionLines || !positions) return;
      
      const positionAttribute = particles.geometry.getAttribute('position');
      const linePositions = connectionLines.geometry.getAttribute('position').array as Float32Array;
      
      let lineIndex = 0;
      const connectionDistance = 200; // Maximum distance to create a connection
      const connectionDistanceSq = connectionDistance * connectionDistance;
      
      // For each particle, find close neighbors
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const px = positionAttribute.array[i3];
        const py = positionAttribute.array[i3 + 1];
        const pz = positionAttribute.array[i3 + 2];
        
        // Check only a subset of particles for connections (performance optimization)
        for (let j = i + 1; j < Math.min(i + 100, particleCount); j++) {
          const j3 = j * 3;
          
          // Calculate distance squared
          const dx = positionAttribute.array[j3] - px;
          const dy = positionAttribute.array[j3 + 1] - py;
          const dz = positionAttribute.array[j3 + 2] - pz;
          const distSq = dx * dx + dy * dy + dz * dz;
          
          // If particles are close enough and we haven't exceeded our line limit
          if (distSq < connectionDistanceSq && lineIndex < linePositions.length - 6) {
            // First point
            linePositions[lineIndex++] = px;
            linePositions[lineIndex++] = py;
            linePositions[lineIndex++] = pz;
            
            // Second point
            linePositions[lineIndex++] = positionAttribute.array[j3];
            linePositions[lineIndex++] = positionAttribute.array[j3 + 1];
            linePositions[lineIndex++] = positionAttribute.array[j3 + 2];
          }
        }
      }
      
      // Clear the remaining line segments
      for (let i = lineIndex; i < linePositions.length; i++) {
        linePositions[i] = 0;
      }
      
      connectionLines.geometry.getAttribute('position').needsUpdate = true;
    };
    
    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 2;
      mouseY = (event.clientY - windowHalfY) * 2;
    };
    
    const onScroll = () => {
      scrollPosition = window.scrollY;
      
      // Pass scroll information to the animation
      if (camera) {
        // Subtle parallax effect - camera follows scroll position
        const targetY = scrollPosition * 0.1;
        camera.position.y = camera.position.y + (targetY - camera.position.y) * 0.05;
        
        // Adjust camera rotation based on scroll position for dynamic effect
        camera.rotation.x = scrollPosition * 0.0001;
      }
    };
    
    const onWindowResize = () => {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Update shader time uniform for particle animation
      if (particles.material instanceof THREE.ShaderMaterial) {
        particles.material.uniforms.time.value = performance.now() * 0.001;
      }
      
      // Create wave-like distortion effect based on mouse position and scroll
      if (particles.geometry.getAttribute('position')) {
        const positionAttribute = particles.geometry.getAttribute('position');
        
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          
          // Calculate distance from mouse 
          const dx = originalPositions[i3] - mouseX;
          const dy = originalPositions[i3 + 1] - mouseY;
          const dz = originalPositions[i3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          // Add wave effect based on mouse position
          const time = performance.now() * 0.001;
          const waveX = Math.sin(time * 0.5 + distance * 0.01) * 20.0;
          const waveY = Math.cos(time * 0.5 + distance * 0.01) * 20.0;
          const waveZ = Math.sin(time * 0.3 + distance * 0.01) * 20.0;
          
          // Enhanced scroll effect - particles create waves based on scroll position
          const scrollFactor = scrollPosition * 0.05;
          const scrollWave = Math.sin(originalPositions[i3 + 2] * 0.01 + scrollFactor) * 15.0;
          
          positions[i3] = originalPositions[i3] + waveX + scrollWave * 0.3;
          // Y position affected more by scrolling for a dramatic effect
          positions[i3 + 1] = originalPositions[i3 + 1] + waveY - (scrollPosition * 0.2) * (originalPositions[i3 + 2] / 2000);
          positions[i3 + 2] = originalPositions[i3 + 2] + waveZ + scrollWave * 0.2;
        }
        
        positionAttribute.needsUpdate = true;
      }
      
      // Update connection lines
      updateConnections();
      
      // Rotate particles based on mouse position
      if (particles) {
        particles.rotation.x += 0.0002;
        particles.rotation.y += 0.0003;
        
        // Apply mouse movement influence
        particles.rotation.x += (mouseY * 0.00003 - particles.rotation.x) * 0.05;
        particles.rotation.y += (mouseX * 0.00003 - particles.rotation.y) * 0.05;
      }
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    onMounted(() => {
      init();
    });
    
    onBeforeUnmount(() => {
      if (threeContainer.value && renderer) {
        threeContainer.value.removeChild(renderer.domElement);
      }
      
      document.removeEventListener('mousemove', onDocumentMouseMove);
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
      
      if (connectionLines) {
        if (connectionLines.geometry) connectionLines.geometry.dispose();
        if (connectionLines.material && !Array.isArray(connectionLines.material)) {
          connectionLines.material.dispose();
        }
      }
      
      if (renderer) renderer.dispose();
    });
    
    return {
      threeContainer
    };
  }
});
</script>

<style scoped>
#three-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -2;
  pointer-events: none;
  overflow: hidden;
}
</style> 