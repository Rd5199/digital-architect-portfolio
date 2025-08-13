<template>
  <div id="floating-text-container" ref="textContainer"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

export default defineComponent({
  name: 'FloatingText3D',
  props: {
    text: {
      type: String,
      default: 'PORTFOLIO'
    },
    followCursor: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: '#3498db'
    },
    size: {
      type: Number,
      default: 0.5
    },
    depth: {
      type: Number,
      default: 0.1
    },
    fontUrl: {
      type: String,
      default: '/assets/fonts/helvetiker_bold.typeface.json'
    }
  },
  setup(props) {
    const textContainer = ref<HTMLElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let textMesh: THREE.Mesh;
    let mouse = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    let animationFrameId: number;
    
    const init = () => {
      if (!textContainer.value) return;
      
      // Create scene
      scene = new THREE.Scene();
      
      // Set up camera
      const aspect = window.innerWidth / window.innerHeight;
      camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
      camera.position.z = 5;
      
      // Set up renderer
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      textContainer.value.appendChild(renderer.domElement);
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 1, 1);
      scene.add(directionalLight);
      
      // Create text
      loadFont();
      
      // Set up event listeners
      if (props.followCursor) {
        document.addEventListener('mousemove', onDocumentMouseMove);
      }
      window.addEventListener('resize', onWindowResize);
      
      // Start animation loop
      animate();
    };
    
    const loadFont = () => {
      const fontLoader = new FontLoader();
      
      // Use an absolute path to ensure the font is found
      const fontUrl = `${window.location.origin}/assets/fonts/helvetiker_bold.typeface.json`;
      console.log('Attempting to load font from:', fontUrl);
      
      fontLoader.load(
        fontUrl,
        (font) => {
          console.log('Font loaded successfully:', font);
          const textGeometry = new TextGeometry(props.text, {
            font: font,
            size: props.size,
            height: props.depth,
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 3
          });
          
          textGeometry.computeBoundingBox();
          
          if (textGeometry.boundingBox) {
            const centerX = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
            textGeometry.translate(centerX, 0, 0);
          }
          
          // Material with shiny metallic look
          const textMaterial = [
            new THREE.MeshPhongMaterial({ 
              color: new THREE.Color(props.color),
              specular: 0xffffff,
              shininess: 100,
              emissive: new THREE.Color(props.color).multiplyScalar(0.2)
            }),
            new THREE.MeshPhongMaterial({ 
              color: new THREE.Color(props.color).multiplyScalar(0.8),
              specular: 0x222222,
              shininess: 50
            })
          ];
          
          textMesh = new THREE.Mesh(textGeometry, textMaterial);
          scene.add(textMesh);
          
          // Add glow effect
          addGlowEffect(textMesh);
        },
        (progress) => console.log('Font loading progress:', progress),
        (error) => console.error('Font loading error:', error)
      );
    };
    
    const addGlowEffect = (mesh: THREE.Mesh) => {
      // Clone geometry for glow effect
      const glowGeometry = mesh.geometry.clone();
      
      // Create glow material
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(props.color) }
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(color, 1.0) * intensity;
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      
      // Create glow mesh
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.scale.multiplyScalar(1.1);
      mesh.add(glowMesh);
    };
    
    const onDocumentMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Set target rotation based on mouse position
      targetRotation.x = mouse.y * 0.5;
      targetRotation.y = mouse.x * 0.5;
    };
    
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Smoothly rotate text to follow mouse
      if (textMesh) {
        textMesh.rotation.x += (targetRotation.x - textMesh.rotation.x) * 0.05;
        textMesh.rotation.y += (targetRotation.y - textMesh.rotation.y) * 0.05;
        
        // Add a subtle floating motion
        textMesh.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        
        // Add a subtle pulsing effect to the scale
        const pulseScale = 1 + Math.sin(Date.now() * 0.002) * 0.02;
        textMesh.scale.set(pulseScale, pulseScale, pulseScale);
      }
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    onMounted(() => {
      // Wait a bit for the DOM to be fully ready
      setTimeout(init, 100);
    });
    
    onBeforeUnmount(() => {
      if (textContainer.value && renderer) {
        textContainer.value.removeChild(renderer.domElement);
      }
      
      if (props.followCursor) {
        document.removeEventListener('mousemove', onDocumentMouseMove);
      }
      window.removeEventListener('resize', onWindowResize);
      
      cancelAnimationFrame(animationFrameId);
      
      // Dispose resources
      if (textMesh) {
        if (textMesh.geometry) textMesh.geometry.dispose();
        if (Array.isArray(textMesh.material)) {
          textMesh.material.forEach(material => material.dispose());
        } else if (textMesh.material) {
          textMesh.material.dispose();
        }
      }
      
      if (renderer) renderer.dispose();
    });
    
    return {
      textContainer
    };
  }
});
</script>

<style scoped>
#floating-text-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}
</style> 