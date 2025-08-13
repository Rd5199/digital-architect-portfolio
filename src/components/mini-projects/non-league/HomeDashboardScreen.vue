<template>
  <div class="screen home-dashboard-screen">
    <div class="status-bar">
      <div class="time">9:48</div>
      <div class="icons">
        <i class="fas fa-wifi"></i>
        <i class="fas fa-battery-full"></i>
      </div>
    </div>
    
    <div class="header">
      <div class="greeting">
        <h1>Hello, Michael</h1>
        <p>Welcome to your Non-League Network</p>
      </div>
      <div class="profile-icon" @click="navigateTo('ProfileScreen')">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" />
      </div>
    </div>
    
    <div class="search-bar">
      <i class="fas fa-search"></i>
      <input type="text" placeholder="Search teams, players or events..." />
    </div>
    
    <div class="content">
      <div class="upcoming-section">
        <div class="section-header">
          <h2>Upcoming Fixture</h2>
          <button class="small-button" @click="navigateTo('FixturesScreen')">View All</button>
        </div>
        
        <div class="match-card">
          <div class="match-header">
            <span class="league">Southern League Premier - Matchday 12</span>
            <span class="date">Tomorrow - 15:00</span>
          </div>
          
          <div class="match-teams">
            <div class="team home-team">
              <div class="team-logo" style="background-color: #E63946;">
                BN
              </div>
              <span class="team-name">Barnet FC</span>
            </div>
            
            <div class="versus">VS</div>
            
            <div class="team away-team">
              <div class="team-logo" style="background-color: #457B9D;">
                SU
              </div>
              <span class="team-name">Sutton United</span>
            </div>
          </div>
          
          <div class="match-actions">
            <button class="match-button available" @click="showNotification('Available', 'You are marked as available for this match', 'fas fa-check-circle')">
              <i class="fas fa-check-circle"></i>
              <span>Available</span>
            </button>
            
            <button class="match-button" @click="showNotification('Directions', 'Opening directions to The Hive Stadium', 'fas fa-map-marker-alt')">
              <i class="fas fa-map-marker-alt"></i>
              <span>Directions</span>
            </button>
            
            <button class="match-button" @click="showNotification('Shared', 'Match details shared with your team', 'fas fa-share-alt')">
              <i class="fas fa-share-alt"></i>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="network-section">
        <div class="section-header">
          <h2>Your Network</h2>
          <button class="small-button" @click="navigateTo('NetworkScreen')">View All</button>
        </div>
        
        <div class="connections-list">
          <div class="connection-item" v-for="(connection, index) in connections" :key="index">
            <div class="connection-avatar">
              <img :src="connection.avatar" :alt="connection.name" />
              <div class="status-dot" :class="connection.online ? 'online' : ''"></div>
            </div>
            <div class="connection-info">
              <div class="connection-name">{{ connection.name }}</div>
              <div class="connection-role">{{ connection.role }}</div>
            </div>
            <button class="message-button" @click="navigateTo('MessageScreen')">
              <i class="fas fa-comment"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="resources-section">
        <div class="section-header">
          <h2>Resources</h2>
          <button class="small-button" @click="navigateTo('ResourceDetailScreen')">More</button>
        </div>
        
        <div class="resources-grid">
          <div class="resource-card" v-for="(resource, index) in resources" :key="index" @click="navigateTo('ResourceDetailScreen')">
            <div class="resource-icon" :style="{ backgroundColor: resource.color }">
              <i :class="resource.icon"></i>
            </div>
            <div class="resource-info">
              <div class="resource-title">{{ resource.title }}</div>
              <div class="resource-desc">{{ resource.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <nav class="bottom-nav">
      <div class="nav-item active">
        <i class="fas fa-home"></i>
        <span>Home</span>
      </div>
      <div class="nav-item" @click="navigateTo('FixturesScreen')">
        <i class="fas fa-calendar-alt"></i>
        <span>Fixtures</span>
      </div>
      <div class="nav-item" @click="navigateTo('NetworkScreen')">
        <i class="fas fa-users"></i>
        <span>Network</span>
      </div>
      <div class="nav-item" @click="navigateTo('NotificationsScreen')">
        <i class="fas fa-bell"></i>
        <span>Notifications</span>
        <div class="notification-badge">3</div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'HomeDashboardScreen',
  props: {
    step: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const connections = ref([
      {
        name: 'Sarah Johnson',
        role: 'Coach at Bromley FC',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        online: true
      },
      {
        name: 'David Thompson',
        role: 'Player at Wealdstone FC',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        online: true
      },
      {
        name: 'Emma Wilson',
        role: 'Staff at Dulwich Hamlet',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
        online: false
      }
    ]);
    
    const resources = ref([
      {
        title: 'Training Routines',
        description: 'Access your training plans',
        icon: 'fas fa-running',
        color: '#2A9D8F'
      },
      {
        title: 'Team Documents',
        description: 'View match tactics & notes',
        icon: 'fas fa-file-alt',
        color: '#E9C46A'
      },
      {
        title: 'Statistics',
        description: 'Your performance metrics',
        icon: 'fas fa-chart-line',
        color: '#F4A261'
      },
      {
        title: 'Community Forum',
        description: 'Join discussions',
        icon: 'fas fa-comments',
        color: '#E76F51'
      }
    ]);
    
    const emitComplete = (taskIndex: number) => {
      if (emit) {
        emit('complete-step', taskIndex);
      }
    };
    
    const navigateTo = (screen: string) => {
      emit('navigate-to', screen);
    };
    
    const showNotification = (title: string, message: string, icon: string = 'fas fa-check-circle') => {
      emit('show-notification', { title, message, icon });
    };
    
    return {
      connections,
      resources,
      emitComplete,
      navigateTo,
      showNotification
    };
  }
});
</script>

<style scoped>
.screen {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  color: #333;
  display: flex;
  flex-direction: column;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  padding: 5px 15px;
  background: #f9f9f9;
  font-size: 12px;
}

.icons {
  display: flex;
  gap: 8px;
}

.header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.greeting h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

.greeting p {
  margin: 5px 0 0 0;
  color: #666;
  font-size: 14px;
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.profile-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-bar {
  margin: 0 20px 15px;
  position: relative;
}

.search-bar i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 14px;
}

.search-bar input {
  width: 100%;
  padding: 12px 15px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 14px;
  background: white;
}

.search-bar input:focus {
  outline: none;
  border-color: #1a2a6c;
  box-shadow: 0 0 0 2px rgba(26, 42, 108, 0.1);
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 80px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.small-button {
  background: none;
  border: none;
  color: #1a2a6c;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
}

.match-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.match-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.league {
  font-size: 12px;
  color: #666;
}

.date {
  font-size: 12px;
  font-weight: 500;
  color: #1a2a6c;
}

.match-teams {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
}

.team-logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 16px;
  margin-bottom: 8px;
}

.team-name {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.versus {
  font-size: 14px;
  font-weight: 600;
  color: #888;
}

.match-actions {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.match-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #555;
  gap: 5px;
  width: 33%;
}

.match-button.available {
  color: #4CAF50;
}

.match-button i {
  font-size: 16px;
}

.connections-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.connection-item {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 12px 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.connection-avatar {
  position: relative;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
}

.connection-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
  border: 2px solid white;
}

.status-dot.online {
  background: #4CAF50;
}

.connection-info {
  flex: 1;
}

.connection-name {
  font-weight: 500;
  font-size: 14px;
}

.connection-role {
  font-size: 12px;
  color: #666;
}

.message-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  color: #1a2a6c;
  transition: all 0.2s;
}

.message-button:hover {
  background: #e0e0e0;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.resource-card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.resource-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  margin-right: 12px;
}

.resource-info {
  flex: 1;
}

.resource-title {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 3px;
}

.resource-desc {
  font-size: 12px;
  color: #666;
}

.bottom-nav {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #eee;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #888;
  cursor: pointer;
  position: relative;
  padding: 8px 0;
  width: 25%;
}

.nav-item i {
  font-size: 18px;
  margin-bottom: 4px;
}

.nav-item.active {
  color: #1a2a6c;
  font-weight: 500;
}

.notification-badge {
  position: absolute;
  top: 5px;
  right: calc(50% - 15px);
  background: #E63946;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}
</style> 