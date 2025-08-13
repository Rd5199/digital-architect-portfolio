<template>
  <div class="wave-surface" ref="waveContainer"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

export default defineComponent({
  name: 'WaveSurface',
  props: {
    color: {
      type: String,
      default: '#3498db'
    },
    height: {
      type: Number,
      default: 200
    }
  },
  setup(props) {
    const waveContainer = ref<HTMLElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let waveMesh: THREE.Mesh;
    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let time = 0;
    let waveGeometry: THREE.PlaneGeometry;

    const init = () => {
      if (!waveContainer.value) return;
      
      // Set container height
      waveContainer.value.style.height = `${props.height}px`;
      
      // Create scene
      scene = new THREE.Scene();
      
      // Set up camera
      const aspect = waveContainer.value.clientWidth / waveContainer.value.clientHeight;
      camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
      camera.position.z = 50;
      
      // Set up renderer
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(waveContainer.value.clientWidth, waveContainer.value.clientHeight);
      renderer.setClearColor(0x000000, 0);
      waveContainer.value.appendChild(renderer.domElement);
      
      // Create wave geometry
      const width = 100;
      const segments = 128;
      waveGeometry = new THREE.PlaneGeometry(width, width / aspect, segments, segments);
      
      // Create wave material
      const waveMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(props.color),
        wireframe: true,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      
      // Create wave mesh
      waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
      waveMesh.rotation.x = -Math.PI / 3;
      scene.add(waveMesh);
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const pointLight1 = new THREE.PointLight(0x3498db, 2, 100);
      pointLight1.position.set(0, 10, 40);
      scene.add(pointLight1);
      
      const pointLight2 = new THREE.PointLight(0x9b59b6, 2, 100);
      pointLight2.position.set(20, -10, 40);
      scene.add(pointLight2);
      
      // Set up event listeners
      document.addEventListener('mousemove', onMouseMove);
      window.addEventListener('resize', onWindowResize);
      
      // Start animation loop
      animate();
    };
    
    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    const onWindowResize = () => {
      if (!waveContainer.value) return;
      
      camera.aspect = waveContainer.value.clientWidth / waveContainer.value.clientHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(waveContainer.value.clientWidth, waveContainer.value.clientHeight);
    };
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Increment time
      time += 0.01;
      
      // Update wave geometry
      const positions = waveGeometry.attributes.position.array as Float32Array;
      const count = positions.length / 3;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        
        // Calculate wave height based on position and time
        const waveHeight = 
          Math.sin(x / 5 + time) * 
          Math.cos(y / 5 + time) * 2 + 
          Math.sin(x / 10 + mouseX * 5) * 
          Math.cos(y / 10 + mouseY * 5) * 3;
        
        positions[i3 + 2] = waveHeight;
      }
      
      waveGeometry.attributes.position.needsUpdate = true;
      waveGeometry.computeVertexNormals();
      
      // Rotate wave
      waveMesh.rotation.z = time * 0.1;
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    onMounted(() => {
      init();
    });
    
    onBeforeUnmount(() => {
      if (waveContainer.value && renderer) {
        waveContainer.value.removeChild(renderer.domElement);
      }
      
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onWindowResize);
      
      cancelAnimationFrame(animationFrameId);
      
      // Dispose resources
      if (waveGeometry) waveGeometry.dispose();
      
      if (waveMesh) {
        if (waveMesh.material) {
          if (Array.isArray(waveMesh.material)) {
            waveMesh.material.forEach(material => material.dispose());
          } else {
            waveMesh.material.dispose();
          }
        }
      }
      
      if (renderer) renderer.dispose();
    });
    
    return {
      waveContainer
    };
  }
});
</script>

<style scoped>
.wave-surface {
  width: 100%;
  overflow: hidden;
}
</style> 