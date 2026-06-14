<template>
  <footer class="site-footer">
    <div class="grain-layer site-footer__grain" aria-hidden="true" />

    <div class="dev-container site-footer__inner">
      <div class="site-footer__grid">
        <!-- Left: statement + contact -->
        <div class="site-footer__col site-footer__col--intro">
          <p class="site-footer__statement">{{ footerCopy.statement }}</p>

          <div class="site-footer__contact">
            <a
              :href="footerCopy.contactAnchor"
              class="site-footer__contact-heading"
              @click="handleContactClick"
            >
              <svg class="site-footer__icon" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 2.5v5.5M6 8l-2.25-2.25M6 8l2.25-2.25" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Contact
            </a>
            <a href="mailto:info@mydigitalarchitect.com" class="site-footer__contact-line">
              info@mydigitalarchitect.com
            </a>
            <p class="site-footer__contact-line site-footer__contact-line--muted">
              Remote-first · working globally
            </p>
          </div>

          <p class="site-footer__fineprint">
            <span>&copy; {{ currentYear }} MyDigitalArchitect.</span>
            <router-link to="/privacy-policy">Privacy</router-link>
            <span aria-hidden="true">·</span>
            <router-link to="/terms-of-service">Terms</router-link>
          </p>
        </div>

        <!-- Center: navigation -->
        <div class="site-footer__col site-footer__col--nav">
          <span class="site-footer__label">Navigation</span>
          <nav class="site-footer__nav" aria-label="Footer navigation">
            <template v-for="item in footerNavItems" :key="item.id">
              <router-link
                v-if="item.to"
                :to="item.to"
                class="site-footer__nav-link"
              >
                {{ item.title }}
              </router-link>
              <a
                v-else
                :href="item.href"
                class="site-footer__nav-link"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noopener noreferrer' : undefined"
              >
                {{ item.title }}
              </a>
            </template>
          </nav>
        </div>

        <!-- Right: connect -->
        <div class="site-footer__col site-footer__col--connect">
          <span class="site-footer__label">Connect</span>
          <div class="site-footer__connect-links">
            <a
              v-for="link in socialLinks"
              :key="link.label"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="site-footer__connect-link"
            >
              <span>{{ link.label }}</span>
              <svg class="site-footer__external-icon" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <rect x="2.5" y="4.5" width="6" height="6" stroke="currentColor" stroke-width="1.1" />
                <path d="M4.5 2.5h5v5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import { useRoute } from 'vue-router';

interface FooterNavItem {
  id: number;
  title: string;
  to?: { path: string; hash?: string };
  href?: string;
  external?: boolean;
}

export default defineComponent({
  name: 'Footer',
  props: {
    onContactNavigate: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined,
    },
  },
  setup(props) {
    const route = useRoute();
    const currentYear = computed(() => new Date().getFullYear());
    const isCreator = computed(() => route.path === '/creators');
    const isBusinessHome = computed(() => route.path === '/' || route.name === 'home');

    const businessStatement =
      'Most businesses run on disconnected tools. We wire agents, data, and delivery into one system that actually runs.';
    const creatorStatement =
      'Your audience is yours. We build the app that turns followers into a business you own.';

    const footerCopy = computed(() => ({
      statement: isCreator.value ? creatorStatement : businessStatement,
      contactAnchor: isCreator.value
        ? '#apply'
        : isBusinessHome.value
          ? '#audit'
          : '#contact',
    }));

    const businessFooterNav: FooterNavItem[] = [
      { id: 1, title: 'Home', to: { path: '/' } },
      { id: 2, title: 'Careers', to: { path: '/careers' } },
      { id: 3, title: 'Creators', to: { path: '/creators' } },
    ];

    const creatorFooterNav = computed<FooterNavItem[]>(() => [
      { id: 1, title: 'Home', to: { path: '/creators' } },
      { id: 2, title: 'Apply', to: { path: '/creators', hash: '#apply' } },
      { id: 3, title: 'Businesses', to: { path: '/' } },
    ]);

    const footerNavItems = computed(() =>
      isCreator.value ? creatorFooterNav.value : businessFooterNav
    );

    const socialLinks = [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
      { label: 'Instagram', url: 'https://www.instagram.com/' },
    ];

    const handleContactClick = (event: MouseEvent) => {
      if (props.onContactNavigate) {
        event.preventDefault();
        props.onContactNavigate(event);
      }
    };

    return {
      currentYear,
      footerCopy,
      footerNavItems,
      socialLinks,
      handleContactClick,
    };
  },
});
</script>

<style scoped>
.site-footer {
  position: relative;
  margin-top: var(--spacing-lg);
  padding: clamp(3.5rem, 8vw, 5.5rem) 0 clamp(2.5rem, 5vw, 3.5rem);
  background: var(--editorial-surface);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  overflow: hidden;
  isolation: isolate;
}

.site-footer__grain {
  z-index: 0;
}

.site-footer__inner {
  position: relative;
  z-index: 1;
}

.site-footer__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, 0.75fr);
  gap: clamp(2rem, 4vw, 4rem);
  align-items: start;
}

.site-footer__col {
  display: flex;
  flex-direction: column;
}

.site-footer__statement {
  margin: 0;
  max-width: 22rem;
  font-size: clamp(0.95rem, 1.6vw, 1.05rem);
  line-height: 1.55;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.88);
}

.site-footer__contact {
  margin-top: clamp(2rem, 4vw, 3rem);
}

.site-footer__contact-heading {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.85rem;
  font-size: 0.82rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: color 0.2s ease;
}

.site-footer__contact-heading:hover {
  color: #fff;
}

.site-footer__icon {
  width: 0.72rem;
  height: 0.72rem;
  opacity: 0.75;
}

.site-footer__contact-line {
  display: block;
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  transition: color 0.2s ease;
}

a.site-footer__contact-line:hover {
  color: rgba(255, 255, 255, 0.95);
}

.site-footer__contact-line--muted {
  margin-top: 0.15rem;
  color: rgba(255, 255, 255, 0.42);
}

.site-footer__fineprint {
  margin: clamp(2.5rem, 5vw, 4rem) 0 0;
  max-width: 20rem;
  font-size: 0.68rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.32);
}

.site-footer__fineprint a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.site-footer__fineprint a:hover {
  color: rgba(255, 255, 255, 0.55);
}

.site-footer__fineprint span[aria-hidden='true'] {
  margin: 0 0.35rem;
}

.site-footer__label {
  display: block;
  margin-bottom: 1.25rem;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.34);
  font-weight: 500;
}

.site-footer__nav {
  display: flex;
  flex-direction: column;
  gap: 0.08rem;
}

.site-footer__nav-link {
  display: block;
  font-size: clamp(1.35rem, 2.6vw, 2rem);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: rgba(255, 255, 255, 0.94);
  text-decoration: none;
  transition: color 0.2s ease, opacity 0.2s ease;
}

.site-footer__nav-link:hover {
  color: rgba(255, 255, 255, 0.62);
}

.site-footer__connect-links {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.site-footer__connect-link {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: clamp(0.95rem, 1.8vw, 1.12rem);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.88);
  text-decoration: none;
  transition: color 0.2s ease;
}

.site-footer__connect-link:hover {
  color: rgba(255, 255, 255, 0.58);
}

.site-footer__external-icon {
  width: 0.72rem;
  height: 0.72rem;
  opacity: 0.55;
  flex-shrink: 0;
}

@media (max-width: 992px) {
  .site-footer__grid {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }

  .site-footer__col--intro {
    grid-column: 1 / -1;
  }

  .site-footer__col--nav {
    grid-column: 1 / -1;
  }

  .site-footer__fineprint {
    margin-top: 2rem;
  }
}

@media (max-width: 640px) {
  .site-footer__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .site-footer__nav-link {
    font-size: clamp(1.25rem, 5.5vw, 1.75rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-footer__nav-link,
  .site-footer__connect-link,
  .site-footer__contact-heading,
  .site-footer__contact-line,
  .site-footer__fineprint a {
    transition: none;
  }
}
</style>
