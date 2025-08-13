<template>
  <div ref="container" class="section-bg-3d"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import * as THREE from 'three';
import SharedWebGL from '../utils/SharedWebGL'; // Import SharedWebGL
import AnimationManager from '../utils/AnimationManager'; // For adding its own animation

export default defineComponent({
  name: 'SectionBackground3D',
  props: {
    sectionId: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#3498db' // Default to a blue color
    },
    density: {
      type: Number,
      default: 5 // Adjusted default density
    }
  },
  setup(props) {
    const container = ref<HTMLElement | null>(null); // This div might just be for positioning reference
    let sectionScene: THREE.Scene; // This component will manage its own scene
    let sectionCamera: THREE.PerspectiveCamera; // And its own camera
    let particles: THREE.Points;
    // let animationFrameId: number; // Animation will be driven by AnimationManager
    let sectionElement: HTMLElement | null = null; // The actual <section> element this background is for
    
    let sharedWebGL: ReturnType<typeof SharedWebGL.getInstance>;
    const sceneName = `section-${props.sectionId}`;

    const init = async () => {
      await nextTick(); // Ensure DOM is ready, especially sectionElement
      if (!container.value) {
        console.warn(`SectionBackground3D (${props.sectionId}): Container ref not found.`);
        return;
      }
      
      sectionElement = document.getElementById(props.sectionId);
      if (!sectionElement) {
        console.warn(`SectionBackground3D (${props.sectionId}): Target section element #${props.sectionId} not found.`);
        return;
      }

      sharedWebGL = SharedWebGL.getInstance();
      if (!sharedWebGL || !sharedWebGL.renderer) {
        console.error(`SectionBackground3D (${props.sectionId}): SharedWebGL renderer not available.`);
        return;
      }

      // 1. Create a unique scene for this section's background objects
      sectionScene = new THREE.Scene();
      
      // 2. Set up a camera for this section's scene
      // The camera's properties will be updated based on the sectionElement's dimensions and position.
      const rect = sectionElement.getBoundingClientRect();
      sectionCamera = new THREE.PerspectiveCamera(75, rect.width / Math.max(1, rect.height), 0.1, 1000);
      sectionCamera.position.z = 150; // Adjust as needed, relative to particles in sectionScene

      // 3. Create particles and add them to sectionScene
      createParticles();
      
      // 4. Register this scene with SharedWebGL for rendering
      // The updatePosition function will also need to inform SharedWebGL about viewport changes
      sharedWebGL.registerSubScene({
        name: sceneName,
        scene: sectionScene,
        camera: sectionCamera,
        containerElement: container.value, // The div managed by this component
        targetElement: sectionElement,     // The actual <section> this bg is for
        updateCallback: updateSubSceneView // Callback to update camera/viewport
      });
      
      // Initial position and size update
      updatePositionAndInformSharedWebGL();

      // Event listeners
      window.addEventListener('resize', updatePositionAndInformSharedWebGL);
      window.addEventListener('scroll', updatePositionAndInformSharedWebGL, { passive: true });
      
      // Add this component's animate function to the global animation loop
      AnimationManager.addAnimation(animateParticles, 2); // Lower priority than cursor/main bg

      console.log(`SectionBackground3D for ${props.sectionId} initialized to use SharedWebGL.`);
    };

    const updateSubSceneView = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, targetElement: HTMLElement) => {
      if (!sectionElement || !sharedWebGL || !sharedWebGL.renderer) return;

      const mainCanvas = sharedWebGL.renderer.domElement;
      const mainCanvasRect = mainCanvas.getBoundingClientRect(); // This is the reference for viewport coords

      const rect = targetElement.getBoundingClientRect(); // Get current screen position of the target section

      // Calculate viewport relative to the main canvas
      // The main canvas might be offset if it's not full screen top-left (though it usually is)
      const viewX = rect.left - mainCanvasRect.left;
      const viewY = mainCanvasRect.height - (rect.bottom - mainCanvasRect.top); // Y is from bottom-left for WebGL viewport
      
      const viewWidth = rect.width;
      const viewHeight = rect.height;

      if (viewWidth <= 0 || viewHeight <= 0) {
        // Section is not visible or has no dimensions, don't render
        return { shouldRender: false }; 
      }
      
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = viewWidth / viewHeight;
        camera.updateProjectionMatrix();
      }
      
      // No need to call renderer.render here, just return the viewport settings
      return {
        x: viewX,
        y: viewY,
        width: viewWidth,
        height: viewHeight,
        shouldRender: true // Only render if dimensions are valid
      };
    };
    
    const createParticles = () => {
      if (!sectionScene || !sectionElement) return;
      const rect = sectionElement.getBoundingClientRect();
      const particleCount = props.density * 100; // Density prop determines particle count
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      
      const baseColor = new THREE.Color(props.color);
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Position particles within a volume relative to the section size
        positions[i3] = (Math.random() - 0.5) * rect.width * 1.2;
        positions[i3 + 1] = (Math.random() - 0.5) * rect.height * 1.2;
        positions[i3 + 2] = (Math.random() - 0.5) * 200; // Depth
        
        colors[i3] = baseColor.r * (0.5 + Math.random() * 0.5);
        colors[i3 + 1] = baseColor.g * (0.5 + Math.random() * 0.5);
        colors[i3 + 2] = baseColor.b * (0.5 + Math.random() * 0.5);
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.PointsMaterial({
        size: 2, // Adjust particle size
        transparent: true,
        opacity: 0.7,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthTest: false, // Often good for particles
        depthWrite: false
      });
      
      if (particles) sectionScene.remove(particles); // Remove old particles if any
      particles = new THREE.Points(geometry, material);
      sectionScene.add(particles);
    };
    
    // This function will be called by AnimationManager
    const animateParticles = () => {
      if (!particles || !sectionScene || !sectionElement) return;

      // Only animate if the section is roughly in view (optimization)
      const rect = sectionElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
          return; // Skip animation if not visible
      }

      particles.rotation.y += 0.0005;
      const positions = particles.geometry.getAttribute('position') as THREE.BufferAttribute;
      
      for (let i = 0; i < positions.count; i++) {
        let y = positions.getY(i);
        y -= 0.1; // Simple upward movement
        if (y < -rect.height / 2 * 1.2) { // Reset when out of view
          y = rect.height / 2 * 1.2;
        }
        positions.setY(i, y);
      }
      positions.needsUpdate = true;
      
      // The actual rendering is handled by SharedWebGL's main loop
    };

    const updatePositionAndInformSharedWebGL = () => {
      if (!container.value || !sectionElement || !sharedWebGL) return;

      // The container div of this component still needs to be positioned over the target section
      // This is mostly for semantic HTML structure or if it were to contain non-WebGL elements.
      // The actual 3D rendering viewport is determined by sectionElement's position.
      const sectionRect = sectionElement.getBoundingClientRect();
      const appElement = document.querySelector('.app') || document.body; // Get a scrollable parent
      const scrollTop = appElement.scrollTop; // Consider scroll position of the main container

      container.value.style.position = 'absolute';
      container.value.style.top = `${sectionElement.offsetTop}px`; // Position relative to offsetParent
      container.value.style.left = '0px'; // Assuming full width
      container.value.style.width = '100%'; // Match parent width
      container.value.style.height = `${sectionRect.height}px`;
      container.value.style.pointerEvents = 'none'; // Ensure it doesn't block interactions
      // container.value.style.zIndex = '0'; // Ensure it's behind content

      // Inform SharedWebGL that this sub-scene might need its viewport updated
      // This will trigger the updateCallback (updateSubSceneView) in SharedWebGL's render loop
      sharedWebGL.updateSubSceneView(sceneName);
    };
    
    // Watch for prop changes to re-initialize particles if necessary
    watch(() => props.color, () => {
      if (sectionScene) { // Check if initialized
        createParticles();
        updatePositionAndInformSharedWebGL();
      }
    });
    watch(() => props.density, () => {
       if (sectionScene) {
        createParticles();
        updatePositionAndInformSharedWebGL();
      }
    });
     watch(() => props.sectionId, async (newId, oldId) => {
      if (newId !== oldId && sharedWebGL) {
        sharedWebGL.unregisterSubScene(sceneName); // Unregister old scene name
        // Re-init for the new sectionId
        // Note: sceneName will be recreated with the new props.sectionId in init()
        await init(); 
      }
    });

    onMounted(async () => {
      await init();
    });
    
    onBeforeUnmount(() => {
      window.removeEventListener('resize', updatePositionAndInformSharedWebGL);
      window.removeEventListener('scroll', updatePositionAndInformSharedWebGL);
      AnimationManager.removeAnimation(animateParticles);
      
      if (sharedWebGL) {
        sharedWebGL.unregisterSubScene(sceneName);
      }
      
      if (particles) {
        if (particles.geometry) particles.geometry.dispose();
        if (particles.material) {
          if (Array.isArray(particles.material)) {
            particles.material.forEach(m => m.dispose());
          } else {
            (particles.material as THREE.Material).dispose();
          }
        }
      }
      if (sectionScene) {
        // Clean up scene contents if necessary, though SharedWebGL might handle this
      }
      console.log(`SectionBackground3D for ${props.sectionId} unmounted and cleaned up.`);
    });
    
    return { container }; // Only container is needed for the template
  }
});
</script>

<style scoped>
.section-bg-3d {
  position: absolute; /* Will be positioned by JS */
  left: 0;
  width: 100%;
  pointer-events: none; /* Must not interfere with content */
  /* z-index: 0; /* Behind section content (2), above main bg (-1) - Managed by App.vue style now */
  overflow: hidden; /* Ensure its (now conceptual) content doesn't cause scrollbars */
}
</style> 