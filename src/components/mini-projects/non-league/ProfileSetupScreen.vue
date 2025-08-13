<template>
  <div class="screen profile-setup-screen">
    <div class="status-bar">
      <div class="time">9:43</div>
      <div class="icons">
        <i class="fas fa-wifi"></i>
        <i class="fas fa-battery-full"></i>
      </div>
    </div>
    
    <div class="nav-header">
      <div class="empty-space"></div>
      <h1>Complete Your Profile</h1>
      <div class="step-indicator">1/2</div>
    </div>
    
    <div class="content">
      <div class="progress-bar">
        <div class="progress-value" :style="{ width: progressPercent + '%' }"></div>
      </div>
      
      <div class="form-intro">
        <p>Tell us about yourself so we can personalize your experience and connect you with the right people.</p>
      </div>
      
      <form class="profile-form" @submit.prevent>
        <div class="photo-upload" @click="emitComplete(1)">
          <div class="photo-circle" v-if="!photoUploaded">
            <i class="fas fa-user"></i>
            <div class="upload-icon">
              <i class="fas fa-camera"></i>
            </div>
          </div>
          <div class="photo-preview" v-else>
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile Photo" />
          </div>
          <p>Upload Profile Photo</p>
        </div>
        
        <div class="form-group">
          <label>Select your role</label>
          <div class="role-options">
            <div 
              class="role-option"
              :class="{ active: selectedRole === 'player' }"
              @click="selectRole('player')"
            >
              <div class="role-icon">
                <i class="fas fa-running"></i>
              </div>
              <span>Player</span>
            </div>
            
            <div 
              class="role-option"
              :class="{ active: selectedRole === 'coach' }"
              @click="selectRole('coach')"
            >
              <div class="role-icon">
                <i class="fas fa-clipboard"></i>
              </div>
              <span>Coach</span>
            </div>
            
            <div 
              class="role-option"
              :class="{ active: selectedRole === 'staff' }"
              @click="selectRole('staff')"
            >
              <div class="role-icon">
                <i class="fas fa-briefcase"></i>
              </div>
              <span>Staff</span>
            </div>
            
            <div 
              class="role-option"
              :class="{ active: selectedRole === 'fan' }"
              @click="selectRole('fan')"
            >
              <div class="role-icon">
                <i class="fas fa-star"></i>
              </div>
              <span>Fan</span>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="club">Current Club/Team</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="club" 
              v-model="club"
              placeholder="Enter your club or team"
              @input="handleClubInput"
            />
            <i class="fas fa-check" v-if="clubSelected"></i>
          </div>
          
          <div class="club-suggestions" v-if="showClubSuggestions">
            <div 
              v-for="(suggestion, index) in clubSuggestions" 
              :key="index"
              class="club-suggestion"
              @click="selectClub(suggestion)"
            >
              <div class="club-logo" 
                :style="{ 
                  backgroundColor: getClubColor(suggestion) 
                }">
                {{ suggestion.substring(0, 2).toUpperCase() }}
              </div>
              <span>{{ suggestion }}</span>
            </div>
          </div>
        </div>
        
        <div class="form-group" v-if="selectedRole === 'player' || selectedRole === 'coach'">
          <label for="position">Position/Specialty</label>
          <select 
            id="position" 
            v-model="position"
            @change="handlePositionSelect"
          >
            <option value="" disabled selected>Select your position</option>
            <option v-if="selectedRole === 'player'" value="goalkeeper">Goalkeeper</option>
            <option v-if="selectedRole === 'player'" value="defender">Defender</option>
            <option v-if="selectedRole === 'player'" value="midfielder">Midfielder</option>
            <option v-if="selectedRole === 'player'" value="forward">Forward</option>
            <option v-if="selectedRole === 'coach'" value="head_coach">Head Coach</option>
            <option v-if="selectedRole === 'coach'" value="assistant_coach">Assistant Coach</option>
            <option v-if="selectedRole === 'coach'" value="fitness_coach">Fitness Coach</option>
            <option v-if="selectedRole === 'coach'" value="goalkeeper_coach">Goalkeeper Coach</option>
          </select>
        </div>
        
        <button 
          type="button" 
          class="btn-primary continue-btn"
          :disabled="!canContinue"
          @click="continueSetup"
        >
          Continue
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'ProfileSetupScreen',
  props: {
    step: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    // Profile data
    const photoUploaded = ref(false);
    const selectedRole = ref('');
    const club = ref('');
    const clubSelected = ref(false);
    const position = ref('');
    
    // UI states
    const showClubSuggestions = ref(false);
    const clubSuggestions = ref([
      'AFC Wimbledon',
      'Barnet FC',
      'Bromley FC',
      'Dulwich Hamlet',
      'Sutton United',
      'Wealdstone FC'
    ]);
    
    // Progress calculation
    const progressPercent = computed(() => {
      let progress = 0;
      
      if (photoUploaded.value) progress += 25;
      if (selectedRole.value) progress += 25;
      if (clubSelected.value) progress += 25;
      if (position.value || selectedRole.value === 'staff' || selectedRole.value === 'fan') progress += 25;
      
      return progress;
    });
    
    const canContinue = computed(() => {
      if (selectedRole.value === 'player' || selectedRole.value === 'coach') {
        return photoUploaded.value && selectedRole.value && clubSelected.value && position.value;
      } else {
        return photoUploaded.value && selectedRole.value && clubSelected.value;
      }
    });
    
    // Methods
    const selectRole = (role: string) => {
      selectedRole.value = role;
      emit('complete-step', 0);
    };
    
    const handleClubInput = () => {
      if (club.value.length > 2) {
        showClubSuggestions.value = true;
        // In a real app, we'd filter suggestions based on input
      } else {
        showClubSuggestions.value = false;
      }
      clubSelected.value = false;
    };
    
    const selectClub = (suggestion: string) => {
      club.value = suggestion;
      clubSelected.value = true;
      showClubSuggestions.value = false;
      emit('complete-step', 2);
    };
    
    const getClubColor = (clubName: string) => {
      // Simple hash function to generate consistent colors
      let hash = 0;
      for (let i = 0; i < clubName.length; i++) {
        hash = clubName.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      const hue = hash % 360;
      return `hsl(${hue}, 70%, 45%)`;
    };
    
    const handlePositionSelect = () => {
      if (position.value) {
        emit('complete-step', 3);
      }
    };
    
    const emitComplete = (taskIndex: number) => {
      if (taskIndex === 1) {
        photoUploaded.value = true;
      }
      emit('complete-step', taskIndex);
    };
    
    const continueSetup = () => {
      if (canContinue.value) {
        console.log('Profile setup complete');
      }
    };
    
    return {
      photoUploaded,
      selectedRole,
      club,
      clubSelected,
      position,
      showClubSuggestions,
      clubSuggestions,
      progressPercent,
      canContinue,
      selectRole,
      handleClubInput,
      selectClub,
      getClubColor,
      handlePositionSelect,
      emitComplete,
      continue: continueSetup
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
  overflow-y: auto;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  padding: 5px 15px;
  background: #f9f9f9;
  font-size: 12px;
  border-bottom: 1px solid #eee;
}

.icons {
  display: flex;
  gap: 8px;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9f9f9;
}

.nav-header h1 {
  font-size: 18px;
  margin: 0;
}

.step-indicator {
  font-size: 14px;
  color: #666;
}

.empty-space {
  width: 30px;
}

.progress-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-value {
  height: 100%;
  background: #4CAF50;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.content {
  padding: 20px;
}

.form-intro {
  margin-bottom: 25px;
}

.form-intro p {
  color: #666;
  line-height: 1.4;
  font-size: 14px;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.photo-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.photo-circle {
  width: 90px;
  height: 90px;
  background: #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: #777;
  position: relative;
  margin-bottom: 10px;
}

.upload-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: #1a2a6c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  border: 2px solid #f9f9f9;
}

.photo-preview {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 10px;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-upload p {
  font-size: 14px;
  color: #1a2a6c;
  margin: 0;
}

.form-group {
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 12px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.role-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.role-option {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.role-option.active {
  border-color: #1a2a6c;
  background: rgba(26, 42, 108, 0.05);
}

.role-icon {
  width: 45px;
  height: 45px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #555;
}

.role-option.active .role-icon {
  background: #1a2a6c;
  color: white;
}

.input-wrapper {
  position: relative;
}

input[type="text"] {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s;
}

input[type="text"]:focus {
  border-color: #1a2a6c;
  box-shadow: 0 0 0 2px rgba(26, 42, 108, 0.1);
  outline: none;
}

.form-group .fa-check {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #4CAF50;
}

.club-suggestions {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.club-suggestion {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.club-suggestion:hover {
  background: #f5f5f5;
}

.club-logo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  appearance: none;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat;
  background-position: right 10px center;
  background-color: white;
}

select:focus {
  border-color: #1a2a6c;
  box-shadow: 0 0 0 2px rgba(26, 42, 108, 0.1);
  outline: none;
}

.continue-btn {
  margin-top: 15px;
  background: #4CAF50;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.continue-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.continue-btn:not(:disabled):hover {
  background: #43A047;
  transform: translateY(-2px);
}
</style> 