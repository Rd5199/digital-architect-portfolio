<template>
  <div class="animation-container">
    <svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Background with gradient -->
      <defs>
        <linearGradient id="savourGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6A3093" />
          <stop offset="100%" stop-color="#a044ff" />
        </linearGradient>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="1" dy="1" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <!-- App background -->
      <rect x="50" y="30" width="300" height="240" rx="8" fill="white" filter="url(#dropShadow)" />
      
      <!-- Header -->
      <rect x="50" y="30" width="300" height="50" rx="8" fill="url(#savourGradient)" />
      <text x="70" y="60" font-size="16" fill="white" font-weight="bold">Savour Societies</text>
      
      <!-- Navigation -->
      <rect x="60" y="90" width="280" height="1" fill="#e9ecef" />
      <text x="70" y="110" font-size="13" fill="#6A3093" font-weight="bold">Upcoming Events</text>
      <text x="200" y="110" font-size="13" fill="#999">Restaurants</text>
      <text x="300" y="110" font-size="13" fill="#999">Profile</text>
      
      <!-- Food event card -->
      <g class="event-card" transform="translate(60, 130)">
        <rect width="280" height="80" rx="8" fill="white" stroke="#e9ecef" stroke-width="1" filter="url(#dropShadow)">
          <animate attributeName="y" values="0;-3;0" dur="4s" repeatCount="indefinite" />
        </rect>
        <rect x="10" y="10" width="60" height="60" rx="8" fill="#f8f9fa" />
        
        <!-- Animated food icon -->
        <g>
          <ellipse cx="40" cy="40" rx="22" ry="18" fill="#FFA500">
            <animate attributeName="ry" values="18;20;18" dur="3s" repeatCount="indefinite" />
          </ellipse>
          <path d="M30 30 Q40 45 50 30" stroke="#FFF" stroke-width="2" fill="none">
            <animate attributeName="d" values="M30 30 Q40 45 50 30;M30 32 Q40 47 50 32;M30 30 Q40 45 50 30" dur="3s" repeatCount="indefinite" />
          </path>
        </g>
        
        <text x="85" y="30" font-size="14" fill="#333" font-weight="bold">French Cuisine Night</text>
        <text x="85" y="50" font-size="12" fill="#777">Thu, 8:00 PM · La Maison</text>
        <text x="85" y="70" font-size="12" fill="#6A3093" font-weight="bold">6 attendees · 2 spots left</text>
        
        <circle cx="260" cy="40" r="15" fill="#6A3093">
          <animate attributeName="r" values="15;16;15" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="257" y="44" font-size="18" fill="white">+</text>
      </g>
      
      <!-- Second food event card -->
      <g class="event-card" transform="translate(60, 220)">
        <rect width="280" height="80" rx="8" fill="white" stroke="#e9ecef" stroke-width="1" filter="url(#dropShadow)">
          <animate attributeName="y" values="0;-3;0" dur="3.5s" repeatCount="indefinite" />
        </rect>
        <rect x="10" y="10" width="60" height="60" rx="8" fill="#f8f9fa" />
        
        <!-- Animated food icon -->
        <g>
          <circle cx="40" cy="40" r="20" fill="#8FBC8F">
            <animate attributeName="r" values="20;22;20" dur="4s" repeatCount="indefinite" />
          </circle>
          <path d="M30 40 C35 30, 45 30, 50 40" stroke="#FFF" stroke-width="2" fill="none">
            <animate attributeName="d" values="M30 40 C35 30, 45 30, 50 40;M30 42 C35 32, 45 32, 50 42;M30 40 C35 30, 45 30, 50 40" dur="4s" repeatCount="indefinite" />
          </path>
        </g>
        
        <text x="85" y="30" font-size="14" fill="#333" font-weight="bold">Vegan Tasting Menu</text>
        <text x="85" y="50" font-size="12" fill="#777">Sat, 7:00 PM · Green Plate</text>
        <text x="85" y="70" font-size="12" fill="#6A3093" font-weight="bold">8 attendees · 4 spots left</text>
        
        <circle cx="260" cy="40" r="15" fill="#6A3093">
          <animate attributeName="r" values="15;16;15" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <text x="257" y="44" font-size="18" fill="white">+</text>
      </g>
      
      <!-- Notification animation -->
      <g class="notification" opacity="0">
        <rect x="100" y="60" width="200" height="40" rx="8" fill="#FFF" stroke="#6A3093" stroke-width="1">
          <animate attributeName="opacity" values="0;0;1;1;0" dur="6s" begin="2s" repeatCount="indefinite" />
        </rect>
        <text x="120" y="85" font-size="12" fill="#333" font-weight="bold">
          New dinner event just added!
          <animate attributeName="opacity" values="0;0;1;1;0" dur="6s" begin="2s" repeatCount="indefinite" />
        </text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.animation-container {
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
</style> 