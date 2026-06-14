<template>
  <div class="business-landing-page">
    <div class="business-landing__tabs" aria-label="Site sections">
      <AudienceToggle size="sm" compact variant="header" />
    </div>

    <iframe
      ref="frameRef"
      class="business-landing__frame"
      src="/business-landing/business.html"
      title="My Digital Architect business landing"
      loading="eager"
      scrolling="no"
    />

    <Footer :on-contact-navigate="scrollToAudit" class="business-landing__footer" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import AudienceToggle from '../components/AudienceToggle.vue';
import Footer from '../components/Footer.vue';

export default defineComponent({
  name: 'BusinessLandingPage',
  components: {
    AudienceToggle,
    Footer,
  },
  setup() {
    const frameRef = ref<HTMLIFrameElement | null>(null);
    let resizeObserver: ResizeObserver | null = null;
    let resizeFrameRaf: number | null = null;

    const resizeFrame = () => {
      const iframe = frameRef.value;
      if (!iframe) return;

      const doc = iframe.contentDocument;
      if (!doc) return;

      const height = Math.max(
        doc.documentElement?.scrollHeight ?? 0,
        doc.body?.scrollHeight ?? 0,
      );

      if (height > 0) {
        iframe.style.height = `${height}px`;
      }
    };

    const scheduleResizeFrame = () => {
      if (resizeFrameRaf !== null) cancelAnimationFrame(resizeFrameRaf);
      resizeFrameRaf = requestAnimationFrame(() => {
        resizeFrameRaf = null;
        resizeFrame();
      });
    };

    const bindFrameResize = () => {
      const iframe = frameRef.value;
      const doc = iframe?.contentDocument;
      if (!iframe || !doc?.body) return;

      scheduleResizeFrame();

      resizeObserver = new ResizeObserver(() => scheduleResizeFrame());
      resizeObserver.observe(doc.body);

      window.addEventListener('resize', scheduleResizeFrame);
    };

    const scrollToAudit = () => {
      const iframe = frameRef.value;
      const doc = iframe?.contentDocument;
      const audit = doc?.getElementById('audit');

      if (audit) {
        const iframeTop = iframe?.getBoundingClientRect().top ?? 0;
        const auditTop = audit.getBoundingClientRect().top;
        const offset = window.scrollY + iframeTop + auditTop - 72;

        window.scrollTo({ top: offset, behavior: 'smooth' });
        return;
      }

      window.location.hash = '#audit';
    };

    onMounted(() => {
      document.body.classList.add('immersive-landing-active');

      const iframe = frameRef.value;
      if (!iframe) return;

      iframe.addEventListener('load', bindFrameResize);
      if (iframe.contentDocument?.readyState === 'complete') {
        bindFrameResize();
      }
    });

    onBeforeUnmount(() => {
      document.body.classList.remove('immersive-landing-active');

      if (resizeFrameRaf !== null) {
        cancelAnimationFrame(resizeFrameRaf);
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }

      window.removeEventListener('resize', scheduleResizeFrame);

      const iframe = frameRef.value;
      if (iframe) {
        iframe.removeEventListener('load', bindFrameResize);
      }
    });

    return {
      frameRef,
      scrollToAudit,
    };
  },
});
</script>

<style scoped>
.business-landing-page {
  position: relative;
  min-height: 100dvh;
  background: #070707;
}

.business-landing__frame {
  display: block;
  width: 100%;
  min-height: 100dvh;
  border: none;
  background: #070707;
}

.business-landing__tabs {
  position: fixed;
  top: 0.85rem;
  left: 50%;
  z-index: 100;
  transform: translateX(-50%);
  pointer-events: auto;
}

.business-landing__footer {
  margin-top: 0;
}
</style>
