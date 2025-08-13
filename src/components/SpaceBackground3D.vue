<template>
  <div id="space-background" ref="backgroundContainer" style="pointer-events: none;"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import AnimationManager from '../utils/AnimationManager';

export default defineComponent({
  name: 'SpaceBackground3D',
  props: {
    backgroundColor: {
      type: String,
      default: '#010108' // Deep black-blue background
    }
  },
  setup(props) {
    const backgroundContainer = ref<HTMLElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Points;
    let backgroundParticles: THREE.Points;
    let deepSpaceParticles: THREE.Points;
    let largeParticles: THREE.Points;
    let interactiveParticles: THREE.Points; // New interactive particles that respond to cursor
    let galaxyClusters: THREE.Group;
    let connectionLines: THREE.LineSegments | null = null;
    let interactiveConnectionLines: THREE.LineSegments | null = null; // Connections between interactive particles
    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let scrollPosition = 0;
    let positions: Float32Array;
    let originalPositions: Float32Array;
    let interactivePositions: Float32Array; // Positions for interactive particles
    let interactiveOriginalPositions: Float32Array; // Original positions for interactive particles
    let particleCount = 2500;
    let backgroundParticleCount = 8000;
    let deepSpaceParticleCount = 12000;
    let largeParticleCount = 100;
    let interactiveParticleCount = 1500; // Count for interactive particles
    let raycaster: THREE.Raycaster;
    let mousePosition = new THREE.Vector2();
    let interactionRadius = 150; // Radius of interaction for mouse repulsion
    let repelStrength = 25; // Strength of repulsion effect

    const init = () => {
      if (!backgroundContainer.value) return;

      // Create scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(props.backgroundColor);
      
      // Add very subtle fog for depth, but less dense to see far objects
      scene.fog = new THREE.FogExp2(props.backgroundColor, 0.0001);
      
      // Set up camera with greater far clipping plane
      camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        1, 
        20000
      );
      camera.position.z = 1000;
      
      // Create galaxy clusters in the far background
      createGalaxyClusters();
      
      // Create ultra-deep space particles
      createDeepSpaceParticles();
      
      // Create regular background particles
      createBackgroundParticles();
      
      // Create larger, more prominent particles
      createLargeParticles();
      
      // Create interactive foreground particles
      createParticles();
      
      // Create mouse-interactive particles
      createInteractiveParticles();
      
      // Create connection lines between close particles
      createConnectionLines();
      
      // Create connections between interactive particles
      createInteractiveConnections();
      
      // Initialize raycaster for mouse interactions
      raycaster = new THREE.Raycaster();
      
      // Add some point lights
      addColoredLights();
      
      // Set up renderer with better quality
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(props.backgroundColor, 1);
      backgroundContainer.value.appendChild(renderer.domElement);
      
      // Set up event listeners
      document.addEventListener('mousemove', onDocumentMouseMove);
      window.addEventListener('scroll', onScroll);
      window.addEventListener('resize', onWindowResize);
      
      // Start animation using AnimationManager
      AnimationManager.addAnimation(animate, 0);
      
      console.log("Space background initialized");
    };
    
    // Create distant galaxy clusters for depth
    const createGalaxyClusters = () => {
      galaxyClusters = new THREE.Group();
      
      // Create 5-8 galaxy clusters at random far positions
      const clusterCount = 5 + Math.floor(Math.random() * 4);
      
      for (let i = 0; i < clusterCount; i++) {
        // Create a galaxy cluster at a very distant position
        const cluster = new THREE.Group();
        
        // Random position in the far background
        const distance = 10000 + Math.random() * 5000;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        cluster.position.set(
          distance * Math.sin(phi) * Math.cos(theta),
          distance * Math.sin(phi) * Math.sin(theta),
          distance * Math.cos(phi)
        );
        
        // Create galaxy core - a bright but small sphere
        const coreSize = 50 + Math.random() * 100;
        const coreGeometry = new THREE.SphereGeometry(coreSize, 16, 16);
        
        // Pick a color for the galaxy (subtle blues and purples)
        const galaxyColors = [
          0x3498db, // Blue
          0x9b59b6, // Purple
          0x6e44ff, // Deep purple
          0x00ffcc, // Cyan
        ];
        const galaxyColor = galaxyColors[Math.floor(Math.random() * galaxyColors.length)];
        
        // Create a glowing core material
        const coreMaterial = new THREE.MeshBasicMaterial({
          color: galaxyColor,
          transparent: true,
          opacity: 0.2,
        });
        
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        cluster.add(core);
        
        // Create galaxy dust - particles around the core
        const dustCount = 500 + Math.floor(Math.random() * 300);
        const dustGeometry = new THREE.BufferGeometry();
        const dustPositions = new Float32Array(dustCount * 3);
        const dustSizes = new Float32Array(dustCount);
        const dustColors = new Float32Array(dustCount * 3);
        
        // Create dust particles in a disc shape
        const discRadius = coreSize * (2 + Math.random() * 4);
        const discThickness = coreSize * 0.4;
        const color = new THREE.Color(galaxyColor);
        
        for (let j = 0; j < dustCount; j++) {
          const j3 = j * 3;
          
          // Calculate position in a disc shape
          const radius = Math.random() * discRadius;
          const angle = Math.random() * Math.PI * 2;
          const height = (Math.random() - 0.5) * discThickness;
          
          dustPositions[j3] = Math.cos(angle) * radius;
          dustPositions[j3 + 1] = Math.sin(angle) * radius;
          dustPositions[j3 + 2] = height;
          
          // Vary size by distance from center
          dustSizes[j] = 0.5 + (1.5 * (1 - radius / discRadius));
          
          // Color (fading from core to edge)
          const fadeFactor = 1 - (radius / discRadius); // 1 at center, 0 at edge
          dustColors[j3] = color.r * fadeFactor;
          dustColors[j3 + 1] = color.g * fadeFactor;
          dustColors[j3 + 2] = color.b * fadeFactor;
        }
        
        dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
        dustGeometry.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));
        dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
        
        const dustMaterial = new THREE.PointsMaterial({
          size: 5,
          transparent: true,
          opacity: 0.6,
          vertexColors: true,
          depthWrite: false,
          map: createCircleTexture(),
          blending: THREE.AdditiveBlending
        });
        
        const dust = new THREE.Points(dustGeometry, dustMaterial);
        cluster.add(dust);
        
        // Randomly rotate the cluster
        cluster.rotation.x = Math.random() * Math.PI;
        cluster.rotation.y = Math.random() * Math.PI;
        cluster.rotation.z = Math.random() * Math.PI;
        
        // Add subtle animation to the cluster
        const rotationSpeed = 0.00002 + Math.random() * 0.00002;
        cluster.userData = { rotationSpeed };
        
        galaxyClusters.add(cluster);
      }
      
      scene.add(galaxyClusters);
    };
    
    // Create a circular texture for particles
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      
      const context = canvas.getContext('2d');
      if (!context) return null;
      
      // Draw a circular gradient
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
      
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    };
    
    // Create ultra-deep space particles
    const createDeepSpaceParticles = () => {
      const dsGeometry = new THREE.BufferGeometry();
      const dsPositions = new Float32Array(deepSpaceParticleCount * 3);
      const dsColors = new Float32Array(deepSpaceParticleCount * 3);
      const dsSizes = new Float32Array(deepSpaceParticleCount);
      
      // Very distant stars - mostly tiny pinpoints
      const dsColorPalette = [
        new THREE.Color(0xffffff).multiplyScalar(0.8), // White
        new THREE.Color(0x00ffcc).multiplyScalar(0.3), // Very dim cyan
        new THREE.Color(0x3498db).multiplyScalar(0.3), // Very dim blue
        new THREE.Color(0xf1c40f).multiplyScalar(0.3), // Very dim yellow
        new THREE.Color(0xe74c3c).multiplyScalar(0.3)  // Very dim red
      ];
      
      // Create particles across a massive depth range
      for (let i = 0; i < deepSpaceParticleCount; i++) {
        const i3 = i * 3;
        
        // Position in deep space sphere
        const radius = 10000 + Math.random() * 8000; // Ultra-deep range
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        dsPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        dsPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        dsPositions[i3 + 2] = radius * Math.cos(phi);
        
        // Tiny sizes for distant stars
        dsSizes[i] = 0.5 + Math.random() * 1.5;
        
        // Colors
        const color = dsColorPalette[Math.floor(Math.random() * dsColorPalette.length)];
        dsColors[i3] = color.r;
        dsColors[i3 + 1] = color.g;
        dsColors[i3 + 2] = color.b;
      }
      
      dsGeometry.setAttribute('position', new THREE.BufferAttribute(dsPositions, 3));
      dsGeometry.setAttribute('color', new THREE.BufferAttribute(dsColors, 3));
      dsGeometry.setAttribute('size', new THREE.BufferAttribute(dsSizes, 1));
      
      // Material with minimal movement
      const dsMaterial = new THREE.ShaderMaterial({
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
            
            // Almost no movement - just tiny twinkling
            vec3 pos = position;
            
            // Subtle twinkling effect
            float twinkle = sin(time * 0.1 + position.x * 0.01 + position.y * 0.01 + position.z * 0.01);
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            // Size varies slightly with time for twinkling
            gl_PointSize = size * (0.8 + twinkle * 0.2) * pixelRatio * (1500.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            vec2 uv = gl_PointCoord.xy - 0.5;
            float circle = 1.0 - smoothstep(0.45, 0.5, length(uv));
            
            if (circle < 0.05) discard;
            
            gl_FragColor = vec4(vColor, circle * 0.6); // Very subtle particles
          }
        `,
        transparent: true,
        vertexColors: true,
        depthWrite: false
      });
      
      deepSpaceParticles = new THREE.Points(dsGeometry, dsMaterial);
      scene.add(deepSpaceParticles);
    };
    
    // Create background particles that don't connect but add depth
    const createBackgroundParticles = () => {
      const bgGeometry = new THREE.BufferGeometry();
      const bgPositions = new Float32Array(backgroundParticleCount * 3);
      const bgColors = new Float32Array(backgroundParticleCount * 3);
      const bgSizes = new Float32Array(backgroundParticleCount);
      
      // Deeper space color palette - more variety in colors
      const bgColorPalette = [
        new THREE.Color(0x00ffcc).multiplyScalar(0.5), // Dimmer cyan
        new THREE.Color(0x3498db).multiplyScalar(0.6), // Dimmer blue
        new THREE.Color(0x6e44ff).multiplyScalar(0.4), // Dimmer purple
        new THREE.Color(0xffffff).multiplyScalar(0.7), // Dimmer white
        new THREE.Color(0x4285F4).multiplyScalar(0.5), // Dimmer blue
        new THREE.Color(0xe74c3c).multiplyScalar(0.4), // Dimmer red
        new THREE.Color(0xf1c40f).multiplyScalar(0.4)  // Dimmer yellow
      ];
      
      // Create particles across a very deep range
      for (let i = 0; i < backgroundParticleCount; i++) {
        const i3 = i * 3;
        
        // Position in a much deeper sphere
        const radius = 1000 + Math.random() * 8000; // Much deeper range
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        bgPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        bgPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        bgPositions[i3 + 2] = radius * Math.cos(phi);
        
        // Occasionally add slightly larger particles
        if (Math.random() < 0.1) {
          bgSizes[i] = 3 + Math.random() * 4;
        } else {
          // Size varies by depth - farther particles are smaller
          const z = Math.abs(bgPositions[i3 + 2]);
          bgSizes[i] = 1 + (3 * (1 - (z / 9000)));
        }
        
        // Colors
        const color = bgColorPalette[Math.floor(Math.random() * bgColorPalette.length)];
        bgColors[i3] = color.r;
        bgColors[i3 + 1] = color.g;
        bgColors[i3 + 2] = color.b;
      }
      
      bgGeometry.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
      bgGeometry.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));
      bgGeometry.setAttribute('size', new THREE.BufferAttribute(bgSizes, 1));
      
      // Material with very subtle movement
      const bgMaterial = new THREE.ShaderMaterial({
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
            
            // Extremely subtle movement
            vec3 pos = position;
            float depth = abs(position.z) / 5000.0; // Normalize depth
            // Slower movement for distant particles
            float moveFactor = 0.1 * (1.0 - depth);
            
            pos.x += sin(time * 0.05 + position.z * 0.0001) * 2.0 * moveFactor;
            pos.y += cos(time * 0.05 + position.x * 0.0001) * 2.0 * moveFactor;
            pos.z += sin(time * 0.05 + position.y * 0.0001) * 2.0 * moveFactor;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            // Size attenuation
            gl_PointSize = size * pixelRatio * (1000.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            vec2 uv = gl_PointCoord.xy - 0.5;
            float circle = 1.0 - smoothstep(0.45, 0.5, length(uv));
            
            if (circle < 0.05) discard;
            
            gl_FragColor = vec4(vColor, circle * 0.8); // More subtle particles
          }
        `,
        transparent: true,
        vertexColors: true,
        depthWrite: false
      });
      
      backgroundParticles = new THREE.Points(bgGeometry, bgMaterial);
      scene.add(backgroundParticles);
    };
    
    const createLargeParticles = () => {
      const largeGeometry = new THREE.BufferGeometry();
      const largePositions = new Float32Array(largeParticleCount * 3);
      const largeColors = new Float32Array(largeParticleCount * 3);
      const largeSizes = new Float32Array(largeParticleCount);
      
      // Brighter and more colorful palette for large particles
      const largeColorPalette = [
        new THREE.Color(0x00ffcc), // Cyan
        new THREE.Color(0x3498db), // Blue
        new THREE.Color(0x9b59b6), // Purple
        new THREE.Color(0xe74c3c), // Red
        new THREE.Color(0xf1c40f)  // Yellow
      ];
      
      // Create large particles across a medium range (visible but not overwhelming)
      for (let i = 0; i < largeParticleCount; i++) {
        const i3 = i * 3;
        
        // Position in middle-distance space
        const radius = 600 + Math.random() * 800;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        largePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        largePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        largePositions[i3 + 2] = radius * Math.cos(phi);
        
        // Larger sizes - these are the prominent particles
        largeSizes[i] = 8 + Math.random() * 12;
        
        // Colors
        const color = largeColorPalette[Math.floor(Math.random() * largeColorPalette.length)];
        largeColors[i3] = color.r;
        largeColors[i3 + 1] = color.g;
        largeColors[i3 + 2] = color.b;
      }
      
      largeGeometry.setAttribute('position', new THREE.BufferAttribute(largePositions, 3));
      largeGeometry.setAttribute('color', new THREE.BufferAttribute(largeColors, 3));
      largeGeometry.setAttribute('size', new THREE.BufferAttribute(largeSizes, 1));
      
      // Create a glow texture for the large particles
      const glowTexture = createGlowTexture();
      
      // Material with more prominent movement
      const largeMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pixelRatio: { value: window.devicePixelRatio },
          texture: { value: glowTexture }
        },
        vertexShader: `
          attribute float size;
          varying vec3 vColor;
          uniform float time;
          uniform float pixelRatio;
          
          void main() {
            vColor = color;
            
            // More noticeable movement
            vec3 pos = position;
            
            // Large, slow orbital motion
            float angle = time * 0.2;
            float radius = length(position.xz);
            float originalY = position.y;
            
            // Different movement patterns based on position
            if (length(position) > 900.0) {
              // Outer particles move in larger orbits
              pos.x = radius * cos(angle + position.z * 0.01);
              pos.z = radius * sin(angle + position.x * 0.01);
              pos.y = originalY + sin(time * 0.3 + position.x * 0.02) * 20.0;
            } else {
              // Inner particles have more wave-like motion
              pos.x += sin(time * 0.3 + position.z * 0.05) * 15.0;
              pos.y += cos(time * 0.2 + position.x * 0.05) * 15.0;
              pos.z += sin(time * 0.4 + position.y * 0.05) * 15.0;
            }
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            // Size attenuation with distance, but keep them relatively large
            gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D texture;
          varying vec3 vColor;
          
          void main() {
            // Use texture for glow effect
            vec4 texColor = texture2D(texture, gl_PointCoord);
            gl_FragColor = vec4(vColor, 1.0) * texColor;
          }
        `,
        transparent: true,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      
      largeParticles = new THREE.Points(largeGeometry, largeMaterial);
      scene.add(largeParticles);
    };
    
    // Create a glow texture for large particles
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      
      const context = canvas.getContext('2d');
      if (!context) return null;
      
      // Draw a soft circular gradient for glow effect
      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
      
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    };
    
    const createParticles = () => {
      // Create particles
      const particlesGeometry = new THREE.BufferGeometry();
      positions = new Float32Array(particleCount * 3);
      originalPositions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      const colorPalette = [
        new THREE.Color(0x00ffcc), // Cyan like in Hero
        new THREE.Color(0x6e44ff), // Purple from Hero
        new THREE.Color(0x3498db), // Blue
        new THREE.Color(0x9b59b6), // Purple
        new THREE.Color(0x4285F4)  // Google Blue
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
        
        // Vary particle sizes - with more variation
        const z = Math.abs(positions[i3 + 2]);
        sizes[i] = 2 + Math.random() * 4 * (1 - (z / 2000)); // Size decreases with distance
        
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
            
            // Add subtle movement - slowed down
            vec3 pos = position;
            pos.x += sin(time * 0.15 + position.z * 0.01) * 3.0;
            pos.y += cos(time * 0.15 + position.x * 0.01) * 3.0;
            pos.z += sin(time * 0.15 + position.y * 0.01) * 3.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            // Size attenuation
            gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            // Create a circular particle with softer edge
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
    };
    
    // Create interactive particles that respond to mouse movement
    const createInteractiveParticles = () => {
      const geometry = new THREE.BufferGeometry();
      interactivePositions = new Float32Array(interactiveParticleCount * 3);
      interactiveOriginalPositions = new Float32Array(interactiveParticleCount * 3);
      const colors = new Float32Array(interactiveParticleCount * 3);
      const sizes = new Float32Array(interactiveParticleCount);
      
      // Color palette similar to what was shown in the sample
      const colorPalette = [
        new THREE.Color(0x3498db), // Blue
        new THREE.Color(0x2ecc71), // Green
        new THREE.Color(0x9b59b6), // Purple
        new THREE.Color(0xe74c3c),  // Red
        new THREE.Color(0xf39c12)   // Yellow
      ];
      
      // Create particles in a plane closer to the camera
      for (let i = 0; i < interactiveParticleCount; i++) {
        const i3 = i * 3;
        
        // Position in a disc shape in front of camera - more 2D for better interaction
        const radius = Math.sqrt(Math.random()) * 800; // Square root for more even distribution
        const theta = Math.random() * Math.PI * 2;
        
        // Positions are more focused in x-y plane for better mouse interaction
        interactivePositions[i3] = interactiveOriginalPositions[i3] = radius * Math.cos(theta);
        interactivePositions[i3 + 1] = interactiveOriginalPositions[i3 + 1] = radius * Math.sin(theta);
        // Vary z slightly to create some depth but keep close to interaction plane
        interactivePositions[i3 + 2] = interactiveOriginalPositions[i3 + 2] = (Math.random() - 0.5) * 300;
        
        // Vary particle sizes as in the sample
        sizes[i] = 2 + Math.random() * 4;
        
        // Color from palette
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(interactivePositions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      // Custom shader for interactive particles - same as sample
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
            
            // Add subtle movement similar to sample
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
      
      interactiveParticles = new THREE.Points(geometry, material);
      interactiveParticles.position.z = 200; // Position closer to camera for better interaction
      scene.add(interactiveParticles);
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
        color: 0x888888, // Changed from 0x00ffcc (cyan) to grey
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
    
    // Create connections between interactive particles
    const createInteractiveConnections = () => {
      // Remove existing lines
      if (interactiveConnectionLines) {
        scene.remove(interactiveConnectionLines);
        if (interactiveConnectionLines.geometry) interactiveConnectionLines.geometry.dispose();
        if (interactiveConnectionLines.material && !Array.isArray(interactiveConnectionLines.material)) {
          interactiveConnectionLines.material.dispose();
        }
      }
      
      // Connection line material - using white with reduced opacity
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x888888, // Changed from white to grey
        transparent: true,
        opacity: 0.2,
        depthWrite: false
      });
      
      // Create geometry for lines
      const lineGeometry = new THREE.BufferGeometry();
      const linePositions = new Float32Array(interactiveParticleCount * 2 * 3); // Each line connects 2 points
      
      // Initially set all line positions to zero - we'll update them dynamically
      for (let i = 0; i < linePositions.length; i++) {
        linePositions[i] = 0;
      }
      
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
      
      // Create mesh
      interactiveConnectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
      scene.add(interactiveConnectionLines);
    };
    
    // Update connections between interactive particles
    const updateInteractiveConnections = () => {
      if (!interactiveConnectionLines || !interactivePositions) return;
      
      const positionAttribute = interactiveParticles.geometry.getAttribute('position');
      const linePositions = interactiveConnectionLines.geometry.getAttribute('position').array as Float32Array;
      
      let lineIndex = 0;
      const connectionDistance = 70; // Reduced distance for fewer connections
      const connectionDistanceSq = connectionDistance * connectionDistance;
      
      // For each particle, find close neighbors
      for (let i = 0; i < interactiveParticleCount; i++) {
        const i3 = i * 3;
        const px = positionAttribute.array[i3];
        const py = positionAttribute.array[i3 + 1];
        const pz = positionAttribute.array[i3 + 2];
        
        // Check only a few particles for connections (even fewer connections)
        for (let j = i + 1; j < Math.min(i + 20, interactiveParticleCount); j++) {
          const j3 = j * 3;
          
          // Calculate distance squared
          const dx = positionAttribute.array[j3] - px;
          const dy = positionAttribute.array[j3 + 1] - py;
          const dz = positionAttribute.array[j3 + 2] - pz;
          const distSq = dx * dx + dy * dy + dz * dz;
          
          // If particles are close enough and we haven't exceeded our line limit
          if (distSq < connectionDistanceSq && lineIndex < linePositions.length - 6) {
            // Add a random condition to further reduce connections (only ~30% of eligible connections)
            if (Math.random() < 0.3) {
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
      }
      
      // Clear the remaining line segments
      for (let i = lineIndex; i < linePositions.length; i++) {
        linePositions[i] = 0;
      }
      
      interactiveConnectionLines.geometry.getAttribute('position').needsUpdate = true;
    };
    
    // Add colored lights to the scene
    const addColoredLights = () => {
      // Match the colors in the Hero component
      const colors = [0x888888, 0x6e44ff, 0x4285F4, 0x9b59b6];
      
      colors.forEach((color, index) => {
        const light = new THREE.PointLight(color, 0.5, 1000);
        const angle = (index / colors.length) * Math.PI * 2;
        const radius = 500;
        
        light.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          Math.sin(angle + Math.PI) * radius * 0.3
        );
        
        scene.add(light);
      });
      
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);
      
      // Add a distant bright light to simulate a distant star
      const distantLight = new THREE.PointLight(0xffffff, 0.2, 15000);
      distantLight.position.set(5000, 3000, -8000);
      scene.add(distantLight);
    };
    
    // Handle mouse movement for interaction
    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 2;
      mouseY = (event.clientY - windowHalfY) * 2;
      
      // Update normalized mouse position for raycaster
      mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Add subtle camera movement for parallax effect
      if (camera) {
        // Move camera very slightly based on mouse to create parallax
        const targetX = (event.clientX / window.innerWidth - 0.5) * 10;
        const targetY = (event.clientY / window.innerHeight - 0.5) * -10;
        
        camera.position.x += (targetX - camera.position.x) * 0.01;
        camera.position.y += (targetY - camera.position.y) * 0.01;
        camera.lookAt(scene.position);
      }
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
      // Update shader time uniforms for all particle systems
      const time = performance.now() * 0.001;
      
      if (particles.material instanceof THREE.ShaderMaterial) {
        particles.material.uniforms.time.value = time;
      }
      
      if (backgroundParticles.material instanceof THREE.ShaderMaterial) {
        backgroundParticles.material.uniforms.time.value = time;
      }
      
      if (deepSpaceParticles.material instanceof THREE.ShaderMaterial) {
        deepSpaceParticles.material.uniforms.time.value = time;
      }
      
      if (largeParticles.material instanceof THREE.ShaderMaterial) {
        largeParticles.material.uniforms.time.value = time;
      }
      
      if (interactiveParticles.material instanceof THREE.ShaderMaterial) {
        interactiveParticles.material.uniforms.time.value = time;
      }
      
      // Animate galaxy clusters
      if (galaxyClusters) {
        galaxyClusters.children.forEach(cluster => {
          if (cluster.userData && cluster.userData.rotationSpeed) {
            cluster.rotation.y += cluster.userData.rotationSpeed;
          }
        });
      }
      
      // Create wave-like distortion effect for regular particles
      if (particles.geometry.getAttribute('position')) {
        const positionAttribute = particles.geometry.getAttribute('position');
        
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          
          // Calculate distance from mouse 
          const dx = originalPositions[i3] - mouseX;
          const dy = originalPositions[i3 + 1] - mouseY;
          const dz = originalPositions[i3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          // Add wave effect based on mouse position - slowed down movement
          const waveX = Math.sin(time * 0.5 + distance * 0.002) * 15.0;
          const waveY = Math.cos(time * 0.5 + distance * 0.002) * 15.0;
          const waveZ = Math.sin(time * 0.3 + distance * 0.002) * 15.0;
          
          // Enhanced scroll effect - particles create waves based on scroll position
          const scrollFactor = scrollPosition * 0.02;
          const scrollWave = Math.sin(originalPositions[i3 + 2] * 0.005 + scrollFactor) * 10.0;
          
          positions[i3] = originalPositions[i3] + waveX + scrollWave * 0.2;
          // Y position affected more by scrolling for a dramatic effect
          positions[i3 + 1] = originalPositions[i3 + 1] + waveY - (scrollPosition * 0.1) * (originalPositions[i3 + 2] / 2000);
          positions[i3 + 2] = originalPositions[i3 + 2] + waveZ + scrollWave * 0.1;
        }
        
        positionAttribute.needsUpdate = true;
      }
      
      // Handle interactive particles repulsion from mouse cursor
      if (interactiveParticles.geometry.getAttribute('position')) {
        // Update raycaster using mouse position
        raycaster.setFromCamera(mousePosition, camera);
        
        const positionAttribute = interactiveParticles.geometry.getAttribute('position');
        
        // Get mouse position in world space
        const mouseRay = raycaster.ray;
        const mouseWorldPos = new THREE.Vector3();
        
        // Project mouse position to z=200 plane (where interactive particles are)
        const planeZ = 200; 
        const distToPlane = (planeZ - camera.position.z) / mouseRay.direction.z;
        mouseWorldPos.copy(camera.position).add(mouseRay.direction.multiplyScalar(distToPlane));
        
        // Update each particle
        for (let i = 0; i < interactiveParticleCount; i++) {
          const i3 = i * 3;
          
          // Current position
          const px = positionAttribute.array[i3];
          const py = positionAttribute.array[i3 + 1];
          const pz = positionAttribute.array[i3 + 2];
          
          // Calculate distance to mouse
          const dx = px - mouseWorldPos.x;
          const dy = py - mouseWorldPos.y;
          const dz = pz - mouseWorldPos.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          // Add wave effect based on mouse position as in sample
          const waveX = Math.sin(time * 0.5 + distance * 0.01) * 20.0;
          const waveY = Math.cos(time * 0.5 + distance * 0.01) * 20.0;
          const waveZ = Math.sin(time * 0.3 + distance * 0.01) * 20.0;
          
          // Set new position
          if (distance < interactionRadius) {
            // Apply repulsion force - stronger the closer to mouse
            const force = 1.0 - distance / interactionRadius;
            const repelX = dx / distance * repelStrength * force;
            const repelY = dy / distance * repelStrength * force;
            
            // Mix repulsion with wave motion similar to sample
            positionAttribute.array[i3] = interactiveOriginalPositions[i3] + repelX + waveX * 0.3;
            positionAttribute.array[i3 + 1] = interactiveOriginalPositions[i3 + 1] + repelY + waveY * 0.3;
            positionAttribute.array[i3 + 2] = interactiveOriginalPositions[i3 + 2] + waveZ * 0.3;
          } else {
            // Wave motion when not under mouse influence
            positionAttribute.array[i3] = interactiveOriginalPositions[i3] + waveX * 0.3;
            positionAttribute.array[i3 + 1] = interactiveOriginalPositions[i3 + 1] + waveY * 0.3;
            positionAttribute.array[i3 + 2] = interactiveOriginalPositions[i3 + 2] + waveZ * 0.3;
          }
        }
        
        positionAttribute.needsUpdate = true;
      }
      
      // Update connection lines
      updateConnections();
      updateInteractiveConnections();
      
      // Rotate particles based on mouse position
      if (particles) {
        particles.rotation.x += 0.0001;
        particles.rotation.y += 0.0002;
        
        // Apply mouse movement influence
        particles.rotation.x += (mouseY * 0.00001 - particles.rotation.x) * 0.03;
        particles.rotation.y += (mouseX * 0.00001 - particles.rotation.y) * 0.03;
      }
      
      // Very slow rotation for background particles
      if (backgroundParticles) {
        backgroundParticles.rotation.y += 0.00005;
      }
      
      // Extremely slow rotation for deep space
      if (deepSpaceParticles) {
        deepSpaceParticles.rotation.y += 0.00002;
      }
      
      // Large particles have their own motion defined in shader, add slight rotation
      if (largeParticles) {
        largeParticles.rotation.y += 0.0001;
      }
      
      // Very subtle rotation for interactive particles
      if (interactiveParticles) {
        interactiveParticles.rotation.z += 0.0001;
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
      window.removeEventListener('scroll', onScroll);
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
      
      if (connectionLines) {
        if (connectionLines.geometry) connectionLines.geometry.dispose();
        if (connectionLines.material && !Array.isArray(connectionLines.material)) {
          connectionLines.material.dispose();
        }
      }
      
      if (renderer) {
        if (backgroundContainer.value && renderer.domElement.parentElement === backgroundContainer.value) {
          backgroundContainer.value.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      
      // Additional cleanup for background particles
      if (backgroundParticles) {
        if (backgroundParticles.geometry) backgroundParticles.geometry.dispose();
        if (backgroundParticles.material) {
          if (Array.isArray(backgroundParticles.material)) {
            backgroundParticles.material.forEach(material => material.dispose());
          } else {
            backgroundParticles.material.dispose();
          }
        }
      }
      
      // Additional cleanup for deep space particles
      if (deepSpaceParticles) {
        if (deepSpaceParticles.geometry) deepSpaceParticles.geometry.dispose();
        if (deepSpaceParticles.material) {
          if (Array.isArray(deepSpaceParticles.material)) {
            deepSpaceParticles.material.forEach(material => material.dispose());
          } else {
            deepSpaceParticles.material.dispose();
          }
        }
      }
      
      // Cleanup for galaxy clusters
      if (galaxyClusters) {
        galaxyClusters.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
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
      
      // Additional cleanup for large particles
      if (largeParticles) {
        if (largeParticles.geometry) largeParticles.geometry.dispose();
        if (largeParticles.material) {
          if (Array.isArray(largeParticles.material)) {
            largeParticles.material.forEach(material => material.dispose());
          } else {
            largeParticles.material.dispose();
          }
        }
      }
      
      // Cleanup for interactive particles
      if (interactiveParticles) {
        if (interactiveParticles.geometry) interactiveParticles.geometry.dispose();
        if (interactiveParticles.material) {
          if (Array.isArray(interactiveParticles.material)) {
            interactiveParticles.material.forEach(material => material.dispose());
          } else {
            interactiveParticles.material.dispose();
          }
        }
      }
      
      // Cleanup for interactive connection lines
      if (interactiveConnectionLines) {
        if (interactiveConnectionLines.geometry) interactiveConnectionLines.geometry.dispose();
        if (interactiveConnectionLines.material && !Array.isArray(interactiveConnectionLines.material)) {
          interactiveConnectionLines.material.dispose();
        }
      }
      
      console.log("Space background cleaned up");
    });
    
    return {
      backgroundContainer
    };
  }
});
</script>

<style scoped>
#space-background {
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