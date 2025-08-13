<template>
  <div class="animation-container">
    <svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Background with gradient -->
      <defs>
        <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#4b6cb7" />
          <stop offset="100%" stop-color="#182848" />
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
      <rect x="50" y="30" width="300" height="50" rx="8" fill="url(#headerGradient)" />
      <text x="70" y="60" font-size="16" fill="white" font-weight="bold">ShopEase</text>
      
      <!-- Search bar -->
      <rect x="180" y="42" width="120" height="26" rx="13" fill="rgba(255,255,255,0.2)" />
      <text x="195" y="60" font-size="12" fill="rgba(255,255,255,0.7)">Search products...</text>
      <circle cx="300" cy="55" r="8" fill="rgba(255,255,255,0.3)" />
      <path d="M302 57 L306 61" stroke="white" stroke-width="2" />
      
      <!-- Cart icon -->
      <circle cx="330" cy="55" r="12" fill="rgba(255,255,255,0.2)" />
      <path d="M324 53 L328 53 L330 58 L336 58 L338 48 L326 48" stroke="white" stroke-width="1.5" fill="none" />
      <circle cx="330" cy="61" r="2" fill="white" />
      <circle cx="335" cy="61" r="2" fill="white" />
      
      <!-- Category tabs -->
      <rect x="60" y="90" width="70" height="25" rx="4" fill="#4b6cb7" />
      <text x="75" y="107" font-size="12" fill="white">All</text>
      
      <rect x="140" y="90" width="70" height="25" rx="4" fill="#e9ecef" />
      <text x="155" y="107" font-size="12" fill="#4b6cb7">Clothing</text>
      
      <rect x="220" y="90" width="70" height="25" rx="4" fill="#e9ecef" />
      <text x="235" y="107" font-size="12" fill="#4b6cb7">Electronics</text>
      
      <!-- Product cards -->
      <g class="product-card" transform="translate(60, 130)">
        <rect width="80" height="120" rx="8" fill="white" stroke="#e9ecef" stroke-width="1" filter="url(#dropShadow)">
          <animate attributeName="y" values="0;-5;0" dur="3s" repeatCount="indefinite" />
        </rect>
        <rect width="80" height="60" rx="8" fill="#f8f9fa" />
        <rect x="10" y="10" width="60" height="40" rx="4" fill="#ff006e" />
        <text x="10" y="80" font-size="10" fill="#333" font-weight="bold">Premium Tee</text>
        <text x="10" y="95" font-size="10" fill="#777">100% Cotton</text>
        <text x="10" y="110" font-size="12" fill="#4b6cb7" font-weight="bold">$29.99</text>
      </g>
      
      <g class="product-card" transform="translate(160, 130)">
        <rect width="80" height="120" rx="8" fill="white" stroke="#e9ecef" stroke-width="1" filter="url(#dropShadow)">
          <animate attributeName="y" values="0;-5;0" dur="4s" repeatCount="indefinite" />
        </rect>
        <rect width="80" height="60" rx="8" fill="#f8f9fa" />
        <rect x="10" y="10" width="60" height="40" rx="4" fill="#3a86ff" />
        <text x="10" y="80" font-size="10" fill="#333" font-weight="bold">Smart Watch</text>
        <text x="10" y="95" font-size="10" fill="#777">Water Resistant</text>
        <text x="10" y="110" font-size="12" fill="#4b6cb7" font-weight="bold">$199.99</text>
      </g>
      
      <g class="product-card" transform="translate(260, 130)">
        <rect width="80" height="120" rx="8" fill="white" stroke="#e9ecef" stroke-width="1" filter="url(#dropShadow)">
          <animate attributeName="y" values="0;-5;0" dur="3.5s" repeatCount="indefinite" />
        </rect>
        <rect width="80" height="60" rx="8" fill="#f8f9fa" />
        <rect x="10" y="10" width="60" height="40" rx="4" fill="#fb5607" />
        <text x="10" y="80" font-size="10" fill="#333" font-weight="bold">Headphones</text>
        <text x="10" y="95" font-size="10" fill="#777">Noise Cancelling</text>
        <text x="10" y="110" font-size="12" fill="#4b6cb7" font-weight="bold">$149.99</text>
      </g>
      
      <!-- Add to cart animation -->
      <g class="add-to-cart" opacity="0">
        <circle cx="295" cy="190" r="15" fill="#4b6cb7">
          <animate attributeName="opacity" values="0;0;1;0" dur="5s" repeatCount="indefinite" />
          <animate attributeName="cy" values="190;150;55" dur="5s" repeatCount="indefinite" />
          <animate attributeName="cx" values="295;295;330" dur="5s" repeatCount="indefinite" />
          <animate attributeName="r" values="15;15;5" dur="5s" repeatCount="indefinite" />
        </circle>
        <text x="291" y="194" font-size="16" fill="white" font-weight="bold">+
          <animate attributeName="opacity" values="0;0;1;0" dur="5s" repeatCount="indefinite" />
          <animate attributeName="y" values="194;154;59" dur="5s" repeatCount="indefinite" />
          <animate attributeName="x" values="291;291;326" dur="5s" repeatCount="indefinite" />
        </text>
      </g>
      
      <!-- Bottom navigation -->
      <rect x="50" y="260" width="300" height="10" rx="0 0 8 8" fill="#f8f9fa" />
      <circle cx="100" cy="265" r="3" fill="#4b6cb7" />
      <circle cx="200" cy="265" r="3" fill="#adb5bd" />
      <circle cx="300" cy="265" r="3" fill="#adb5bd" />
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