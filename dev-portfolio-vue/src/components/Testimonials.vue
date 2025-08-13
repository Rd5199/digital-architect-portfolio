<template>
  <section id="testimonials" class="dev-section dev-testimonials">
    <div class="dev-container">
      <h2 class="dev-section-title">What Clients Say</h2>
      <p class="dev-section-subtitle">Hear from businesses and individuals who have trusted me with their projects.</p>
      
      <div class="dev-testimonials-grid">
        <div v-for="testimonial in testimonials" :key="testimonial.id" class="dev-testimonial-card">
          <div class="dev-testimonial-quote">
            {{ testimonial.quote }}
          </div>
          <div class="dev-testimonial-author">
            <div class="dev-testimonial-author-info">
              <h4>{{ testimonial.author }}</h4>
              <p>{{ testimonial.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Testimonials',
  setup() {
    const testimonials = [
      {
        id: 1,
        quote: 'Working with DigitalArchitect was a game-changer for our business. They transformed our outdated website into a modern, high-converting platform that our customers love. Their technical expertise and attention to detail exceeded our expectations.',
        author: 'Sarah Johnson',
        role: 'CEO, InnovateTech Solutions'
      },
      {
        id: 2,
        quote: 'The mobile app developed by DigitalArchitect has significantly improved our customer engagement. Their iterative approach ensured we got exactly what we needed, and their post-launch support has been exceptional.',
        author: 'Michael Chen',
        role: 'Founder, HealthWave'
      },
      {
        id: 3,
        quote: 'We approached DigitalArchitect with a complex e-commerce integration project. They not only delivered on time but also optimized our system in ways we hadn\'t even considered. Truly excellent work.',
        author: 'Emma Rodriguez',
        role: 'CTO, ShopifyPlus Partner'
      }
    ];

    return {
      testimonials
    };
  }
});
</script>

<style scoped>
/* Styles are imported from main.css */
</style> 