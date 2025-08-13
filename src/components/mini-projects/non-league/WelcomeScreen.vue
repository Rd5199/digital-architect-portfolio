<template>
  <div class="screen welcome-screen">
    <div class="status-bar">
      <div class="time">9:41</div>
      <div class="icons">
        <i class="fas fa-wifi"></i>
        <i class="fas fa-battery-full"></i>
      </div>
    </div>
    
    <div class="content">
      <div class="app-logo">
        <div class="logo-circle">
          <i class="fas fa-futbol"></i>
        </div>
        <h1>Non-League Network</h1>
      </div>
      
      <div class="welcome-text">
        <h2>Welcome to the Community</h2>
        <p>Connect with players, coaches, and fans from the non-league football community. Access fixtures, resources, and networking opportunities all in one place.</p>
      </div>
      
      <div class="feature-highlights">
        <div class="feature">
          <div class="feature-icon">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div class="feature-text">
            <h3>Fixture Management</h3>
            <p>Keep track of matches, even offline</p>
          </div>
        </div>
        
        <div class="feature">
          <div class="feature-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="feature-text">
            <h3>Network Building</h3>
            <p>Connect with the football community</p>
          </div>
        </div>
        
        <div class="feature">
          <div class="feature-icon">
            <i class="fas fa-book"></i>
          </div>
          <div class="feature-text">
            <h3>Resource Library</h3>
            <p>Access training materials and guides</p>
          </div>
        </div>
      </div>
      
      <div class="auth-buttons">
        <button class="btn-primary" @click="emitComplete(1)">Register</button>
        <button class="btn-secondary">Login</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WelcomeScreen',
  props: {
    step: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const emitComplete = (taskIndex: number) => {
      emit('complete-step', taskIndex);
    };
    
    return {
      emitComplete
    };
  }
});
</script>

<style scoped>
.screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(180deg, #1a2a6c 0%, #2a5298 100%);
  color: white;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  padding: 5px 15px;
  background: rgba(0, 0, 0, 0.2);
  font-size: 12px;
}

.icons {
  display: flex;
  gap: 8px;
}

.content {
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: calc(100% - 27px);
  justify-content: center;
  align-items: center;
  text-align: center;
}

.app-logo {
  margin-bottom: 30px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.logo-circle i {
  font-size: 40px;
  color: #1a2a6c;
}

.app-logo h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.welcome-text {
  margin-bottom: 30px;
}

.welcome-text h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.welcome-text p {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.5;
}

.feature-highlights {
  margin-bottom: 40px;
  width: 100%;
}

.feature {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.feature-text h3 {
  font-size: 16px;
  margin: 0 0 5px;
}

.feature-text p {
  font-size: 12px;
  margin: 0;
  opacity: 0.8;
}

.auth-buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-primary {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #43A047;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style> 