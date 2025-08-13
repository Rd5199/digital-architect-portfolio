<template>
  <div class="animation-container">
    <svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Background and definitions -->
      <defs>
        <linearGradient id="appGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#6366f1" />
          <stop offset="100%" stop-color="#4338ca" />
        </linearGradient>
        <filter id="phoneShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <!-- Phone outline -->
      <rect x="120" y="20" width="160" height="260" rx="20" fill="#111827" filter="url(#phoneShadow)" />
      <rect x="126" y="26" width="148" height="248" rx="16" fill="url(#appGradient)" />
      
      <!-- Status bar -->
      <rect x="126" y="26" width="148" height="30" rx="16 16 0 0" fill="rgba(0,0,0,0.2)" />
      <text x="140" y="46" font-size="10" fill="white">10:30</text>
      <circle cx="260" cy="41" r="3" fill="white" />
      <circle cx="249" cy="41" r="3" fill="white" />
      <circle cx="238" cy="41" r="3" fill="white" />
      
      <!-- Main UI screen -->
      <rect x="136" y="66" width="128" height="140" rx="10" fill="white" />
      
      <!-- App title -->
      <text x="150" y="86" font-size="12" fill="#4338ca" font-weight="bold">ZenFit</text>
      <circle cx="250" cy="81" r="8" fill="#4338ca" opacity="0.1" />
      <circle cx="250" cy="81" r="3" fill="#4338ca" />
      
      <!-- Activity stats -->
      <rect x="146" y="96" width="108" height="40" rx="6" fill="#f8fafc">
        <animate attributeName="y" values="96;94;96" dur="3s" repeatCount="indefinite" />
      </rect>
      
      <!-- Steps counter -->
      <circle cx="166" cy="116" r="12" fill="none" stroke="#4338ca" stroke-width="3" stroke-dasharray="60 13" stroke-dashoffset="0">
        <animate attributeName="stroke-dashoffset" values="0;73;0" dur="6s" repeatCount="indefinite" />
      </circle>
      <text x="164" y="119" font-size="8" fill="#4338ca" font-weight="bold">8k</text>
      <text x="166" y="136" font-size="7" fill="#94a3b8" text-anchor="middle">Steps</text>
      
      <!-- Calories counter -->
      <circle cx="200" cy="116" r="12" fill="none" stroke="#f43f5e" stroke-width="3" stroke-dasharray="60 13" stroke-dashoffset="10">
        <animate attributeName="stroke-dashoffset" values="10;65;10" dur="8s" repeatCount="indefinite" />
      </circle>
      <text x="194" y="119" font-size="8" fill="#f43f5e" font-weight="bold">427</text>
      <text x="200" y="136" font-size="7" fill="#94a3b8" text-anchor="middle">Calories</text>
      
      <!-- Activity minutes counter -->
      <circle cx="234" cy="116" r="12" fill="none" stroke="#10b981" stroke-width="3" stroke-dasharray="60 13" stroke-dashoffset="20">
        <animate attributeName="stroke-dashoffset" values="20;50;20" dur="7s" repeatCount="indefinite" />
      </circle>
      <text x="230" y="119" font-size="8" fill="#10b981" font-weight="bold">42</text>
      <text x="234" y="136" font-size="7" fill="#94a3b8" text-anchor="middle">Minutes</text>
      
      <!-- Heart rate monitor -->
      <rect x="146" y="146" width="108" height="50" rx="6" fill="#f8fafc">
        <animate attributeName="y" values="146;144;146" dur="4s" repeatCount="indefinite" />
      </rect>
      <text x="156" y="161" font-size="8" fill="#475569" font-weight="bold">Heart Rate</text>
      <text x="238" y="161" font-size="8" fill="#f43f5e" font-weight="bold">72 BPM</text>
      
      <!-- Heart rate graph -->
      <polyline 
        points="156,180 166,175 176,185 186,165 196,178 206,168 216,186 226,175 236,182 246,170" 
        fill="none" 
        stroke="#f43f5e" 
        stroke-width="1.5">
        <animate 
          attributeName="points" 
          values="156,180 166,175 176,185 186,165 196,178 206,168 216,186 226,175 236,182 246,170;
                 156,175 166,185 176,170 186,180 196,165 206,180 216,170 226,186 236,175 246,182;
                 156,180 166,175 176,185 186,165 196,178 206,168 216,186 226,175 236,182 246,170" 
          dur="3s" 
          repeatCount="indefinite" />
      </polyline>
      
      <!-- Bottom navigation bar -->
      <rect x="136" y="216" width="128" height="50" rx="0 0 10 10" fill="#f8fafc" />
      
      <!-- Nav icons -->
      <circle cx="164" cy="236" r="16" fill="#4338ca" opacity="0.1" />
      <path d="M164 229 L164 243 M157 236 L171 236" stroke="#4338ca" stroke-width="2" />
      
      <circle cx="200" cy="236" r="20" fill="#4338ca" />
      <path d="M195 236 L205 236 M200 231 L200 241" stroke="white" stroke-width="2" />
      
      <circle cx="236" cy="236" r="16" fill="#4338ca" opacity="0.1" />
      <path d="M230 232 Q236 228 242 232 Q239 237 242 242 Q236 238 230 242 Q233 237 230 232" stroke="#4338ca" stroke-width="1.5" fill="none" />
    </svg>
  </div>
</template>

<style scoped>
.animation-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style> 