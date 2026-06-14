<template>
  <div class="models-page">
    <div class="grain-layer models-page__grain" aria-hidden="true" />

    <main class="models-page__main">
      <div class="models-showcase-container">
        <header class="models-hero">
          <p class="models-hero__kicker">3D Models</p>
          <h1 class="models-hero__title">Interactive showcase</h1>
          <p class="models-hero__lead">
            Web-ready 3D assets and real-time viewers — the same stack we use for product demos,
            configurators, and immersive marketing on client projects.
          </p>
        </header>

        <div class="showcase-content">
        <div class="model-viewer">
          <div class="model-display" ref="modelContainer" :class="{ 'is-dragging': isUserInteracting }">
            <!-- 3D model will be rendered here -->
            <div class="rotation-hint" :class="{ 'fade-out': isUserInteracting }">
              <i class="fas fa-arrows-rotate"></i>
              <span>Drag to rotate</span>
            </div>
            
            <!-- Loading indicator -->
            <div class="loading-indicator" v-if="isLoading">
              <i class="fas fa-spinner fa-spin"></i>
              <span>Loading model...</span>
            </div>
          </div>
          
          <div class="model-tabs">
            <button 
              v-for="model in models" 
              :key="model.id" 
              :class="{ active: activeModel === model.id }"
              @click="selectModel(model.id)">
              {{ model.name }}
            </button>
            
            <div class="slider-controls">
              <button @click="prevModel" class="slider-control prev">
                <i class="fas fa-chevron-left"></i>
              </button>
              <div class="slider-bar">
                <div class="slider-progress" :style="{ width: sliderProgressWidth + '%' }"></div>
              </div>
              <button @click="nextModel" class="slider-control next">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="model-info">
          <div class="info-section">
            <h3>About These Models</h3>
            <p>
              Sample assets from client and internal projects — optimized meshes, tuned lighting,
              and interactive controls built for the web with Blender and Three.js.
            </p>
          </div>

          <div class="info-grid">
            <div class="info-block">
              <div class="info-icon">
                <i class="fas fa-cube"></i>
              </div>
              <h4>Technical Details</h4>
              <ul>
                <li>
                  <i class="fas fa-angle-right"></i>
                  Created using Blender and Three.js
                </li>
                <li>
                  <i class="fas fa-angle-right"></i>
                  Low-poly models optimized for web
                </li>
                <li>
                  <i class="fas fa-angle-right"></i>
                  Interactive 360° viewing
                </li>
                <li>
                  <i class="fas fa-angle-right"></i>
                  Glb/gltf format for web compatibility
                </li>
              </ul>
            </div>

            <div class="info-block">
              <div class="info-icon">
                <i class="fas fa-code-branch"></i>
              </div>
              <h4>Implementation</h4>
              <ul>
                <li>
                  <i class="fas fa-angle-right"></i>
                  Integrated using Three.js
                </li>
                <li>
                  <i class="fas fa-angle-right"></i>
                  Responsive viewport
                </li>
                <li>
                  <i class="fas fa-angle-right"></i>
                  Custom lighting setups
                </li>
                <li>
                  <i class="fas fa-angle-right"></i>
                  Smooth animations and transitions
                </li>
              </ul>
            </div>
          </div>

          <div class="info-section applications">
            <h3>Applications</h3>
            <p>These 3D models can be used in various applications such as:</p>
            
            <div class="application-icons">
              <div class="app-icon">
                <i class="fas fa-vr-cardboard"></i>
                <span>Virtual Reality</span>
              </div>
              <div class="app-icon">
                <i class="fas fa-mobile-alt"></i>
                <span>Mobile Apps</span>
              </div>
              <div class="app-icon">
                <i class="fas fa-gamepad"></i>
                <span>Gaming</span>
              </div>
              <div class="app-icon">
                <i class="fas fa-globe"></i>
                <span>Web Experiences</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from 'vue';
import Footer from './Footer.vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls.js';
import SimpleModelGenerator from '../utils/SimpleModelGenerator';

export default defineComponent({
  name: 'ModelsShowcase',
  components: { Footer },
  setup() {
    const modelContainer = ref<HTMLElement | null>(null);
    const activeModel = ref('spaceship');
    const isUserInteracting = ref(false);
    const isLoading = ref(true);
    const models = ref([
      { id: 'spaceship', name: 'Spaceship', path: '' },
      { id: 'mars-rover', name: 'Mars Rover', path: '' },
      { id: 'space-station', name: 'Space Station', path: '' },
      { id: 'satellite', name: 'Satellite', path: '' },
      { id: 'planet', name: 'Planet', path: '' },
      { id: 'telescope', name: 'Telescope', path: '' }
    ]);

    // Three.js variables
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let currentModel: THREE.Object3D | null = null;
    let loader: GLTFLoader;
    let animationFrameId: number | null = null;
    let autoRotationSpeed = 0.005; // Speed of auto-rotation
    let loadRequestId = 0;
    let loadScheduledTimeout: ReturnType<typeof setTimeout> | null = null;

    // Add helper variables for visual feedback
    let interactionHelper: {
      startTime: number;
      lastInteraction: number;
      autoRotateTimeout: number | null;
    } = {
      startTime: 0,
      lastInteraction: 0,
      autoRotateTimeout: null
    };

    // Calculate slider progress width
    const sliderProgressWidth = computed(() => {
      const index = models.value.findIndex(model => model.id === activeModel.value);
      return ((index + 1) / models.value.length) * 100;
    });

    const initThreeJs = () => {
      if (!modelContainer.value) {
        console.error('Model container not found');
        return;
      }
      
      try {

      // Set up scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x070707);

      // Add a grid for better depth perception
      const gridHelper = new THREE.GridHelper(10, 20, 0xffd601, 0x1a1a1a);
      gridHelper.position.y = -1.5;
      scene.add(gridHelper);

      // Add a shadow-catching plane
      const planeGeometry = new THREE.PlaneGeometry(20, 20);
      const planeMaterial = new THREE.ShadowMaterial({ 
        opacity: 0.3,
        color: 0x000000 
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = -1.49; // Just above the grid
      plane.receiveShadow = true;
      scene.add(plane);

      // Set up camera
      const containerWidth = modelContainer.value.clientWidth;
      const containerHeight = modelContainer.value.clientHeight;
      camera = new THREE.PerspectiveCamera(
        45,
        containerWidth / containerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Set up renderer with explicit interaction handling
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(containerWidth, containerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
      // Apply critical styles
      const canvas = renderer.domElement;
      canvas.classList.add('interactive-canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '1';
      canvas.style.outline = 'none';
      
      modelContainer.value.appendChild(canvas);

      // Bind controls to the container so drag works even when canvas ignores pointer events
      controls = new OrbitControls(camera, modelContainer.value);
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 1.5; // Increase rotation speed
      controls.minDistance = 2;
      controls.maxDistance = 10;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2.0;
      controls.enablePan = true;
      controls.enableRotate = true;
      controls.minPolarAngle = 0.1;
      controls.maxPolarAngle = Math.PI - 0.1;
      
      // Add event listeners for detecting user interaction
      controls.addEventListener('start', handleUserInteractionStart);
      controls.addEventListener('end', handleUserInteractionEnd);
      
      // Set up lighting for better visuals
      // Ambient light
      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambientLight);

      // Main directional light with shadows
      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight1.position.set(5, 5, 5);
      directionalLight1.castShadow = true;
      directionalLight1.shadow.mapSize.width = 1024;
      directionalLight1.shadow.mapSize.height = 1024;
      scene.add(directionalLight1);

      // Secondary colored lights for visual interest
      const directionalLight2 = new THREE.DirectionalLight(0xffd601, 0.35);
      directionalLight2.position.set(-5, -2, -5);
      scene.add(directionalLight2);

      const pointLight = new THREE.PointLight(0xfff4c2, 0.4, 10);
      pointLight.position.set(2, 0, -2);
      scene.add(pointLight);

      // Initialize loader
      loader = new GLTFLoader();

      // Load initial model
      loadModel(models.value.find(model => model.id === activeModel.value)?.id || '');

      // Set up resize handler
      window.addEventListener('resize', handleResize);
      
      // Set up keyboard controls
      window.addEventListener('keydown', handleKeyDown);

      // Start animation loop
      animate();
      } catch (error) {
        console.error('Error initializing Three.js:', error);
        isLoading.value = false;
      }
    };

    // Handler for user interaction start
    const handleUserInteractionStart = () => {
      console.log('Interaction started');
      isUserInteracting.value = true;
      controls.autoRotate = false;
      interactionHelper.startTime = Date.now();
      
      // Make sure cursor styling is applied
      if (modelContainer.value) {
        modelContainer.value.style.cursor = 'grabbing';
      }
      
      // Clear any existing timeout
      if (interactionHelper.autoRotateTimeout !== null) {
        clearTimeout(interactionHelper.autoRotateTimeout);
        interactionHelper.autoRotateTimeout = null;
      }
    };

    // Handler for user interaction end
    const handleUserInteractionEnd = () => {
      console.log('Interaction ended');
      isUserInteracting.value = false;
      interactionHelper.lastInteraction = Date.now();
      
      // Reset cursor
      if (modelContainer.value) {
        modelContainer.value.style.cursor = 'grab';
      }
      
      // Resume auto-rotation after a delay (3 seconds)
      interactionHelper.autoRotateTimeout = window.setTimeout(() => {
        controls.autoRotate = true;
      }, 3000);
    };

    // Handle keyboard controls
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!currentModel) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          rotateModel(-0.1, 0);
          break;
        case 'ArrowRight':
          rotateModel(0.1, 0);
          break;
        case 'ArrowUp':
          rotateModel(0, -0.1);
          break;
        case 'ArrowDown':
          rotateModel(0, 0.1);
          break;
        case '+':
        case '=':
          zoomCamera(-0.5);
          break;
        case '-':
        case '_':
          zoomCamera(0.5);
          break;
        case 'r':
          resetView();
          break;
      }
    };

    // Programmatically rotate the camera orbit
    const rotateModel = (deltaY: number, deltaX: number) => {
      if (!controls || !camera) return;
      
      handleUserInteractionStart();

      const offset = camera.position.clone();
      const spherical = new THREE.Spherical().setFromVector3(offset);
      spherical.theta -= deltaY;
      spherical.phi += deltaX;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      offset.setFromSpherical(spherical);
      camera.position.copy(offset);
      camera.lookAt(controls.target);
      controls.update();
      
      if (interactionHelper.autoRotateTimeout !== null) {
        clearTimeout(interactionHelper.autoRotateTimeout);
      }
      
      interactionHelper.autoRotateTimeout = window.setTimeout(() => {
        handleUserInteractionEnd();
      }, 500);
    };

    // Zoom the camera
    const zoomCamera = (delta: number) => {
      if (!controls || !camera) return;
      
      handleUserInteractionStart();
      const direction = camera.position.clone().normalize();
      camera.position.add(direction.multiplyScalar(delta));
      controls.update();
      
      // Use timeout to simulate end of interaction
      if (interactionHelper.autoRotateTimeout !== null) {
        clearTimeout(interactionHelper.autoRotateTimeout);
      }
      
      interactionHelper.autoRotateTimeout = window.setTimeout(() => {
        handleUserInteractionEnd();
      }, 500);
    };

    // Reset view to default
    const resetView = () => {
      if (!controls) return;
      
      controls.reset();
      camera.position.z = 5;
      camera.position.y = 0;
      camera.position.x = 0;
      controls.update();
    };

    const createProceduralModel = (modelId: string): THREE.Group => {
      switch (modelId) {
        case 'mars-rover':
          return SimpleModelGenerator.createMarsRover();
        case 'space-station':
          return SimpleModelGenerator.createSpaceStation();
        case 'satellite':
          return SimpleModelGenerator.createSatellite();
        case 'planet':
          return SimpleModelGenerator.createPlanet();
        case 'telescope':
          return SimpleModelGenerator.createTelescope();
        default:
          return SimpleModelGenerator.createSpaceship();
      }
    };

    const enhanceMeshMaterials = (model: THREE.Object3D) => {
      model.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;

        object.castShadow = true;
        object.receiveShadow = true;

        const materials = Array.isArray(object.material) ? object.material : [object.material];
        const clonedMaterials = materials.map((material) => {
          const cloned = material.clone();
          if (cloned instanceof THREE.MeshStandardMaterial) {
            cloned.metalness = Math.min(1, cloned.metalness + 0.15);
            cloned.roughness = Math.max(0.1, cloned.roughness - 0.08);
            cloned.envMapIntensity = 0.8;
          }
          return cloned;
        });

        object.material = clonedMaterials.length === 1 ? clonedMaterials[0] : clonedMaterials;
      });
    };

    const fitModelToView = (model: THREE.Group) => {
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const scale = 2 / maxDim;
        model.scale.set(scale, scale, scale);
      }
    };

    const setCameraForModel = (modelId: string) => {
      controls.reset();

      switch (modelId) {
        case 'mars-rover':
          camera.position.set(4, 3, 4);
          break;
        case 'space-station':
          camera.position.set(5, 2, 5);
          break;
        case 'satellite':
          camera.position.set(3, 2, 3);
          break;
        case 'planet':
          camera.position.set(4, 1, 4);
          break;
        case 'telescope':
          camera.position.set(3, 2, 5);
          break;
        default:
          camera.position.set(4, 2, 4);
      }

      camera.lookAt(0, 0, 0);
    };

    const loadModel = (modelId: string) => {
      if (!modelId || !scene) return;

      const requestId = ++loadRequestId;
      isLoading.value = true;

      if (loadScheduledTimeout !== null) {
        clearTimeout(loadScheduledTimeout);
        loadScheduledTimeout = null;
      }

      if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
      }

      // Brief delay so the loading overlay can paint before sync model build
      loadScheduledTimeout = setTimeout(() => {
        loadScheduledTimeout = null;
        if (requestId !== loadRequestId) return;

        try {
          const model = createProceduralModel(modelId);
          enhanceMeshMaterials(model);
          fitModelToView(model);
          model.rotation.x = 0.1;
          model.rotation.y = 0.3;

          scene.add(model);
          currentModel = model;
          setCameraForModel(modelId);
          controls.autoRotate = true;
        } catch (error) {
          console.error('Failed to load 3D model:', modelId, error);
        }

        if (requestId === loadRequestId) {
          isLoading.value = false;
        }
      }, 32);
    };

    const handleResize = () => {
      if (!modelContainer.value || !camera || !renderer) return;

      const containerWidth = modelContainer.value.clientWidth;
      const containerHeight = modelContainer.value.clientHeight;
      
      camera.aspect = containerWidth / containerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerWidth, containerHeight);
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Update controls
      if (controls) {
        controls.update();
      }
      
      // Rotate temp cube if it's still showing (legacy mesh placeholder)
      if (currentModel && currentModel.type === 'Mesh' && currentModel.geometry?.type === 'BoxGeometry') {
        currentModel.rotation.x += 0.01;
        currentModel.rotation.y += 0.01;
      }
      
      // Add subtle continuous rotation when not interacting
      if (!isUserInteracting.value && currentModel && currentModel instanceof THREE.Group) {
        // Very subtle continuous rotation for visual interest
        currentModel.rotation.y += 0.001;
      }
      
      // Render the scene
      renderer.render(scene, camera);
    };

    const selectModel = (modelId: string) => {
      activeModel.value = modelId;
      loadModel(modelId);
    };

    const nextModel = () => {
      const currentIndex = models.value.findIndex(model => model.id === activeModel.value);
      const nextIndex = (currentIndex + 1) % models.value.length;
      selectModel(models.value[nextIndex].id);
    };

    const prevModel = () => {
      const currentIndex = models.value.findIndex(model => model.id === activeModel.value);
      const prevIndex = (currentIndex - 1 + models.value.length) % models.value.length;
      selectModel(models.value[prevIndex].id);
    };

    onMounted(() => {
      initThreeJs();
    });

    onBeforeUnmount(() => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      
      if (controls) {
        controls.removeEventListener('start', handleUserInteractionStart);
        controls.removeEventListener('end', handleUserInteractionEnd);
        controls.dispose();
      }
      
      if (interactionHelper.autoRotateTimeout !== null) {
        clearTimeout(interactionHelper.autoRotateTimeout);
      }

      if (loadScheduledTimeout !== null) {
        clearTimeout(loadScheduledTimeout);
        loadScheduledTimeout = null;
      }
      
      if (renderer && modelContainer.value) {
        modelContainer.value.removeChild(renderer.domElement);
        renderer.dispose();
      }
      
      if (scene) {
        // Dispose of all geometries and materials
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            
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
    });

    return {
      modelContainer,
      activeModel,
      models,
      sliderProgressWidth,
      selectModel,
      nextModel,
      prevModel,
      isUserInteracting,
      isLoading
    };
  }
});
</script>

<style scoped>
.models-page {
  position: relative;
  min-height: 100vh;
  background: var(--editorial-surface, #070707);
  color: rgba(255, 255, 255, 0.92);
  font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  isolation: isolate;
}

.models-page__grain {
  z-index: 0;
}

.models-page__main {
  position: relative;
  z-index: 1;
  padding: calc(var(--site-header-offset, 4.75rem) + 2.5rem) 0 3rem;
}

.models-showcase-container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.models-hero {
  max-width: 42rem;
  margin-bottom: clamp(2rem, 4vw, 3rem);
}

.models-hero__kicker {
  margin: 0 0 0.75rem;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 214, 1, 0.62);
}

.models-hero__title {
  margin: 0 0 1rem;
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: #ffd601;
}

.models-hero__lead {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.58);
}

.showcase-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 4vw, 3rem);
  align-items: start;
}

.model-viewer {
  position: relative;
}

.model-display {
  height: 400px;
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  cursor: grab;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  touch-action: none !important;
  z-index: 1;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Make canvas capture all events */
.model-display > canvas {
  pointer-events: auto !important;
  z-index: 2;
  touch-action: none !important;
  cursor: grab;
}

.model-display.is-dragging {
  cursor: grabbing;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 214, 1, 0.22);
}

.model-display:active {
  cursor: grabbing;
}

.model-display::after {
  content: "Drag to rotate • Arrow keys to rotate • +/- to zoom • R to reset";
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background: rgba(7, 7, 7, 0.82);
  color: rgba(255, 255, 255, 0.78);
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.78rem;
  text-align: center;
  opacity: 0.85;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.model-display:hover::after {
  opacity: 1;
}

.model-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.model-tabs button {
  padding: 0.6rem 1rem;
  background-color: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: max-content;
  font-size: 0.88rem;
  font-family: inherit;
}

.model-tabs button:hover {
  background-color: rgba(255, 214, 1, 0.08);
  border-color: rgba(255, 214, 1, 0.28);
  color: #ffd601;
}

.model-tabs button.active {
  background-color: rgba(255, 214, 1, 0.14);
  border-color: rgba(255, 214, 1, 0.45);
  color: #ffd601;
}

.slider-controls {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
  gap: 0.5rem;
}

.slider-control {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.88);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider-control:hover {
  background: rgba(255, 214, 1, 0.12);
  border-color: rgba(255, 214, 1, 0.35);
  color: #ffd601;
}

.slider-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  border-radius: 2px;
  overflow: hidden;
}

.slider-progress {
  position: absolute;
  height: 100%;
  background: linear-gradient(to right, rgba(255, 214, 1, 0.45), #ffd601);
  transition: width 0.3s ease;
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section h3 {
  font-size: 1.35rem;
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #ffd601;
}

.info-section p {
  color: rgba(255, 255, 255, 0.62);
  line-height: 1.65;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.info-block {
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.5rem;
  border-radius: 12px;
  transition: border-color 0.25s ease, transform 0.25s ease;
}

.info-block:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 214, 1, 0.2);
}

.info-icon {
  width: 3rem;
  height: 3rem;
  background: rgba(255, 214, 1, 0.12);
  border: 1px solid rgba(255, 214, 1, 0.28);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.info-icon i {
  font-size: 1.35rem;
  color: #ffd601;
}

.info-block h4 {
  font-size: 1.05rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
}

.info-block ul {
  list-style: none;
  padding: 0;
}

.info-block li {
  margin-bottom: 0.7rem;
  color: rgba(255, 255, 255, 0.58);
  display: flex;
  align-items: center;
  font-size: 0.92rem;
  line-height: 1.45;
}

.info-block li i {
  color: rgba(255, 214, 1, 0.75);
  margin-right: 0.5rem;
  font-size: 0.75rem;
}

.applications {
  margin-top: 1rem;
}

.application-icons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.app-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.app-icon:hover {
  background-color: rgba(255, 214, 1, 0.08);
  border-color: rgba(255, 214, 1, 0.22);
}

.app-icon i {
  font-size: 1.5rem;
  color: #ffd601;
  margin-bottom: 0.5rem;
}

.app-icon span {
  font-size: 0.78rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.62);
}

/* Add rotation hint */
.rotation-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 214, 1, 0.72);
  pointer-events: none;
  transition: opacity 0.5s ease, transform 0.5s ease;
  z-index: 10; /* Above canvas */
}

.rotation-hint i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  animation: pulse 2s infinite;
}

.rotation-hint span {
  font-size: 0.88rem;
  font-weight: 500;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
}

.rotation-hint.fade-out {
  opacity: 0;
  transform: translate(-50%, -70%);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.65;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.65;
  }
}

@media (max-width: 992px) {
  .showcase-content {
    grid-template-columns: 1fr;
  }

  .model-display {
    height: 350px;
  }
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .model-tabs {
    overflow-x: auto;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .model-tabs button {
    flex: 0 0 auto;
  }
}

/* Add loading indicator */
.loading-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(7, 7, 7, 0.88);
  color: rgba(255, 255, 255, 0.9);
  z-index: 20;
  pointer-events: none;
  animation: fadeIn 0.3s ease;
}

.loading-indicator i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ffd601;
}

.loading-indicator span {
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.72);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style> 