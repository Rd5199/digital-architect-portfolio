<template>
  <div id="custom-cursor" ref="cursorContainer">
    <div class="cursor-dot"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';

export default defineComponent({
  name: 'Cursor3D',
  setup() {
    const cursorContainer = ref<HTMLElement | null>(null);
    let cursorDot: HTMLElement | null = null;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;
    let animationFrameId: number | null = null;
    
    const init = () => {
      if (!cursorContainer.value) return;
      
      // Check for touch devices
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouchDevice) {
        cursorContainer.value.style.display = 'none';
        return;
      }

      cursorDot = cursorContainer.value.querySelector('.cursor-dot') as HTMLElement;
      if (!cursorDot) return;

      // Hide default cursor
      document.body.style.cursor = 'none';
    };

    const animate = () => {
      if (!cursorDot) return;
      
      // Smooth interpolation (Notion-like smoothness)
      const lerpFactor = 0.15;
      currentX += (mouseX - currentX) * lerpFactor;
      currentY += (mouseY - currentY) * lerpFactor;

      // Update position
      cursorDot.style.transform = `translate(${currentX}px, ${currentY}px)`;
      
      // Update size based on hover state
      if (isHovering) {
        cursorDot.style.width = '24px';
        cursorDot.style.height = '24px';
        cursorDot.style.opacity = '0.5';
      } else {
        cursorDot.style.width = '8px';
        cursorDot.style.height = '8px';
        cursorDot.style.opacity = '1';
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    const onMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      
      // Check if hovering over interactive elements
      const elementsUnderCursor = document.elementsFromPoint(event.clientX, event.clientY);
      const isOverInteractive = elementsUnderCursor.some(el => {
        if (el instanceof HTMLElement) {
          return el.tagName === 'A' || 
                 el.tagName === 'BUTTON' || 
                 el.getAttribute('role') === 'button' ||
                 el.classList.contains('dev-btn') ||
                 el.classList.contains('interactive-element') ||
                 el.hasAttribute('onclick') ||
                 el.classList.contains('clickable');
        }
        return false;
      });
      
        isHovering = isOverInteractive;
    };
    
    const onMouseDown = () => {
      if (cursorDot) {
        cursorDot.style.transform += ' scale(0.8)';
      }
    };
    
    const onMouseUp = () => {
      if (cursorDot) {
        cursorDot.style.transform = cursorDot.style.transform.replace(' scale(0.8)', '');
      }
    };
    
    onMounted(() => {
      init();
      animate();

      document.addEventListener('mousemove', onMouseMove, { passive: true });
      document.addEventListener('mousedown', onMouseDown, { passive: true });
      document.addEventListener('mouseup', onMouseUp, { passive: true });
    });
    
    onBeforeUnmount(() => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      document.body.style.cursor = '';
    });
    
    return {
      cursorContainer
    };
  }
});
</script>

<style scoped>
#custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
  mix-blend-mode: difference;
}

.cursor-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.2s ease, height 0.2s ease, opacity 0.2s ease;
  will-change: transform;
}

/* Ensure buttons and links still show pointer cursor */
:global(a),
:global(button),
:global(.dev-btn) {
  cursor: pointer !important;
}
</style>
