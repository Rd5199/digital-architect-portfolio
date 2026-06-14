<template>
  <div class="creator-form-wrap" :class="{ 'creator-form-wrap--elevated': variant === 'elevated' }">
    <p v-if="showIntro" class="creator-form-intro">
      Drop your handle and platform. We’ll look at your audience and reply with scope, timeline,
      and pricing — usually within 3–5 business days.
    </p>

    <div v-if="isSubmitting" class="creator-form-status">
      <div class="creator-spinner"></div>
      <p>Sending your application...</p>
    </div>

    <div v-else-if="submitStatus === 'success'" class="creator-form-status creator-form-status--success">
      <p class="creator-status-kicker">Received</p>
      <h3>Application sent.</h3>
      <p>
        We’ll review {{ submittedHandle || 'your profile' }} and reply with next steps.
        Check your inbox (and spam) within a few days.
      </p>
    </div>

    <div v-else-if="submitStatus === 'error'" class="creator-form-status creator-form-status--error">
      <h3>Something went wrong</h3>
      <p>{{ errorMessage || 'Please try again in a moment.' }}</p>
      <button type="button" class="creator-submit" @click="resetForm">Try again</button>
    </div>

    <form
      v-else
      id="creator-contact-form"
      class="creator-form"
      action="https://api.web3forms.com/submit"
      method="POST"
      @submit.prevent="handleSubmit"
    >
      <input type="hidden" name="access_key" value="b4e46767-36a0-4855-94f9-7b006ace25ed">
      <input type="hidden" name="subject" :value="emailSubject">
      <input type="hidden" name="from_name" value="Creator Application Form">
      <input type="hidden" name="audience_type" value="creator">

      <p class="creator-form-section-label">Creator application</p>

      <div class="creator-field">
        <label for="creator-handle">Your handle</label>
        <input
          id="creator-handle"
          name="handle"
          v-model="formData.handle"
          type="text"
          placeholder="@yourusername"
          required
          autocomplete="username"
        >
      </div>

      <div class="creator-field">
        <label id="creator-platform-label">Platform</label>
        <div
          ref="platformSelectRef"
          class="creator-select"
          :class="{ 'is-open': platformOpen }"
        >
          <input type="hidden" name="platform" :value="formData.platform" required>
          <button
            type="button"
            id="creator-platform"
            class="creator-select-trigger"
            :class="{ 'is-placeholder': !formData.platform }"
            aria-haspopup="listbox"
            :aria-expanded="platformOpen"
            aria-labelledby="creator-platform-label"
            @click="togglePlatformMenu"
          >
            <span>{{ selectedPlatformLabel }}</span>
            <span class="creator-select-chevron" aria-hidden="true"></span>
          </button>
          <ul
            v-show="platformOpen"
            class="creator-select-menu"
            role="listbox"
            aria-labelledby="creator-platform-label"
          >
            <li
              v-for="option in platformOptions"
              :key="option.value"
              role="option"
              :class="{ 'is-selected': formData.platform === option.value }"
              :aria-selected="formData.platform === option.value"
              @click="selectPlatform(option.value)"
            >
              {{ option.label }}
            </li>
          </ul>
        </div>
      </div>

      <div class="creator-field">
        <label for="creator-name">Your name</label>
        <input
          id="creator-name"
          name="name"
          v-model="formData.name"
          type="text"
          placeholder="How should we address you?"
          required
          autocomplete="name"
        >
      </div>

      <div class="creator-field">
        <label for="creator-email">Email</label>
        <input
          id="creator-email"
          name="email"
          v-model="formData.email"
          type="email"
          placeholder="you@email.com"
          required
          autocomplete="email"
        >
      </div>

      <label class="creator-checkbox">
        <input v-model="formData.privacyAgree" type="checkbox" required>
        <span>
          I agree to the
          <router-link to="/privacy-policy" class="creator-link-inline">Privacy Policy</router-link>
          and
          <router-link to="/terms-of-service" class="creator-link-inline">Terms of Service</router-link>
        </span>
      </label>

      <button type="submit" class="creator-submit" :disabled="isSubmitting">
        Submit application
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue';

export default defineComponent({
  name: 'CreatorContactForm',
  props: {
    showIntro: {
      type: Boolean,
      default: true
    },
    variant: {
      type: String as () => 'default' | 'elevated',
      default: 'default'
    }
  },
  setup() {
    const isSubmitting = ref(false);
    const submitStatus = ref<'idle' | 'success' | 'error'>('idle');
    const errorMessage = ref('');
    const submittedHandle = ref('');
    const platformOpen = ref(false);
    const platformSelectRef = ref<HTMLElement | null>(null);

    const formData = reactive({
      handle: '',
      platform: '',
      name: '',
      email: '',
      privacyAgree: false
    });

    const platformOptions = [
      { value: 'instagram', label: 'Instagram' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'youtube', label: 'YouTube' },
      { value: 'twitch', label: 'Twitch' },
      { value: 'podcast', label: 'Podcast' },
      { value: 'newsletter', label: 'Newsletter / email list' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'multi', label: 'Multiple platforms' },
      { value: 'other', label: 'Other' }
    ];

    const platformLabels: Record<string, string> = {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      twitch: 'Twitch',
      podcast: 'Podcast',
      newsletter: 'Newsletter / email list',
      linkedin: 'LinkedIn',
      multi: 'Multiple platforms',
      other: 'Other'
    };

    const selectedPlatformLabel = computed(() => {
      if (!formData.platform) return 'Choose one';
      return platformLabels[formData.platform] || formData.platform;
    });

    const togglePlatformMenu = () => {
      platformOpen.value = !platformOpen.value;
    };

    const selectPlatform = (value: string) => {
      formData.platform = value;
      platformOpen.value = false;
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        platformOpen.value &&
        platformSelectRef.value &&
        !platformSelectRef.value.contains(event.target as Node)
      ) {
        platformOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleOutsideClick);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleOutsideClick);
    });

    const emailSubject = computed(() => {
      const handle = formData.handle.trim() || 'New creator';
      const platform = platformLabels[formData.platform] || 'unknown platform';
      return `Creator application: ${handle} on ${platform}`;
    });

    const handleSubmit = async (e: Event) => {
      isSubmitting.value = true;
      submitStatus.value = 'idle';
      errorMessage.value = '';

      try {
        const form = e.target as HTMLFormElement;
        const payload = new FormData(form);

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: payload
        });

        const data = await response.json();

        if (response.ok && data.success) {
          submittedHandle.value = formData.handle.trim();
          submitStatus.value = 'success';
          formData.handle = '';
          formData.platform = '';
          formData.name = '';
          formData.email = '';
          formData.privacyAgree = false;
        } else {
          errorMessage.value = data.message || 'Form submission failed. Please try again.';
          submitStatus.value = 'error';
        }
      } catch (error) {
        errorMessage.value = 'Network error. Please check your connection and try again.';
        submitStatus.value = 'error';
        console.error('Creator form submission error:', error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const resetForm = () => {
      submitStatus.value = 'idle';
      errorMessage.value = '';
    };

    return {
      formData,
      emailSubject,
      submittedHandle,
      platformOpen,
      platformSelectRef,
      platformOptions,
      selectedPlatformLabel,
      togglePlatformMenu,
      selectPlatform,
      isSubmitting,
      submitStatus,
      errorMessage,
      handleSubmit,
      resetForm
    };
  }
});
</script>

<style scoped>
.creator-form-wrap {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 1.5rem 1.35rem 1.65rem;
  border-radius: 0.75rem;
  background: rgba(4, 4, 4, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-family: 'Anton', 'Poppins', sans-serif;
  font-weight: 400;
  letter-spacing: 0.015em;
  box-sizing: border-box;
}

.creator-form-wrap--elevated {
  max-width: 480px;
  padding: 1.65rem 1.5rem 1.75rem;
  background: rgba(22, 22, 22, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow:
    0 28px 56px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
}

.creator-form-wrap--elevated .creator-form-section-label {
  color: rgba(255, 255, 255, 0.52);
}

.creator-form-wrap--elevated .creator-field label {
  color: rgba(255, 255, 255, 0.95);
}

.creator-form-wrap--elevated .creator-field input,
.creator-form-wrap--elevated .creator-select-trigger {
  border-bottom-color: rgba(255, 255, 255, 0.32);
}

.creator-form-wrap--elevated .creator-checkbox {
  color: rgba(255, 255, 255, 0.68);
}

.creator-form-intro {
  margin: 0 0 1.35rem;
  color: rgba(255, 255, 255, 0.58);
  font-size: clamp(0.92rem, 1.15vw, 1rem);
  line-height: 1.5;
  text-transform: none;
}

.creator-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.creator-form-section-label {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.38);
}

.creator-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.creator-field label {
  font-size: clamp(0.92rem, 1.15vw, 1.02rem);
  letter-spacing: 0.02em;
  text-transform: none;
  color: rgba(255, 255, 255, 0.88);
}

.creator-field input {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  background: transparent;
  color: rgba(255, 255, 255, 0.92);
  padding: 0.6rem 0;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.5;
  transition: border-color 0.2s ease;
}

.creator-field input:focus {
  outline: none;
  border-bottom-color: rgba(255, 255, 255, 0.55);
}

.creator-select {
  position: relative;
}

.creator-select-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  background: transparent;
  color: rgba(255, 255, 255, 0.92);
  font-family: inherit;
  font-size: 16px;
  line-height: 1.5;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s ease;
}

.creator-select-trigger.is-placeholder {
  color: rgba(255, 255, 255, 0.28);
}

.creator-select.is-open .creator-select-trigger,
.creator-select-trigger:focus-visible {
  outline: none;
  border-bottom-color: rgba(255, 255, 255, 0.55);
}

.creator-select-trigger span:first-child {
  flex: 1;
  text-transform: none;
}

.creator-select-chevron {
  width: 7px;
  height: 7px;
  border-right: 1.5px solid rgba(255, 255, 255, 0.45);
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.45);
  transform: rotate(45deg) translateY(-2px);
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.creator-select.is-open .creator-select-chevron {
  transform: rotate(-135deg) translateY(2px);
}

.creator-select-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 30;
  margin: 0;
  padding: 0.4rem 0;
  list-style: none;
  background: #0a0a0a;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.55rem;
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.55);
  max-height: min(280px, 50vh);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.creator-select-menu li {
  padding: 0.7rem 0.9rem;
  font-size: 16px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
  text-transform: none;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.creator-select-menu li:hover,
.creator-select-menu li.is-selected {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.creator-field input::placeholder {
  color: rgba(255, 255, 255, 0.28);
}

.creator-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  color: rgba(255, 255, 255, 0.55);
  font-size: clamp(0.82rem, 1vw, 0.92rem);
  line-height: 1.45;
  text-transform: none;
  cursor: pointer;
}

.creator-checkbox input {
  margin-top: 0.2rem;
}

.creator-link-inline {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.creator-submit {
  width: 100%;
  margin-top: 0.15rem;
  padding: 0.9rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: var(--border-radius-pill, 9999px);
  background: rgba(255, 255, 255, 0.96);
  color: #111;
  font-family: inherit;
  font-size: clamp(0.95rem, 1.2vw, 1.05rem);
  text-transform: none;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.creator-submit:hover:not(:disabled) {
  transform: translateY(-1px);
}

.creator-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.creator-form-status {
  text-align: center;
  padding: 2rem 0.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.creator-form-status h3 {
  color: rgba(255, 255, 255, 0.95);
  font-size: clamp(1.15rem, 2vw, 1.35rem);
  text-transform: none;
  margin: 0.35rem 0 0.65rem;
}

.creator-form-status p {
  text-transform: none;
  line-height: 1.5;
  max-width: 24rem;
  margin: 0 auto;
  font-size: 0.95rem;
}

.creator-status-kicker {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}

.creator-spinner {
  width: 28px;
  height: 28px;
  margin: 0 auto 1rem;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-top-color: rgba(255, 255, 255, 0.75);
  border-radius: 50%;
  animation: creator-spin 0.8s linear infinite;
}

@keyframes creator-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .creator-form-wrap {
    max-width: none;
    padding: 1.1rem 0.9rem 1.25rem;
    border-radius: 0.5rem;
  }

  .creator-form {
    gap: 0.95rem;
  }

  .creator-checkbox {
    font-size: 0.8rem;
  }

  .creator-submit {
    padding: 0.85rem 1.25rem;
  }
}
</style>
