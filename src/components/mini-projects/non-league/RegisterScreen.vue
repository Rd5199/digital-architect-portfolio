<template>
  <div class="screen register-screen">
    <div class="status-bar">
      <div class="time">9:42</div>
      <div class="icons">
        <i class="fas fa-wifi"></i>
        <i class="fas fa-battery-full"></i>
      </div>
    </div>
    
    <div class="nav-header">
      <button class="back-button">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1>Create Account</h1>
      <div class="empty-space"></div>
    </div>
    
    <div class="content">
      <div class="form-intro">
        <p>Join the Non-League Network community to connect with other players, coaches, and fans.</p>
      </div>
      
      <form class="registration-form" @submit.prevent>
        <div class="form-group" :class="{ 'active': nameActive, 'completed': nameCompleted }">
          <label for="fullname">Full Name</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="fullname" 
              v-model="fullname"
              @focus="nameActive = true"
              @blur="validateName()"
              placeholder="Enter your full name"
            />
            <i class="fas fa-check" v-if="nameCompleted"></i>
          </div>
          <div class="error-message" v-if="nameError">{{ nameError }}</div>
        </div>
        
        <div class="form-group" :class="{ 'active': emailActive, 'completed': emailCompleted }">
          <label for="email">Email Address</label>
          <div class="input-wrapper">
            <input 
              type="email" 
              id="email" 
              v-model="email"
              @focus="emailActive = true"
              @blur="validateEmail()"
              placeholder="Enter your email address"
            />
            <i class="fas fa-check" v-if="emailCompleted"></i>
          </div>
          <div class="error-message" v-if="emailError">{{ emailError }}</div>
        </div>
        
        <div class="form-group" :class="{ 'active': passwordActive, 'completed': passwordCompleted }">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="password"
              @focus="passwordActive = true"
              @blur="validatePassword()"
              placeholder="Create a password"
            />
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
            </button>
          </div>
          <div class="password-strength" v-if="password">
            <div class="strength-meter">
              <div 
                class="strength-value"
                :style="{ width: passwordStrength + '%' }"
                :class="getPasswordStrengthClass()"
              ></div>
            </div>
            <span class="strength-text">{{ getPasswordStrengthText() }}</span>
          </div>
          <div class="error-message" v-if="passwordError">{{ passwordError }}</div>
        </div>
        
        <div class="form-group terms" :class="{ 'completed': termsAccepted }">
          <div class="checkbox-wrapper">
            <input 
              type="checkbox" 
              id="terms" 
              v-model="termsAccepted"
              @change="emitComplete(3)"
            />
            <label for="terms" class="checkbox-label">
              I accept the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>
        </div>
        
        <button 
          type="submit" 
          class="btn-primary submit-btn"
          :disabled="!isFormValid()"
          @click="submitForm()"
        >
          Create Account
        </button>
        
        <div class="login-link">
          Already have an account? <a href="#">Log In</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'RegisterScreen',
  props: {
    step: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    // Form values
    const fullname = ref('');
    const email = ref('');
    const password = ref('');
    const termsAccepted = ref(false);
    const showPassword = ref(false);
    
    // Input states
    const nameActive = ref(false);
    const emailActive = ref(false);
    const passwordActive = ref(false);
    
    // Validation states
    const nameCompleted = ref(false);
    const emailCompleted = ref(false);
    const passwordCompleted = ref(false);
    
    // Error messages
    const nameError = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    
    // Validation methods
    const validateName = () => {
      if (fullname.value.length < 3) {
        nameError.value = 'Name must be at least 3 characters';
        nameCompleted.value = false;
      } else {
        nameError.value = '';
        nameCompleted.value = true;
        emit('complete-step', 0);
      }
    };
    
    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        emailError.value = 'Please enter a valid email address';
        emailCompleted.value = false;
      } else {
        emailError.value = '';
        emailCompleted.value = true;
        emit('complete-step', 1);
      }
    };
    
    const validatePassword = () => {
      if (password.value.length < 8) {
        passwordError.value = 'Password must be at least 8 characters';
        passwordCompleted.value = false;
      } else {
        passwordError.value = '';
        passwordCompleted.value = true;
        emit('complete-step', 2);
      }
    };
    
    // Password strength calculation
    const passwordStrength = computed(() => {
      if (!password.value) return 0;
      
      let strength = 0;
      
      // Length check
      if (password.value.length >= 8) strength += 20;
      if (password.value.length >= 12) strength += 10;
      
      // Character variety checks
      if (/[A-Z]/.test(password.value)) strength += 20;
      if (/[a-z]/.test(password.value)) strength += 20;
      if (/[0-9]/.test(password.value)) strength += 20;
      if (/[^A-Za-z0-9]/.test(password.value)) strength += 20;
      
      return Math.min(100, strength);
    });
    
    const getPasswordStrengthClass = () => {
      const strength = passwordStrength.value;
      if (strength < 40) return 'weak';
      if (strength < 70) return 'medium';
      return 'strong';
    };
    
    const getPasswordStrengthText = () => {
      const strength = passwordStrength.value;
      if (strength < 40) return 'Weak';
      if (strength < 70) return 'Medium';
      return 'Strong';
    };
    
    const isFormValid = () => {
      return nameCompleted.value && 
             emailCompleted.value && 
             passwordCompleted.value &&
             termsAccepted.value;
    };
    
    const submitForm = () => {
      if (isFormValid()) {
        // In a real app, this would submit to an API
        console.log('Form submitted', { fullname, email, password });
      }
    };
    
    // Emit completions for any pre-filled fields
    const emitComplete = (taskIndex: number) => {
      emit('complete-step', taskIndex);
    };
    
    return {
      fullname,
      email,
      password,
      termsAccepted,
      showPassword,
      nameActive,
      emailActive,
      passwordActive,
      nameCompleted,
      emailCompleted,
      passwordCompleted,
      nameError,
      emailError,
      passwordError,
      validateName,
      validateEmail,
      validatePassword,
      passwordStrength,
      getPasswordStrengthClass,
      getPasswordStrengthText,
      isFormValid,
      submitForm,
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
  border-bottom: 1px solid #eee;
}

.back-button {
  background: transparent;
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1a2a6c;
}

.nav-header h1 {
  font-size: 18px;
  margin: 0;
}

.empty-space {
  width: 30px;
}

.content {
  padding: 20px;
}

.form-intro {
  margin-bottom: 20px;
}

.form-intro p {
  color: #666;
  line-height: 1.4;
  font-size: 14px;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
  transition: color 0.3s;
}

.form-group.active label {
  color: #1a2a6c;
}

.input-wrapper {
  position: relative;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"] {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s;
}

.form-group.active input {
  border-color: #1a2a6c;
  box-shadow: 0 0 0 2px rgba(26, 42, 108, 0.1);
}

.form-group.completed input {
  border-color: #4CAF50;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
}

.form-group .fa-check {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #4CAF50;
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
}

.password-strength {
  margin-top: 10px;
}

.strength-meter {
  height: 5px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 5px;
}

.strength-value {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.strength-value.weak {
  background: #e74c3c;
}

.strength-value.medium {
  background: #f39c12;
}

.strength-value.strong {
  background: #2ecc71;
}

.strength-text {
  font-size: 12px;
  color: #777;
}

.terms {
  margin: 10px 0;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
}

.checkbox-wrapper input[type="checkbox"] {
  margin-right: 10px;
  margin-top: 3px;
}

.checkbox-label {
  font-size: 13px;
  line-height: 1.4;
  color: #555;
}

.checkbox-label a {
  color: #1a2a6c;
  text-decoration: none;
}

.submit-btn {
  margin-top: 10px;
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

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  background: #43A047;
  transform: translateY(-2px);
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.login-link a {
  color: #1a2a6c;
  text-decoration: none;
  font-weight: 500;
}
</style> 