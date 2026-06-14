<template>
  <section id="about" class="dev-section dev-section-alt dev-about-section">
    <div class="dev-container">
      <div class="dev-how-it-works-label">
        <span>How it Works</span>
      </div>
      <h2 class="dev-section-title">AI Systems for Your Use Case</h2>
      <p class="dev-section-subtitle">
        Different modules for different businesses — assembled around how you work
      </p>

      <div class="dev-about-steps-grid">
        <article
          v-for="useCase in useCases"
          :key="useCase.id"
          class="dev-about-step-card group"
          :data-step="useCase.id"
        >
          <Card
            size="sm"
            :class="cardClass"
          >
            <CardHeader class="border-b border-border/80 pb-4 [.border-b]:pb-4">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 space-y-1">
                  <CardTitle class="text-sm font-medium tracking-tight text-foreground">
                    {{ useCase.title }}
                  </CardTitle>
                  <CardDescription class="text-xs leading-relaxed text-muted-foreground">
                    {{ useCase.description }}
                  </CardDescription>
                </div>
                <span
                  class="shrink-0 rounded-md border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-muted-foreground"
                >
                  {{ useCase.systemName }}
                </span>
              </div>
            </CardHeader>

            <CardContent class="p-0">
              <UseCaseSystemDemo
                :system-name="useCase.systemName"
                :url="useCase.url"
                :metric="useCase.metric"
                :metric-value="useCase.metricValue"
                :nav-items="useCase.navItems"
                :stats="useCase.stats"
                :modules="useCase.modules"
              />
            </CardContent>
          </Card>
        </article>
      </div>

      <div class="dev-about-cta">
        <a href="#contact" class="dev-btn dev-btn-primary dev-apply-cta-btn">Apply Now</a>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UseCaseSystemDemo from './about/demos/UseCaseSystemDemo.vue';
import { useCases } from '../data/useCases';

export default defineComponent({
  name: 'About',
  components: {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    UseCaseSystemDemo,
  },
  setup() {
    const cardClass =
      'overflow-hidden rounded-xl border border-border/90 bg-card/70 shadow-none ring-0 backdrop-blur-sm transition-colors duration-200 group-hover:border-border group-hover:bg-card/85';

    return { useCases, cardClass };
  },
});
</script>

<style scoped>
.dev-how-it-works-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.34);
  font-weight: 500;
}

.dev-about-steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  align-items: stretch;
}

.dev-about-step-card {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.dev-about-cta {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-lg);
}

.dev-apply-cta-btn {
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 3rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: none;
  border-radius: var(--border-radius-pill, 9999px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.dev-apply-cta-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.dev-apply-cta-btn:hover::before {
  left: 100%;
}

.dev-apply-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(110, 68, 255, 0.4);
}

@media (max-width: 992px) {
  .dev-about-steps-grid {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
    gap: var(--spacing-lg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dev-about-step-card {
    transition: none;
  }
}
</style>
