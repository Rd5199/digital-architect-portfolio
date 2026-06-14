<template>
  <div class="mac-browser" :class="{ 'mac-browser--float': floating }">
    <div class="mac-browser__shell">
      <div class="mac-browser__chrome">
        <div class="mac-browser__dots" aria-hidden="true">
          <span class="dot dot-red" />
          <span class="dot dot-yellow" />
          <span class="dot dot-green" />
        </div>
        <div class="mac-browser__toolbar">
          <div class="mac-browser__nav" aria-hidden="true">
            <ChevronLeft :size="12" />
            <ChevronRight :size="12" />
          </div>
          <div class="mac-browser__url">
            <Lock :size="10" class="mac-browser__lock" />
            <span>{{ url }}</span>
          </div>
        </div>
      </div>
      <div class="mac-browser__viewport">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ChevronLeft, ChevronRight, Lock } from '@lucide/vue';

export default defineComponent({
  name: 'MacBrowserFrame',
  components: { ChevronLeft, ChevronRight, Lock },
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
.mac-browser {
  width: 100%;
  perspective: 1200px;
}

.mac-browser--float .mac-browser__shell {
  animation: browser-float 6s ease-in-out infinite;
}

.mac-browser__shell {
  background: #1c1c24;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
  overflow: hidden;
  transform: rotateX(2deg);
  transform-origin: center bottom;
}

.mac-browser__chrome {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  background: linear-gradient(180deg, #2a2a34 0%, #22222c 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.mac-browser__dots {
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-red { background: #ff5f57; box-shadow: 0 0 6px rgba(255, 95, 87, 0.4); }
.dot-yellow { background: #febc2e; box-shadow: 0 0 6px rgba(254, 188, 46, 0.35); }
.dot-green { background: #28c840; box-shadow: 0 0 6px rgba(40, 200, 64, 0.35); }

.mac-browser__toolbar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.mac-browser__nav {
  display: flex;
  gap: 0.15rem;
  color: rgba(255, 255, 255, 0.25);
  flex-shrink: 0;
}

.mac-browser__url {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-width: 0;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.35);
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.68rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mac-browser__lock {
  color: rgba(0, 255, 204, 0.7);
  flex-shrink: 0;
}

.mac-browser__viewport {
  background: #0f0f16;
  min-height: 180px;
  aspect-ratio: 16 / 11;
  overflow: hidden;
  position: relative;
}

@keyframes browser-float {
  0%, 100% { transform: rotateX(2deg) translateY(0); }
  50% { transform: rotateX(2deg) translateY(-6px); }
}

@media (max-width: 768px) {
  .mac-browser__shell {
    transform: none;
  }

  .mac-browser--float .mac-browser__shell {
    animation: none;
  }

  .mac-browser__viewport {
    min-height: 160px;
  }
}
</style>
