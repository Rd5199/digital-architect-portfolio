<template>
  <section id="contact" class="dev-section dev-contact">
    <div class="dev-container">
      <h2 class="dev-section-title">Apply To Work With Us</h2>
      <p class="dev-section-subtitle dev-urgency-message">
        Taking on 3 more clients in 2026
      </p>
      
      <div class="dev-apply-container">
        <!-- Show Button Initially -->
        <div v-if="!showForm" class="dev-apply-button-container">
          <button @click="showForm = true" class="dev-btn dev-btn-primary dev-apply-btn">
            Apply Now
          </button>
        </div>
        
        <!-- Contact Form -->
        <transition name="form-fade">
          <div v-if="showForm" class="dev-contact-form">
            <!-- Loading State -->
            <div v-if="isSubmitting" class="dev-form-status dev-form-loading">
              <div class="dev-spinner"></div>
              <p>Sending your application...</p>
            </div>
            
            <!-- Success State -->
            <div v-else-if="submitStatus === 'success'" class="dev-form-status dev-form-success">
              <h3>Application Sent Successfully!</h3>
              <p>Thank you for your application. We will review your submission and get back to you soon.</p>
            </div>
            
            <!-- Error State -->
            <div v-else-if="submitStatus === 'error'" class="dev-form-status dev-form-error">
              <h3>Submission Failed</h3>
              <p>{{ errorMessage || 'There was a problem submitting your form. Please try again.' }}</p>
              <button @click="resetForm" class="dev-btn dev-btn-primary">Try Again</button>
            </div>
            
            <!-- Form -->
            <form v-else id="contact-form" action="https://api.web3forms.com/submit" method="POST" @submit.prevent="handleSubmit">
              <input type="hidden" name="access_key" value="b4e46767-36a0-4855-94f9-7b006ace25ed">
            <div class="dev-form-group">
              <label for="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                v-model="formData.name" 
                class="dev-form-control" 
                placeholder="Your name"
                required
              >
            </div>
            
            <div class="dev-form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                v-model="formData.email" 
                class="dev-form-control" 
                placeholder="your.email@example.com"
                required
              >
            </div>
            
            <div class="dev-form-group">
              <label for="phone">Phone (Optional)</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                v-model="formData.phone" 
                class="dev-form-control" 
                placeholder="(123) 456-7890"
              >
            </div>
            
            <div class="dev-form-group">
              <label for="project-type">Project Type</label>
              <select 
                id="project-type" 
                name="project_type"
                v-model="formData.projectType" 
                class="dev-form-control"
              >
                <option value="">Select Project Type</option>
                <option 
                  v-for="option in projectOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
            
            <div class="dev-form-group">
              <label for="timeline">Expected Timeline</label>
              <select 
                id="timeline" 
                name="timeline"
                v-model="formData.timeline" 
                class="dev-form-control"
              >
                <option value="">Select Timeline</option>
                <option value="urgent">ASAP / Urgent</option>
                <option value="1month">Within 1 month</option>
                <option value="3months">Within 3 months</option>
                <option value="6months">Within 6 months</option>
                <option value="flexible">Flexible / Not sure yet</option>
              </select>
            </div>
            
            <div class="dev-form-group">
              <label for="message">Project Details</label>
              <textarea 
                id="message" 
                name="message"
                v-model="formData.message" 
                class="dev-form-control" 
                placeholder="Tell me about your project requirements and goals..."
                required
              ></textarea>
            </div>
            
            <div class="dev-form-group dev-privacy-terms">
              <input 
                type="checkbox" 
                id="privacy-agree" 
                v-model="formData.privacyAgree" 
                required
              >
              <label for="privacy-agree">
                I agree to the <router-link to="/privacy-policy" class="dev-link">Privacy Policy</router-link> and 
                <router-link to="/terms-of-service" class="dev-link">Terms of Service</router-link>
              </label>
            </div>
            
            <!-- Hidden fields for tracking -->
            <input type="hidden" name="subject" value="New Application - Work With Us">
            <input type="hidden" name="from_name" value="Portfolio Contact Form">
            
            <button type="submit" class="dev-btn dev-btn-primary dev-apply-btn" style="width: 100%;" :disabled="isSubmitting">
              <span v-if="isSubmitting">Sending...</span>
              <span v-else>Apply Now</span>
            </button>
          </form>
        </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
  name: 'Contact',
  setup() {
    const showForm = ref(false);
    const isSubmitting = ref(false);
    const submitStatus = ref<'idle' | 'success' | 'error'>('idle');
    const errorMessage = ref('');
    
    const formData = reactive({
      name: '',
      email: '',
      phone: '',
      projectType: '',
      timeline: '',
      message: '',
      privacyAgree: false
    });

    const projectOptions = [
      { value: 'website', label: 'Website' },
      { value: 'web-app', label: 'Web Application' },
      { value: 'mobile-app', label: 'Mobile App' },
      { value: 'e-commerce', label: 'E-commerce' },
      { value: 'other', label: 'Other' }
    ];


    const handleSubmit = async (e: Event) => {
      isSubmitting.value = true;
      submitStatus.value = 'idle';
      errorMessage.value = '';
      
      try {
        // Get form data
        const form = e.target as HTMLFormElement;
        const formDataObject = new FormData(form);
        
        // Note: access_key, subject, and from_name are already in the form as hidden fields
        
        // Submit to Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formDataObject
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          submitStatus.value = 'success';
          
          // Reset form data
          formData.name = '';
          formData.email = '';
          formData.phone = '';
          formData.projectType = '';
          formData.timeline = '';
          formData.message = '';
          formData.privacyAgree = false;
        } else {
          // Error handling
          errorMessage.value = data.message || 'Form submission failed. Please try again.';
          submitStatus.value = 'error';
        }
      } catch (error) {
        errorMessage.value = 'Network error. Please check your connection and try again.';
        submitStatus.value = 'error';
        console.error('Form submission error:', error);
      } finally {
        isSubmitting.value = false;
      }
    };
    
    const resetForm = () => {
      submitStatus.value = 'idle';
      errorMessage.value = '';
      const form = document.getElementById('contact-form') as HTMLFormElement;
      if (form) {
        form.reset();
      }
    };

    return {
      showForm,
      isSubmitting,
      submitStatus,
      errorMessage,
      formData,
      projectOptions,
      handleSubmit,
      resetForm
    };
  }
});
</script>

<style scoped>
/* Apply Now Page Styles */
.dev-apply-container {
  max-width: 700px;
  margin: 0 auto;
}

.dev-apply-button-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.dev-apply-btn {
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 3rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: none;
  border-radius: var(--border-radius-pill, 9999px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  min-width: 200px;
}

.dev-apply-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.dev-apply-btn:hover::before {
  left: 100%;
}

.dev-apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(110, 68, 255, 0.4);
}

.dev-apply-btn:active {
  transform: translateY(0);
}

/* Form transition animations */
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 0.4s ease;
}

.form-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.form-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.form-fade-enter-to,
.form-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.dev-urgency-message {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--text-light);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.dev-contact-form {
  backdrop-filter: blur(10px);
  padding: var(--spacing-lg);
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(110, 68, 255, 0.2);
  min-height: 400px;
}

/* Form Status Styles */
.dev-form-status {
  text-align: center;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.dev-form-status h3 {
  margin: 1rem 0 0.5rem 0;
  color: var(--text-white);
  font-size: 1.5rem;
}

.dev-form-status p {
  color: var(--text-light);
  margin: 0.5rem 0;
  line-height: 1.6;
}

.dev-form-info {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 1rem;
  font-style: italic;
}

/* Loading State */
.dev-form-loading {
  color: var(--primary-color);
}

.dev-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(110, 68, 255, 0.2);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Success State */
.dev-form-success {
  color: #10b981;
}

.dev-success-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #10b981;
  margin-bottom: 1rem;
  font-weight: bold;
}

.dev-form-success h3 {
  color: #10b981;
}

.dev-form-success button {
  margin-top: 1.5rem;
}

/* Error State */
.dev-form-error {
  color: #ef4444;
}

.dev-error-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #ef4444;
  margin-bottom: 1rem;
  font-weight: bold;
}

.dev-form-error h3 {
  color: #ef4444;
}

.dev-form-error button {
  margin-top: 1.5rem;
}

.dev-btn-secondary {
  background: rgba(110, 68, 255, 0.1);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius-pill, 9999px);
}

.dev-btn-secondary:hover {
  background: rgba(110, 68, 255, 0.2);
}

.dev-apply-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}


.dev-privacy-terms {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.dev-privacy-terms input[type="checkbox"] {
  margin-top: 4px;
}

.dev-privacy-terms label {
  font-size: 0.9rem;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .dev-urgency-message {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .dev-contact-form {
    padding: var(--spacing-sm);
  }
  
  .dev-form-group {
    margin-bottom: var(--spacing-sm);
  }
  
  .dev-form-group label {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }
  
  .dev-form-control {
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 0.875rem 1rem;
    min-height: 44px;
  }
  
  textarea.dev-form-control {
    min-height: 120px;
    font-size: 16px;
  }
  
  .dev-apply-btn {
    width: 100%;
    min-height: 44px;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
  
  .dev-apply-button-container {
    text-align: center;
  }
}

@media (max-width: 576px) {
  .dev-urgency-message {
    font-size: 0.95rem;
    margin-bottom: 1.25rem;
  }
  
  .dev-contact-form {
    padding: var(--spacing-xs);
  }
  
  .dev-form-group {
    margin-bottom: var(--spacing-xs);
  }
  
  .dev-form-control {
    padding: 0.75rem 0.875rem;
  }
  
  textarea.dev-form-control {
    min-height: 100px;
  }
}
</style> 