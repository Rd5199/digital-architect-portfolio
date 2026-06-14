<template>
  <section id="faq" class="dev-section dev-section-alt">
    <div class="dev-container">
      <div class="dev-faq-label">
        <span class="dev-faq-dot"></span>
        <span>FAQ's</span>
      </div>
      <h2 class="dev-section-title">Frequently Asked Questions</h2>
      <p class="dev-section-subtitle">for Quick Answers</p>
      
      <div class="dev-faq-container">
        <div 
          v-for="(faq, index) in faqs" 
          :key="faq.id" 
          class="dev-faq-item"
          :class="{ 'active': openIndex === index }"
        >
          <div class="dev-faq-question" @click="toggleFAQ(index)">
            <span class="dev-faq-question-text">{{ faq.question }}</span>
            <button 
              class="dev-faq-toggle"
              :aria-expanded="openIndex === index"
              :aria-label="openIndex === index ? 'Close answer' : 'Open answer'"
            >
              <span class="dev-faq-toggle-mark">{{ openIndex === index ? '−' : '+' }}</span>
            </button>
            </div>
          <transition name="faq-answer">
            <div v-if="openIndex === index" class="dev-faq-answer">
              <p>{{ faq.answer }}</p>
          </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'FAQ',
  setup() {
    const openIndex = ref<number | null>(null);

    const faqs = [
      {
        id: 1,
        question: 'How long does it take to build a custom web application?',
        answer: 'The timeline varies based on project complexity and requirements. A basic website typically takes 1-2 weeks, while a full-featured web application can take 4-12 weeks. We provide detailed timelines during the discovery phase and keep you updated throughout the development process.'
      },
      {
        id: 2,
        question: "What's included in your development process?",
        answer: 'Our comprehensive process includes discovery & analysis, design & prototyping, development & coding, testing & QA, deployment & launch, and ongoing support. We ensure quality at every stage and maintain transparent communication throughout the project lifecycle.'
      },
      {
        id: 3,
        question: 'Do you provide ongoing support after launch?',
        answer: 'Yes, we offer continued maintenance, updates, and future enhancements as your needs grow. Our support packages include bug fixes, security updates, performance optimization, and feature additions to help your digital solution evolve with your business.'
      },
      {
        id: 4,
        question: 'What technologies do you work with?',
        answer: 'We work with modern technologies across the stack: Frontend (Vue.js, React, Angular), Backend (Node.js, Python, PHP), Mobile (React Native, Swift, Kotlin, Flutter), and Cloud services (AWS, Firebase, Supabase, Docker). We choose the best technology stack based on your specific project requirements.'
      }
    ];

    const toggleFAQ = (index: number) => {
      if (openIndex.value === index) {
        openIndex.value = null;
      } else {
        openIndex.value = index;
      }
    };

    return {
      faqs,
      openIndex,
      toggleFAQ
    };
  }
});
</script>

<style scoped>
/* FAQ Label */
.dev-faq-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--primary-color);
  font-weight: 500;
}

.dev-faq-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color);
  display: inline-block;
  box-shadow: 0 0 10px var(--primary-color);
}

/* FAQ Container */
.dev-faq-container {
  max-width: 800px;
  margin: var(--spacing-lg) auto 0;
}

/* FAQ Item */
.dev-faq-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.dev-faq-item:first-child {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.dev-faq-item:hover {
  background: rgba(110, 68, 255, 0.02);
}

/* FAQ Question */
.dev-faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  cursor: pointer;
  user-select: none;
}

.dev-faq-question-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-white);
  flex: 1;
  padding-right: var(--spacing-md);
  line-height: 1.5;
}

/* Toggle Button */
.dev-faq-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  border: none;
  color: var(--text-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(110, 68, 255, 0.3);
}

.dev-faq-toggle-mark {
  font-size: 1.25rem;
  font-weight: 300;
  line-height: 1;
  font-family: 'Inter', sans-serif;
}

.dev-faq-toggle:hover {
  background: var(--primary-light);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(110, 68, 255, 0.4);
}

.dev-faq-toggle:active {
  transform: scale(0.95);
}

/* FAQ Answer */
.dev-faq-answer {
  padding: 0 0 var(--spacing-md) 0;
  overflow: hidden;
}

.dev-faq-answer p {
  color: var(--text-muted);
  line-height: 1.8;
  font-size: 1rem;
  margin: 0;
  padding-top: var(--spacing-sm);
}

/* Transition Animations */
.faq-answer-enter-active {
  transition: all 0.3s ease;
  max-height: 500px;
}

.faq-answer-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
}

.faq-answer-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.faq-answer-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.faq-answer-enter-to,
.faq-answer-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
  .dev-faq-question-text {
    font-size: 1rem;
    padding-right: var(--spacing-sm);
  }
  
  .dev-faq-toggle {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
  }
  
  .dev-faq-item {
    padding: var(--spacing-sm);
  }
  
  .dev-faq-question {
    padding: var(--spacing-xs) 0;
    min-height: 44px;
    display: flex;
    align-items: center;
  }
  
  .dev-faq-answer p {
    font-size: 0.95rem;
  }
}
</style> 