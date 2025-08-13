<template>
  <div class="wellness-suite-container">
    <div class="back-navigation">
      <router-link :to="`/project/2`" class="back-link">
        <i class="fas fa-arrow-left"></i> Back to Wellness Project
      </router-link>
    </div>
    
    <div class="iphone-frame">
      <div class="iphone-top">
        <div class="iphone-notch">
          <div class="notch-camera"></div>
        </div>
      </div>
      
      <div class="iphone-screen">
        <div class="wellness-suite">
          <!-- App Header -->
          <header class="app-header">
            <div class="app-info">
              <h1 class="app-title">Mindful</h1>
              <p class="app-tagline">Your complete wellness companion</p>
            </div>
            
            <div class="user-profile">
              <div class="avatar">
                <img src="/assets/images/openart-image_4J3rsNPv_1741447658208_raw.jpg" alt="User Avatar">
              </div>
              <div class="user-streak">
                <span class="streak-count">{{ userStats.streak }}</span>
                <span class="streak-label">day streak</span>
              </div>
            </div>
          </header>
          
          <!-- Tab Content -->
          <main class="tab-content">
            <!-- Dashboard Tab -->
            <section v-if="activeTab === 'dashboard'" class="dashboard-tab">
              <h2 class="section-title">Daily Overview</h2>
              
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-shoe-prints"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-value">{{ userStats.steps }}</span>
                    <span class="stat-label">Steps</span>
                  </div>
                  <div class="stat-progress">
                    <div class="progress-bar" :style="{ width: `${(userStats.steps / userStats.stepGoal) * 100}%` }"></div>
                  </div>
                  <div class="stat-goal">Goal: {{ formatNumber(userStats.stepGoal) }}</div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-fire"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-value">{{ userStats.calories }}</span>
                    <span class="stat-label">Calories</span>
                  </div>
                  <div class="stat-progress">
                    <div class="progress-bar" :style="{ width: `${(userStats.calories / userStats.calorieGoal) * 100}%` }"></div>
                  </div>
                  <div class="stat-goal">Goal: {{ formatNumber(userStats.calorieGoal) }}</div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-heart"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-value">{{ userStats.heartRate }}</span>
                    <span class="stat-label">BPM (avg)</span>
                  </div>
                  <div class="stat-status" :class="heartRateStatus">{{ getHeartRateStatus() }}</div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-bed"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-value">{{ userStats.sleepHours }}</span>
                    <span class="stat-label">Hours Sleep</span>
                  </div>
                  <div class="stat-progress">
                    <div class="progress-bar" :style="{ width: `${(userStats.sleepHours / userStats.sleepGoal) * 100}%` }"></div>
                  </div>
                  <div class="stat-goal">Goal: {{ userStats.sleepGoal }}h</div>
                </div>
              </div>
              
              <div class="activity-timeline">
                <h3>Today's Activities</h3>
                <div v-for="activity in todayActivities" :key="activity.id" class="activity-item">
                  <div class="activity-icon" :class="activity.type">
                    <i :class="getActivityIcon(activity.type)"></i>
                  </div>
                  <div class="activity-details">
                    <div class="activity-title">{{ activity.title }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                  </div>
                  <div class="activity-metadata">
                    <div class="activity-metric">{{ activity.metric }}</div>
                    <div class="activity-duration">{{ activity.duration }}</div>
                  </div>
                </div>
              </div>
              
              <div class="mindfulness-reminder">
                <div class="reminder-content">
                  <h3>Mindfulness Reminder</h3>
                  <p>{{ dailyQuote }}</p>
                </div>
                <button class="reminder-action" @click="activeTab = 'meditation'">Meditate Now</button>
              </div>
            </section>
            
            <!-- Meditation Tab -->
            <section v-if="activeTab === 'meditation'" class="meditation-tab">
              <h2 class="section-title">Meditation Timer</h2>
              
              <div class="meditation-container" :class="{ 'session-active': meditationActive }">
                <div class="timer-display">
                  <div class="timer-circle">
                    <svg width="200" height="200" class="timer-progress">
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="90" 
                        fill="none" 
                        stroke="rgba(255, 255, 255, 0.1)" 
                        stroke-width="10"
                      />
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="90" 
                        fill="none" 
                        stroke="var(--accent-color)" 
                        stroke-width="10"
                        stroke-dasharray="566"
                        :stroke-dashoffset="timerProgress" 
                        transform="rotate(-90 100 100)"
                      />
                    </svg>
                    <div class="timer-time">{{ formatTime(meditationTimeRemaining) }}</div>
                  </div>
                  
                  <div class="timer-phase">{{ meditationPhaseName }}</div>
                </div>
                
                <div class="session-controls">
                  <button 
                    v-if="!meditationActive" 
                    class="control-btn start" 
                    @click="startMeditation"
                  >
                    Begin Session
                  </button>
                  
                  <template v-else>
                    <button class="control-btn pause" @click="togglePauseMeditation">
                      {{ meditationPaused ? 'Resume' : 'Pause' }}
                    </button>
                    <button class="control-btn stop" @click="stopMeditation">
                      End Session
                    </button>
                  </template>
                </div>
                
                <!-- Additional meditation content condensed for mobile -->
                <div class="meditation-stats">
                  <div class="stat">
                    <div class="stat-value">{{ userStats.totalSessions }}</div>
                    <div class="stat-label">Total Sessions</div>
                  </div>
                  <div class="stat">
                    <div class="stat-value">{{ formatHoursMinutes(userStats.totalMeditationTime) }}</div>
                    <div class="stat-label">Total Meditation</div>
                  </div>
                </div>
              </div>
            </section>
            
            <!-- Journal Tab -->
            <section v-if="activeTab === 'journal'" class="journal-tab">
              <h2 class="section-title">Journal</h2>
              
              <div class="journal-container">
                <div class="journal-header">
                  <button class="new-entry-btn" @click="startNewEntry">
                    <i class="fas fa-plus"></i> New Entry
                  </button>
                </div>
                
                <div class="journal-entries">
                  <div v-if="filteredEntries.length === 0" class="no-entries">
                    <div class="empty-state">
                      <i class="fas fa-book"></i>
                      <p>No journal entries yet.</p>
                    </div>
                  </div>
                  
                  <div v-else class="entries-list">
                    <div 
                      v-for="entry in filteredEntries" 
                      :key="entry.id"
                      class="entry-card"
                      @click="viewEntry(entry)"
                    >
                      <div class="entry-header">
                        <div class="entry-title">{{ entry.title }}</div>
                        <div class="entry-date">{{ formatDate(entry.date) }}</div>
                      </div>
                      
                      <div class="entry-preview">{{ truncateText(entry.content, 80) }}</div>
                      
                      <div class="entry-footer">
                        <div class="entry-tags">
                          <span 
                            v-for="tagId in entry.tags" 
                            :key="tagId"
                            class="tag"
                          >
                            {{ getTagName(tagId) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <!-- Gratitude Tab -->
            <section v-if="activeTab === 'gratitude'" class="gratitude-tab">
              <h2 class="section-title">Gratitude</h2>
              
              <div class="gratitude-container">
                <div class="gratitude-header">
                  <button class="add-gratitude-btn" @click="startNewGratitude">
                    <i class="fas fa-plus"></i> Add Gratitude
                  </button>
                </div>
                
                <div v-if="todayGratitude" class="today-gratitude">
                  <div class="today-mood">
                    <i :class="getMoodIcon(todayGratitude.mood)"></i>
                    {{ getMoodName(todayGratitude.mood) }}
                  </div>
                </div>
                
                <div class="gratitude-streak">
                  <div class="streak-icon">
                    <i class="fas fa-fire"></i>
                    <span>{{ userStats.gratitudeStreak }} days</span>
                  </div>
                </div>
              </div>
            </section>
          </main>
          
          <!-- View Entry Modal -->
          <div v-if="viewingEntry" class="modal-overlay" @click="closeEntryView">
            <div class="entry-modal" @click.stop>
              <div class="modal-header">
                <h3>{{ viewedEntry.title }}</h3>
                <div class="modal-date">{{ formatDate(viewedEntry.date) }}</div>
                <button class="close-modal" @click="closeEntryView">×</button>
              </div>
              
              <div class="modal-body">
                <p class="entry-content">{{ viewedEntry.content }}</p>
                
                <div class="entry-tags">
                  <span 
                    v-for="tagId in viewedEntry.tags" 
                    :key="tagId"
                    class="tag"
                  >
                    {{ getTagName(tagId) }}
                  </span>
                </div>
              </div>
              
              <div class="modal-actions">
                <button class="edit-btn" @click="editEntry(viewedEntry)">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-btn" @click="confirmDeleteEntry">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
          
          <!-- Confirmation Modal -->
          <div v-if="showConfirmation" class="modal-overlay">
            <div class="confirm-modal">
              <div class="confirm-message">
                <i class="fas fa-exclamation-triangle warning-icon"></i>
                <p>{{ confirmationMessage }}</p>
              </div>
              
              <div class="confirm-actions">
                <button class="cancel-btn" @click="cancelConfirmation">Cancel</button>
                <button class="confirm-btn" @click="confirmAction">{{ confirmButtonText }}</button>
              </div>
            </div>
          </div>
          
          <!-- Bottom Navigation Bar -->
          <nav class="mobile-nav">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="['nav-item', { active: activeTab === tab.id }]"
            >
              <i :class="tab.icon"></i>
              <span class="nav-label">{{ tab.name }}</span>
            </button>
          </nav>
        </div>
      </div>
      
      <div class="iphone-bottom">
        <div class="home-indicator"></div>
      </div>
    </div>
    
    <div class="portfolio-navigation">
      <router-link :to="'/'" class="portfolio-button">
        <i class="fas fa-home"></i> Back to Portfolio
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';

export default defineComponent({
  name: 'WellnessSuite',
  setup() {
    // Tab Navigation
    const activeTab = ref('dashboard');
    const tabs = [
      { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-home' },
      { id: 'meditation', name: 'Meditation', icon: 'fas fa-spa' },
      { id: 'activity', name: 'Activity', icon: 'fas fa-walking' },
      { id: 'journal', name: 'Journal', icon: 'fas fa-book' },
      { id: 'gratitude', name: 'Gratitude', icon: 'fas fa-heart' }
    ];
    
    // User stats
    const userStats = ref({
      steps: 7824,
      stepGoal: 10000,
      calories: 487,
      calorieGoal: 600,
      heartRate: 68,
      sleepHours: 7.2,
      sleepGoal: 8,
      distance: 5.7,
      activeMinutes: 42,
      streak: 8,
      totalSessions: 32,
      longestStreak: 14,
      totalMeditationTime: 960, // in minutes
      gratitudeStreak: 5
    });
    
    // Simulate data synced status
    const dataSynced = ref(true);
    
    // Heart rate status
    const heartRateStatus = computed(() => {
      const hr = userStats.value.heartRate;
      if (hr < 60) return 'low';
      if (hr > 100) return 'high';
      return 'normal';
    });
    
    const getHeartRateStatus = () => {
      const status = heartRateStatus.value;
      return status === 'normal' ? 'Normal' : status === 'high' ? 'Elevated' : 'Low';
    };
    
    // Daily quote
    const dailyQuote = ref('Take a deep breath. Remember that you are here, now. Let go of what you cannot control.');
    
    // Activities
    const todayActivities = ref([
      { 
        id: 1, 
        type: 'walk', 
        title: 'Morning Walk', 
        time: '07:30 AM', 
        metric: '2,541 steps', 
        duration: '25 min' 
      },
      { 
        id: 2, 
        type: 'meditation', 
        title: 'Mindful Breathing', 
        time: '08:15 AM', 
        metric: '', 
        duration: '10 min' 
      },
      { 
        id: 3, 
        type: 'exercise', 
        title: 'Quick Workout', 
        time: '12:30 PM', 
        metric: '142 cal', 
        duration: '15 min' 
      },
      { 
        id: 4, 
        type: 'walk', 
        title: 'Afternoon Stroll', 
        time: '03:45 PM', 
        metric: '1,823 steps', 
        duration: '18 min' 
      }
    ]);
    
    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'walk': return 'fas fa-walking';
        case 'meditation': return 'fas fa-spa';
        case 'exercise': return 'fas fa-dumbbell';
        default: return 'fas fa-circle';
      }
    };
    
    // Meditation Timer
    const meditationActive = ref(false);
    const meditationPaused = ref(false);
    const meditationDuration = ref(10); // minutes
    const meditationTimeRemaining = ref(0); // seconds
    const meditationDurations = [5, 10, 15, 20, 30];
    const selectedSound = ref('rain');
    const selectedSessionType = ref('guided');
    const meditationPhaseName = ref('Preparation');
    const timerInterval = ref<number | null>(null);
    
    const backgroundSounds = [
      { id: 'rain', name: 'Rain', icon: 'fas fa-cloud-rain' },
      { id: 'forest', name: 'Forest', icon: 'fas fa-tree' },
      { id: 'ocean', name: 'Ocean', icon: 'fas fa-water' },
      { id: 'silence', name: 'Silence', icon: 'fas fa-volume-mute' }
    ];
    
    const sessionTypes = [
      { id: 'guided', name: 'Guided Meditation' },
      { id: 'breathing', name: 'Breathing Exercise' },
      { id: 'unguided', name: 'Silent Meditation' }
    ];
    
    const timerProgress = computed(() => {
      if (!meditationActive.value || meditationDuration.value === 0) return 0;
      const totalSeconds = meditationDuration.value * 60;
      const progress = (totalSeconds - meditationTimeRemaining.value) / totalSeconds;
      return 566 * (1 - progress); // 566 is circumference of circle (2*PI*r)
    });
    
    const startMeditation = () => {
      meditationTimeRemaining.value = meditationDuration.value * 60;
      meditationActive.value = true;
      meditationPaused.value = false;
      meditationPhaseName.value = 'Meditation in progress';
      
      timerInterval.value = window.setInterval(() => {
        if (!meditationPaused.value) {
          meditationTimeRemaining.value--;
          
          if (meditationTimeRemaining.value <= 0) {
            completeMeditation();
          }
        }
      }, 1000);
    };
    
    const togglePauseMeditation = () => {
      meditationPaused.value = !meditationPaused.value;
      meditationPhaseName.value = meditationPaused.value ? 'Paused' : 'Meditation in progress';
    };
    
    const stopMeditation = () => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
      }
      
      meditationActive.value = false;
      meditationPaused.value = false;
      meditationPhaseName.value = 'Session ended';
      
      // Record partial session
      const sessionMinutes = (meditationDuration.value * 60 - meditationTimeRemaining.value) / 60;
      if (sessionMinutes >= 1) {
        userStats.value.totalMeditationTime += sessionMinutes;
      }
    };
    
    const completeMeditation = () => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
      }
      
      meditationActive.value = false;
      meditationPhaseName.value = 'Session complete';
      
      // Update stats
      userStats.value.totalSessions++;
      userStats.value.totalMeditationTime += meditationDuration.value;
      userStats.value.streak++;
      
      if (userStats.value.streak > userStats.value.longestStreak) {
        userStats.value.longestStreak = userStats.value.streak;
      }
      
      // Add to activities
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const time = `${formattedHours}:${formattedMinutes} ${ampm}`;
      
      todayActivities.value.push({
        id: Date.now(),
        type: 'meditation',
        title: `${selectedSessionType.value === 'guided' ? 'Guided' : selectedSessionType.value === 'breathing' ? 'Breathing' : 'Silent'} Meditation`,
        time,
        metric: '',
        duration: `${meditationDuration.value} min`
      });
    };
    
    onBeforeUnmount(() => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
      }
    });
    
    // Weekly Activity data
    const weeklyActivity = ref([
      { day: 'Mon', steps: 8245, isToday: false },
      { day: 'Tue', steps: 10123, isToday: false },
      { day: 'Wed', steps: 7896, isToday: false },
      { day: 'Thu', steps: 9342, isToday: false },
      { day: 'Fri', steps: 7824, isToday: true },
      { day: 'Sat', steps: 0, isToday: false },
      { day: 'Sun', steps: 0, isToday: false }
    ]);
    
    const weeklyMax = computed(() => {
      return Math.max(...weeklyActivity.value.map(day => day.steps)) * 1.1; // Add 10% for visual spacing
    });
    
    const weeklyTotal = computed(() => {
      return weeklyActivity.value.reduce((total, day) => total + day.steps, 0);
    });
    
    const weeklyAverage = computed(() => {
      const days = weeklyActivity.value.filter(day => day.steps > 0).length;
      return days > 0 ? Math.round(weeklyTotal.value / days) : 0;
    });
    
    // Journal functionality
    const journalEntries = ref<any[]>([]);
    const showJournalEditor = ref(false);
    const currentEntry = ref({
      id: 0,
      title: '',
      content: '',
      date: new Date(),
      tags: []
    });
    const viewingEntry = ref(false);
    const viewedEntry = ref({
      id: 0,
      title: '',
      content: '',
      date: new Date(),
      tags: []
    });
    
    const journalFilters = [
      { id: 'all', name: 'All Entries' },
      { id: 'recent', name: 'Recent' },
      { id: 'tagged', name: 'Tagged' }
    ];
    
    const activeJournalFilter = ref('all');
    
    const availableTags = [
      { id: 'insights', name: 'Insights' },
      { id: 'goals', name: 'Goals' },
      { id: 'reflection', name: 'Reflection' },
      { id: 'gratitude', name: 'Gratitude' },
      { id: 'progress', name: 'Progress' }
    ];
    
    const filteredEntries = computed(() => {
      let entries = [...journalEntries.value];
      
      if (activeJournalFilter.value === 'recent') {
        entries = entries.slice(0, 5);
      } else if (activeJournalFilter.value === 'tagged') {
        entries = entries.filter(entry => entry.tags.length > 0);
      }
      
      // Sort by date, newest first
      return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    
    const startNewEntry = () => {
      currentEntry.value = {
        id: Date.now(),
        title: '',
        content: '',
        date: new Date(),
        tags: []
      };
      showJournalEditor.value = true;
    };
    
    const saveEntry = () => {
      if (currentEntry.value.title.trim() === '') {
        currentEntry.value.title = 'Untitled Entry';
      }
      
      const existingIndex = journalEntries.value.findIndex(entry => entry.id === currentEntry.value.id);
      
      if (existingIndex >= 0) {
        journalEntries.value[existingIndex] = { ...currentEntry.value };
      } else {
        journalEntries.value.push({ ...currentEntry.value });
      }
      
      showJournalEditor.value = false;
    };
    
    const cancelEntry = () => {
      showJournalEditor.value = false;
    };
    
    const viewEntry = (entry: any) => {
      viewedEntry.value = { ...entry };
      viewingEntry.value = true;
    };
    
    const closeEntryView = () => {
      viewingEntry.value = false;
    };
    
    const editEntry = (entry: any) => {
      currentEntry.value = { ...entry };
      showJournalEditor.value = true;
      viewingEntry.value = false;
    };
    
    const toggleTag = (tagId: string) => {
      const index = currentEntry.value.tags.indexOf(tagId);
      if (index >= 0) {
        currentEntry.value.tags.splice(index, 1);
      } else {
        currentEntry.value.tags.push(tagId);
      }
    };
    
    const getTagName = (tagId: string) => {
      const tag = availableTags.find(t => t.id === tagId);
      return tag ? tag.name : '';
    };
    
    // Confirmation dialog
    const showConfirmation = ref(false);
    const confirmationMessage = ref('');
    const confirmButtonText = ref('Confirm');
    const confirmActionCallback = ref<Function | null>(null);
    
    const confirmDeleteEntry = () => {
      confirmationMessage.value = 'Are you sure you want to delete this journal entry? This action cannot be undone.';
      confirmButtonText.value = 'Delete';
      showConfirmation.value = true;
      confirmActionCallback.value = deleteEntry;
    };
    
    const deleteEntry = () => {
      const index = journalEntries.value.findIndex(entry => entry.id === viewedEntry.value.id);
      if (index >= 0) {
        journalEntries.value.splice(index, 1);
      }
      viewingEntry.value = false;
      showConfirmation.value = false;
    };
    
    const cancelConfirmation = () => {
      showConfirmation.value = false;
      confirmActionCallback.value = null;
    };
    
    const confirmAction = () => {
      if (confirmActionCallback.value) {
        confirmActionCallback.value();
      }
      showConfirmation.value = false;
    };
    
    // Gratitude journal
    const gratitudeQuote = ref('Gratitude turns what we have into enough, and more. It turns denial into acceptance, chaos into order, confusion into clarity.');
    const gratitudeEntries = ref<any[]>([]);
    const showGratitudeEditor = ref(false);
    const currentGratitude = ref({
      id: 0,
      date: new Date(),
      prompts: ['', '', ''],
      mood: 'happy'
    });
    
    const gratitudePrompts = [
      'What are three things you are grateful for today?',
      'What is something that went well today?',
      'What is something you are looking forward to?'
    ];
    
    const moods = [
      { id: 'happy', name: 'Happy', icon: 'fas fa-smile' },
      { id: 'calm', name: 'Calm', icon: 'fas fa-peace' },
      { id: 'motivated', name: 'Motivated', icon: 'fas fa-bolt' },
      { id: 'tired', name: 'Tired', icon: 'fas fa-tired' },
      { id: 'anxious', name: 'Anxious', icon: 'fas fa-meh' }
    ];
    
    const getMoodIcon = (moodId: string) => {
      const mood = moods.find(m => m.id === moodId);
      return mood ? mood.icon : 'fas fa-smile';
    };
    
    const getMoodName = (moodId: string) => {
      const mood = moods.find(m => m.id === moodId);
      return mood ? mood.name : '';
    };
    
    const todayGratitude = computed(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return gratitudeEntries.value.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      });
    });
    
    const startNewGratitude = () => {
      currentGratitude.value = {
        id: Date.now(),
        date: new Date(),
        prompts: ['', '', ''],
        mood: 'happy'
      };
      showGratitudeEditor.value = true;
    };
    
    const saveGratitude = () => {
      const existingIndex = gratitudeEntries.value.findIndex(entry => entry.id === currentGratitude.value.id);
      
      if (existingIndex >= 0) {
        gratitudeEntries.value[existingIndex] = { ...currentGratitude.value };
      } else {
        gratitudeEntries.value.push({ ...currentGratitude.value });
        userStats.value.gratitudeStreak++;
      }
      
      showGratitudeEditor.value = false;
    };
    
    const cancelGratitude = () => {
      showGratitudeEditor.value = false;
    };
    
    const editTodayGratitude = () => {
      if (todayGratitude.value) {
        currentGratitude.value = { ...todayGratitude.value };
        showGratitudeEditor.value = true;
      }
    };
    
    // Calendar for gratitude
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentMonth = ref(new Date());
    const viewingGratitude = ref(false);
    const viewedGratitude = ref({
      id: 0,
      date: new Date(),
      prompts: ['', '', ''],
      mood: 'happy'
    });
    
    const calendarDays = computed(() => {
      const year = currentMonth.value.getFullYear();
      const month = currentMonth.value.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const daysInMonth = lastDay.getDate();
      const firstDayOfWeek = firstDay.getDay();
      
      const days = [];
      
      // Add days from previous month
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        days.push({
          day: prevMonthLastDay - i,
          date: new Date(year, month - 1, prevMonthLastDay - i),
          inMonth: false,
          hasEntry: false,
          entryId: 0,
          isToday: false
        });
      }
      
      // Add days of current month
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const hasEntry = gratitudeEntries.value.some(entry => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === date.getTime();
        });
        
        const entryId = hasEntry 
          ? gratitudeEntries.value.find(entry => {
              const entryDate = new Date(entry.date);
              entryDate.setHours(0, 0, 0, 0);
              return entryDate.getTime() === date.getTime();
            })?.id 
          : 0;
        
        const isToday = date.getTime() === today.getTime();
        
        days.push({
          day: i,
          date,
          inMonth: true,
          hasEntry,
          entryId,
          isToday
        });
      }
      
      // Add days from next month to complete the grid (up to 42 days total = 6 weeks)
      const remainingDays = 42 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          day: i,
          date: new Date(year, month + 1, i),
          inMonth: false,
          hasEntry: false,
          entryId: 0,
          isToday: false
        });
      }
      
      return days;
    });
    
    const previousMonth = () => {
      const newMonth = new Date(currentMonth.value);
      newMonth.setMonth(newMonth.getMonth() - 1);
      currentMonth.value = newMonth;
    };
    
    const nextMonth = () => {
      const newMonth = new Date(currentMonth.value);
      newMonth.setMonth(newMonth.getMonth() + 1);
      currentMonth.value = newMonth;
    };
    
    const viewGratitudeEntry = (entryId: number) => {
      const entry = gratitudeEntries.value.find(e => e.id === entryId);
      if (entry) {
        viewedGratitude.value = { ...entry };
        viewingGratitude.value = true;
      }
    };
    
    const closeGratitudeView = () => {
      viewingGratitude.value = false;
    };
    
    // Sample data initialization
    onMounted(() => {
      // Add sample journal entries
      journalEntries.value = [
        {
          id: 1,
          title: 'Morning Reflection',
          content: 'Today I woke up feeling refreshed after trying the new breathing technique last night. I noticed that my mind is clearer and I feel more focused. Going to continue this practice and see how it affects my sleep quality over time.',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          tags: ['insights', 'reflection']
        },
        {
          id: 2,
          title: 'Weekly Goals',
          content: 'This week I want to focus on: 1) Meditating for at least 10 minutes every morning, 2) Walking 10,000 steps daily, 3) Drinking more water, 4) Reading for 30 minutes before bed instead of using my phone.',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          tags: ['goals']
        }
      ];
      
      // Add sample gratitude entries
      gratitudeEntries.value = [
        {
          id: 101,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
          prompts: [
            'My supportive friends, clean water, and the beautiful sunset I saw today',
            'I had a productive meeting at work where my ideas were well received',
            'The weekend trip I have planned with my family'
          ],
          mood: 'happy'
        },
        {
          id: 102,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          prompts: [
            'My health, the delicious meal I had, and my comfortable home',
            'I finished a challenging project on time',
            'Learning a new skill in my upcoming workshop'
          ],
          mood: 'motivated'
        }
      ];
      
      // Simulate real-time updates
      setInterval(() => {
        // Random step increases
        if (Math.random() > 0.7) {
          const stepIncrease = Math.floor(Math.random() * 100) + 50;
          userStats.value.steps += stepIncrease;
          
          // Update weekly as well
          const todayIndex = weeklyActivity.value.findIndex(day => day.isToday);
          if (todayIndex >= 0) {
            weeklyActivity.value[todayIndex].steps += stepIncrease;
          }
          
          // Update calories
          userStats.value.calories += Math.floor(stepIncrease * 0.05);
          
          // Toggle sync status occasionally
          dataSynced.value = false;
          setTimeout(() => {
            dataSynced.value = true;
          }, 1500);
        }
        
        // Small heart rate fluctuations
        if (Math.random() > 0.8) {
          const heartChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          userStats.value.heartRate = Math.max(50, Math.min(100, userStats.value.heartRate + heartChange));
        }
      }, 8000);
    });
    
    // Utility functions
    const formatNumber = (num: number) => {
      return num.toLocaleString();
    };
    
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    };
    
    const formatHoursMinutes = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };
    
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    };
    
    const formatMonth = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };
    
    const truncateText = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };
    
    return {
      // Tab navigation
      activeTab,
      tabs,
      
      // User stats
      userStats,
      
      // Dashboard
      dailyQuote,
      todayActivities,
      getActivityIcon,
      heartRateStatus,
      getHeartRateStatus,
      
      // Meditation
      meditationActive,
      meditationPaused,
      meditationDuration,
      meditationTimeRemaining,
      meditationDurations,
      selectedSound,
      backgroundSounds,
      selectedSessionType,
      sessionTypes,
      meditationPhaseName,
      timerProgress,
      startMeditation,
      togglePauseMeditation,
      stopMeditation,
      
      // Activity tracking
      dataSynced,
      weeklyActivity,
      weeklyMax,
      weeklyTotal,
      weeklyAverage,
      
      // Journal
      journalEntries,
      showJournalEditor,
      currentEntry,
      journalFilters,
      activeJournalFilter,
      availableTags,
      filteredEntries,
      viewingEntry,
      viewedEntry,
      startNewEntry,
      saveEntry,
      cancelEntry,
      viewEntry,
      closeEntryView,
      editEntry,
      toggleTag,
      getTagName,
      
      // Confirmation
      showConfirmation,
      confirmationMessage,
      confirmButtonText,
      confirmDeleteEntry,
      confirmAction,
      cancelConfirmation,
      
      // Gratitude journal
      gratitudeQuote,
      gratitudePrompts,
      moods,
      todayGratitude,
      showGratitudeEditor,
      currentGratitude,
      gratitudeEntries,
      startNewGratitude,
      saveGratitude,
      cancelGratitude,
      editTodayGratitude,
      getMoodIcon,
      getMoodName,
      
      // Calendar
      weekdays,
      currentMonth,
      calendarDays,
      previousMonth,
      nextMonth,
      viewingGratitude,
      viewedGratitude,
      viewGratitudeEntry,
      closeGratitudeView,
      
      // Utility functions
      formatNumber,
      formatTime,
      formatHoursMinutes,
      formatDate,
      formatMonth,
      truncateText
    };
  }
});
</script>

<style scoped>
.wellness-suite-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.back-navigation {
  align-self: flex-start;
  margin-bottom: 20px;
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

.portfolio-navigation {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.portfolio-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: var(--primary-color, #6366f1);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.portfolio-button:hover {
  background-color: var(--primary-hover, #4f46e5);
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.portfolio-button i {
  margin-right: 8px;
}

/* iPhone frame styling */
.iphone-frame {
  position: relative;
  width: 365px;
  max-width: 100%;
  height: 740px;
  margin: 0 auto;
  background: #000000;
  border-radius: 40px;
  padding: 12px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2),
              0 0 5px rgba(0, 0, 0, 0.4) inset;
  border: 1px solid #444;
  overflow: hidden;
}

.iphone-top {
  position: relative;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.iphone-notch {
  width: 180px;
  height: 30px;
  background: #000;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  position: relative;
}

.notch-camera {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #222;
  border-radius: 50%;
  right: 35%;
  top: 10px;
}

.iphone-screen {
  background: var(--bg-dark, #121212);
  border-radius: 28px;
  height: calc(100% - 60px);
  overflow: hidden;
  position: relative;
}

.iphone-bottom {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-indicator {
  width: 140px;
  height: 5px;
  background: #444;
  border-radius: 3px;
}

/* Adjust wellness suite styles for mobile frame */
.wellness-suite {
  max-width: 100%;
  height: 100%;
  padding: 15px 15px 80px;
  font-family: 'DM Sans', sans-serif;
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  scrollbar-width: none; /* For Firefox */
}

.wellness-suite::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}

/* App Header */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.app-title {
  font-size: 1.8rem;
  margin: 0;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.app-tagline {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 3px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-streak {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.streak-count {
  font-size: 1rem;
  font-weight: 700;
  color: var(--accent-color);
}

.streak-label {
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* Bottom Navigation Bar */
.mobile-nav {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(25, 25, 35, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  height: 65px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
  width: 100%;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  margin-bottom: 5px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 20%;
  height: 100%;
  color: var(--text-muted, #a0a0a0);
  background: transparent;
  border: none;
  padding: 8px 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.nav-item i {
  font-size: 1.2rem;
  margin-bottom: 4px;
  transition: transform 0.2s ease;
}

.nav-label {
  font-size: 0.7rem;
  font-weight: 500;
}

.nav-item.active {
  color: var(--primary-color, #6366f1);
}

.nav-item.active i {
  transform: translateY(-2px);
  color: var(--primary-color, #6366f1);
}

/* Tab Content */
.tab-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  padding: 15px;
  min-height: 400px;
  font-size: 0.9rem;
  margin-bottom: 20px;
  overflow-y: auto;
}

.section-title {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: var(--heading-color);
}

/* Dashboard Tab */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.stat-icon {
  font-size: 1.2rem;
  color: var(--accent-color);
  margin-bottom: 8px;
}

.stat-info {
  margin-bottom: 10px;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 3px;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.stat-progress {
  height: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-bottom: 6px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--accent-color);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.stat-goal {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.stat-status {
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.8rem;
  display: inline-block;
  text-align: center;
}

.stat-status.normal {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.stat-status.high {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.stat-status.low {
  background: rgba(255, 193, 7, 0.1);
  color: #FFC107;
}

/* Activity Timeline */
.activity-timeline {
  margin-top: 25px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 10px;
}

.activity-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

.activity-icon.walk {
  background: rgba(33, 150, 243, 0.15);
  color: #2196F3;
}

.activity-icon.meditation {
  background: rgba(156, 39, 176, 0.15);
  color: #9C27B0;
}

.activity-icon.exercise {
  background: rgba(255, 87, 34, 0.15);
  color: #FF5722;
}

.activity-details {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  margin-bottom: 3px;
}

.activity-time {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.activity-metadata {
  text-align: right;
}

.activity-metric {
  font-weight: 600;
  color: var(--accent-color);
}

.activity-duration {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Meditation Timer */
.meditation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
}

.timer-display {
  position: relative;
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer-circle {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-progress {
  position: absolute;
  top: 0;
  left: 0;
}

.timer-time {
  font-size: 2.5rem;
  font-weight: 700;
}

.timer-phase {
  margin-top: 8px;
  font-size: 1rem;
  color: var(--text-muted);
}

.session-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.control-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.control-btn.start {
  background: var(--primary-color);
  color: white;
}

.control-btn.pause {
  background: rgba(255, 193, 7, 0.2);
  color: #FFC107;
}

.control-btn.stop {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

/* Journal Tab */
.journal-container, .gratitude-container {
  display: flex;
  flex-direction: column;
}

.journal-header, .gratitude-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.new-entry-btn, .add-gratitude-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s;
}

.journal-entries {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.entry-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: transform 0.3s, background 0.3s;
}

.entry-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.08);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.entry-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.entry-date {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.entry-preview {
  font-size: 0.9rem;
  margin-bottom: 12px;
  line-height: 1.4;
  color: var(--text-light);
}

.tag {
  display: inline-block;
  padding: 3px 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  font-size: 0.7rem;
  margin-right: 4px;
  margin-bottom: 4px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.entry-modal, .gratitude-modal, .confirm-modal {
  background: var(--bg-lighter);
  border-radius: 10px;
  width: 90%;
  max-width: 300px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.close-modal {
  background: none;
  border: none;
  font-size: 1.3rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.3s;
}

.close-modal:hover {
  color: var(--accent-color);
}

/* Mindfulness reminder */
.mindfulness-reminder {
  background: rgba(103, 58, 183, 0.1);
  border-radius: 10px;
  padding: 15px;
  margin-top: 20px;
}

.reminder-content h3 {
  color: #9C27B0;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.reminder-content p {
  font-style: italic;
  margin-bottom: 12px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.reminder-action {
  background: #9C27B0;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s;
}

.reminder-action:hover {
  background: #7B1FA2;
}

/* Gratitude */
.today-mood {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  color: var(--accent-color);
  margin-bottom: 15px;
}

.today-mood i {
  font-size: 1.3rem;
}

.gratitude-streak {
  background: rgba(255, 193, 7, 0.1);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
}

.streak-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #FFC107;
  font-size: 1.1rem;
  font-weight: 600;
}

.streak-icon i {
  font-size: 1.3rem;
}

/* Meditation stats */
.meditation-stats {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
}

.meditation-stats .stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  width: 45%;
}

.meditation-stats .stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--accent-color);
  margin-bottom: 5px;
}

.meditation-stats .stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
}

.empty-state i {
  font-size: 2rem;
  color: var(--text-muted);
  margin-bottom: 15px;
}

.empty-state p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Keep existing responsive styles with some mobile-specific adjustments */
@media (min-width: 768px) {
  .iphone-frame {
    width: 390px;
    height: 780px;
  }
}
</style> 