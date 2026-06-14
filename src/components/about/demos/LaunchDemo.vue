<template>
  <div class="demo demo-launch">
    <div class="demo-top">
      <span class="live-badge"><span class="live-dot" /> Live</span>
      <span class="deploy-time">Systems running</span>
    </div>

    <div class="kpi-row">
      <div v-for="(kpi, i) in kpis" :key="kpi.label" class="kpi" :style="{ animationDelay: `${0.15 + i * 0.1}s` }">
        <span class="kpi-value">{{ kpi.display }}</span>
        <span class="kpi-label">{{ kpi.label }}</span>
      </div>
    </div>

    <div class="chart-wrap">
      <svg class="line-chart" viewBox="0 0 200 50" preserveAspectRatio="none">
        <defs>
          <linearGradient id="aboutLaunchGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(110, 68, 255, 0.3)" />
            <stop offset="100%" stop-color="rgba(110, 68, 255, 0)" />
          </linearGradient>
        </defs>
        <path class="chart-area" d="M0,42 L50,38 L100,28 L150,18 L200,10 L200,50 L0,50 Z" />
        <path class="chart-line" d="M0,42 L50,38 L100,28 L150,18 L200,10" />
      </svg>
    </div>

    <div class="activity-item">
      <TrendingUp :size="11" />
      <span>Automations saved 12+ hrs this week</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { TrendingUp } from '@lucide/vue';

export default defineComponent({
  name: 'LaunchDemo',
  components: { TrendingUp },
  setup() {
    const kpis = ref([
      { label: 'Tasks automated', display: '0', target: 847 },
      { label: 'Uptime', display: '0%', target: 99.9 },
    ]);

    let frame: number | null = null;
    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / 1800, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      kpis.value[0].display = Math.floor(847 * ease).toLocaleString();
      kpis.value[1].display = `${(99.9 * ease).toFixed(1)}%`;

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    onMounted(() => {
      frame = requestAnimationFrame(animate);
    });

    onBeforeUnmount(() => {
      if (frame) cancelAnimationFrame(frame);
    });

    return { kpis };
  },
});
</script>

<style scoped>
.demo-launch {
  padding: 0.65rem 0.7rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  box-sizing: border-box;
}

.demo-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.18rem 0.45rem;
  border-radius: 999px;
  background: rgba(40, 200, 64, 0.15);
  color: #5ee87a;
  font-size: 0.58rem;
  font-weight: 600;
}

.live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #28c840;
  animation: pulse 1.2s ease-in-out infinite;
}

.deploy-time {
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.35);
}

.kpi-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.35rem;
}

.kpi {
  padding: 0.38rem 0.4rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  opacity: 0;
  animation: fade-up 0.45s ease forwards;
}

.kpi-value {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.15;
}

.kpi-label {
  display: block;
  font-size: 0.52rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 0.08rem;
}

.chart-wrap {
  flex: 1;
  min-height: 36px;
  max-height: 48px;
  border-radius: 6px;
  background: rgba(110, 68, 255, 0.06);
  border: 1px solid rgba(110, 68, 255, 0.12);
  padding: 0.25rem;
  overflow: hidden;
}

.line-chart {
  width: 100%;
  height: 100%;
}

.chart-area {
  fill: url(#aboutLaunchGrad);
  opacity: 0;
  animation: fade-in 0.8s ease 0.3s forwards;
}

.chart-line {
  fill: none;
  stroke: var(--primary-light);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 220;
  stroke-dashoffset: 220;
  animation: draw-chart 1.6s ease 0.4s forwards;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.55);
  margin-top: auto;
}

.activity-item svg {
  color: var(--secondary-color);
  flex-shrink: 0;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  to { opacity: 1; }
}

@keyframes draw-chart {
  to { stroke-dashoffset: 0; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
