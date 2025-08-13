<template>
  <div class="mini-project-container">
    <div class="back-navigation">
      <router-link :to="`/project/3`" class="back-link">
        <i class="fas fa-arrow-left"></i> Back to SaaS Dashboard Project
      </router-link>
    </div>
    
    <h1 class="mini-project-title">Interactive Data Visualization</h1>
    
    <div class="dashboard-controls">
      <div class="time-range">
        <span>Time Range:</span>
        <select v-model="selectedTimeRange" @change="updateChartData">
          <option v-for="range in timeRanges" :key="range.value" :value="range.value">
            {{ range.label }}
          </option>
        </select>
      </div>
      
      <div class="metric-selector">
        <span>Metric:</span>
        <div class="metrics">
          <button 
            v-for="metric in metrics" 
            :key="metric.id" 
            class="metric-btn"
            :class="{ active: selectedMetric === metric.id }"
            @click="changeMetric(metric.id)"
          >
            {{ metric.name }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="chart-container">
      <h2 class="chart-title">{{ chartTitle }}</h2>
      
      <div class="chart">
        <div class="chart-labels">
          <div class="y-axis-label">{{ yAxisLabel }}</div>
        </div>
        
        <div class="chart-grid">
          <div class="chart-bars">
            <div 
              v-for="(dataPoint, index) in chartData" 
              :key="index" 
              class="chart-bar-wrapper"
            >
              <div 
                class="chart-bar" 
                :style="{ 
                  height: `${dataPoint.percentage}%`,
                  backgroundColor: getBarColor(dataPoint.value)
                }"
                @mouseover="showTooltip(dataPoint, $event)"
                @mouseleave="hideTooltip"
              ></div>
              <div class="x-label">{{ dataPoint.label }}</div>
            </div>
          </div>
          
          <div class="y-axis">
            <div v-for="tick in yAxisTicks" :key="tick" class="y-tick">
              <div class="tick-line"></div>
              <div class="tick-label">{{ tick }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chart-tooltip" ref="tooltip" :style="tooltipStyle">
        <div v-if="activeTooltip">
          <div class="tooltip-date">{{ activeTooltip.label }}</div>
          <div class="tooltip-value">{{ formatValue(activeTooltip.value) }}</div>
          <div class="tooltip-change" :class="getChangeClass(activeTooltip.change)">
            {{ formatChange(activeTooltip.change) }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="metrics-summary">
      <div class="metric-card" v-for="card in summaryCards" :key="card.title">
        <div class="metric-card-title">{{ card.title }}</div>
        <div class="metric-card-value">{{ card.value }}</div>
        <div class="metric-card-change" :class="getChangeClass(card.change)">
          {{ formatChange(card.change) }}
        </div>
      </div>
    </div>
    
    <div class="mini-project-description">
      <h2>About This Component</h2>
      <p>
        This interactive data visualization component from the SaaS Dashboard project demonstrates a
        business metrics tracking system with real-time filtering and data representation.
      </p>
      <p>
        Key features of this component include:
      </p>
      <ul>
        <li>Dynamic chart updates based on time range selection</li>
        <li>Multiple metric views with contextual coloring</li>
        <li>Interactive tooltips for detailed information</li>
        <li>Summary cards for quick performance overview</li>
        <li>Responsive design that adapts to different screen sizes</li>
      </ul>
      <p>
        In the full SaaS Dashboard, this component connects to real-time data streams via WebSockets, 
        allowing users to track their business performance metrics with up-to-the-minute accuracy. The
        visualization library supports multiple chart types (bar, line, area, pie) and can export data
        in various formats.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive } from 'vue';

export default defineComponent({
  name: 'DataVisualization',
  setup() {
    // State
    const selectedTimeRange = ref('30d');
    const selectedMetric = ref('users');
    const activeTooltip = ref(null);
    const tooltip = ref(null);
    const tooltipStyle = reactive({
      display: 'none',
      left: '0px',
      top: '0px'
    });
    
    // Data for different metrics
    const userData = {
      '7d': [
        { label: 'Mon', value: 1250, change: 5.3 },
        { label: 'Tue', value: 1380, change: 10.4 },
        { label: 'Wed', value: 1472, change: 6.7 },
        { label: 'Thu', value: 1430, change: -2.8 },
        { label: 'Fri', value: 1510, change: 5.6 },
        { label: 'Sat', value: 1325, change: -12.3 },
        { label: 'Sun', value: 1290, change: -2.6 }
      ],
      '30d': [
        { label: 'Week 1', value: 1100, change: 15.8 },
        { label: 'Week 2', value: 1350, change: 22.7 },
        { label: 'Week 3', value: 1420, change: 5.2 },
        { label: 'Week 4', value: 1500, change: 5.6 }
      ],
      '90d': [
        { label: 'Jan', value: 950, change: 0 },
        { label: 'Feb', value: 1200, change: 26.3 },
        { label: 'Mar', value: 1500, change: 25.0 }
      ]
    };
    
    const revenueData = {
      '7d': [
        { label: 'Mon', value: 5200, change: 3.5 },
        { label: 'Tue', value: 6100, change: 17.3 },
        { label: 'Wed', value: 5900, change: -3.3 },
        { label: 'Thu', value: 6500, change: 10.2 },
        { label: 'Fri', value: 7200, change: 10.8 },
        { label: 'Sat', value: 4800, change: -33.3 },
        { label: 'Sun', value: 4500, change: -6.3 }
      ],
      '30d': [
        { label: 'Week 1', value: 20500, change: 8.5 },
        { label: 'Week 2', value: 24600, change: 20.0 },
        { label: 'Week 3', value: 26800, change: 8.9 },
        { label: 'Week 4', value: 29800, change: 11.2 }
      ],
      '90d': [
        { label: 'Jan', value: 75000, change: 0 },
        { label: 'Feb', value: 92000, change: 22.7 },
        { label: 'Mar', value: 110000, change: 19.6 }
      ]
    };
    
    const usageData = {
      '7d': [
        { label: 'Mon', value: 9520, change: 2.1 },
        { label: 'Tue', value: 10200, change: 7.1 },
        { label: 'Wed', value: 11500, change: 12.7 },
        { label: 'Thu', value: 10800, change: -6.1 },
        { label: 'Fri', value: 12100, change: 12.0 },
        { label: 'Sat', value: 8200, change: -32.2 },
        { label: 'Sun', value: 7800, change: -4.9 }
      ],
      '30d': [
        { label: 'Week 1', value: 40000, change: 10.2 },
        { label: 'Week 2', value: 45600, change: 14.0 },
        { label: 'Week 3', value: 51200, change: 12.3 },
        { label: 'Week 4', value: 48000, change: -6.3 }
      ],
      '90d': [
        { label: 'Jan', value: 150000, change: 0 },
        { label: 'Feb', value: 175000, change: 16.7 },
        { label: 'Mar', value: 210000, change: 20.0 }
      ]
    };
    
    // Options
    const timeRanges = [
      { value: '7d', label: 'Last 7 Days' },
      { value: '30d', label: 'Last 30 Days' },
      { value: '90d', label: 'Last 90 Days' }
    ];
    
    const metrics = [
      { id: 'users', name: 'Active Users' },
      { id: 'revenue', name: 'Revenue' },
      { id: 'usage', name: 'API Usage' }
    ];
    
    // Computed properties
    const chartData = computed(() => {
      let data;
      
      switch (selectedMetric.value) {
        case 'users':
          data = userData[selectedTimeRange.value];
          break;
        case 'revenue':
          data = revenueData[selectedTimeRange.value];
          break;
        case 'usage':
          data = usageData[selectedTimeRange.value];
          break;
        default:
          data = userData[selectedTimeRange.value];
      }
      
      // Calculate percentages for bar heights
      const maxValue = Math.max(...data.map(d => d.value));
      return data.map(d => ({
        ...d,
        percentage: (d.value / maxValue) * 80 // Max height is 80% to leave room for labels
      }));
    });
    
    const chartTitle = computed(() => {
      const metricName = metrics.find(m => m.id === selectedMetric.value)?.name;
      const timeRange = timeRanges.find(t => t.value === selectedTimeRange.value)?.label;
      
      return `${metricName} - ${timeRange}`;
    });
    
    const yAxisLabel = computed(() => {
      switch (selectedMetric.value) {
        case 'users':
          return 'Users';
        case 'revenue':
          return 'Revenue ($)';
        case 'usage':
          return 'API Calls';
        default:
          return '';
      }
    });
    
    const yAxisTicks = computed(() => {
      const data = chartData.value;
      const maxValue = Math.max(...data.map(d => d.value));
      
      // Create 5 evenly spaced ticks
      const ticks = [];
      for (let i = 0; i <= 4; i++) {
        const value = Math.round(maxValue * (i / 4));
        ticks.unshift(formatValue(value, true));
      }
      
      return ticks;
    });
    
    const summaryCards = computed(() => {
      let lastData, changeValue;
      
      // Current active users
      const users = userData[selectedTimeRange.value];
      lastData = users[users.length - 1];
      changeValue = calculateAverageChange(users);
      
      const userCard = {
        title: 'Active Users',
        value: formatValue(lastData.value),
        change: changeValue
      };
      
      // Current revenue
      const revenue = revenueData[selectedTimeRange.value];
      lastData = revenue[revenue.length - 1];
      changeValue = calculateAverageChange(revenue);
      
      const revenueCard = {
        title: 'Revenue',
        value: formatValue(lastData.value, false, '$'),
        change: changeValue
      };
      
      // Current usage
      const usage = usageData[selectedTimeRange.value];
      lastData = usage[usage.length - 1];
      changeValue = calculateAverageChange(usage);
      
      const usageCard = {
        title: 'API Usage',
        value: formatValue(lastData.value),
        change: changeValue
      };
      
      return [userCard, revenueCard, usageCard];
    });
    
    // Methods
    const calculateAverageChange = (data) => {
      const changes = data.map(d => d.change);
      return changes.reduce((sum, val) => sum + val, 0) / changes.length;
    };
    
    const updateChartData = () => {
      // In a real app, this might fetch data from an API
      console.log(`Updating chart for ${selectedTimeRange.value}`);
    };
    
    const changeMetric = (metricId) => {
      selectedMetric.value = metricId;
    };
    
    const formatValue = (value, shortFormat = false, prefix = '') => {
      if (shortFormat) {
        if (value >= 1000000) {
          return `${prefix}${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
          return `${prefix}${(value / 1000).toFixed(1)}K`;
        } else {
          return `${prefix}${value}`;
        }
      } else {
        return `${prefix}${value.toLocaleString()}`;
      }
    };
    
    const formatChange = (change) => {
      return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
    };
    
    const getChangeClass = (change) => {
      return {
        'positive': change > 0,
        'negative': change < 0,
        'neutral': change === 0
      };
    };
    
    const getBarColor = (value) => {
      // Generate colors based on value relative to metric
      switch (selectedMetric.value) {
        case 'users':
          return `rgba(94, 23, 235, ${0.5 + (value / 2000) * 0.5})`;
        case 'revenue':
          return `rgba(0, 184, 148, ${0.5 + (value / 10000) * 0.5})`;
        case 'usage':
          return `rgba(52, 152, 219, ${0.5 + (value / 20000) * 0.5})`;
        default:
          return 'var(--primary-color)';
      }
    };
    
    const showTooltip = (dataPoint, event) => {
      activeTooltip.value = dataPoint;
      
      // Position tooltip
      const rect = event.target.getBoundingClientRect();
      tooltipStyle.display = 'block';
      tooltipStyle.left = `${rect.left + rect.width / 2}px`;
      tooltipStyle.top = `${rect.top - 80}px`;
    };
    
    const hideTooltip = () => {
      tooltipStyle.display = 'none';
      activeTooltip.value = null;
    };
    
    return {
      selectedTimeRange,
      selectedMetric,
      timeRanges,
      metrics,
      chartData,
      chartTitle,
      yAxisLabel,
      yAxisTicks,
      summaryCards,
      activeTooltip,
      tooltip,
      tooltipStyle,
      updateChartData,
      changeMetric,
      formatValue,
      formatChange,
      getChangeClass,
      getBarColor,
      showTooltip,
      hideTooltip
    };
  }
});
</script>

<style scoped>
.mini-project-container {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
}

.back-navigation {
  margin-bottom: 30px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s;
}

.back-link:hover {
  color: var(--primary-color);
}

.back-link i {
  margin-right: 8px;
}

.mini-project-title {
  font-size: 2.5rem;
  margin-bottom: 40px;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.dashboard-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.time-range {
  display: flex;
  align-items: center;
}

.time-range span {
  margin-right: 10px;
  color: var(--text-light);
}

.time-range select {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: var(--text-white);
  width: 150px;
}

.metric-selector {
  display: flex;
  align-items: center;
}

.metric-selector span {
  margin-right: 10px;
  color: var(--text-light);
}

.metrics {
  display: flex;
  gap: 10px;
}

.metric-btn {
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s;
}

.metric-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.metric-btn.active {
  background: var(--primary-color);
  color: white;
}

.chart-container {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 40px;
  position: relative;
}

.chart-title {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: var(--text-white);
  text-align: center;
}

.chart {
  display: flex;
  height: 400px;
  position: relative;
}

.chart-labels {
  width: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.y-axis-label {
  transform: rotate(-90deg);
  white-space: nowrap;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.chart-grid {
  flex: 1;
  display: flex;
  position: relative;
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding-bottom: 40px;
  padding-right: 50px;
  height: 100%;
}

.chart-bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
}

.chart-bar {
  width: 30px;
  min-height: 4px;
  border-radius: 3px 3px 0 0;
  transition: height 0.5s ease, background-color 0.5s ease;
  cursor: pointer;
}

.chart-bar:hover {
  opacity: 0.8;
}

.x-label {
  position: absolute;
  bottom: 10px;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.y-axis {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 40px;
  width: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.y-tick {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.tick-line {
  position: absolute;
  left: -100%;
  right: 10px;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.tick-label {
  position: absolute;
  right: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.chart-tooltip {
  position: fixed;
  z-index: 100;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 5px;
  padding: 10px;
  pointer-events: none;
  transform: translateX(-50%);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.tooltip-date {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 5px;
}

.tooltip-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;
}

.tooltip-change {
  font-size: 0.9rem;
}

.metrics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.metric-card-title {
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 10px;
}

.metric-card-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--text-white);
  margin-bottom: 5px;
}

.metric-card-change {
  font-size: 1rem;
}

.positive {
  color: #4CAF50;
}

.negative {
  color: #F44336;
}

.neutral {
  color: var(--text-muted);
}

.mini-project-description {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 30px;
  margin-top: 40px;
}

.mini-project-description h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: var(--heading-color);
}

.mini-project-description p {
  margin-bottom: 20px;
  line-height: 1.7;
}

.mini-project-description ul {
  margin-bottom: 20px;
  padding-left: 20px;
}

.mini-project-description li {
  margin-bottom: 10px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .dashboard-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .chart {
    height: 300px;
  }
  
  .chart-bar {
    width: 20px;
  }
  
  .metrics-summary {
    grid-template-columns: 1fr;
  }
}
</style> 