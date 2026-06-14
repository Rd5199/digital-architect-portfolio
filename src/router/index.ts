import { createRouter, createWebHistory } from 'vue-router'
import { scrollToTarget, getLenis } from '../utils/smoothExperience'
import { updatePageMeta, SITE_URL } from '../utils/seo'
import Home from '../components/Home.vue'
import CreatorsPage2 from '../views/CreatorsPage2.vue'
import ModelsShowcase from '../components/ModelsShowcase.vue'
import ProjectDetail from '../components/ProjectDetail.vue'
import MeditationTimer from '../components/mini-projects/MeditationTimer.vue'
import DataVisualization from '../components/mini-projects/DataVisualization.vue'
import EcommercePlatform from '../components/mini-projects/EcommercePlatform.vue'
import WellnessSuite from '../components/mini-projects/WellnessSuite.vue'
import SaasDashboard from '../components/mini-projects/SaasDashboard.vue'
import SavourSocieties from '../components/mini-projects/SavourSocieties.vue'
import NonLeagueNetwork from '../components/mini-projects/NonLeagueNetwork.vue'
import PrivacyPolicy from '../components/PrivacyPolicy.vue'
import TermsOfService from '../components/TermsOfService.vue'
import CareersPage from '../views/CareersPage.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        audience: 'business',
        title: 'My Digital Architect | Custom AI for Service Businesses',
        description:
          'Custom AI systems for service businesses. We cut costs and move faster with web and mobile apps built around how you work.',
      },
    },
    {
      path: '/business-landing/business.html',
      redirect: '/',
    },
    {
      path: '/business-landing',
      redirect: '/',
    },
    {
      path: '/creators',
      name: 'creators',
      component: CreatorsPage2,
      meta: {
        audience: 'creator',
        title: 'Custom Creator Apps — Membership & Fan Community Apps | DigitalArchitect',
        description:
          'Branded iOS, Android, and web apps for creators and influencers. Membership tiers, fan communities, and digital products — revenue split or pay upfront. App Store launch included.',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Custom Creator App Development',
          provider: {
            '@type': 'Organization',
            name: 'DigitalArchitect',
            url: SITE_URL,
          },
          description:
            'Custom membership and fan community apps for content creators and influencers. Branded mobile and web apps with App Store launch, subscriptions, and digital product sales.',
          url: `${SITE_URL}/creators`,
          areaServed: 'Worldwide',
          serviceType: 'Creator App Development — Membership, Community, and Digital Products',
        },
      },
    },
    {
      path: '/creators-2',
      redirect: '/creators',
    },
    {
      path: '/3d-models',
      name: '3dModels',
      component: ModelsShowcase,
      meta: {
        audience: 'business',
        title: '3D Models | My Digital Architect',
        description:
          'Interactive 3D model showcase — web-optimized GLB assets, Three.js integration, and real-time visualization for product and marketing experiences.',
      },
    },
    {
      path: '/careers',
      name: 'careers',
      component: CareersPage,
      meta: {
        audience: 'business',
        title: 'Careers | My Digital Architect',
        description:
          'Apply to join My Digital Architect. General applications for engineering, design, AI, and operations — remote-first studio building custom web and mobile products.',
      },
    },
    {
      path: '/project/:id',
      name: 'projectDetail',
      component: ProjectDetail
    },
    {
      path: '/mini-projects/ecommerce-platform',
      name: 'ecommercePlatform',
      component: EcommercePlatform
    },
    {
      path: '/mini-projects/wellness-suite',
      name: 'wellnessSuite',
      component: WellnessSuite
    },
    {
      path: '/mini-projects/data-visualization',
      name: 'dataVisualization',
      component: DataVisualization
    },
    {
      path: '/mini-projects/saas-dashboard',
      name: 'saasDashboard',
      component: SaasDashboard
    },
    {
      path: '/mini-projects/savour-societies',
      name: 'savourSocieties',
      component: SavourSocieties
    },
    {
      path: '/mini-projects/non-league-network',
      name: 'nonLeagueNetwork',
      component: NonLeagueNetwork
    },
    {
      path: '/privacy-policy',
      name: 'privacyPolicy',
      component: PrivacyPolicy
    },
    {
      path: '/terms-of-service',
      name: 'termsOfService',
      component: TermsOfService
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      // Route hash scrolling through Lenis for a smooth glide
      setTimeout(() => scrollToTarget(to.hash), 500); // Delay to ensure DOM is ready
      return false;
    }

    if (savedPosition) {
      return savedPosition;
    }

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      return false;
    }
    return { top: 0 };
  }
})

router.afterEach((to) => {
  const title = (to.meta.title as string) || 'DigitalArchitect';
  const description = (to.meta.description as string) || 'Professional web and app development services.';

  updatePageMeta({
    title,
    description,
    path: to.path,
    jsonLd: to.meta.jsonLd as Record<string, unknown> | undefined
  });
});

export default router
