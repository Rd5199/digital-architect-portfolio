<template>
  <section id="contact" class="dev-section dev-contact">
    <div class="dev-container">
      <h2 class="dev-section-title">Ready to Launch Your Next Project?</h2>
      <p class="dev-section-subtitle">Let's collaborate to build something truly exceptional. Reach out to discuss your ideas.</p>
      
      <div class="dev-quote-request-container">
        <!-- Pricing Packages -->
        <div class="dev-pricing-packages">
          <h3 class="dev-packages-title">Step 1: Choose a Package</h3>
          
          <div class="dev-packages-grid">
            <div 
              v-for="(pkg, index) in packages" 
              :key="index" 
              class="dev-package-card" 
              :class="{ 'selected': formData.selectedPackage === pkg.id }"
              @click="selectPackage(pkg.id)"
            >
              <div class="dev-package-name">{{ pkg.name }}</div>
              <div class="dev-package-price">{{ pkg.price }}</div>
              <div class="dev-package-description">{{ pkg.description }}</div>
              <ul class="dev-package-features">
                <li v-for="(feature, i) in pkg.features" :key="i">{{ feature }}</li>
              </ul>
              <div class="dev-package-select">
                <div class="dev-package-radio" :class="{ 'checked': formData.selectedPackage === pkg.id }"></div>
                <span>{{ formData.selectedPackage === pkg.id ? 'Selected' : 'Select' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Contact Form -->
        <div class="dev-contact-form">
          <h3 class="dev-form-title">Step 2: Tell Us About Your Project</h3>
          <form id="contact-form" action="https://formspree.io/f/xyzwawvl" method="POST" @submit.prevent="handleSubmit">
            <div class="dev-selected-package-summary" v-if="selectedPackageInfo">
              <h4>Selected Package: {{ selectedPackageInfo.name }}</h4>
              <p class="dev-selected-package-price">{{ selectedPackageInfo.price }}</p>
            </div>
            
            <div class="dev-form-group">
              <label for="name">Name</label>
              <input 
                type="text" 
                id="name" 
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
                v-model="formData.phone" 
                class="dev-form-control" 
                placeholder="(123) 456-7890"
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
              <label for="timeline">Expected Timeline</label>
              <select 
                id="timeline" 
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
            
            <!-- Add hidden fields for the selected package -->
            <input type="hidden" name="selectedPackage" :value="selectedPackageInfo ? selectedPackageInfo.name : 'No package selected'">
            <input type="hidden" name="packagePrice" :value="selectedPackageInfo ? selectedPackageInfo.price : 'N/A'">
            
            <button type="submit" class="dev-btn dev-btn-primary" style="width: 100%;">
              Request Quote
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';

export default defineComponent({
  name: 'Contact',
  setup() {
    const formData = reactive({
      name: '',
      email: '',
      phone: '',
      projectType: '',
      timeline: '',
      message: '',
      selectedPackage: 'custom',
      privacyAgree: false
    });

    const packages = [
      {
        id: 'basic',
        name: 'Basic Website',
        price: '$1,499',
        description: 'Perfect for small businesses looking to establish an online presence.',
        features: [
          '5 Pages Website',
          'Mobile Responsive Design',
          'Contact Form',
          'Basic SEO Setup',
          '1 Week Delivery'
        ]
      },
      {
        id: 'business',
        name: 'Business Growth',
        price: '$2,999',
        description: 'For established businesses needing more advanced features.',
        features: [
          'Up to 10 Pages',
          'Content Management System',
          'Blog Integration',
          'Advanced SEO Package',
          'Social Media Integration',
          '2 Weeks Delivery'
        ]
      },
      {
        id: 'ecommerce',
        name: 'E-Commerce',
        price: 'Starting at $4,999',
        description: 'Full-featured online store with payment processing.',
        features: [
          'Full E-Commerce Store',
          'Product Management System',
          'Payment Gateway Integration',
          'Order Management',
          'Customer Accounts',
          'Advanced Analytics',
          '3-4 Weeks Delivery'
        ]
      },
      {
        id: 'web-app-basic',
        name: 'Web App - Basic',
        price: 'Starting at $7,999',
        description: 'Entry-level web application for specific business needs.',
        features: [
          'Custom User Interface',
          'Basic User Authentication',
          'Core Feature Development',
          'Database Integration',
          'Responsive Design',
          '4-6 Weeks Delivery'
        ]
      },
      {
        id: 'web-app-advanced',
        name: 'Web App - Advanced',
        price: 'Starting at $15,999',
        description: 'Sophisticated web application with complex functionality.',
        features: [
          'Advanced User Management',
          'Complex Workflows',
          'Third-party Integrations',
          'Payment Systems',
          'Reporting Dashboard',
          'API Development',
          '8-12 Weeks Delivery'
        ]
      },
      {
        id: 'mobile-app-basic',
        name: 'Mobile App - Basic',
        price: 'Starting at $12,999',
        description: 'Native or hybrid mobile application for iOS and/or Android.',
        features: [
          'User-friendly Interface',
          'Core Functionality',
          'User Authentication',
          'Push Notifications',
          'Basic API Integration',
          '6-8 Weeks Delivery'
        ]
      },
      {
        id: 'mobile-app-advanced',
        name: 'Mobile App - Advanced',
        price: 'Starting at $24,999',
        description: 'Feature-rich mobile application with complex functionality.',
        features: [
          'Advanced UI/UX Design',
          'Complex Data Management',
          'Third-party Integrations',
          'Offline Functionality',
          'Payment Processing',
          'Analytics Integration',
          '12-16 Weeks Delivery'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise Solution',
        price: 'Starting at $35,000',
        description: 'Complete custom enterprise-grade solutions for large organizations.',
        features: [
          'Fully Custom Development',
          'Scalable Architecture',
          'Multiple Integrations',
          'Advanced Security Features',
          'Performance Optimization',
          'Comprehensive Documentation',
          'Training & Extended Support',
          '16+ Weeks Delivery'
        ]
      },
      {
        id: 'custom',
        name: 'Custom Quote',
        price: 'Custom',
        description: 'Have unique requirements? Get a tailored solution for your specific needs.',
        features: [
          'Custom Features',
          'Tailored to Your Needs',
          'Advanced Integrations',
          'Custom Timeline',
          'Priority Support'
        ]
      }
    ];

    const projectOptions = [
      { value: 'website', label: 'Website' },
      { value: 'web-app', label: 'Web Application' },
      { value: 'mobile-app', label: 'Mobile App' },
      { value: 'e-commerce', label: 'E-commerce' },
      { value: 'other', label: 'Other' }
    ];

    const selectedPackageInfo = computed(() => {
      return packages.find(pkg => pkg.id === formData.selectedPackage);
    });

    const selectPackage = (packageId: string) => {
      formData.selectedPackage = packageId;
      
      // Set project type based on selected package
      if (packageId.includes('web-app')) {
        formData.projectType = 'web-app';
      } else if (packageId.includes('mobile-app')) {
        formData.projectType = 'mobile-app';
      } else if (packageId === 'ecommerce') {
        formData.projectType = 'e-commerce';
      } else if (packageId === 'basic' || packageId === 'business') {
        formData.projectType = 'website';
      }
    };

    const handleSubmit = async (e: Event) => {
      try {
        // Get form data
        const form = e.target as HTMLFormElement;
        const formDataObject = new FormData(form);
        
        // Submit to Formspree
        const response = await fetch(form.action, {
          method: form.method,
          body: formDataObject,
          headers: {
            Accept: 'application/json'
          }
        });
        
        if (response.ok) {
          // Success message
          alert('Thank you for your message! You selected the ' + 
                (selectedPackageInfo.value ? selectedPackageInfo.value.name : 'Custom') + 
                ' package. We will get back to you soon.');
          
          // Reset form
          form.reset();
          
          // Reset reactive data
          formData.name = '';
          formData.email = '';
          formData.phone = '';
          formData.projectType = '';
          formData.timeline = '';
          formData.message = '';
          formData.selectedPackage = 'custom';
          formData.privacyAgree = false;
        } else {
          // Error handling
          const data = await response.json();
          throw new Error(data.error || 'Form submission failed');
        }
      } catch (error) {
        alert('Oops! There was a problem submitting your form. Please try again or contact us directly.');
        console.error(error);
      }
    };

    return {
      formData,
      projectOptions,
      packages,
      selectedPackageInfo,
      selectPackage,
      handleSubmit
    };
  }
});
</script>

<style scoped>
/* Additional custom styles */
.dev-quote-request-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  align-items: start;
}

.dev-contact-form {
  backdrop-filter: blur(10px);
  padding: var(--spacing-md);
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.dev-form-title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  color: var(--text-white);
}

.dev-selected-package-summary {
  background: rgba(110, 68, 255, 0.1);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-md);
  border-left: 3px solid var(--primary-color);
}

.dev-selected-package-summary h4 {
  margin: 0;
  color: var(--text-white);
  font-size: 1rem;
}

.dev-selected-package-price {
  margin: 0.3rem 0 0 0;
  color: var(--primary-color);
  font-weight: 600;
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

@media (max-width: 992px) {
  .dev-quote-request-container {
    grid-template-columns: 1fr;
  }
  
  .dev-pricing-packages {
    order: 1;
  }
  
  .dev-contact-form {
    order: 2;
  }
}
</style> 