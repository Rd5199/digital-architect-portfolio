<template>
  <div class="non-league-network-demo">
    <h2 class="demo-title">Non-League Network Mobile App</h2>
    <p class="demo-description">A community platform for non-league football players, staff and fans</p>
    
    <div class="device-container">
      <div class="device-frame">
        <div class="device-screen">
          <HomeDashboardScreen 
            @navigate-to="navigateTo"
            @show-notification="showNotification"
          />
        </div>
        
        <div v-if="notification" class="notification">
          <div class="notification-content">
            <i :class="notification.icon"></i>
            <div>
              <h4>{{ notification.title }}</h4>
              <p>{{ notification.message }}</p>
            </div>
          </div>
          <button @click="closeNotification" class="notification-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div class="action-buttons">
      <router-link to="/#portfolio" class="back-button">
        <i class="fas fa-arrow-left"></i> Back to Portfolio
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import HomeDashboardScreen from './non-league/HomeDashboardScreen.vue';

interface Notification {
  title: string;
  message: string;
  icon: string;
}

export default defineComponent({
  name: 'NonLeagueNetwork',
  components: {
    HomeDashboardScreen
  },
  setup() {
    const currentScreen = ref('HomeDashboardScreen');
    const notification = ref<Notification | null>(null);
    
    const navigateTo = (screen: string) => {
      // In this simplified version, we just show a notification instead of navigating
      showNotification({
        title: 'Navigation',
        message: `Navigating to ${screen}`,
        icon: 'fas fa-info-circle'
      });
    };
    
    const showNotification = (notif: Notification) => {
      notification.value = notif;
      setTimeout(() => {
        notification.value = null;
      }, 3000);
    };
    
    const closeNotification = () => {
      notification.value = null;
    };
    
    return {
      currentScreen,
      notification,
      navigateTo,
      showNotification,
      closeNotification
    };
  }
});
</script>

<style scoped>
.non-league-network-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 20px 60px;
  max-width: 100%;
  margin: 0 auto;
}

.demo-title {
  font-size: 2rem;
  margin-bottom: 10px;
  color: var(--heading-color);
  text-align: center;
}

.demo-description {
  font-size: 1rem;
  color: var(--text-color);
  margin-bottom: 30px;
  text-align: center;
  max-width: 600px;
}

.device-container {
  margin: 20px 0 40px;
  display: flex;
  justify-content: center;
}

.device-frame {
  width: 320px;
  height: 650px;
  background: #111;
  border-radius: 36px;
  padding: 12px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.2),
    inset 0 -3px 0 rgba(255, 255, 255, 0.1),
    inset 0 3px 3px rgba(0, 0, 0, 0.4);
  position: relative;
}

.device-screen {
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  border-radius: 28px;
  overflow: hidden;
  position: relative;
}

.notification {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 12px 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  animation: slideDown 0.3s forwards;
}

@keyframes slideDown {
  from {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-content i {
  font-size: 20px;
  color: #4CAF50;
}

.notification-content h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.notification-content p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.notification-close {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 5px;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--primary-color);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .device-frame {
    width: 280px;
    height: 570px;
  }
  
  .demo-title {
    font-size: 1.7rem;
  }
}
</style> 