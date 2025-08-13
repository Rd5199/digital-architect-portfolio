<template>
  <section id="contact" class="dev-section dev-section-alt">
    <div class="dev-container">
      <h2 class="dev-section-title">Ready to Launch Your Next Project?</h2>
      <p class="dev-section-subtitle">Let's collaborate to build something truly exceptional. Reach out to discuss your ideas.</p>
      
      <div class="dev-contact-form">
        <form id="contact-form" @submit.prevent="handleSubmit">
          <div class="dev-form-group">
            <label for="name">Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.name" 
              class="dev-form-control" 
              required
            >
          </div>
          
          <div class="dev-form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              class="dev-form-control" 
              required
            >
          </div>
          
          <div class="dev-form-group">
            <label for="project-type">Project Type</label>
            <select 
              id="project-type" 
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
            <label for="message">Project Details</label>
            <textarea 
              id="message" 
              v-model="formData.message" 
              class="dev-form-control" 
              required
            ></textarea>
          </div>
          
          <button type="submit" class="dev-btn dev-btn-primary" style="width: 100%;">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  name: 'Contact',
  setup() {
    const formData = reactive({
      name: '',
      email: '',
      projectType: '',
      message: ''
    });

    const projectOptions = [
      { value: 'website', label: 'Website' },
      { value: 'web-app', label: 'Web Application' },
      { value: 'mobile-app', label: 'Mobile App' },
      { value: 'e-commerce', label: 'E-commerce' },
      { value: 'other', label: 'Other' }
    ];

    const handleSubmit = () => {
      // In a real application, you would send this data to a server
      alert('Thank you for your message! I will get back to you soon.');
      
      // Reset form
      formData.name = '';
      formData.email = '';
      formData.projectType = '';
      formData.message = '';
    };

    return {
      formData,
      projectOptions,
      handleSubmit
    };
  }
});
</script>

<style scoped>
/* Styles are imported from main.css */
</style> 