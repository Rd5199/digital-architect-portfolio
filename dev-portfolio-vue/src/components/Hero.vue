<template>
  <section id="home" class="dev-hero">
    <div class="dev-container">
      <div class="dev-hero-content">
        <h1 class="dev-hero-title">
          Crafting Digital Experiences 
          <span ref="typedRef">That Inspire & Convert</span>
        </h1>
        <p class="dev-hero-subtitle">Expert Web & Mobile App Developer, transforming visionary ideas into seamless, high-performance digital realities.</p>
        <div class="dev-hero-cta">
          <a href="#portfolio" class="dev-btn dev-btn-primary">View My Work</a>
          <a href="#contact" class="dev-btn dev-btn-outline">Let's Discuss Your Project</a>
        </div>
      </div>
      
      <!-- 3D Creation Core -->
      <div class="dev-creation-core">
        <div ref="modelContainer" class="creation-core-container" id="model-container"></div>
      </div>
    </div>
    
    <!-- Canvas container for 3D background -->
    <div id="canvas-container" class="dev-canvas-container"></div>
    
    <!-- Interactive 3D Wave Surface -->
    <div class="wave-surface-container">
      <WaveSurface color="#3498db" :height="150" />
    </div>
    
    <!-- Scroll indicator -->
    <div class="scroll-indicator">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <div class="arrow-container">
        <span class="scroll-arrow"></span>
        <span class="scroll-arrow"></span>
        <span class="scroll-arrow"></span>
      </div>
      <span class="scroll-text">Scroll Down</span>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import Typed from 'typed.js';
import WaveSurface from './WaveSurface.vue';

export default defineComponent({
  name: 'Hero',
  components: {
    WaveSurface
  },
  setup() {
    const modelContainer = ref<HTMLElement | null>(null);
    const typedRef = ref<HTMLElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let model: THREE.Object3D;
    let clock: THREE.Clock;
    let mixer: THREE.AnimationMixer | null = null;
    let typed: Typed | null = null;

    // Initialize the 3D scene
    const initScene = () => {
      if (!modelContainer.value) return;

      // Create scene
      scene = new THREE.Scene();
      scene.background = null; // Transparent background
      scene.fog = new THREE.FogExp2(0x000000, 0.001);
      
      // Set up camera
      camera = new THREE.PerspectiveCamera(
        75, 
        modelContainer.value.clientWidth / modelContainer.value.clientHeight, 
        0.1, 
        1000
      );
      camera.position.z = 5;
      
      // Set up renderer
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(modelContainer.value.clientWidth, modelContainer.value.clientHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(window.devicePixelRatio);
      modelContainer.value.appendChild(renderer.domElement);
      
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
      
      // Add point lights for dynamic lighting
      addColoredLights();
      
      // Set up OrbitControls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1;
      
      // Load 3D model
      loadModel();
      
      // Set up animation loop
      clock = new THREE.Clock();
      animate();
      
      // Handle window resize
      window.addEventListener('resize', onWindowResize);
    };

    // Add colored lights to the scene
    const addColoredLights = () => {
      // Add colored point lights
      const colors = [0x4285F4, 0x34A853, 0xFBBC05, 0xEA4335];
      
      colors.forEach((color, index) => {
        const light = new THREE.PointLight(color, 1, 20);
        const angle = (index / colors.length) * Math.PI * 2;
        const radius = 10;
        
        light.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          Math.sin(angle + Math.PI) * radius * 0.5
        );
        
        scene.add(light);
        
        // Animate light position
        animateLight(light, angle, radius);
      });
    };

    // Animate light position using GSAP
    const animateLight = (light: THREE.PointLight, startAngle: number, radius: number) => {
      const duration = 5 + Math.random() * 10;
      
      gsap.to(light.position, {
        x: Math.cos(startAngle + Math.PI) * radius,
        y: Math.sin(startAngle + Math.PI) * radius,
        z: Math.sin(startAngle) * radius * 0.5,
        duration: duration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
    };

    // Load 3D model
    const loadModel = () => {
      // Create a group to hold all geometric elements
      const geometryGroup = new THREE.Group();
      
      // Create an icosahedron as the main element
      const geometry = new THREE.IcosahedronGeometry(1.5, 1);
      const material = new THREE.MeshPhongMaterial({
        color: 0x6e44ff,
        emissive: 0x2a1a66,
        shininess: 90,
        transparent: true,
        opacity: 0.9,
        wireframe: false
      });
      
      const mainObject = new THREE.Mesh(geometry, material);
      geometryGroup.add(mainObject);
      
      // Add wireframe overlay
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      
      const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
      wireframe.scale.set(1.02, 1.02, 1.02);
      geometryGroup.add(wireframe);
      
      // Add orbiting particles
      const particlesCount = 50;
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00ffcc,
        size: 0.05,
        transparent: true,
        opacity: 0.8
      });
      
      const particlesPositions = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const radius = 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        particlesPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        particlesPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlesPositions[i3 + 2] = radius * Math.cos(phi);
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      geometryGroup.add(particles);
      
      // Add the group to the scene
      scene.add(geometryGroup);
      model = geometryGroup;
      
      // Animate particles
      animateParticles(particles);
      
      // Add pulsing effect
      addPulsingEffect(mainObject);
      addPulsingEffect(wireframe);
    };

    // Process successfully loaded model
    const processLoadedModel = (gltf: any) => {
      model = gltf.scene;
      
      // Scale model to fit container
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3 / maxDim;
      model.scale.set(scale, scale, scale);
      
      // Center model
      box.setFromObject(model);
      box.getCenter(model.position);
      model.position.multiplyScalar(-1);
      
      // Add model to scene
      scene.add(model);
      
      // Set up animations if they exist
      if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
      }
      
      // Add pulsing effect to model
      addPulsingEffect(model);
    };

    // Add pulsing effect to a model
    const addPulsingEffect = (target: THREE.Object3D) => {
      gsap.to(target.scale, {
        x: target.scale.x * 1.05,
        y: target.scale.y * 1.05,
        z: target.scale.z * 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    };

    // Animate particles
    const animateParticles = (particles: THREE.Points) => {
      gsap.to(particles.rotation, {
        x: Math.PI * 2,
        y: Math.PI,
        duration: 20,
        repeat: -1,
        ease: "none"
      });
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update controls
      if (controls) controls.update();
      
      // Update animation mixer
      if (mixer) mixer.update(clock.getDelta());
      
      // Rotate model if it exists
      if (model && !mixer) {
        model.rotation.y += 0.005;
      }
      
      // Render scene
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    // Handle window resize
    const onWindowResize = () => {
      if (!modelContainer.value || !camera || !renderer) return;
      
      camera.aspect = modelContainer.value.clientWidth / modelContainer.value.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(modelContainer.value.clientWidth, modelContainer.value.clientHeight);
    };

    // Add orbiting motes
    const addMotes = () => {
      if (!modelContainer.value) return;
      
      for (let i = 0; i < 8; i++) {
        const mote = document.createElement('div');
        mote.className = 'orbiting-mote';
        
        // Calculate position and animation
        const angle = (i / 8) * 2 * Math.PI;
        const radius = 40 + Math.random() * 15; // % of parent
        const x = `calc(50% + ${radius}% * ${Math.cos(angle)})`;
        const y = `calc(50% + ${radius}% * ${Math.sin(angle)})`;
        const duration = 5 + Math.random() * 5; // seconds
        const delay = Math.random() * 5; // seconds
        const size = 3 + Math.random() * 4; // px
        
        // Apply styles
        mote.style.top = y;
        mote.style.left = x;
        mote.style.width = `${size}px`;
        mote.style.height = `${size}px`;
        mote.style.animation = `mote-orbit ${duration}s linear infinite ${delay}s, mote-pulse 2s ease-in-out infinite alternate ${delay * 0.5}s`;
        
        modelContainer.value.appendChild(mote);
      }
    };

    // Initialize typing effect
    const initTypingEffect = () => {
      if (typedRef.value) {
        typed = new Typed(typedRef.value, {
          strings: ['That Inspire & Convert', 'That Drive Results', 'That Engage Users', 'That Scale With You'],
          typeSpeed: 50,
          backSpeed: 30,
          backDelay: 3000,
          loop: true
        });
      }
    };

    onMounted(() => {
      // Initialize 3D scene
      initScene();
      
      // Add motes around the 3D model
      addMotes();
      
      // Initialize typing effect
      initTypingEffect();
    });

    return {
      modelContainer,
      typedRef
    };
  }
});
</script>

<style scoped>
/* Styles are imported from main.css */

.wave-surface-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  transform: translateY(50%);
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 10;
}

.mouse {
  width: 30px;
  height: 45px;
  border: 2px solid var(--primary-color);
  border-radius: 20px;
  position: relative;
  margin-bottom: 10px;
}

.wheel {
  width: 6px;
  height: 10px;
  background: var(--primary-color);
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 3px;
  animation: scroll-wheel 1.5s ease infinite;
}

.arrow-container {
  height: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.scroll-arrow {
  display: block;
  width: 10px;
  height: 10px;
  border-right: 2px solid var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  transform: rotate(45deg);
  animation: scroll-arrows 1.5s infinite;
  opacity: 0;
}

.scroll-arrow:nth-child(1) {
  animation-delay: 0s;
}

.scroll-arrow:nth-child(2) {
  animation-delay: 0.3s;
}

.scroll-arrow:nth-child(3) {
  animation-delay: 0.6s;
}

.scroll-text {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 10px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.7;
}

@keyframes scroll-wheel {
  0% {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(15px);
    opacity: 0;
  }
}

@keyframes scroll-arrows {
  0% {
    opacity: 0;
    transform: rotate(45deg) translate(-5px, -5px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(45deg) translate(5px, 5px);
  }
}
</style> 