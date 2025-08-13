<template>
  <div class="animation-container">
    <svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Dashboard panel -->
      <rect x="50" y="40" width="300" height="220" rx="8" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2" />
      
      <!-- Header -->
      <rect x="50" y="40" width="300" height="40" rx="8" fill="#4c1d95" />
      <text x="70" y="65" font-size="14" fill="white">Dashboard Analytics</text>
      <circle cx="320" cy="60" r="10" fill="#10b981" />
      
      <!-- Bar chart -->
      <g class="bar-chart" transform="translate(80, 100)">
        <line x1="0" y1="100" x2="180" y2="100" stroke="#adb5bd" stroke-width="1" />
        
        <rect class="bar" x="10" y="50" width="15" height="50" fill="#0077b6">
          <animate attributeName="height" values="50;70;50" dur="3s" repeatCount="indefinite" />
          <animate attributeName="y" values="50;30;50" dur="3s" repeatCount="indefinite" />
        </rect>
        
        <rect class="bar" x="40" y="30" width="15" height="70" fill="#0096c7">
          <animate attributeName="height" values="70;40;70" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y" values="30;60;30" dur="4s" repeatCount="indefinite" />
        </rect>
        
        <rect class="bar" x="70" y="60" width="15" height="40" fill="#00b4d8">
          <animate attributeName="height" values="40;80;40" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="y" values="60;20;60" dur="3.5s" repeatCount="indefinite" />
        </rect>
        
        <rect class="bar" x="100" y="20" width="15" height="80" fill="#48cae4">
          <animate attributeName="height" values="80;50;80" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="y" values="20;50;20" dur="4.5s" repeatCount="indefinite" />
        </rect>
        
        <rect class="bar" x="130" y="40" width="15" height="60" fill="#90e0ef">
          <animate attributeName="height" values="60;90;60" dur="5s" repeatCount="indefinite" />
          <animate attributeName="y" values="40;10;40" dur="5s" repeatCount="indefinite" />
        </rect>
      </g>
      
      <!-- Donut chart -->
      <g class="donut-chart" transform="translate(300, 150)">
        <circle cx="0" cy="0" r="50" fill="#f8f9fa" />
        
        <!-- Segments of the donut chart -->
        <path d="M0,0 L0,-50 A50,50 0 0,1 43.3,-25 z" fill="#ff595e">
          <animate attributeName="d" 
                  values="M0,0 L0,-50 A50,50 0 0,1 43.3,-25 z;
                         M0,0 L0,-50 A50,50 0 0,1 50,0 z;
                         M0,0 L0,-50 A50,50 0 0,1 43.3,-25 z" 
                  dur="5s" repeatCount="indefinite" />
        </path>
        
        <path d="M0,0 L43.3,-25 A50,50 0 0,1 43.3,25 z" fill="#ffca3a">
          <animate attributeName="d" 
                  values="M0,0 L43.3,-25 A50,50 0 0,1 43.3,25 z;
                         M0,0 L50,0 A50,50 0 0,1 0,50 z;
                         M0,0 L43.3,-25 A50,50 0 0,1 43.3,25 z" 
                  dur="5s" repeatCount="indefinite" />
        </path>
        
        <path d="M0,0 L43.3,25 A50,50 0 0,1 0,50 z" fill="#8ac926">
          <animate attributeName="d" 
                  values="M0,0 L43.3,25 A50,50 0 0,1 0,50 z;
                         M0,0 L0,50 A50,50 0 0,1 -50,0 z;
                         M0,0 L43.3,25 A50,50 0 0,1 0,50 z" 
                  dur="5s" repeatCount="indefinite" />
        </path>
        
        <path d="M0,0 L0,50 A50,50 0 0,1 -43.3,25 z" fill="#1982c4">
          <animate attributeName="d" 
                  values="M0,0 L0,50 A50,50 0 0,1 -43.3,25 z;
                         M0,0 L-50,0 A50,50 0 0,1 0,-50 z;
                         M0,0 L0,50 A50,50 0 0,1 -43.3,25 z" 
                  dur="5s" repeatCount="indefinite" />
        </path>
        
        <path d="M0,0 L-43.3,25 A50,50 0 0,1 -43.3,-25 z" fill="#6a4c93">
          <animate attributeName="d" 
                  values="M0,0 L-43.3,25 A50,50 0 0,1 -43.3,-25 z;
                         M0,0 L0,-50 A50,50 0 0,1 0,-50 z;
                         M0,0 L-43.3,25 A50,50 0 0,1 -43.3,-25 z" 
                  dur="5s" repeatCount="indefinite" />
        </path>
        
        <!-- Hole in the middle of the donut -->
        <circle cx="0" cy="0" r="25" fill="#f8f9fa" />
      </g>
      
      <!-- Data points -->
      <g class="data-points">
        <circle cx="80" cy="220" r="4" fill="#ff595e">
          <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="120" cy="220" r="4" fill="#ffca3a">
          <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="160" cy="220" r="4" fill="#8ac926">
          <animate attributeName="r" values="4;6;4" dur="4s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="200" cy="220" r="4" fill="#1982c4">
          <animate attributeName="r" values="4;6;4" dur="2.5s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="240" cy="220" r="4" fill="#6a4c93">
          <animate attributeName="r" values="4;6;4" dur="3.5s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.animation-container {
  width: 100%;
  height: 100%;
  background-color: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.bar-chart, .donut-chart {
  filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1));
}

.data-points circle {
  filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.2));
}
</style> 