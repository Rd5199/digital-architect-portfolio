export interface ProjectGalleryImage {
  url: string;
  alt?: string;
}

export interface MiniProject {
  id: number;
  title: string;
  description: string;
  route: string;
  image?: string;
  animation3d?: string;
}

export interface Project {
  id: number;
  title: string;
  type: string;
  image: string;
  animation3d?: string;
  tags: string[];
  description: string;
  challenge: string;
  solution: string;
  duration: string;
  technologies: string[];
  liveUrl?: string;
  gallery?: ProjectGalleryImage[];
  miniProjects?: MiniProject[];
}

export const projectsData: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform X',
    type: 'Web Application',
    image: '/assets/images/openart-image_lC1XlWa1_1741449161168_raw.jpg',
    animation3d: '/assets/animations/ecommerce-animation.svg',
    tags: ['Vue.js', 'Node.js', 'Stripe'],
    description: 'A comprehensive e-commerce platform built for a medium-sized retail business, featuring product management, inventory tracking, customer accounts, and integrated payment processing.',
    challenge: 'The client needed a scalable solution to transition from brick-and-mortar to online sales during the pandemic. They required a platform that could handle thousands of products, integrate with their existing inventory system, and provide a seamless checkout experience.',
    solution: 'I developed a custom Vue.js frontend with a Node.js backend that offers real-time inventory updates, a responsive design optimized for mobile shopping, and Stripe integration for secure payments. The platform includes an admin dashboard for easy product management and order fulfillment.',
    duration: '2.5 months',
    technologies: ['Vue.js', 'Vuex', 'Node.js', 'Express', 'MongoDB', 'Stripe API', 'AWS S3', 'Docker'],
    liveUrl: 'https://example.com/ecommerce',
    miniProjects: [
      {
        id: 101,
        title: 'E-commerce Platform Demo',
        description: 'A functional e-commerce platform demonstration with product management, inventory tracking, customer accounts, and payment processing features.',
        route: '/mini-projects/ecommerce-platform',
        image: '/assets/images/openart-image_lC1XlWa1_1741449161168_raw.jpg'
      }
    ]
  },
  {
    id: 2,
    title: 'Wellness Mobile App',
    type: 'Mobile App (iOS & Android)',
    image: '/assets/images/openart-image_4J3rsNPv_1741447658208_raw.jpg',
    animation3d: '/assets/animations/wellness-animation.svg',
    tags: ['React Native', 'Firebase', 'API Integration'],
    description: 'A holistic wellness application that combines fitness tracking, meditation guidance, and nutritional planning in a single, user-friendly mobile experience.',
    challenge: 'The startup needed to consolidate multiple wellness services into a unified platform that would appeal to health-conscious users while integrating with various fitness tracking devices and APIs.',
    solution: 'I built a cross-platform React Native application with real-time synchronization via Firebase, custom animation sequences for guided meditations, and integration with popular fitness tracking APIs. The app features offline functionality and personalized wellness recommendations.',
    duration: '3.5 months',
    technologies: ['React Native', 'TypeScript', 'Firebase', 'Redux', 'Google Fit API', 'Apple HealthKit', 'Push Notifications'],
    liveUrl: 'https://apps.apple.com/example/wellness',
    miniProjects: [
      {
        id: 201,
        title: 'Comprehensive Wellness Suite',
        description: 'A full-featured wellness platform combining meditation timer, activity tracking, journaling capabilities, and offline data synchronization in one seamless experience.',
        route: '/mini-projects/wellness-suite',
        image: '/assets/images/openart-image_4J3rsNPv_1741447658208_raw.jpg'
      }
    ]
  },
  {
    id: 3,
    title: 'SaaS Dashboard',
    type: 'Web Application',
    image: '/assets/images/space-bg.svg',
    animation3d: '/assets/animations/saas-animation.svg',
    tags: ['Angular', 'Python/Django', 'AWS'],
    description: 'A comprehensive analytics and management dashboard for a B2B SaaS company, enabling customers to monitor service usage, manage subscriptions, and access detailed reports.',
    challenge: 'The client needed a high-performance dashboard that could visualize complex data sets, handle real-time updates for thousands of concurrent users, and maintain security for sensitive business information.',
    solution: 'I developed an Angular frontend with a Django REST Framework backend that features interactive data visualizations, role-based access controls, and secure API integrations. The system uses WebSockets for real-time updates and AWS infrastructure for scalability.',
    duration: '3 months',
    technologies: ['Angular', 'TypeScript', 'NgRx', 'Python', 'Django', 'PostgreSQL', 'WebSockets', 'D3.js', 'AWS Lambda'],
    liveUrl: 'https://dashboard.example.com',
    miniProjects: [
      {
        id: 304,
        title: 'B2B SaaS Dashboard',
        description: 'A comprehensive analytics and management dashboard for B2B customers to monitor service usage, manage subscriptions, and access detailed reports.',
        route: '/mini-projects/saas-dashboard',
        image: '/assets/images/space-bg.svg'
      }
    ]
  },
  {
    id: 4,
    title: 'Savour Societies',
    type: 'Web Application',
    image: '/assets/images/savour-societies.png',
    animation3d: '/assets/animations/savour-societies.svg',
    tags: ['Vue.js', 'TailwindCSS', 'Firebase'],
    description: 'A social dining platform that brings people together for real-life connections over meals, helping users find like-minded individuals who share their taste in food and conversation.',
    challenge: 'The client wanted to create a platform that would encourage people to disconnect from screens and form genuine connections through shared dining experiences. They needed a solution that could handle user matchmaking, restaurant partnerships, and a referral system.',
    solution: 'I developed a responsive Vue.js website with a sleek user interface that emphasizes the social experience. The platform includes a sophisticated referral system with rewards, user profiles for matching dining preferences, and an intuitive booking system for curated meal experiences.',
    duration: '2 months',
    technologies: ['Vue.js', 'TailwindCSS', 'Firebase', 'Cloud Functions', 'Stripe API', 'Email Integration', 'Analytics'],
    liveUrl: 'https://savoursocieties.com',
    miniProjects: [
      {
        id: 401,
        title: 'Savour Societies Landing Page',
        description: 'An engaging landing page for the social dining platform featuring the referral system, countdown timer, and guest list registration.',
        route: '/mini-projects/savour-societies',
        image: '/assets/images/savour-societies.jpg'
      }
    ]
  },
  {
    id: 5,
    title: 'Non-League Network',
    type: 'Mobile App (iOS & Android)',
    image: '/assets/images/non-league-network.png',
    animation3d: '/assets/animations/non-league-network.svg',
    tags: ['React Native', 'Firebase', 'Offline Support'],
    description: 'A comprehensive mobile application designed specifically for the non-league football community, connecting players, coaches, staff, and fans within a dedicated ecosystem.',
    challenge: 'The client needed to create a platform that would serve the diverse needs of the non-league football community, which has been underserved by mainstream sports apps. The app needed to function reliably in various network conditions, including offline scenarios common at remote match venues.',
    solution: 'I developed a cross-platform mobile application using React Native with a Firebase backend that combines fixture management, networking capabilities, and a resource library. The app features robust offline functionality, allowing users to access critical information even without an internet connection.',
    duration: '3 months',
    technologies: ['React Native', 'TypeScript', 'Firebase', 'Redux', 'Offline Storage', 'Push Notifications', 'Geolocation API', 'Real-time Database'],
    liveUrl: 'https://play.google.com/store/apps/details?id=com.nonleaguenetwork',
    miniProjects: [
      {
        id: 501,
        title: 'Non-League Network Demo',
        description: 'An interactive demonstration of the Non-League Network mobile app, showcasing key user flows from registration to offline match management.',
        route: '/mini-projects/non-league-network',
        image: '/assets/images/non-league-network.jpg'
      }
    ]
  }
]; 