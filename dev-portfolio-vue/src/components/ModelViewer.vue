<template>
  <div class="model-viewer-container">
    <div class="model-selector">
      <button 
        v-for="model in availableModels" 
        :key="model.id" 
        @click="loadModel(model.path)"
        :class="{ active: currentModel === model.path }"
        class="model-button"
      >
        {{ model.name }}
      </button>
    </div>
    <div class="model-display" ref="modelDisplay"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default defineComponent({
  name: 'ModelViewer',
  props: {
    initialModel: {
      type: String,
      default: '/assets/models/spaceship.glb'
    }
  },
  setup(props) {
    const modelDisplay = ref<HTMLElement | null>(null);
    const currentModel = ref(props.initialModel);
    
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let model: THREE.Object3D | null = null;
    let animationFrameId: number;
    
    const availableModels = [
      { id: 1, name: 'Spaceship', path: 'spaceship' },
      { id: 2, name: 'Mars Rover', path: 'rover' },
      { id: 3, name: 'Space Station', path: 'station' },
      { id: 4, name: 'Satellite', path: 'satellite' },
      { id: 5, name: 'Planet', path: 'planet' },
      { id: 6, name: 'Telescope', path: 'telescope' }
    ];
    
    const initScene = () => {
      if (!modelDisplay.value) return;
      
      // Create scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x111111);
      
      // Set up camera
      camera = new THREE.PerspectiveCamera(
        75, 
        modelDisplay.value.clientWidth / modelDisplay.value.clientHeight, 
        0.1, 
        1000
      );
      camera.position.z = 5;
      
      // Set up renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(modelDisplay.value.clientWidth, modelDisplay.value.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      modelDisplay.value.appendChild(renderer.domElement);
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
      
      const pointLight1 = new THREE.PointLight(0x3498db, 1, 10);
      pointLight1.position.set(3, 3, 3);
      scene.add(pointLight1);
      
      const pointLight2 = new THREE.PointLight(0xe74c3c, 1, 10);
      pointLight2.position.set(-3, -3, 3);
      scene.add(pointLight2);
      
      // Set up controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      
      // Load initial model
      loadModel('spaceship');
      
      // Handle window resize
      window.addEventListener('resize', onWindowResize);
      
      // Start animation loop
      animate();
    };
    
    const loadModel = (modelType: string) => {
      currentModel.value = modelType;
      
      // Remove existing model from scene if it exists
      if (model) {
        scene.remove(model);
        model = null;
      }
      
      // Create a geometric model based on type
      switch (modelType) {
        case 'spaceship':
          model = createSpaceship();
          break;
        case 'rover':
          model = createRover();
          break;
        case 'station':
          model = createSpaceStation();
          break;
        case 'satellite':
          model = createSatellite();
          break;
        case 'planet':
          model = createPlanet();
          break;
        case 'telescope':
          model = createTelescope();
          break;
        default:
          model = createSpaceship();
      }
      
      // Add model to scene
      scene.add(model);
    };
    
    const createSpaceship = () => {
      const ship = new THREE.Group();
      
      // Ship body
      const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x3498db,
        emissive: 0x1a2d3d,
        shininess: 30
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2;
      ship.add(body);
      
      // Wings
      const wingGeometry = new THREE.BoxGeometry(0.1, 0.7, 0.5);
      const wingMaterial = new THREE.MeshPhongMaterial({
        color: 0xe74c3c,
        emissive: 0x3d1a1a,
        shininess: 30
      });
      
      const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
      leftWing.position.set(-0.4, 0, -0.6);
      ship.add(leftWing);
      
      const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
      rightWing.position.set(-0.4, 0, 0.6);
      ship.add(rightWing);
      
      // Cockpit
      const cockpitGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const cockpitMaterial = new THREE.MeshPhongMaterial({
        color: 0xf39c12,
        emissive: 0x3d2d1a,
        shininess: 90,
        transparent: true,
        opacity: 0.8
      });
      const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
      cockpit.position.set(0.5, 0, 0);
      ship.add(cockpit);
      
      // Engines
      const engineGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.5, 16);
      const engineMaterial = new THREE.MeshPhongMaterial({
        color: 0x7f8c8d,
        emissive: 0x2c3e50,
        shininess: 30
      });
      
      const engine = new THREE.Mesh(engineGeometry, engineMaterial);
      engine.position.set(-1, 0, 0);
      engine.rotation.z = Math.PI / 2;
      ship.add(engine);
      
      // Engine glow
      const glowGeometry = new THREE.SphereGeometry(0.12, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xe74c3c,
        transparent: true,
        opacity: 0.7
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.set(-1.3, 0, 0);
      ship.add(glow);
      
      return ship;
    };
    
    const createRover = () => {
      const rover = new THREE.Group();
      
      // Rover body
      const bodyGeometry = new THREE.BoxGeometry(1.5, 0.4, 1);
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xecf0f1,
        shininess: 30
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      rover.add(body);
      
      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
      const wheelMaterial = new THREE.MeshPhongMaterial({
        color: 0x34495e,
        shininess: 30
      });
      
      const wheelPositions = [
        [-0.6, -0.3, 0.6], // front left
        [-0.6, -0.3, -0.6], // front right
        [0.6, -0.3, 0.6], // back left
        [0.6, -0.3, -0.6], // back right
      ];
      
      wheelPositions.forEach(position => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(position[0], position[1], position[2]);
        wheel.rotation.z = Math.PI / 2;
        rover.add(wheel);
      });
      
      // Solar panel
      const panelGeometry = new THREE.BoxGeometry(0.8, 0.05, 1.2);
      const panelMaterial = new THREE.MeshPhongMaterial({
        color: 0x3498db,
        shininess: 100
      });
      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      panel.position.set(0, 0.3, 0);
      rover.add(panel);
      
      // Antenna
      const poleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
      const poleMaterial = new THREE.MeshPhongMaterial({
        color: 0x7f8c8d,
        shininess: 30
      });
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.set(0.6, 0.5, 0);
      rover.add(pole);
      
      const dishGeometry = new THREE.SphereGeometry(0.2, 8, 4, 0, Math.PI);
      const dishMaterial = new THREE.MeshPhongMaterial({
        color: 0xbdc3c7,
        shininess: 30
      });
      const dish = new THREE.Mesh(dishGeometry, dishMaterial);
      dish.position.set(0.6, 0.8, 0);
      dish.rotation.x = Math.PI / 2;
      rover.add(dish);
      
      return rover;
    };
    
    const createSpaceStation = () => {
      const station = new THREE.Group();
      
      // Central hub
      const hubGeometry = new THREE.SphereGeometry(0.7, 16, 16);
      const hubMaterial = new THREE.MeshPhongMaterial({
        color: 0xecf0f1,
        shininess: 30
      });
      const hub = new THREE.Mesh(hubGeometry, hubMaterial);
      station.add(hub);
      
      // Ring
      const ringGeometry = new THREE.TorusGeometry(1.5, 0.1, 16, 40);
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0x3498db,
        shininess: 30
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      station.add(ring);
      
      // Solar panels
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const panelGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.4);
        const panelMaterial = new THREE.MeshPhongMaterial({
          color: 0x2ecc71,
          shininess: 30
        });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.set(
          Math.cos(angle) * 0.9,
          Math.sin(angle) * 0.9,
          0
        );
        panel.lookAt(new THREE.Vector3(0, 0, 0));
        station.add(panel);
      }
      
      return station;
    };
    
    const createSatellite = () => {
      const satellite = new THREE.Group();
      
      // Main body
      const bodyGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.8);
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xbdc3c7,
        shininess: 30
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      satellite.add(body);
      
      // Solar panels
      const leftPanelGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.5);
      const panelMaterial = new THREE.MeshPhongMaterial({
        color: 0x3498db,
        shininess: 100
      });
      const leftPanel = new THREE.Mesh(leftPanelGeometry, panelMaterial);
      leftPanel.position.set(0.9, 0, 0);
      satellite.add(leftPanel);
      
      const rightPanel = new THREE.Mesh(leftPanelGeometry, panelMaterial);
      rightPanel.position.set(-0.9, 0, 0);
      satellite.add(rightPanel);
      
      // Dish
      const dishGeometry = new THREE.SphereGeometry(0.3, 12, 6, 0, Math.PI);
      const dishMaterial = new THREE.MeshPhongMaterial({
        color: 0xecf0f1,
        shininess: 30
      });
      const dish = new THREE.Mesh(dishGeometry, dishMaterial);
      dish.position.set(0, 0, 0.6);
      dish.rotation.x = Math.PI / 2;
      satellite.add(dish);
      
      return satellite;
    };
    
    const createPlanet = () => {
      const planet = new THREE.Group();
      
      // Planet sphere
      const planetGeometry = new THREE.SphereGeometry(1.5, 32, 32);
      const planetMaterial = new THREE.MeshPhongMaterial({
        color: 0x3498db,
        emissive: 0x1a2d3d,
        shininess: 10
      });
      const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.add(planetMesh);
      
      // Atmosphere
      const atmosphereGeometry = new THREE.SphereGeometry(1.55, 32, 32);
      const atmosphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x74b9ff,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      planet.add(atmosphere);
      
      // Clouds
      const cloudGeometry = new THREE.SphereGeometry(1.52, 24, 24);
      const cloudMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6
      });
      const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
      planet.add(clouds);
      
      // Small moon
      const moonGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const moonMaterial = new THREE.MeshPhongMaterial({
        color: 0xecf0f1,
        emissive: 0x7f8c8d,
        shininess: 5
      });
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.position.set(2.5, 0.8, 0);
      planet.add(moon);
      
      return planet;
    };
    
    const createTelescope = () => {
      const telescope = new THREE.Group();
      
      // Main tube
      const tubeGeometry = new THREE.CylinderGeometry(0.4, 0.5, 2, 16);
      const tubeMaterial = new THREE.MeshPhongMaterial({
        color: 0x2c3e50,
        shininess: 30
      });
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      tube.rotation.z = Math.PI / 2;
      telescope.add(tube);
      
      // Solar panels
      const panelGeometry = new THREE.BoxGeometry(1.8, 0.05, 0.5);
      const panelMaterial = new THREE.MeshPhongMaterial({
        color: 0x3498db,
        shininess: 100
      });
      
      const topPanel = new THREE.Mesh(panelGeometry, panelMaterial);
      topPanel.position.set(0, 0.5, 0);
      telescope.add(topPanel);
      
      const bottomPanel = new THREE.Mesh(panelGeometry, panelMaterial);
      bottomPanel.position.set(0, -0.5, 0);
      telescope.add(bottomPanel);
      
      // Lens
      const lensGeometry = new THREE.CircleGeometry(0.4, 32);
      const lensMaterial = new THREE.MeshBasicMaterial({
        color: 0x74b9ff,
        side: THREE.DoubleSide
      });
      const lens = new THREE.Mesh(lensGeometry, lensMaterial);
      lens.position.set(1, 0, 0);
      lens.rotation.y = Math.PI / 2;
      telescope.add(lens);
      
      // Antenna
      const antennaGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.7, 8);
      const antennaMaterial = new THREE.MeshPhongMaterial({
        color: 0x7f8c8d,
        shininess: 30
      });
      const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
      antenna.position.set(-1, 0.4, 0);
      telescope.add(antenna);
      
      // Dish
      const dishGeometry = new THREE.SphereGeometry(0.1, 8, 4, 0, Math.PI);
      const dishMaterial = new THREE.MeshPhongMaterial({
        color: 0xecf0f1,
        shininess: 30
      });
      const dish = new THREE.Mesh(dishGeometry, dishMaterial);
      dish.position.set(-1, 0.7, 0);
      dish.rotation.x = -Math.PI / 2;
      telescope.add(dish);
      
      return telescope;
    };
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Update controls
      if (controls) controls.update();
      
      // Rotate model if it exists
      if (model) {
        model.rotation.y += 0.005;
      }
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    const onWindowResize = () => {
      if (!modelDisplay.value) return;
      
      camera.aspect = modelDisplay.value.clientWidth / modelDisplay.value.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(modelDisplay.value.clientWidth, modelDisplay.value.clientHeight);
    };
    
    onMounted(() => {
      initScene();
    });
    
    onBeforeUnmount(() => {
      window.removeEventListener('resize', onWindowResize);
      cancelAnimationFrame(animationFrameId);
      
      if (renderer) {
        renderer.dispose();
        
        if (modelDisplay.value && renderer.domElement) {
          modelDisplay.value.removeChild(renderer.domElement);
        }
      }
    });
    
    return {
      modelDisplay,
      availableModels,
      currentModel,
      loadModel
    };
  }
});
</script>

<style scoped>
.model-viewer-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 100%;
  background: #0f0f0f;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.model-selector {
  display: flex;
  padding: 10px;
  background: #1a1a1a;
  overflow-x: auto;
  gap: 10px;
}

.model-button {
  padding: 8px 16px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.model-button:hover {
  background: #444;
}

.model-button.active {
  background: #3498db;
}

.model-display {
  flex: 1;
  position: relative;
}
</style> 