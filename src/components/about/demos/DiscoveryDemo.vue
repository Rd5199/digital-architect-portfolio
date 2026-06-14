<template>
  <div class="demo demo-discovery">
    <div class="demo-top">
      <span class="demo-title">AI Workflow Audit</span>
      <span class="demo-status"><span class="pulse-dot" /> Scanning</span>
    </div>

    <div class="stat-row">
      <div v-for="(item, i) in stats" :key="item.label" class="stat" :style="{ animationDelay: `${0.15 + i * 0.1}s` }">
        <strong>{{ item.value }}</strong>
        <span>{{ item.label }}</span>
      </div>
    </div>

    <div class="audit-bar">
      <div class="audit-bar-fill" />
    </div>

    <ul class="audit-list">
      <li v-for="(item, i) in items" :key="item" :style="{ animationDelay: `${0.5 + i * 0.15}s` }">
        <CheckCircle2 :size="12" />
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CheckCircle2 } from '@lucide/vue';

export default defineComponent({
  name: 'DiscoveryDemo',
  components: { CheckCircle2 },
  setup() {
    const stats = [
      { value: '8', label: 'Workflows mapped' },
      { value: '14h', label: 'Saved / week' },
      { value: '6', label: 'AI automations' },
    ];

    const items = [
      'Manual tasks identified',
      'Integration plan ready',
    ];

    return { stats, items };
  },
});
</script>

<style scoped>
.demo-discovery {
  padding: 0.65rem 0.7rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.65rem;
  box-sizing: border-box;
}

.demo-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo-title {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.68rem;
}

.demo-status {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.58rem;
}

.pulse-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--secondary-color);
  animation: pulse 1.5s ease-in-out infinite;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.35rem;
}

.stat {
  padding: 0.4rem 0.35rem;
  border-radius: 6px;
  background: rgba(110, 68, 255, 0.12);
  border: 1px solid rgba(110, 68, 255, 0.2);
  text-align: center;
  opacity: 0;
  animation: fade-up 0.45s ease forwards;
}

.stat strong {
  display: block;
  color: #fff;
  font-size: 0.78rem;
  line-height: 1.2;
}

.stat span {
  display: block;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.52rem;
  margin-top: 0.1rem;
  line-height: 1.2;
}

.audit-bar {
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.audit-bar-fill {
  height: 100%;
  width: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  animation: fill-bar 2s ease 0.3s forwards;
}

.audit-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  margin-top: auto;
}

.audit-list li {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.58rem;
  opacity: 0;
  animation: fade-up 0.4s ease forwards;
}

.audit-list li svg {
  color: var(--secondary-color);
  flex-shrink: 0;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fill-bar {
  to { width: 78%; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}
</style>
