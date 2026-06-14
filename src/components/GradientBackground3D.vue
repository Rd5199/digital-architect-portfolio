<template>
  <div ref="host" class="gradient-bg" aria-hidden="true"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';

/**
 * Cursor-reactive animated mesh-gradient background.
 *
 * A full-screen three.js quad running a simplex-noise fragment shader — a real
 * rendered WebGL asset (not a CSS gradient). The flow field warps toward the
 * pointer and a soft light follows the cursor, so the whole backdrop reacts to
 * movement. Brand-toned and dark enough to keep foreground text legible.
 *
 * Simplex noise: Ashima Arts / Stefan Gustavson (MIT / public domain), the
 * standard GLSL snoise implementation.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;      // 0..1, smoothed
  uniform vec2 uResolution;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractal brownian motion for richer, layered flow.
  float fbm(vec2 p) {
    float total = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      total += snoise(p) * amp;
      p *= 2.0;
      amp *= 0.5;
    }
    return total;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 auv = vec2(uv.x * aspect, uv.y);
    vec2 am = vec2(uMouse.x * aspect, uMouse.y);

    float t = uTime * 0.04;

    // Pointer warps the flow field so the gradient drifts toward the cursor.
    vec2 warp = (uMouse - 0.5) * 0.35;
    vec2 p = uv * 2.2 + warp;

    float n1 = fbm(p + vec2(t, t * 0.6));
    float n2 = fbm(p * 1.6 - vec2(t * 0.7, t * 1.1));
    float flow = 0.5 + 0.5 * sin(n1 * 1.6 + n2 + uTime * 0.25);

    // Brand palette, kept dark and cohesive.
    vec3 deep   = vec3(0.020, 0.020, 0.055);
    vec3 indigo = vec3(0.180, 0.110, 0.430);
    vec3 purple = vec3(0.430, 0.270, 1.000);
    vec3 teal   = vec3(0.000, 1.000, 0.800);
    vec3 pink   = vec3(1.000, 0.270, 0.490);

    vec3 col = mix(deep, indigo, smoothstep(0.0, 0.7, flow));
    col = mix(col, purple, smoothstep(0.45, 1.0, n1 * 0.5 + 0.5) * 0.7);

    // Subtle teal + pink glints in the brightest folds.
    col += teal * 0.06 * smoothstep(0.72, 1.0, n2 * 0.5 + 0.5);
    col += pink * 0.05 * smoothstep(0.78, 1.0, fbm(p * 0.8 + t) * 0.5 + 0.5);

    // Soft light that follows the cursor.
    float md = distance(auv, am);
    float glow = exp(-md * 2.6);
    col += mix(purple, pink, uMouse.x) * 0.22 * glow;

    // Gentle vignette for depth.
    float vig = smoothstep(1.15, 0.35, distance(uv, vec2(0.5)));
    col *= 0.55 + 0.45 * vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default defineComponent({
  name: 'GradientBackground3D',
  setup() {
    const host = ref<HTMLElement | null>(null);

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let material: THREE.ShaderMaterial;
    let geometry: THREE.PlaneGeometry;
    let rafId = 0;
    let running = true;
    const startTime = performance.now();

    // Pointer state (target vs. smoothed current) for inertial follow.
    const mouseTarget = new THREE.Vector2(0.5, 0.5);
    const mouse = new THREE.Vector2(0.5, 0.5);

    const onPointerMove = (e: PointerEvent) => {
      mouseTarget.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };

    const resize = () => {
      if (!renderer) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      material.uniforms.uResolution.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
    };

    const animate = () => {
      if (!renderer) return;
      rafId = requestAnimationFrame(animate);
      if (!running) return;
      // Ease the smoothed pointer toward the target.
      mouse.lerp(mouseTarget, 0.06);
      material.uniforms.uMouse.value.copy(mouse);
      material.uniforms.uTime.value = (performance.now() - startTime) / 1000;
      renderer.render(scene, camera);
    };

    const onVisibility = () => {
      running = document.visibilityState === 'visible';
    };

    onMounted(() => {
      if (!host.value) return;

      renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      host.value.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      geometry = new THREE.PlaneGeometry(2, 2);
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uResolution: {
            value: new THREE.Vector2(
              window.innerWidth * renderer.getPixelRatio(),
              window.innerHeight * renderer.getPixelRatio()
            )
          }
        }
      });
      scene.add(new THREE.Mesh(geometry, material));

      window.addEventListener('resize', resize);
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
      animate();
    });

    onBeforeUnmount(() => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
      if (renderer?.domElement && host.value?.contains(renderer.domElement)) {
        host.value.removeChild(renderer.domElement);
      }
      renderer = null;
    });

    return { host };
  }
});
</script>

<style scoped>
.gradient-bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  z-index: 0;
  pointer-events: none;
}
.gradient-bg :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
