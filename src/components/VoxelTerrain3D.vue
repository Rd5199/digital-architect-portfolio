<template>
  <div id="voxel-terrain-background" ref="backgroundContainer"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import type { PropType } from 'vue';
import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';
import AnimationManager from '../utils/AnimationManager';

export default defineComponent({
  name: 'VoxelTerrain3D',
  props: {
    resolution: {
      type: Number,
      default: 48 // Resolution of the voxel grid
    },
    terrainColors: {
      type: Array as PropType<string[]>,
      default: () => [
        '#2980b9', // Water
        '#27ae60', // Land
        '#f1c40f', // Sand
        '#e74c3c', // Mountain
        '#9b59b6'  // Peak
      ]
    },
    backgroundColor: {
      type: String,
      default: '#1a1a2e' // Dark blue-purple
    },
    animated: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const backgroundContainer = ref<HTMLElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let terrain: THREE.Group;
    let noise: SimplexNoise;
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
      scene.fog = new THREE.FogExp2(props.backgroundColor, 0.002);
      
      // Setup camera
      camera = new THREE.PerspectiveCamera(
        60, 
        window.innerWidth / window.innerHeight, 
        1, 
        2000
      );
      camera.position.set(300, 200, 300); // Position camera above and to the side
      camera.lookAt(0, 0, 0);
      
      // Initialize clock for animation timing
      clock = new THREE.Clock();
      
      // Create noise generator
      noise = new SimplexNoise();
      
      // Create terrain
      createTerrain();
      
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
      
      // Start animation
      AnimationManager.addAnimation(animate, 0);
      
      console.log("Voxel terrain background initialized");
    };
    
    const createTerrain = () => {
      // Create a group to hold all voxels
      terrain = new THREE.Group();
      
      // Create color array from props
      const colorPalette = props.terrainColors.map(color => new THREE.Color(color));
      
      // Set dimensions
      const size = props.resolution;
      const halfSize = size / 2;
      
      // Create voxel geometry (shared by all voxels)
      const voxelGeometry = new THREE.BoxGeometry(1, 1, 1);
      
      // Create voxels based on noise function
      for (let x = 0; x < size; x++) {
        for (let z = 0; z < size; z++) {
          // Calculate normalized position
          const nx = x / size - 0.5;
          const nz = z / size - 0.5;
          
          // Generate terrain height using simplex noise
          let height = Math.floor(
            (noise.noise(nx * 3, nz * 3) * 0.5 + 0.5) * 16 + 4
          );
          
          // Create voxel columns
          for (let y = 0; y < height; y++) {
            // Calculate color index based on height
            const heightPercent = y / 16;
            let colorIndex = 0;
            
            if (heightPercent < 0.2) colorIndex = 0; // Water
            else if (heightPercent < 0.4) colorIndex = 1; // Land
            else if (heightPercent < 0.6) colorIndex = 2; // Sand
            else if (heightPercent < 0.8) colorIndex = 3; // Mountain
            else colorIndex = 4; // Peak
            
            // Create voxel material with color from palette
            const material = new THREE.MeshLambertMaterial({ 
              color: colorPalette[colorIndex],
              flatShading: true
            });
            
            // Create voxel mesh
            const voxel = new THREE.Mesh(voxelGeometry, material);
            
            // Position voxel in the terrain
            voxel.position.set(
              x - halfSize,
              y - 8, // Offset to center terrain vertically
              z - halfSize
            );
            
            // Add voxel to terrain group
            terrain.add(voxel);
          }
        }
      }
      
      // Add terrain to scene
      scene.add(terrain);
      
      // Add directional light for shading
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // Add ambient light for base illumination
      const ambientLight = new THREE.AmbientLight(0x444444);
      scene.add(ambientLight);
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
      const time = clock.getElapsedTime() * 0.5;
      
      if (terrain && props.animated) {
        // Rotate terrain slowly
        terrain.rotation.y = time * 0.1;
        
        // Move camera based on mouse
        const targetX = mouseX * 0.5;
        const targetY = mouseY * 0.5;
        
        camera.position.x = 300 * Math.cos(targetX * 0.01 + time * 0.1);
        camera.position.z = 300 * Math.sin(targetX * 0.01 + time * 0.1);
        camera.position.y = 200 + targetY;
        
        camera.lookAt(0, 0, 0);
      }
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    onMounted(() => {
      init();
    });
    
    onBeforeUnmount(() => {
      // Remove event listeners
      document.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('resize', onWindowResize);
      
      // Remove animation
      AnimationManager.removeAnimation(animate);
      
      // Clean up THREE.js resources
      if (terrain) {
        terrain.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
      
      if (renderer) {
        if (backgroundContainer.value && renderer.domElement.parentElement === backgroundContainer.value) {
          backgroundContainer.value.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      
      console.log("Voxel terrain background cleaned up");
    });
    
    return {
      backgroundContainer
    };
  }
});
</script>

<style scoped>
#voxel-terrain-background {
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