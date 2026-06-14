<template>
  <div
    class="audience-toggle"
    :class="[
      `audience-toggle--${size}`,
      {
        'audience-toggle--compact': compact,
        'audience-toggle--header': variant === 'header',
      },
    ]"
    role="tablist"
    aria-label="Choose your path"
  >
    <button
      type="button"
      role="tab"
      class="audience-toggle__option"
      :class="{ 'is-active': isBusiness }"
      :aria-selected="isBusiness"
      @click="setAudienceMode('business')"
    >
      For businesses
    </button>
    <button
      type="button"
      role="tab"
      class="audience-toggle__option"
      :class="{ 'is-active': isCreator }"
      :aria-selected="isCreator"
      @click="setAudienceMode('creator')"
    >
      For creators
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAudienceMode } from '../composables/useAudienceMode';

export default defineComponent({
  name: 'AudienceToggle',
  props: {
    size: {
      type: String as () => 'sm' | 'md',
      default: 'md',
    },
    compact: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String as () => 'default' | 'header',
      default: 'default',
    },
  },
  setup() {
    const { isBusiness, isCreator, setAudienceMode } = useAudienceMode();

    return {
      isBusiness,
      isCreator,
      setAudienceMode,
    };
  },
});
</script>

<style scoped>
.audience-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: var(--border-radius-pill, 9999px);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
}

.audience-toggle--sm {
  padding: 0.2rem;
}

.audience-toggle--header {
  padding: 0.12rem;
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: none;
}

.audience-toggle__option {
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  font-weight: 500;
  letter-spacing: 0.01em;
  cursor: pointer;
  border-radius: var(--border-radius-pill, 9999px);
  transition: color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  white-space: nowrap;
}

.audience-toggle--md .audience-toggle__option {
  padding: 0.55rem 1.1rem;
  font-size: 0.9rem;
}

.audience-toggle--sm .audience-toggle__option {
  padding: 0.4rem 0.85rem;
  font-size: 0.78rem;
}

.audience-toggle--compact .audience-toggle__option {
  padding: 0.35rem 0.7rem;
}

.audience-toggle--header .audience-toggle__option {
  padding: 0.28rem 0.5rem;
  font-size: 0.65rem;
}

.audience-toggle__option.is-active {
  color: #111;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.audience-toggle--header .audience-toggle__option.is-active {
  color: rgba(10, 10, 10, 0.92);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: none;
}

.audience-toggle__option:not(.is-active):hover {
  color: rgba(255, 255, 255, 0.85);
}

@media (max-width: 640px) {
  .audience-toggle:not(.audience-toggle--header) {
    width: 100%;
    justify-content: stretch;
  }

  .audience-toggle:not(.audience-toggle--header) .audience-toggle__option {
    flex: 1;
    text-align: center;
  }
}
</style>
