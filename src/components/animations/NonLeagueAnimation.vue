<template>
  <div class="animation-container">
    <svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Background with gradient -->
      <defs>
        <linearGradient id="footballGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1D976C" />
          <stop offset="100%" stop-color="#93F9B9" />
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
      
      <!-- Mobile phone frame -->
      <rect x="130" y="20" width="140" height="260" rx="20" fill="#111" filter="url(#dropShadow)" />
      <rect x="135" y="30" width="130" height="240" rx="15" fill="white" />
      
      <!-- Status bar -->
      <rect x="135" y="30" width="130" height="20" rx="5" fill="#f5f5f5" />
      <text x="145" y="44" font-size="9" fill="#333">9:41</text>
      <path d="M245 35 L250 40 L245 45" stroke="#333" stroke-width="1" fill="none" />
      <path d="M240 35 L240 45" stroke="#333" stroke-width="1" />
      <path d="M235 37 L235 43" stroke="#333" stroke-width="1" />
      <path d="M230 39 L230 41" stroke="#333" stroke-width="1" />
      
      <!-- App header -->
      <rect x="135" y="50" width="130" height="40" rx="0" fill="url(#footballGradient)" />
      <text x="155" y="75" font-size="12" fill="white" font-weight="bold">Non-League Network</text>
      
      <!-- Football pitch visualization -->
      <rect x="145" y="100" width="110" height="70" rx="5" fill="#1a7c43" />
      
      <!-- Pitch lines -->
      <rect x="150" y="105" width="100" height="60" rx="3" fill="none" stroke="white" stroke-width="1" />
      <line x1="200" y1="105" x2="200" y2="165" stroke="white" stroke-width="1" />
      <circle cx="200" cy="135" r="10" fill="none" stroke="white" stroke-width="1" />
      
      <!-- Penalty areas -->
      <rect x="150" y="120" width="20" height="30" fill="none" stroke="white" stroke-width="1" />
      <rect x="230" y="120" width="20" height="30" fill="none" stroke="white" stroke-width="1" />
      
      <!-- Animated football -->
      <circle class="football" cx="200" cy="135" r="6" fill="white">
        <animate attributeName="cx" values="200;170;190;220;200" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="135;125;145;130;135" dur="5s" repeatCount="indefinite" />
      </circle>
      
      <!-- Player dots -->
      <circle cx="180" cy="125" r="3" fill="#3498db" />
      <circle cx="160" cy="135" r="3" fill="#3498db" />
      <circle cx="190" cy="155" r="3" fill="#3498db" />
      
      <circle cx="220" cy="125" r="3" fill="#e74c3c" />
      <circle cx="240" cy="135" r="3" fill="#e74c3c" />
      <circle cx="210" cy="155" r="3" fill="#e74c3c" />
      
      <!-- Fixture info section -->
      <rect x="145" y="180" width="110" height="50" rx="5" fill="#f5f5f5" />
      <text x="155" y="195" font-size="10" fill="#333" font-weight="bold">Next Fixture</text>
      <text x="155" y="210" font-size="9" fill="#555">Maplewood FC vs.</text>
      <text x="155" y="222" font-size="9" fill="#555">East Valley United</text>
      
      <!-- Date and time with animation -->
      <text x="200" y="210" font-size="9" fill="#1D976C" text-anchor="end">
        Sat, 3:00 PM
        <animate attributeName="font-weight" values="normal;bold;normal" dur="2s" repeatCount="indefinite" />
      </text>
      
      <!-- Bottom navigation -->
      <rect x="135" y="240" width="130" height="30" rx="0" fill="#f5f5f5" />
      
      <circle cx="160" cy="255" r="10" fill="url(#footballGradient)">
        <animate attributeName="r" values="10;11;10" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="160" y="258" font-size="10" fill="white" text-anchor="middle">🏠</text>
      
      <circle cx="200" cy="255" r="10" fill="#ddd" />
      <text x="200" y="258" font-size="10" fill="#555" text-anchor="middle">🏆</text>
      
      <circle cx="240" cy="255" r="10" fill="#ddd" />
      <text x="240" y="258" font-size="10" fill="#555" text-anchor="middle">👥</text>
      
      <!-- Notification animation -->
      <g class="notification" opacity="0">
        <rect x="150" y="70" width="100" height="25" rx="5" fill="white" stroke="#1D976C" stroke-width="1">
          <animate attributeName="opacity" values="0;0;1;1;0" dur="6s" begin="1s" repeatCount="indefinite" />
        </rect>
        <text x="160" y="85" font-size="8" fill="#333" text-anchor="start">
          New Match Result Added!
          <animate attributeName="opacity" values="0;0;1;1;0" dur="6s" begin="1s" repeatCount="indefinite" />
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
  display: flex;
  justify-content: center;
  align-items: center;
}
</style> 