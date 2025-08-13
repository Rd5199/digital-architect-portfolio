<template>
  <div id="transition-scene" ref="sceneContainer"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { gsap } from 'gsap';

export default defineComponent({
  name: 'TransitionScene',
  props: {
    transitionIn: {
      type: Boolean,
      default: false
    },
    transitionOut: {
      type: Boolean,
      default: false
    },
    transitionColor: {
      type: String,
      default: '#2c3e50'
    },
    duration: {
      type: Number,
      default: 1.0
    },
    transitionType: {
      type: String,
      default: 'cube' // cube, vortex, dissolve
    }
  },
  emits: ['transitionComplete'],
  setup(props, { emit }) {
    const sceneContainer = ref<HTMLElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let mesh: THREE.Mesh | THREE.Group | null = null;
    let animationFrameId: number;
    let currentAnimation: gsap.core.Tween | null = null;
    
    const init = () => {
      if (!sceneContainer.value) return;
      
      // Create scene
      scene = new THREE.Scene();
      
      // Set up camera
      const aspect = window.innerWidth / window.innerHeight;
      camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
      camera.position.z = 5;
      
      // Set up renderer
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: false 
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(new THREE.Color(props.transitionColor), 0);
      sceneContainer.value.appendChild(renderer.domElement);
      
      // Create transition mesh based on type
      createTransitionMesh();
      
      // Set up event listeners
      window.addEventListener('resize', onWindowResize);
      
      // Start animation loop
      animate();
      
      // Start transition if needed
      if (props.transitionIn) {
        transitionIn();
      }
      if (props.transitionOut) {
        transitionOut();
      }
    };
    
    const createTransitionMesh = () => {
      // Clear existing mesh
      if (mesh) {
        scene.remove(mesh);
        if (mesh instanceof THREE.Mesh) {
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material && !Array.isArray(mesh.material)) {
            mesh.material.dispose();
          }
        }
      }
      
      switch (props.transitionType) {
        case 'cube':
          createCubeTransition();
          break;
        case 'vortex':
          createVortexTransition();
          break;
        case 'dissolve':
          createDissolveTransition();
          break;
        default:
          createCubeTransition();
      }
    };
    
    const createCubeTransition = () => {
      // Create a cube covering the entire screen
      const geometry = new THREE.BoxGeometry(10, 6, 0.1);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(props.transitionColor),
        transparent: true,
        opacity: 0
      });
      
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      
      // Position for initial animation
      mesh.scale.set(0.001, 0.001, 0.001);
      mesh.rotation.set(Math.PI / 4, Math.PI / 4, 0);
    };
    
    const createVortexTransition = () => {
      // Create a group for all spiral segments
      mesh = new THREE.Group();
      
      // Create spiral segments
      const segments = 24;
      const totalRotation = Math.PI * 4;
      const segmentAngle = totalRotation / segments;
      const color = new THREE.Color(props.transitionColor);
      
      for (let i = 0; i < segments; i++) {
        const angle = i * segmentAngle;
        const radius = 0.5 + i * 0.2;
        
        const segmentGeometry = new THREE.PlaneGeometry(radius * 2, 0.2);
        const segmentMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0
        });
        
        const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
        segment.position.x = Math.cos(angle) * (radius / 2);
        segment.position.y = Math.sin(angle) * (radius / 2);
        segment.rotation.z = angle + Math.PI / 2;
        
        mesh.add(segment);
      }
      
      scene.add(mesh);
      
      // Position for initial animation
      mesh.scale.set(0.001, 0.001, 0.001);
    };
    
    const createDissolveTransition = () => {
      // Create a plane covering the screen with a custom shader
      const geometry = new THREE.PlaneGeometry(10, 6);
      
      const material = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(props.transitionColor) },
          progress: { value: 0.0 },
          noiseScale: { value: 10.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform float progress;
          uniform float noiseScale;
          varying vec2 vUv;
          
          // Simple pseudo-random noise function
          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
          }
          
          void main() {
            vec2 scaled = vUv * noiseScale;
            float noise = random(scaled);
            
            // Stepped transition based on progress and noise
            float alpha = step(noise, progress);
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
      });
      
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    };
    
    const transitionIn = () => {
      if (!mesh) return;
      
      // Cancel any existing animation
      if (currentAnimation) currentAnimation.kill();
      
      // Reset properties
      if (props.transitionType === 'dissolve' && mesh instanceof THREE.Mesh && 
          mesh.material instanceof THREE.ShaderMaterial) {
        mesh.material.uniforms.progress.value = 0.0;
        
        // Animate progress value for dissolve effect
        currentAnimation = gsap.to(mesh.material.uniforms.progress, {
          value: 1.0,
          duration: props.duration,
          ease: "power2.inOut",
          onComplete: () => {
            emit('transitionComplete', 'in');
          }
        });
      } else if (props.transitionType === 'vortex') {
        mesh.scale.set(5, 5, 5);
        mesh.rotation.z = -Math.PI * 2;
        
        // Reset opacity of all spiral segments
        mesh.children.forEach(segment => {
          if (segment instanceof THREE.Mesh && !Array.isArray(segment.material)) {
            segment.material.opacity = 0;
          }
        });
        
        // Animate each segment with a staggered delay
        mesh.children.forEach((segment, index) => {
          if (segment instanceof THREE.Mesh && !Array.isArray(segment.material)) {
            gsap.to(segment.material, {
              opacity: 1,
              duration: props.duration * 0.5,
              delay: (index / mesh.children.length) * props.duration * 0.5,
            });
          }
        });
        
        // Animate the entire vortex
        currentAnimation = gsap.to(mesh.rotation, {
          z: 0,
          duration: props.duration,
          ease: "power2.inOut",
          onComplete: () => {
            emit('transitionComplete', 'in');
          }
        });
      } else {
        // For cube transition
        mesh.scale.set(0.001, 0.001, 0.001);
        mesh.rotation.set(Math.PI / 4, Math.PI / 4, 0);
        
        if (mesh instanceof THREE.Mesh && !Array.isArray(mesh.material)) {
          mesh.material.opacity = 1;
        }
        
        // Animate scale and rotation
        gsap.to(mesh.scale, {
          x: 5,
          y: 5,
          z: 5,
          duration: props.duration,
          ease: "power2.inOut"
        });
        
        currentAnimation = gsap.to(mesh.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: props.duration,
          ease: "power2.inOut",
          onComplete: () => {
            emit('transitionComplete', 'in');
          }
        });
      }
    };
    
    const transitionOut = () => {
      if (!mesh) return;
      
      // Cancel any existing animation
      if (currentAnimation) currentAnimation.kill();
      
      if (props.transitionType === 'dissolve' && mesh instanceof THREE.Mesh && 
          mesh.material instanceof THREE.ShaderMaterial) {
        mesh.material.uniforms.progress.value = 1.0;
        
        // Animate progress value for dissolve effect
        currentAnimation = gsap.to(mesh.material.uniforms.progress, {
          value: 0.0,
          duration: props.duration,
          ease: "power2.inOut",
          onComplete: () => {
            emit('transitionComplete', 'out');
          }
        });
      } else if (props.transitionType === 'vortex') {
        mesh.scale.set(5, 5, 5);
        mesh.rotation.z = 0;
        
        // Reset opacity of all spiral segments
        mesh.children.forEach(segment => {
          if (segment instanceof THREE.Mesh && !Array.isArray(segment.material)) {
            segment.material.opacity = 1;
          }
        });
        
        // Animate each segment with a staggered delay
        mesh.children.forEach((segment, index) => {
          if (segment instanceof THREE.Mesh && !Array.isArray(segment.material)) {
            gsap.to(segment.material, {
              opacity: 0,
              duration: props.duration * 0.5,
              delay: (1 - (index / mesh.children.length)) * props.duration * 0.5,
            });
          }
        });
        
        // Animate the entire vortex
        currentAnimation = gsap.to(mesh.rotation, {
          z: Math.PI * 2,
          duration: props.duration,
          ease: "power2.inOut",
          onComplete: () => {
            emit('transitionComplete', 'out');
          }
        });
      } else {
        // For cube transition
        mesh.scale.set(5, 5, 5);
        mesh.rotation.set(0, 0, 0);
        
        if (mesh instanceof THREE.Mesh && !Array.isArray(mesh.material)) {
          mesh.material.opacity = 1;
        }
        
        // Animate scale and rotation
        gsap.to(mesh.scale, {
          x: 0.001,
          y: 0.001,
          z: 0.001,
          duration: props.duration,
          ease: "power2.inOut"
        });
        
        currentAnimation = gsap.to(mesh.rotation, {
          x: -Math.PI / 4,
          y: -Math.PI / 4,
          z: 0,
          duration: props.duration,
          ease: "power2.inOut",
          onComplete: () => {
            if (mesh instanceof THREE.Mesh && !Array.isArray(mesh.material)) {
              mesh.material.opacity = 0;
            }
            emit('transitionComplete', 'out');
          }
        });
      }
    };
    
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    onMounted(() => {
      // Wait a bit for the DOM to be fully ready
      setTimeout(init, 100);
    });
    
    onBeforeUnmount(() => {
      if (sceneContainer.value && renderer) {
        sceneContainer.value.removeChild(renderer.domElement);
      }
      
      window.removeEventListener('resize', onWindowResize);
      
      cancelAnimationFrame(animationFrameId);
      
      // Kill any active animations
      if (currentAnimation) currentAnimation.kill();
      
      // Dispose resources
      if (mesh) {
        if (mesh instanceof THREE.Mesh) {
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(material => material.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        } else {
          // Dispose Group materials and geometries
          mesh.traverse(child => {
            if (child instanceof THREE.Mesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach(material => material.dispose());
                } else {
                  child.material.dispose();
                }
              }
            }
          });
        }
      }
      
      if (renderer) renderer.dispose();
    });
    
    return {
      sceneContainer
    };
  }
});
</script>

<style scoped>
#transition-scene {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  pointer-events: none;
  overflow: hidden;
}
</style> 