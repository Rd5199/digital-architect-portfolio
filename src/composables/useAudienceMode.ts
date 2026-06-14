import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export type AudienceMode = 'business' | 'creator';

const CREATOR_PATH = '/creators';

function isBusinessLandingPath(path: string) {
  return path === '/' || path === '/business-landing/business.html' || path.startsWith('/business-landing/');
}

export function useAudienceMode() {
  const route = useRoute();
  const router = useRouter();

  const audienceMode = computed<AudienceMode>(() => {
    if (route.path === CREATOR_PATH || route.meta.audience === 'creator') {
      return 'creator';
    }
    return 'business';
  });

  const isBusiness = computed(() => audienceMode.value === 'business');
  const isCreator = computed(() => audienceMode.value === 'creator');
  const isCreatorRoute = computed(() => route.path === CREATOR_PATH);

  const setAudienceMode = (mode: AudienceMode) => {
    if (mode === 'creator' && route.path !== CREATOR_PATH) {
      router.push({ name: 'creators' });
      return;
    }

    if (mode === 'business' && !isBusinessLandingPath(route.path)) {
      window.location.href = '/';
    }
  };

  return {
    audienceMode,
    setAudienceMode,
    isBusiness,
    isCreator,
    isCreatorRoute,
  };
}
