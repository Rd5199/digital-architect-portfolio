<template>
  <div class="mini-project-container">
    <div class="back-navigation">
      <router-link :to="`/project/2`" class="back-link">
        <i class="fas fa-arrow-left"></i> Back to Wellness App Project
      </router-link>
    </div>
    
    <h1 class="mini-project-title">Meditation Timer</h1>
    
    <div class="meditation-container">
      <div class="timer-circle" :style="circleStyle">
        <div class="timer-display">
          <div class="timer-time">{{ formatTime }}</div>
          <div class="timer-status">{{ timerStatus }}</div>
        </div>
      </div>
      
      <div class="timer-controls">
        <div class="presets">
          <button 
            v-for="preset in presets" 
            :key="preset.time" 
            class="preset-btn"
            :class="{ active: preset.time === duration }"
            @click="setDuration(preset.time)"
          >
            {{ preset.label }}
          </button>
        </div>
        
        <div class="main-controls">
          <button 
            class="control-btn"
            @click="toggleTimer"
            :class="{ 'stop': isRunning }"
          >
            {{ isRunning ? 'Pause' : 'Start' }}
          </button>
          <button 
            class="control-btn reset-btn"
            @click="resetTimer"
            :disabled="!hasStarted"
          >
            Reset
          </button>
        </div>
        
        <div class="sound-selector">
          <label for="sound-select">Background Sound:</label>
          <select id="sound-select" v-model="selectedSound" :disabled="isRunning">
            <option v-for="sound in sounds" :key="sound.id" :value="sound.id">
              {{ sound.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="ambient-visualization">
      <div 
        v-for="i in 10" 
        :key="i" 
        class="wave" 
        :style="{ 
          height: isRunning ? `${20 + Math.sin(Date.now() / (1000 + i * 200)) * 15}px` : '5px',
          opacity: isRunning ? 0.5 + (i / 20) : 0.2,
          animationDuration: `${3 + i * 0.5}s`
        }"
      ></div>
    </div>
    
    <div class="mini-project-description">
      <h2>About This Component</h2>
      <p>
        The Meditation Timer is a core feature of the Wellness Mobile App, designed to guide users through 
        meditation sessions of varying lengths with ambient sounds and visual feedback.
      </p>
      <p>
        This component demonstrates:
      </p>
      <ul>
        <li>Circular visual timer with progress indicator</li>
        <li>Configurable session lengths with presets</li>
        <li>Ambient sound selection</li>
        <li>Visual animation to enhance the meditative experience</li>
        <li>Simple, distraction-free interface</li>
      </ul>
      <p>
        In the actual mobile app, this component integrates with device notifications to allow background 
        operation and includes guided meditation audio tracks. The animations are more sophisticated and 
        respond to user breath patterns for deeper immersion.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onBeforeUnmount } from 'vue';

export default defineComponent({
  name: 'MeditationTimer',
  setup() {
    // Timer state
    const duration = ref(300); // 5 minutes in seconds
    const remainingTime = ref(duration.value);
    const isRunning = ref(false);
    const hasStarted = ref(false);
    const intervalId = ref<number | null>(null);
    const progress = ref(0);
    
    // Sounds
    const selectedSound = ref('nature');
    const sounds = [
      { id: 'nature', name: 'Forest Sounds' },
      { id: 'rain', name: 'Gentle Rain' },
      { id: 'ocean', name: 'Ocean Waves' },
      { id: 'white-noise', name: 'White Noise' },
      { id: 'silence', name: 'Silence' },
    ];
    
    // Duration presets
    const presets = [
      { time: 60, label: '1 min' },
      { time: 300, label: '5 min' },
      { time: 600, label: '10 min' },
      { time: 1200, label: '20 min' },
    ];
    
    // Computed properties
    const formatTime = computed(() => {
      const minutes = Math.floor(remainingTime.value / 60);
      const seconds = remainingTime.value % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });
    
    const timerStatus = computed(() => {
      if (!hasStarted.value) return 'Ready';
      if (isRunning.value) return 'Meditating';
      if (remainingTime.value === 0) return 'Complete';
      return 'Paused';
    });
    
    const circleStyle = computed(() => {
      const dashArray = 283; // 2 * PI * 45 (circle radius)
      const dashOffset = dashArray * (1 - progress.value);
      
      return {
        background: progress.value >= 1 ? 'rgba(94, 23, 235, 0.2)' : 'rgba(10, 10, 24, 0.3)',
        boxShadow: isRunning.value ? '0 0 30px rgba(94, 23, 235, 0.4)' : 'none',
        '--dash-array': dashArray,
        '--dash-offset': dashOffset
      };
    });
    
    // Methods
    const startTimer = () => {
      if (intervalId.value !== null) return;
      
      hasStarted.value = true;
      isRunning.value = true;
      
      intervalId.value = window.setInterval(() => {
        if (remainingTime.value > 0) {
          remainingTime.value--;
          progress.value = 1 - (remainingTime.value / duration.value);
        } else {
          stopTimer();
          progress.value = 1;
        }
      }, 1000);
    };
    
    const stopTimer = () => {
      if (intervalId.value) {
        clearInterval(intervalId.value);
        intervalId.value = null;
      }
      isRunning.value = false;
    };
    
    const toggleTimer = () => {
      if (isRunning.value) {
        stopTimer();
      } else {
        startTimer();
      }
    };
    
    const resetTimer = () => {
      stopTimer();
      remainingTime.value = duration.value;
      progress.value = 0;
      hasStarted.value = false;
    };
    
    const setDuration = (time: number) => {
      if (isRunning.value) return;
      
      duration.value = time;
      remainingTime.value = time;
      progress.value = 0;
      hasStarted.value = false;
    };
    
    // Cleanup on component unmount
    onBeforeUnmount(() => {
      if (intervalId.value) {
        clearInterval(intervalId.value);
      }
    });
    
    return {
      duration,
      remainingTime,
      isRunning,
      hasStarted,
      progress,
      formatTime,
      timerStatus,
      circleStyle,
      sounds,
      selectedSound,
      presets,
      toggleTimer,
      resetTimer,
      setDuration
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

.meditation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
}

.timer-circle {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  transition: all 0.5s ease;
}

.timer-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
}

.timer-circle::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid var(--primary-color);
  border-right-color: transparent;
  border-top-color: transparent;
  box-sizing: border-box;
  transition: all 0.5s ease;
  transform: rotate(-45deg);
  animation: rotate 2s linear infinite;
  animation-play-state: paused;
  stroke-dasharray: var(--dash-array);
  stroke-dashoffset: var(--dash-offset);
}

.timer-circle:not(.paused)::after {
  animation-play-state: running;
}

@keyframes rotate {
  0% {
    transform: rotate(-45deg);
  }
  100% {
    transform: rotate(315deg);
  }
}

.timer-display {
  text-align: center;
}

.timer-time {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: var(--text-white);
}

.timer-status {
  font-size: 1rem;
  color: var(--text-muted);
}

.timer-controls {
  width: 100%;
  max-width: 500px;
}

.presets {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.preset-btn {
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s;
}

.preset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.preset-btn.active {
  background: var(--primary-color);
  color: white;
}

.main-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.control-btn {
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.control-btn:not(.reset-btn) {
  background: var(--primary-color);
  color: white;
}

.control-btn:not(.reset-btn):hover {
  background: #4a11c9;
}

.control-btn.stop {
  background: var(--accent-color);
}

.control-btn.stop:hover {
  background: #e42d5a;
}

.reset-btn {
  background: transparent;
  color: var(--text-light);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.reset-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.reset-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.sound-selector {
  text-align: center;
  margin-top: 20px;
}

.sound-selector label {
  margin-right: 10px;
  color: var(--text-light);
}

.sound-selector select {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: var(--text-white);
  width: 200px;
}

.ambient-visualization {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 100px;
  gap: 5px;
  margin-bottom: 60px;
}

.wave {
  width: 5px;
  height: 5px;
  background: var(--primary-color);
  border-radius: 2px;
  transition: height 0.5s ease, opacity 0.5s ease;
}

.mini-project-description {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 30px;
  margin-top: 50px;
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
  .timer-circle {
    width: 180px;
    height: 180px;
  }
  
  .timer-time {
    font-size: 2rem;
  }
  
  .main-controls {
    flex-direction: column;
    gap: 10px;
  }
  
  .control-btn {
    width: 100%;
  }
}
</style> 