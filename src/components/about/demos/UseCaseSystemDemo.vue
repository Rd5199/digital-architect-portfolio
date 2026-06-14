<script setup lang="ts">
import type { PropType } from 'vue';
import type { UseCaseModule, UseCaseStat } from '@/data/useCases';
import { statusLabels } from '@/data/useCases';
import { cn } from '@/lib/utils';

defineProps({
  systemName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  metric: {
    type: String,
    required: true,
  },
  metricValue: {
    type: String,
    required: true,
  },
  navItems: {
    type: Array as PropType<string[]>,
    required: true,
  },
  stats: {
    type: Array as PropType<UseCaseStat[]>,
    required: true,
  },
  modules: {
    type: Array as PropType<UseCaseModule[]>,
    required: true,
  },
});

const dotClass = (status: UseCaseModule['status']) =>
  cn(
    'size-1 shrink-0 rounded-full',
    status === 'running' && 'bg-foreground/85',
    status === 'active' && 'bg-foreground/55',
    status === 'synced' && 'bg-foreground/40',
    status === 'connected' && 'bg-foreground/28',
  );

const progressWidth = (value: string) => {
  const numeric = Number.parseInt(value, 10);
  if (Number.isNaN(numeric)) return '72%';
  return `${Math.min(100, Math.max(0, numeric))}%`;
};
</script>

<template>
  <div class="flex min-h-[228px] flex-col bg-background text-foreground">
    <div class="flex items-center justify-between border-b border-border px-3 py-2">
      <div class="min-w-0">
        <p class="text-[10px] font-medium tracking-tight text-foreground/90">{{ systemName }}</p>
        <p class="truncate font-mono text-[8px] text-muted-foreground">{{ url }}</p>
      </div>
      <span class="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-muted-foreground">
        Live
      </span>
    </div>

    <div class="flex min-h-0 flex-1">
      <nav
        class="flex w-[4.5rem] shrink-0 flex-col gap-0.5 border-r border-border bg-muted/10 p-1.5"
        aria-label="Dashboard navigation"
      >
        <span
          v-for="(item, index) in navItems"
          :key="item"
          :class="cn(
            'rounded-sm px-1.5 py-1 text-[8px] leading-tight tracking-tight',
            index === 0
              ? 'bg-secondary text-foreground/90'
              : 'text-muted-foreground',
          )"
        >
          {{ item }}
        </span>
      </nav>

      <div class="flex min-w-0 flex-1 flex-col gap-2 p-2">
        <div class="grid grid-cols-3 gap-1">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="rounded-md border border-border bg-card/40 px-1.5 py-1.5"
          >
            <p class="text-[7px] uppercase tracking-[0.08em] text-muted-foreground">{{ stat.label }}</p>
            <p class="mt-0.5 text-[11px] font-medium tabular-nums tracking-tight text-foreground/90">
              {{ stat.value }}
            </p>
          </div>
        </div>

        <div class="overflow-hidden rounded-md border border-border">
          <div
            class="grid grid-cols-[1fr_auto] border-b border-border bg-muted/25 px-2 py-1 text-[7px] uppercase tracking-[0.1em] text-muted-foreground"
          >
            <span>Agent / module</span>
            <span>Status</span>
          </div>
          <div
            v-for="mod in modules"
            :key="mod.name"
            class="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-border/60 px-2 py-1.5 last:border-b-0"
          >
            <span class="truncate text-[9px] text-foreground/85">{{ mod.name }}</span>
            <span class="inline-flex items-center gap-1 text-[8px] text-muted-foreground">
              <span :class="dotClass(mod.status)" aria-hidden="true" />
              {{ statusLabels[mod.status] }}
            </span>
          </div>
        </div>

        <div class="mt-auto space-y-1 border-t border-border/70 pt-2">
          <div class="flex items-center justify-between text-[8px] text-muted-foreground">
            <span>{{ metric }}</span>
            <span class="tabular-nums text-foreground/70">{{ metricValue }}</span>
          </div>
          <div class="h-px overflow-hidden rounded-full bg-muted">
            <div
              class="h-full rounded-full bg-foreground/45"
              :style="{ width: progressWidth(metricValue) }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
