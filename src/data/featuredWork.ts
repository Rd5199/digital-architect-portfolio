export interface FeaturedWorkItem {
  id: string;
  name: string;
  domain: string;
  url: string;
  logo: string;
  logoAlt: string;
}

export const featuredWork: FeaturedWorkItem[] = [
  {
    id: 'brandreppd',
    name: 'BrandReppd',
    domain: 'brandreppd.com',
    url: 'https://brandreppd.com',
    logo: '/assets/logos/brandreppd.png',
    logoAlt: 'BrandReppd logo',
  },
  {
    id: 'localito',
    name: 'Localito',
    domain: 'localito.com',
    url: 'https://localito.com',
    logo: '/assets/logos/localito.png',
    logoAlt: 'Localito logo',
  },
  {
    id: 'theramate',
    name: 'TheraMate',
    domain: 'theramate.co.uk',
    url: 'https://theramate.co.uk',
    logo: '/assets/logos/theramate.png',
    logoAlt: 'TheraMate logo',
  },
];
