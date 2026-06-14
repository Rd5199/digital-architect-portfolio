<template>
  <header class="site-header" :class="{ 'site-header--scrolled': scrolled }">
    <div class="grain-layer site-header__grain" aria-hidden="true" />

    <div class="dev-container site-header__inner">
      <router-link to="/" class="site-header__logo" @click="closeMobileMenu">
        DIGITALARCHITECT
      </router-link>

      <div class="site-header__center">
        <AudienceToggle size="sm" compact variant="header" />
      </div>

      <div class="site-header__end">
        <nav class="site-header__nav" aria-label="Primary navigation">
          <router-link
            v-for="link in navLinks"
            :key="link.id"
            :to="link.url"
            class="site-header__nav-link"
            :class="{ 'is-active': isNavActive(link.url) }"
            @click="closeMobileMenu"
          >
            {{ link.title }}
          </router-link>
        </nav>

        <router-link
          :to="contactLink"
          class="site-header__contact"
          @click="closeMobileMenu"
        >
          <span>Contact</span>
          <svg class="site-header__contact-icon" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="2.5" y="4.5" width="6" height="6" stroke="currentColor" stroke-width="1.1" />
            <path d="M4.5 2.5h5v5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </router-link>
      </div>

      <button
        class="site-header__menu-toggle"
        type="button"
        @click="toggleMobileMenu"
        :aria-expanded="isMobileMenuOpen"
        aria-label="Toggle navigation menu"
      >
        <span class="site-header__menu-line" :class="{ open: isMobileMenuOpen }" />
        <span class="site-header__menu-line" :class="{ open: isMobileMenuOpen }" />
      </button>
    </div>

    <transition name="site-header-menu">
      <div
        v-if="isMobileMenuOpen"
        class="site-header__mobile-overlay"
        @click="closeMobileMenu"
      >
        <div class="site-header__mobile-panel" @click.stop>
          <div class="grain-layer site-header__mobile-grain" aria-hidden="true" />
          <div class="site-header__mobile-top">
            <span class="site-header__mobile-logo">DIGITALARCHITECT</span>
            <button type="button" class="site-header__mobile-close" @click="closeMobileMenu">
              Close
            </button>
          </div>

          <nav class="site-header__mobile-nav" aria-label="Mobile navigation">
            <router-link
              v-for="link in navLinks"
              :key="`mobile-${link.id}`"
              :to="link.url"
              class="site-header__mobile-link"
              :class="{ 'is-active': isNavActive(link.url) }"
              @click="closeMobileMenu"
            >
              {{ link.title }}
            </router-link>
            <router-link
              :to="contactLink"
              class="site-header__mobile-link site-header__mobile-link--contact"
              @click="closeMobileMenu"
            >
              Contact
              <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3.5 8.5h6.5M8 2.5h3.5v3.5" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </router-link>
          </nav>
        </div>
      </div>
    </transition>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { stopSmoothScroll, startSmoothScroll } from '../utils/smoothExperience';
import AudienceToggle from './AudienceToggle.vue';
import { useAudienceMode } from '../composables/useAudienceMode';

interface NavRoute {
  path: string;
  hash?: string;
}

interface NavLink {
  id: number;
  title: string;
  url: NavRoute;
}

export default defineComponent({
  name: 'Header',
  components: {
    AudienceToggle,
  },
  props: {
    scrolled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const route = useRoute();
    const isMobileMenuOpen = ref(false);
    const { isCreatorRoute } = useAudienceMode();

    const businessNavLinks: NavLink[] = [
      { id: 1, title: 'Careers', url: { path: '/careers' } },
      { id: 2, title: '3D Models', url: { path: '/3d-models' } },
    ];

    const creatorNavLinks = computed<NavLink[]>(() => [
      { id: 1, title: 'Apply', url: { path: '/creators', hash: '#apply' } },
    ]);

    const navLinks = computed(() =>
      isCreatorRoute.value ? creatorNavLinks.value : businessNavLinks
    );

    const contactLink = computed(() =>
      isCreatorRoute.value
        ? { path: '/creators', hash: '#apply' }
        : { path: '/', hash: '#contact' },
    );

    const isNavActive = (url: NavRoute) => {
      if (route.path !== url.path) return false;
      if (url.hash) return route.hash === url.hash;
      return !route.hash;
    };

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
      if (isMobileMenuOpen.value) {
        document.body.style.overflow = 'hidden';
        stopSmoothScroll();
      } else {
        document.body.style.overflow = '';
        startSmoothScroll();
      }
    };

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false;
      document.body.style.overflow = '';
      startSmoothScroll();
    };

    const handleResize = () => {
      if (window.innerWidth > 992 && isMobileMenuOpen.value) {
        closeMobileMenu();
      }
    };

    onMounted(() => {
      window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    });

    return {
      navLinks,
      contactLink,
      isMobileMenuOpen,
      isNavActive,
      toggleMobileMenu,
      closeMobileMenu,
    };
  },
});
</script>

<style scoped>
.site-header {
  --site-header-height: 4.75rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: var(--editorial-surface-header);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  transition: background 0.25s ease, border-color 0.25s ease;
  isolation: isolate;
}

.site-header__grain {
  z-index: 0;
}

.site-header__mobile-panel {
  position: relative;
  height: 100%;
  padding: calc(var(--site-header-height) + 1rem) 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  background: var(--editorial-surface);
  overflow: hidden;
  isolation: isolate;
}

.site-header__mobile-grain {
  z-index: 0;
}

.site-header--scrolled {
  background: var(--editorial-surface-header-scrolled);
  border-bottom-color: rgba(255, 255, 255, 0.07);
}

.site-header__inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: var(--site-header-height);
  padding: 0.85rem 0;
}

.site-header__logo {
  flex-shrink: 0;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.site-header__logo:hover {
  color: #fff;
}

.site-header__center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  max-width: min(24rem, 62vw);
  width: max-content;
}

.site-header__center :deep(.audience-toggle) {
  max-width: 100%;
}

.site-header__end {
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.site-header__nav {
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 2.8vw, 2.35rem);
}

.site-header__nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding-bottom: 0.6rem;
  font-size: 0.86rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.site-header__nav-link:hover {
  color: rgba(255, 255, 255, 0.58);
}

.site-header__nav-link.is-active {
  color: rgba(255, 255, 255, 0.95);
}

.site-header__nav-link.is-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  transform: translateX(-50%);
}

.site-header__contact {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-left: clamp(3rem, 11vw, 8.5rem);
  padding-bottom: 0.1rem;
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1;
  color: rgba(255, 255, 255, 0.86);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.site-header__contact:hover {
  color: rgba(255, 255, 255, 0.55);
}

.site-header__contact-icon {
  width: 0.72rem;
  height: 0.72rem;
  opacity: 0.65;
  flex-shrink: 0;
}

.site-header__menu-toggle {
  display: none;
  margin-left: auto;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  gap: 0.38rem;
  flex-direction: column;
}

.site-header__menu-line {
  display: block;
  width: 1.35rem;
  height: 1px;
  background: rgba(255, 255, 255, 0.88);
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.site-header__menu-line.open:first-child {
  transform: translateY(3px) rotate(45deg);
}

.site-header__menu-line.open:last-child {
  transform: translateY(-3px) rotate(-45deg);
}

.site-header__mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(4, 4, 4, 0.94);
  backdrop-filter: blur(6px);
}

.site-header__mobile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.site-header__mobile-logo {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.88);
}

.site-header__mobile-close {
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  font-family: inherit;
  font-size: 0.82rem;
  cursor: pointer;
}

.site-header__mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.site-header__mobile-link {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 0;
  font-size: clamp(1.75rem, 8vw, 2.35rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: color 0.2s ease;
}

.site-header__mobile-link:hover,
.site-header__mobile-link.is-active {
  color: rgba(255, 255, 255, 0.52);
}

.site-header__mobile-link--contact {
  margin-top: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0;
}

.site-header__mobile-link--contact svg {
  width: 0.72rem;
  height: 0.72rem;
}

.site-header-menu-enter-active,
.site-header-menu-leave-active {
  transition: opacity 0.25s ease;
}

.site-header-menu-enter-from,
.site-header-menu-leave-to {
  opacity: 0;
}

@media (max-width: 992px) {
  .site-header__inner {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    column-gap: 0.5rem;
  }

  .site-header__logo {
    grid-column: 1;
    justify-self: start;
  }

  .site-header__end {
    display: none;
  }

  .site-header__center {
    position: static;
    transform: none;
    grid-column: 2;
    justify-self: center;
    max-width: min(18rem, 70vw);
    width: auto;
    margin: 0;
  }

  .site-header__menu-toggle {
    display: flex;
    grid-column: 3;
    justify-self: end;
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .site-header__center {
    margin-right: 0.25rem;
  }

  .site-header__center :deep(.audience-toggle__option) {
    padding: 0.32rem 0.5rem;
    font-size: 0.68rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-header,
  .site-header__nav-link,
  .site-header__contact,
  .site-header__logo,
  .site-header__mobile-link,
  .site-header__menu-line {
    transition: none;
  }
}
</style>
