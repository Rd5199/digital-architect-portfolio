import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
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

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/3d-models',
      name: '3dModels',
      component: ModelsShowcase
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
    if (savedPosition) {
      return savedPosition;
    }
    
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth',
            top: 80 // Offset for header
          });
        }, 500); // Delay to ensure DOM is ready
      });
    } else {
      return { top: 0 };
    }
  }
})

export default router 