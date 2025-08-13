<template>
  <div class="models-showcase">
    <div class="models-showcase-container">
      <div class="header-section">
        <h2>3D Models Showcase</h2>
        <p>Explore my 3D modeling skills with these interactive examples.</p>
      </div>

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
              This collection showcases various 3D models created for different
              projects. These models demonstrate my ability to work with 3D graphics,
              model optimization, and interactive visualization techniques.
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SimpleModelGenerator from '../utils/SimpleModelGenerator';

export default defineComponent({
  name: 'ModelsShowcase',
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

    // Add direct rotation tracking variables
    const mousePosition = {
      x: 0,
      y: 0,
      isDragging: false
    };

    // Calculate slider progress width
    const sliderProgressWidth = computed(() => {
      const index = models.value.findIndex(model => model.id === activeModel.value);
      return ((index + 1) / models.value.length) * 100;
    });

    const initThreeJs = () => {
      if (!modelContainer.value) return;

      // Set up scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a18);

      // Add a grid for better depth perception
      const gridHelper = new THREE.GridHelper(10, 20, 0x3498db, 0x222222);
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
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'auto'; 
      canvas.style.zIndex = '5'; // Higher z-index
      canvas.style.outline = 'none';
      canvas.style.touchAction = 'none';
      
      modelContainer.value.appendChild(canvas);

      // Set up controls
      controls = new OrbitControls(camera, canvas);
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
      
      // Manual direct event handling as a fallback
      canvas.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      // Touch support
      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('touchmove', handleTouchMove);
      canvas.addEventListener('touchend', handleTouchEnd);
      
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
      const directionalLight2 = new THREE.DirectionalLight(0x3498db, 0.5);
      directionalLight2.position.set(-5, -2, -5);
      scene.add(directionalLight2);

      const pointLight = new THREE.PointLight(0xe74c3c, 0.5, 10);
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

    // Programmatically rotate the model
    const rotateModel = (deltaY: number, deltaX: number) => {
      if (!controls) return;
      
      handleUserInteractionStart();
      (controls as any).rotateLeft(deltaY);
      (controls as any).rotateUp(deltaX);
      controls.update();
      
      // Use timeout to simulate end of interaction
      if (interactionHelper.autoRotateTimeout !== null) {
        clearTimeout(interactionHelper.autoRotateTimeout);
      }
      
      interactionHelper.autoRotateTimeout = window.setTimeout(() => {
        handleUserInteractionEnd();
      }, 500);
    };

    // Zoom the camera
    const zoomCamera = (delta: number) => {
      if (!controls) return;
      
      handleUserInteractionStart();
      (controls as any).dollyIn(1 + Math.abs(delta) * 0.1 * (delta > 0 ? 1 : -1));
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

    const loadModel = (modelId: string) => {
      if (!modelId) return;

      // Show loading state
      isLoading.value = true;

      if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
      }

      // Create temporary model (spinning cube) while loading
      const tempGeometry = new THREE.BoxGeometry(1, 1, 1);
      const tempMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3498db,
        wireframe: true,
        transparent: true,
        opacity: 0.7
      });
      const tempCube = new THREE.Mesh(tempGeometry, tempMaterial);
      
      // Add animation to the loading cube
      const cubeAnimation = () => {
        if (tempCube && scene.children.includes(tempCube)) {
          tempCube.rotation.x += 0.03;
          tempCube.rotation.y += 0.02;
          tempCube.rotation.z += 0.01;
          requestAnimationFrame(cubeAnimation);
        }
      };
      
      scene.add(tempCube);
      currentModel = tempCube;
      cubeAnimation();

      // Generate the appropriate model based on ID
      let model: THREE.Group;
      
      // Use setTimeout to give the loading indicator time to display
      setTimeout(() => {
      switch (modelId) {
        case 'spaceship':
          model = SimpleModelGenerator.createSpaceship();
          break;
        case 'mars-rover':
          model = SimpleModelGenerator.createMarsRover();
          break;
        case 'space-station':
          model = SimpleModelGenerator.createSpaceStation();
          break;
        case 'satellite':
          model = SimpleModelGenerator.createSatellite();
          break;
        case 'planet':
          model = SimpleModelGenerator.createPlanet();
          break;
        case 'telescope':
          model = SimpleModelGenerator.createTelescope();
          break;
        default:
          model = SimpleModelGenerator.createSpaceship();
      }
      
      // Remove temporary cube
      scene.remove(tempCube);
        
        // Enable shadows for all meshes in the model
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
            
            // Enhance materials for better 3D look
            if (object.material) {
              // Create a copy of the material to avoid modifying shared materials
              object.material = object.material.clone();
              
              if (object.material instanceof THREE.MeshStandardMaterial) {
                // Procedurally create a normal map
                const normalMapSize = 512;
                const canvas = document.createElement('canvas');
                canvas.width = normalMapSize;
                canvas.height = normalMapSize;
                const ctx = canvas.getContext('2d');
                
                if (ctx) {
                  // Generate a simple noise pattern for the normal map
                  ctx.fillStyle = '#8888ff'; // Neutral normal map color
                  ctx.fillRect(0, 0, normalMapSize, normalMapSize);
                  
                  // Add some noise
                  for (let i = 0; i < 5000; i++) {
                    const x = Math.random() * normalMapSize;
                    const y = Math.random() * normalMapSize;
                    const size = 1 + Math.random() * 3;
                    const color = Math.random() > 0.5 ? '#aaaaff' : '#6666ff';
                    
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                  }
                  
                  const normalMap = new THREE.CanvasTexture(canvas);
                  normalMap.wrapS = THREE.RepeatWrapping;
                  normalMap.wrapT = THREE.RepeatWrapping;
                  normalMap.repeat.set(2, 2);
                  object.material.normalMap = normalMap;
                  object.material.normalScale.set(0.5, 0.5);
                }
                
                // Enhance material properties
                if (object.material.metalness < 0.5) {
                  object.material.metalness += 0.2;
                }
                
                if (object.material.roughness > 0.3) {
                  object.material.roughness -= 0.1;
                }
                
                // Add environment mapping for realistic reflections
                object.material.envMapIntensity = 0.8;
              }
            }
          }
        });
      
      // Center the model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      
      // Scale the model to fit view
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      model.scale.set(scale, scale, scale);
        
        // Add initial slight tilt for visual interest
        model.rotation.x = 0.1;
        model.rotation.y = 0.3;
      
      scene.add(model);
      currentModel = model;
      
        // Set appropriate camera positions based on model type
      controls.reset();
        
        switch (modelId) {
          case 'spaceship':
            camera.position.set(4, 2, 4);
            break;
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
        
        // Force auto-rotation for a few seconds
        controls.autoRotate = true;
        setTimeout(() => {
          if (!isUserInteracting.value) {
            controls.autoRotate = true;
          }
          
          // Model loaded, hide loading indicator
          isLoading.value = false;
        }, 1000);
      }, 500); // Short delay for loading state
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
      
      // Rotate temp cube if it's still showing
      if (currentModel && currentModel.type === 'Mesh') {
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

    // Direct mouse handling functions
    const handleMouseDown = (event: MouseEvent) => {
      console.log('Manual mousedown captured');
      mousePosition.isDragging = true;
      mousePosition.x = event.clientX;
      mousePosition.y = event.clientY;
      handleUserInteractionStart();
      
      // Prevent events from reaching other elements
      event.preventDefault();
      event.stopPropagation();
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!mousePosition.isDragging) return;
      
      const deltaX = event.clientX - mousePosition.x;
      const deltaY = event.clientY - mousePosition.y;
      
      // Manual rotation if OrbitControls isn't working
      if (currentModel && deltaX !== 0 || deltaY !== 0) {
        // Apply manual rotation (fallback if OrbitControls doesn't work)
        if (currentModel instanceof THREE.Group) {
          currentModel.rotation.y += deltaX * 0.01;
          currentModel.rotation.x += deltaY * 0.01;
        }
        
        // Also try to rotate via OrbitControls
        if (controls) {
          (controls as any).rotateLeft(deltaX * 0.005);
          (controls as any).rotateUp(deltaY * 0.005);
          controls.update();
        }
      }
      
      mousePosition.x = event.clientX;
      mousePosition.y = event.clientY;
      
      // Prevent events from reaching other elements
      event.preventDefault();
      event.stopPropagation();
    };
    
    const handleMouseUp = () => {
      console.log('Manual mouseup captured');
      mousePosition.isDragging = false;
      handleUserInteractionEnd();
    };
    
    // Touch event handlers
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        mousePosition.isDragging = true;
        mousePosition.x = event.touches[0].clientX;
        mousePosition.y = event.touches[0].clientY;
        handleUserInteractionStart();
      }
      
      // Prevent events from reaching other elements
      event.preventDefault();
    };
    
    const handleTouchMove = (event: TouchEvent) => {
      if (!mousePosition.isDragging || event.touches.length !== 1) return;
      
      const touch = event.touches[0];
      const deltaX = touch.clientX - mousePosition.x;
      const deltaY = touch.clientY - mousePosition.y;
      
      // Manual rotation
      if (currentModel && (deltaX !== 0 || deltaY !== 0)) {
        if (currentModel instanceof THREE.Group) {
          currentModel.rotation.y += deltaX * 0.01;
          currentModel.rotation.x += deltaY * 0.01;
        }
        
        // Also try to rotate via OrbitControls
        if (controls) {
          (controls as any).rotateLeft(deltaX * 0.005);
          (controls as any).rotateUp(deltaY * 0.005);
          controls.update();
        }
      }
      
      mousePosition.x = touch.clientX;
      mousePosition.y = touch.clientY;
      
      // Prevent events from reaching other elements
      event.preventDefault();
    };
    
    const handleTouchEnd = () => {
      mousePosition.isDragging = false;
      handleUserInteractionEnd();
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      if (renderer && renderer.domElement) {
        renderer.domElement.removeEventListener('mousedown', handleMouseDown);
        renderer.domElement.removeEventListener('touchstart', handleTouchStart);
        renderer.domElement.removeEventListener('touchmove', handleTouchMove);
        renderer.domElement.removeEventListener('touchend', handleTouchEnd);
      }
      
      if (controls) {
        controls.removeEventListener('start', handleUserInteractionStart);
        controls.removeEventListener('end', handleUserInteractionEnd);
        controls.dispose();
      }
      
      if (interactionHelper.autoRotateTimeout !== null) {
        clearTimeout(interactionHelper.autoRotateTimeout);
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
.models-showcase {
  padding: 4rem 0;
  color: #fff;
}

.models-showcase-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.header-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.header-section p {
  font-size: 1.2rem;
  color: #aaa;
  max-width: 700px;
  margin: 0 auto;
}

.showcase-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.model-viewer {
  position: relative;
}

.model-display {
  height: 400px;
  background-color: rgba(16, 16, 40, 0.5);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  cursor: grab;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
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
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  background-color: rgba(20, 20, 50, 0.6);
}

.model-display:active {
  cursor: grabbing;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.model-display::after {
  content: "Drag to rotate • Arrow keys to rotate • +/- to zoom • R to reset";
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  text-align: center;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.model-display:hover::after {
  opacity: 0.9;
}

.model-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.model-tabs button {
  padding: 0.6rem 1rem;
  background-color: rgba(16, 16, 40, 0.5);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: max-content;
  font-size: 0.9rem;
}

.model-tabs button:hover {
  background-color: rgba(52, 152, 219, 0.3);
}

.model-tabs button.active {
  background-color: #3498db;
}

.slider-controls {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
  gap: 0.5rem;
}

.slider-control {
  background: rgba(52, 152, 219, 0.3);
  border: none;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-control:hover {
  background: rgba(52, 152, 219, 0.6);
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
  background: linear-gradient(to right, #3498db, #9b59b6);
  transition: width 0.3s ease;
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #3498db;
}

.info-section p {
  color: #ddd;
  line-height: 1.6;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.info-block {
  background-color: rgba(16, 16, 40, 0.5);
  padding: 1.5rem;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.info-block:hover {
  transform: translateY(-5px);
}

.info-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(45deg, #3498db, #9b59b6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.info-icon i {
  font-size: 1.5rem;
  color: white;
}

.info-block h4 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #fff;
}

.info-block ul {
  list-style: none;
  padding: 0;
}

.info-block li {
  margin-bottom: 0.7rem;
  color: #bbb;
  display: flex;
  align-items: center;
}

.info-block li i {
  color: #3498db;
  margin-right: 0.5rem;
  font-size: 0.8rem;
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
  background-color: rgba(16, 16, 40, 0.5);
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.app-icon:hover {
  background-color: rgba(52, 152, 219, 0.3);
}

.app-icon i {
  font-size: 1.5rem;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.app-icon span {
  font-size: 0.8rem;
  text-align: center;
  color: #ddd;
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
  color: rgba(255, 255, 255, 0.7);
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
  font-size: 0.9rem;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.rotation-hint.fade-out {
  opacity: 0;
  transform: translate(-50%, -70%);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
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
  background: rgba(10, 10, 20, 0.7);
  color: white;
  z-index: 20; /* Above everything */
  animation: fadeIn 0.3s ease;
}

.loading-indicator i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #3498db;
}

.loading-indicator span {
  font-size: 1rem;
  font-weight: 500;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style> 