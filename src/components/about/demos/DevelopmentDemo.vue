<template>
  <div class="demo demo-dev">
    <div class="demo-top">
      <span class="demo-title">Building your AI system</span>
      <GitBranch :size="12" class="demo-icon" />
    </div>

    <div class="tool-row">
      <div v-for="(tool, i) in tools" :key="tool.name" class="tool-pill" :style="{ animationDelay: `${0.2 + i * 0.1}s` }">
        <component :is="tool.icon" :size="11" />
        <span>{{ tool.name }}</span>
      </div>
    </div>

    <div class="agent-card">
      <Bot :size="14" class="agent-icon" />
      <div class="agent-copy">
        <span class="agent-label">AI agent</span>
        <span class="agent-name">Lead follow-up bot</span>
      </div>
      <span class="agent-status">Active</span>
    </div>

    <div class="deploy-row">
      <span>Deploying automations</span>
      <div class="deploy-bar"><div class="deploy-fill" /></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Bot, Cloud, CreditCard, Database, GitBranch, Mail } from '@lucide/vue';

export default defineComponent({
  name: 'DevelopmentDemo',
  components: { Bot, Cloud, CreditCard, Database, GitBranch, Mail },
  setup() {
    const tools = [
      { name: 'CRM', icon: Database },
      { name: 'Stripe', icon: CreditCard },
      { name: 'Email', icon: Mail },
      { name: 'Cloud', icon: Cloud },
    ];

    return { tools };
  },
});
</script>

<style scoped>
.demo-dev {
  padding: 0.65rem 0.7rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.demo-icon {
  color: var(--secondary-color);
}

.tool-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.tool-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.28rem 0.45rem;
  border-radius: 999px;
  background: rgba(0, 255, 204, 0.08);
  border: 1px solid rgba(0, 255, 204, 0.18);
  color: var(--secondary-color);
  font-size: 0.55rem;
  opacity: 0;
  animation: pop-in 0.4s ease forwards;
}

.agent-card {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 0.15rem;
}

.agent-icon {
  color: var(--primary-light);
  flex-shrink: 0;
}

.agent-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
}

.agent-label {
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.38);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.agent-name {
  font-size: 0.62rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.agent-status {
  font-size: 0.52rem;
  padding: 0.15rem 0.4rem;
  border-radius: 999px;
  background: rgba(40, 200, 64, 0.15);
  color: #5ee87a;
  flex-shrink: 0;
}

.deploy-row {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.45);
}

.deploy-bar {
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.deploy-fill {
  height: 100%;
  width: 65%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--secondary-color), var(--primary-color));
  animation: deploy-pulse 2s ease-in-out infinite;
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes deploy-pulse {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 1; }
}
</style>
