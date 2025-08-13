<template>
  <div id="three-cursor" ref="cursorContainer">
    <!-- Fallback cursor element -->
    <div class="fallback-cursor"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
// import SharedWebGL from '../utils/SharedWebGL'; // No longer using SharedWebGL
import AnimationManager from '../utils/AnimationManager';

export default defineComponent({
  name: 'Cursor3D',
  setup() {
    const cursorContainer = ref<HTMLElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera; // Using OrthographicCamera for cursor
    let renderer: THREE.WebGLRenderer; // Cursor's own renderer
    let cursor: THREE.Group;
    let targetPosition = { x: 0, y: 0 };
    let currentPosition = { x: 0, y: 0 };
    let clickRipple: THREE.Mesh | null = null;
    let rippleScale = 0;
    let rippleOpacity = 1;
    let isHovering = false;
    
    // Store handler references to prevent memory leaks
    const mouseEnterHandler = () => { 
      isHovering = true;
      if (animateCursor) requestAnimationFrame(animateCursor);
    };
    
    const mouseLeaveHandler = () => { 
      isHovering = false;
      if (animateCursor) requestAnimationFrame(animateCursor);
    };

    const init = () => {
      if (!cursorContainer.value) return;
      
      // Add touch device detection
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouchDevice) {
        // Disable custom cursor on touch devices
        if (cursorContainer.value) {
          cursorContainer.value.style.display = 'none';
        }
        
        // Remove the global style that forces cursor: none
        const styles = document.querySelectorAll('style');
        styles.forEach(style => {
          if (style.innerHTML.includes('cursor: none')) {
            style.remove();
          }
        });
        
        return; // Skip initialization on touch devices
      }

      // Explicitly size the container to match window dimensions
      cursorContainer.value.style.width = `${window.innerWidth}px`;
      cursorContainer.value.style.height = `${window.innerHeight}px`;

      // Create cursor-specific scene
      scene = new THREE.Scene();
      
      // Create a dedicated orthographic camera for the cursor
      const aspect = window.innerWidth / window.innerHeight;
      const frustumSize = 20; // This determines the "zoom" level of the cursor
      camera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.1,
        1000
      );
      camera.position.z = 10; // Keep it in front
      
      // Create cursor's own renderer
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(window.devicePixelRatio || 2);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0); // Transparent
      renderer.autoClear = false; // We'll manage clearing

      // Append renderer's canvas to cursor container
      cursorContainer.value.appendChild(renderer.domElement);
      
      // Style the canvas
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.classList.add('cursor-canvas');
      
      // Handle window resize for camera AND container
      window.addEventListener('resize', () => {
        if (cursorContainer.value) {
          cursorContainer.value.style.width = `${window.innerWidth}px`;
          cursorContainer.value.style.height = `${window.innerHeight}px`;
        }
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        const aspect = window.innerWidth / window.innerHeight;
        camera.left = frustumSize * aspect / -2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = frustumSize / -2;
        camera.updateProjectionMatrix();
      });
      
      // Force a manual update of the projection matrix on init
      camera.updateProjectionMatrix();
      
      // Create cursor group and ensure it's at the right depth
      cursor = new THREE.Group();
      cursor.position.z = -10; // Far in front of everything
      cursor.renderOrder = 9999; // Extremely high render order
      cursor.frustumCulled = false; // Never cull the cursor
      
      // NEW CURSOR DESIGN
      // 1. Central Core: Glowing Icosahedron
      const coreGeometry = new THREE.IcosahedronGeometry(0.35, 1); // Smaller core
      const coreMaterial = new THREE.MeshPhongMaterial({
        color: 0x8A2BE2, // BlueViolet
        emissive: 0x4B0082, // Indigo
        emissiveIntensity: 0.7,
        specular: 0x00FFFF, // Cyan
        shininess: 80,
        transparent: true,
        opacity: 0.9,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      core.renderOrder = 10000;
      core.frustumCulled = false;
      cursor.add(core);

      // 2. Orbiting Rings
      const ringGroup = new THREE.Group();
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FFFF, // Bright Cyan
        wireframe: true,
        transparent: true,
        opacity: 0.7,
        depthTest: false,
        depthWrite: false
      });

      const ring1Geometry = new THREE.TorusGeometry(0.6, 0.02, 16, 64); // Thinner ring
      const ring1 = new THREE.Mesh(ring1Geometry, ringMaterial);
      ring1.rotation.x = Math.PI / 2;
      ringGroup.add(ring1);

      const ring2Geometry = new THREE.TorusGeometry(0.75, 0.015, 16, 64); // Slightly larger, even thinner
      const ring2 = new THREE.Mesh(ring2Geometry, ringMaterial);
      ring2.rotation.x = Math.PI / 2;
      ring2.rotation.y = Math.PI / 4; // Tilted
      ringGroup.add(ring2);
      
      ringGroup.renderOrder = 10001;
      ringGroup.frustumCulled = false;
      cursor.add(ringGroup);
      
      // 3. Enhanced Particle System
      const particleGroup = new THREE.Group();
      const particleMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.85,
        depthTest: false,
        depthWrite: false,
        vertexColors: true // Use vertex colors for variety
      });

      const particleColors = [
        new THREE.Color(0x00FFFF), // Cyan
        new THREE.Color(0x007FFF), // Azure
        new THREE.Color(0x8A2BE2), // BlueViolet
        new THREE.Color(0xFFFFFF)  // White
      ];

      // Reduce particle count for better performance on lower-end devices
      const particleCount = window.navigator.hardwareConcurrency < 4 ? 15 : 30;
      
      for (let i = 0; i < particleCount; i++) { // More particles
        const particleGeometry = new THREE.SphereGeometry(0.03 + Math.random() * 0.04, 6, 6); // Smaller, varied sizes
        
        // Assign random color to each vertex of the sphere
        const colors: number[] = [];
        const baseColor = particleColors[i % particleColors.length];
        for (let j = 0; j < particleGeometry.attributes.position.count; j++) {
          colors.push(baseColor.r, baseColor.g, baseColor.b);
        }
        particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.5 + Math.random() * 0.7; // Spread out more
        particle.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 1.5 // More Z-depth variation
        );
        
        particle.userData = {
          originalX: particle.position.x,
          originalY: particle.position.y,
          originalZ: particle.position.z,
          speed: 0.01 + Math.random() * 0.04, // Varied speeds
          amplitude: 0.1 + Math.random() * 0.2,
          phase: Math.random() * Math.PI * 2,
          orbitSpeed: (Math.random() - 0.5) * 0.02 // Add orbital movement around center
        };
        particleGroup.add(particle);
      }
      particleGroup.renderOrder = 10002;
      particleGroup.frustumCulled = false;
      cursor.add(particleGroup);
      
      // Add a point light to illuminate the cursor
      const light = new THREE.PointLight(0xADD8E6, 0.7, 15); // Light blue, softer intensity
      cursor.add(light);
      
      // Add cursor to scene
      scene.add(cursor);
      
      // Force an initial render
      renderer.render(scene, camera);
      
      // Add animation with highest possible priority
      AnimationManager.addAnimation(animateCursor, 1000); // Highest possible priority
      
      // Set up global interactive element tracking to detect hover states
      setupGlobalInteractiveTracking();
      
      console.log("Cursor3D initialized with independent renderer");
    };
    
    const onDocumentMouseMove = (event: MouseEvent) => {
      // Update target position based on mouse coordinates
      targetPosition.x = (event.clientX / window.innerWidth) * (camera.right - camera.left) + camera.left;
      targetPosition.y = - (event.clientY / window.innerHeight) * (camera.top - camera.bottom) - camera.bottom;
      
      // Force immediate render to reduce input lag
      if (animateCursor) {
        requestAnimationFrame(animateCursor);
      }
    };
    
    const onDocumentClick = () => {
      createClickRipple();
    };
    
    const onDocumentMouseDown = () => {
      // Scale down cursor on mouse down
      if (cursor) {
        cursor.scale.set(0.8, 0.8, 0.8);
      }
    };
    
    const onDocumentMouseUp = () => {
      // Scale back up on mouse up
      if (cursor) {
        cursor.scale.set(1, 1, 1);
      }
    };
    
    const createClickRipple = () => {
      // Remove existing ripple if present
      if (clickRipple) {
        scene.remove(clickRipple);
        if (clickRipple.geometry) clickRipple.geometry.dispose();
        if (clickRipple.material && !Array.isArray(clickRipple.material)) {
          clickRipple.material.dispose();
        }
      }
      
      // Create new ripple
      const rippleGeometry = new THREE.RingGeometry(0.1, 0.15, 32);
      const rippleMaterial = new THREE.MeshBasicMaterial({
        color: isHovering ? 0xf39c12 : 0x3498db,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
      });
      
      clickRipple = new THREE.Mesh(rippleGeometry, rippleMaterial);
      clickRipple.position.copy(cursor.position);
      clickRipple.rotation.x = Math.PI / 2;
      scene.add(clickRipple);
      
      // Reset ripple animation values
      rippleScale = 0;
      rippleOpacity = 1;
    };
    
    // Main animation function for the cursor
    const animateCursor = () => {
      // Smooth cursor movement with lerp (linear interpolation)
      const lerpFactor = 0.25; 
      currentPosition.x += (targetPosition.x - currentPosition.x) * lerpFactor;
      currentPosition.y += (targetPosition.y - currentPosition.y) * lerpFactor;
      
      // Update cursor position
      if (cursor) {
        cursor.position.x = currentPosition.x;
        cursor.position.y = currentPosition.y;
        
        // Animate Central Core (Icosahedron)
        const core = cursor.children[0];
        if (core) {
          core.rotation.x += 0.01;
          core.rotation.y += 0.015;
          const corePulse = 1 + 0.05 * Math.sin(Date.now() * 0.002);
          core.scale.set(corePulse, corePulse, corePulse);
        }
        
        // Animate Orbiting Rings
        const ringGroup = cursor.children[1];
        if (ringGroup && ringGroup.children.length >= 2) {
          ringGroup.children[0].rotation.z += 0.02; // Ring 1
          ringGroup.children[1].rotation.z -= 0.01; // Ring 2, opposite direction & slower
          ringGroup.rotation.y += 0.005; // Rotate the whole ring group slowly
        }
        
        // Animate Enhanced Particles
        const particleGroup = cursor.children[2];
        if (particleGroup && particleGroup.children) {
          particleGroup.children.forEach((particle: THREE.Object3D) => {
            const userData = particle.userData;
            if (userData) {
              userData.phase += userData.speed;
              // Swirling and emanating motion
              particle.position.x = userData.originalX * (1 + Math.sin(userData.phase) * 0.1) + Math.cos(userData.phase + userData.originalX) * userData.amplitude;
              particle.position.y = userData.originalY * (1 + Math.cos(userData.phase) * 0.1) + Math.sin(userData.phase + userData.originalY) * userData.amplitude;
              particle.position.z = userData.originalZ + Math.sin(userData.phase * 0.5) * userData.amplitude * 2;
              
              const scale = 0.6 + 0.4 * Math.abs(Math.sin(userData.phase * 1.5));
              particle.scale.set(scale, scale, scale);
              
              if (particle instanceof THREE.Mesh && particle.material instanceof THREE.MeshBasicMaterial) {
                particle.material.opacity = 0.5 + 0.5 * Math.abs(Math.cos(userData.phase * 0.8));
              }
            }
          });
        }
        
        // Implement click ripple animation
        if (clickRipple) {
          rippleScale += 0.1;
          rippleOpacity -= 0.05;
          
          if (rippleOpacity <= 0) {
            scene.remove(clickRipple);
            clickRipple = null;
          } else {
            clickRipple.scale.set(1 + rippleScale, 1 + rippleScale, 1);
            if (clickRipple.material instanceof THREE.MeshBasicMaterial) {
              clickRipple.material.opacity = rippleOpacity;
            }
          }
        }
        
        // Hover effect adjustments for the new design
        if (isHovering) {
          cursor.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
          if (core instanceof THREE.Mesh && core.material instanceof THREE.MeshPhongMaterial) {
            core.material.emissiveIntensity = 1.0;
            core.material.color.setHex(0x00FFFF); // Cyan on hover
          }
          const firstRing = ringGroup.children[0] as THREE.Mesh;
          const secondRing = ringGroup.children[1] as THREE.Mesh;

          if (ringGroup && firstRing && firstRing.material instanceof THREE.MeshBasicMaterial) {
            (firstRing.material as THREE.MeshBasicMaterial).color.setHex(0xFFFFFF); // White rings on hover
            if (secondRing && secondRing.material instanceof THREE.MeshBasicMaterial) {
                 (secondRing.material as THREE.MeshBasicMaterial).color.setHex(0xFFFFFF);
            }
          }
        } else {
          cursor.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          if (core instanceof THREE.Mesh && core.material instanceof THREE.MeshPhongMaterial) {
            core.material.emissiveIntensity = 0.7;
            core.material.color.setHex(0x8A2BE2); // Back to BlueViolet
          }
          const firstRing = ringGroup.children[0] as THREE.Mesh;
          const secondRing = ringGroup.children[1] as THREE.Mesh;
          if (ringGroup && firstRing && firstRing.material instanceof THREE.MeshBasicMaterial) {
            (firstRing.material as THREE.MeshBasicMaterial).color.setHex(0x00FFFF); // Back to Cyan rings
             if (secondRing && secondRing.material instanceof THREE.MeshBasicMaterial) {
                 (secondRing.material as THREE.MeshBasicMaterial).color.setHex(0x00FFFF);
            }
          }
        }
      }
      
      // Always render the cursor, even if there was no movement
      // With cursor's own renderer, we can control the rendering process completely
      renderer.clear(); // Clear everything
      renderer.render(scene, camera);
    };
    
    // Function to set up tracking for all interactive elements in the viewport
    const setupGlobalInteractiveTracking = () => {
      // Create a global style to ensure cursor is hidden everywhere
      const style = document.createElement('style');
      style.innerHTML = `
        * { cursor: none !important; }
        a, button, input, select, textarea, [role="button"], 
        .interactive-element, .dev-btn, .model-button, .dev-card, .glow-effect, 
        [tabindex], [onclick], .clickable {
          cursor: none !important;
        }
      `;
      document.head.appendChild(style);
      
      // We need to handle dynamically added elements too, so use MutationObserver
      const observer = new MutationObserver(() => {
        // When DOM changes, reattach event listeners to interactive elements
        attachInteractiveListeners();
      });
      
      // Start observing the entire document for changes
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
      
      // Initial attachment of listeners
      attachInteractiveListeners();
      
      // Log that global tracking is set up
      console.log("Global interactive element tracking initialized");
    };
    
    // Function to attach hover listeners to all interactive elements
    const attachInteractiveListeners = () => {
      // Comprehensive selector for interactive elements
      const interactiveElements = document.querySelectorAll(
        'a, button, .dev-btn, .model-button, .interactive-element, ' +
        '.dev-card, .glow-effect, input, select, textarea, ' + 
        '[role="button"], [tabindex], [onclick], .clickable, ' +
        'summary, details, .card, .project, .portfolio-item'
      );
      
      interactiveElements.forEach(el => {
        // Remove previous listeners using proper references
        el.removeEventListener('mouseenter', mouseEnterHandler);
        el.removeEventListener('mouseleave', mouseLeaveHandler);
        
        // Add new listeners with capture to ensure they take precedence
        el.addEventListener('mouseenter', mouseEnterHandler, true);
        el.addEventListener('mouseleave', mouseLeaveHandler, true);
      });
    };
    
    onMounted(() => {
      init();

      // Site-wide mouse event listeners
      document.addEventListener("mousemove", onDocumentMouseMove, {
        passive: true,
        capture: true // Use capture phase to ensure we get all events first
      });
      
      document.addEventListener("click", onDocumentClick, {
        passive: true,
        capture: true
      });
      
      document.addEventListener("mousedown", onDocumentMouseDown, {
        passive: true,
        capture: true
      });
      
      document.addEventListener("mouseup", onDocumentMouseUp, {
        passive: true,
        capture: true
      });
      
      // Handle scroll events to ensure cursor stays correct during scrolling
      window.addEventListener("scroll", () => {
        // Force an immediate render
        if (animateCursor) requestAnimationFrame(animateCursor);
      }, { passive: true });
      
      // Monitor all viewport changes
      const resizeObserver = new ResizeObserver(() => {
        // Force an immediate render
        if (animateCursor) requestAnimationFrame(animateCursor);
      });
      resizeObserver.observe(document.body);
      
      // Force immediate cursor update
      if (animateCursor) requestAnimationFrame(animateCursor);
      
      console.log("Cursor3D mounted with global event handlers");
    });
    
    onBeforeUnmount(() => {
      document.removeEventListener("mousemove", onDocumentMouseMove);
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("mousedown", onDocumentMouseDown);
      document.removeEventListener("mouseup", onDocumentMouseUp);
      
      // Clean up animation manager
      AnimationManager.removeAnimation(animateCursor);
      
      // Clean up THREE.js resources
      if (renderer) {
        scene.traverse((object) => {
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
        
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
      }
      
      console.log("Cursor3D unmounted and cleaned up");
    });
    
    return {
      cursorContainer
    };
  }
});
</script>

<style>
/* Global style to ensure cursor visibility */
:root {
  cursor: none !important; /* Force no cursor throughout the entire document and all elements */
}

/* Make sure links and buttons don't show the default cursor */
a, button, input, select, textarea, [role="button"], 
.interactive-element, .dev-btn, .model-button, .dev-card, .glow-effect,
[tabindex], [onclick], .clickable { /* Added .clickable from previous work */
  cursor: none !important;
}

/* Touch device styles - show normal cursor */
@media (hover: none) {
  :root {
    cursor: auto !important;
  }
  
  #three-cursor {
    display: none !important;
  }
  
  a, button, input, select, textarea, [role="button"],
  .interactive-element, .dev-btn, .model-button, .dev-card, .glow-effect,
  [tabindex], [onclick], .clickable {
    cursor: pointer !important;
  }
}

/* Ensure cursor container covers the entire viewport and is on top */
#three-cursor {
  position: fixed !important; /* Important to override any relative positioning */
  top: 0 !important;
  left: 0 !important;
  /* width and height are set by JavaScript in init() and resize handler */
  z-index: 2147483647 !important; /* Maximum possible z-index for top level */
  pointer-events: none !important; /* Allows clicks to pass through to elements underneath */
  overflow: visible !important; /* Ensures cursor elements aren't clipped */
  isolation: isolate; /* Creates a new stacking context, helps with z-index issues */
  will-change: transform; 
  transform: translateZ(0); /* Promotes to its own layer for performance */
}

/* Styles for the WebGL canvas *inside* #three-cursor */
.cursor-canvas {
  position: absolute !important; /* Relative to #three-cursor */
  top: 0 !important;
  left: 0 !important;
  width: 100% !important; /* Fill #three-cursor */
  height: 100% !important;/* Fill #three-cursor */
  /* z-index is inherited or not needed as it's inside the max z-index #three-cursor */
  pointer-events: none !important;
}

/* Fallback cursor for debugging - normally hidden */
.fallback-cursor {
  position: fixed;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(255, 0, 0, 0.8);
  border: 3px solid white;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2147483647;
  display: none; /* Hidden by default, can be toggled with F key */
  mix-blend-mode: difference; /* Makes it visible on any background */
}

/* Add a keyboard focus indicator for accessibility */
:focus-visible {
  outline: 3px solid #00FFFF !important;
  outline-offset: 3px !important;
}
</style> 