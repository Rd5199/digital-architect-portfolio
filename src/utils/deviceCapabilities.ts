export type QualityTier = 'high' | 'medium' | 'low';

export interface ParticleBudget {
  foreground: number;
  background: number;
  deepSpace: number;
  large: number;
  interactive: number;
  galaxyClusters: number;
  connectionCheckRange: number;
  interactiveConnectionRange: number;
  updateConnectionsEvery: number;
}

const PARTICLE_BUDGETS: Record<QualityTier, ParticleBudget> = {
  high: {
    foreground: 2500,
    background: 8000,
    deepSpace: 12000,
    large: 100,
    interactive: 1500,
    galaxyClusters: 7,
    connectionCheckRange: 100,
    interactiveConnectionRange: 20,
    updateConnectionsEvery: 1,
  },
  medium: {
    foreground: 1200,
    background: 3500,
    deepSpace: 5000,
    large: 60,
    interactive: 700,
    galaxyClusters: 4,
    connectionCheckRange: 50,
    interactiveConnectionRange: 12,
    updateConnectionsEvery: 2,
  },
  low: {
    foreground: 600,
    background: 1500,
    deepSpace: 2500,
    large: 30,
    interactive: 350,
    galaxyClusters: 2,
    connectionCheckRange: 25,
    interactiveConnectionRange: 8,
    updateConnectionsEvery: 3,
  },
};

export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function getQualityTier(): QualityTier {
  const width = window.innerWidth;
  const isMobile = width <= 768 || isTouchDevice();
  const isLowEndMobile = width <= 576 || (isIOS() && width <= 820);

  if (isLowEndMobile) return 'low';
  if (isMobile) return 'medium';
  return 'high';
}

export function getParticleBudget(tier: QualityTier = getQualityTier()): ParticleBudget {
  return PARTICLE_BUDGETS[tier];
}

export function getAdaptivePixelRatio(): number {
  const tier = getQualityTier();
  const dpr = window.devicePixelRatio || 1;

  if (tier === 'low') return Math.min(dpr, 1.5);
  if (tier === 'medium') return Math.min(dpr, 2);
  return Math.min(dpr, 2);
}

export function getViewportSize(): { width: number; height: number } {
  const visualViewport = window.visualViewport;

  if (visualViewport) {
    return {
      width: Math.round(visualViewport.width),
      height: Math.round(visualViewport.height),
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl')
      || canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}
