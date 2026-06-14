<template>
  <div class="macbook" :class="{ 'macbook--float': floating }">
    <div class="macbook__lid">
      <div class="macbook__bezel">
        <div class="macbook__camera" aria-hidden="true" />
        <div class="macbook__screen">
          <div class="macbook__chrome">
            <div class="macbook__dots" aria-hidden="true">
              <span class="dot dot-red" />
              <span class="dot dot-yellow" />
              <span class="dot dot-green" />
            </div>
            <div class="macbook__url">
              <span>{{ url }}</span>
            </div>
          </div>
          <div class="macbook__viewport">
            <slot />
          </div>
        </div>
      </div>
    </div>
    <div class="macbook__hinge" aria-hidden="true" />
    <div class="macbook__base" aria-hidden="true">
      <div class="macbook__trackpad" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MacBookFrame',
  props: {
    url: {
      type: String,
      default: 'app.digitalarchitect.com',
    },
    floating: {
      type: Boolean,
      default: true,
    },
  },
});
</script>

<style scoped>
.macbook {
  width: 100%;
  perspective: 1400px;
}

.macbook__lid {
  transform: rotateX(-6deg);
  transform-origin: center bottom;
  transition: transform 0.4s ease;
}

.macbook--float .macbook__lid {
  animation: none;
}

.macbook__bezel {
  padding: 10px 10px 8px;
  border-radius: 14px 14px 0 0;
  background: linear-gradient(180deg, #3a3a42 0%, #25252d 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: none;
  box-shadow:
    0 -2px 0 rgba(255, 255, 255, 0.06) inset,
    0 20px 40px rgba(0, 0, 0, 0.35);
}

.macbook__camera {
  width: 6px;
  height: 6px;
  margin: 0 auto 6px;
  border-radius: 50%;
  background: #1a1a22;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.macbook__screen {
  border-radius: 6px;
  overflow: hidden;
  background: #0c0c12;
  border: 1px solid rgba(0, 0, 0, 0.5);
}

.macbook__chrome {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.55rem;
  background: linear-gradient(180deg, #2a2a34 0%, #1e1e26 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.macbook__dots {
  display: flex;
  gap: 0.3rem;
  flex-shrink: 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-red { background: #ff5f57; }
.dot-yellow { background: #febc2e; }
.dot-green { background: #28c840; }

.macbook__url {
  flex: 1;
  min-width: 0;
  padding: 0.28rem 0.5rem;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.6rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.macbook__viewport {
  aspect-ratio: 16 / 10;
  min-height: 0;
  overflow: hidden;
  position: relative;
  background: #0f0f16;
}

.macbook__viewport :deep(> *) {
  height: 100%;
}

.macbook__hinge {
  height: 4px;
  margin: 0 8%;
  background: linear-gradient(180deg, #1a1a20, #2e2e36);
  border-radius: 0 0 2px 2px;
}

.macbook__base {
  height: 14px;
  margin: 0 2%;
  border-radius: 0 0 12px 12px;
  background: linear-gradient(180deg, #3d3d45 0%, #2a2a32 40%, #222228 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: none;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
  position: relative;
}

.macbook__trackpad {
  position: absolute;
  left: 50%;
  top: 3px;
  transform: translateX(-50%);
  width: 28%;
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.06);
}

@media (max-width: 768px) {
  .macbook__lid {
    transform: none;
  }
}
</style>
