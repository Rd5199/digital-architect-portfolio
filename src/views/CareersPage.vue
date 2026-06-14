<template>
  <div class="careers-page">
    <div class="grain-layer careers-page__grain" aria-hidden="true" />

    <main class="careers-page__main">
      <div class="dev-container careers-page__inner">
        <header class="careers-hero">
          <p class="careers-hero__kicker">Careers</p>
          <h1 class="careers-hero__title">Build with us</h1>
          <p class="careers-hero__lead">
            We’re a small studio shipping custom AI, web, and mobile products for businesses and
            creators. No open reqs on a board — tell us who you are and what you’d bring to the
            team. We review every general application.
          </p>
        </header>

        <div class="careers-grid">
          <aside class="careers-aside">
            <h2 class="careers-aside__title">What we look for</h2>
            <ul class="careers-aside__list">
              <li>Clear thinking and ownership — you finish what you start.</li>
              <li>Comfort with modern web/mobile stacks and AI tooling.</li>
              <li>Strong communication with clients and teammates.</li>
              <li>Bias for shipping: prototypes, polish, and iteration.</li>
            </ul>
            <p class="careers-aside__note">
              Remote-first · Global candidates welcome · Contract and full-time depending on fit.
            </p>
          </aside>

          <section class="careers-form-panel" aria-labelledby="careers-form-title">
            <h2 id="careers-form-title" class="careers-form-panel__title">General application</h2>
            <p class="careers-form-panel__subtitle">
              Share a bit about yourself. We’ll reach out if there’s a fit.
            </p>

            <div v-if="isSubmitting" class="careers-status careers-status--loading">
              <div class="careers-spinner" aria-hidden="true" />
              <p>Sending your application…</p>
            </div>

            <div v-else-if="submitStatus === 'success'" class="careers-status careers-status--success">
              <h3>Application received</h3>
              <p>
                Thanks for applying. We review submissions regularly and will contact you if we’d
                like to move forward.
              </p>
              <router-link to="/" class="careers-back-link">Back to home</router-link>
            </div>

            <div v-else-if="submitStatus === 'error'" class="careers-status careers-status--error">
              <h3>Something went wrong</h3>
              <p>{{ errorMessage || 'Please try again in a moment.' }}</p>
              <button type="button" class="careers-submit" @click="resetForm">Try again</button>
            </div>

            <form
              v-else
              id="careers-form"
              class="careers-form"
              @submit.prevent="handleSubmit"
            >
              <input type="hidden" name="access_key" value="b4e46767-36a0-4855-94f9-7b006ace25ed" />
              <input type="hidden" name="subject" value="New Careers — General Application" />
              <input type="hidden" name="from_name" value="Careers Page" />

              <div class="careers-form__row">
                <div class="dev-form-group">
                  <label for="careers-name">Full name</label>
                  <input
                    id="careers-name"
                    name="name"
                    type="text"
                    v-model="formData.name"
                    class="careers-input"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div class="dev-form-group">
                  <label for="careers-email">Email</label>
                  <input
                    id="careers-email"
                    name="email"
                    type="email"
                    v-model="formData.email"
                    class="careers-input"
                    placeholder="you@email.com"
                    required
                  />
                </div>
              </div>

              <div class="careers-form__row">
                <div class="dev-form-group">
                  <label for="careers-phone">Phone <span class="careers-optional">(optional)</span></label>
                  <input
                    id="careers-phone"
                    name="phone"
                    type="tel"
                    v-model="formData.phone"
                    class="careers-input"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div class="dev-form-group">
                  <label for="careers-location">Location <span class="careers-optional">(optional)</span></label>
                  <input
                    id="careers-location"
                    name="location"
                    type="text"
                    v-model="formData.location"
                    class="careers-input"
                    placeholder="City, country or timezone"
                  />
                </div>
              </div>

              <div class="dev-form-group">
                <label for="careers-role">Area of interest</label>
                <select
                  id="careers-role"
                  name="role_interest"
                  v-model="formData.roleInterest"
                  class="careers-input"
                  required
                >
                  <option value="">Select an area</option>
                  <option v-for="role in roleOptions" :key="role.value" :value="role.value">
                    {{ role.label }}
                  </option>
                </select>
              </div>

              <div class="dev-form-group">
                <label for="careers-portfolio">
                  Portfolio or LinkedIn <span class="careers-optional">(optional)</span>
                </label>
                <input
                  id="careers-portfolio"
                  name="portfolio_url"
                  type="url"
                  v-model="formData.portfolioUrl"
                  class="careers-input"
                  placeholder="https://linkedin.com/in/you or your portfolio"
                />
              </div>

              <div class="dev-form-group">
                <label for="careers-message">Why My Digital Architect?</label>
                <textarea
                  id="careers-message"
                  name="message"
                  v-model="formData.message"
                  class="careers-input careers-input--textarea"
                  placeholder="Tell us about your experience, what you want to work on, and links to work we should see…"
                  required
                />
              </div>

              <div class="careers-privacy">
                <input
                  id="careers-privacy"
                  type="checkbox"
                  v-model="formData.privacyAgree"
                  required
                />
                <label for="careers-privacy">
                  I agree to the
                  <router-link to="/privacy-policy" class="careers-link">Privacy Policy</router-link>
                  and
                  <router-link to="/terms-of-service" class="careers-link">Terms of Service</router-link>.
                </label>
              </div>

              <button type="submit" class="careers-submit" :disabled="isSubmitting">
                Submit application
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import Footer from '../components/Footer.vue';

const WEB3FORMS_KEY = 'b4e46767-36a0-4855-94f9-7b006ace25ed';

export default defineComponent({
  name: 'CareersPage',
  components: { Footer },
  setup() {
    const isSubmitting = ref(false);
    const submitStatus = ref<'idle' | 'success' | 'error'>('idle');
    const errorMessage = ref('');

    const formData = reactive({
      name: '',
      email: '',
      phone: '',
      location: '',
      roleInterest: '',
      portfolioUrl: '',
      message: '',
      privacyAgree: false,
    });

    const roleOptions = [
      { value: 'engineering', label: 'Software engineering' },
      { value: 'design', label: 'Product / UI design' },
      { value: 'ai', label: 'AI / automation' },
      { value: 'operations', label: 'Operations & delivery' },
      { value: 'client-success', label: 'Client success' },
      { value: 'general', label: 'General / open application' },
    ];

    const handleSubmit = async (e: Event) => {
      isSubmitting.value = true;
      submitStatus.value = 'idle';
      errorMessage.value = '';

      try {
        const form = e.target as HTMLFormElement;
        const fd = new FormData(form);
        fd.set('access_key', WEB3FORMS_KEY);

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: fd,
        });
        const data = await response.json();

        if (response.ok && data.success) {
          submitStatus.value = 'success';
          formData.name = '';
          formData.email = '';
          formData.phone = '';
          formData.location = '';
          formData.roleInterest = '';
          formData.portfolioUrl = '';
          formData.message = '';
          formData.privacyAgree = false;
        } else {
          errorMessage.value = data.message || 'Submission failed. Please try again.';
          submitStatus.value = 'error';
        }
      } catch {
        errorMessage.value = 'Network error. Please check your connection and try again.';
        submitStatus.value = 'error';
      } finally {
        isSubmitting.value = false;
      }
    };

    const resetForm = () => {
      submitStatus.value = 'idle';
      errorMessage.value = '';
    };

    return {
      isSubmitting,
      submitStatus,
      errorMessage,
      formData,
      roleOptions,
      handleSubmit,
      resetForm,
    };
  },
});
</script>

<style scoped>
.careers-page {
  position: relative;
  min-height: 100vh;
  background: var(--editorial-surface, #070707);
  color: rgba(255, 255, 255, 0.92);
  font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  isolation: isolate;
}

.careers-page__grain {
  z-index: 0;
}

.careers-page__main {
  position: relative;
  z-index: 1;
  padding: calc(var(--site-header-offset, 4.75rem) + 2.5rem) 0 4rem;
}

.careers-page__inner {
  max-width: 1080px;
}

.careers-hero {
  max-width: 42rem;
  margin-bottom: clamp(2.5rem, 5vw, 3.5rem);
}

.careers-hero__kicker {
  margin: 0 0 0.75rem;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.38);
}

.careers-hero__title {
  margin: 0 0 1rem;
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: rgba(255, 255, 255, 0.96);
}

.careers-hero__lead {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.58);
}

.careers-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(2rem, 4vw, 3.5rem);
  align-items: start;
}

.careers-aside__title {
  margin: 0 0 1rem;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.34);
}

.careers-aside__list {
  margin: 0 0 1.25rem;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.careers-aside__list li {
  font-size: 0.95rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
  padding-left: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
}

.careers-aside__note {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.38);
}

.careers-form-panel {
  padding: clamp(1.5rem, 3vw, 2rem);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}

.careers-form-panel__title {
  margin: 0 0 0.35rem;
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.careers-form-panel__subtitle {
  margin: 0 0 1.5rem;
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.48);
}

.careers-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.careers-optional {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.35);
}

.careers-input {
  width: 100%;
  padding: 0.85rem 1rem;
  font-family: inherit;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.careers-input:focus {
  border-color: rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.06);
}

.careers-input::placeholder {
  color: rgba(255, 255, 255, 0.32);
}

.careers-input--textarea {
  min-height: 140px;
  resize: vertical;
}

.careers-privacy {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  margin: 1rem 0 1.25rem;
  font-size: 0.82rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.48);
}

.careers-privacy input {
  margin-top: 0.2rem;
  flex-shrink: 0;
}

.careers-link {
  color: rgba(255, 255, 255, 0.78);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.careers-link:hover {
  color: #fff;
}

.careers-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem 1.5rem;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #0a0a0a;
  background: rgba(255, 255, 255, 0.94);
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease;
}

.careers-submit:hover:not(:disabled) {
  opacity: 0.92;
}

.careers-submit:active:not(:disabled) {
  transform: scale(0.98);
}

.careers-submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.careers-status {
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.careers-status h3 {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
}

.careers-status p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.62);
}

.careers-status--loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.careers-status--success {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.28);
}

.careers-status--error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.28);
}

.careers-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-top-color: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  animation: careers-spin 0.8s linear infinite;
}

@keyframes careers-spin {
  to {
    transform: rotate(360deg);
  }
}

.careers-back-link {
  display: inline-block;
  margin-top: 1rem;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.78);
  text-decoration: underline;
}

.careers-page :deep(.site-footer) {
  margin-top: 0;
}

@media (max-width: 900px) {
  .careers-grid {
    grid-template-columns: 1fr;
  }

  .careers-form__row {
    grid-template-columns: 1fr;
  }
}
</style>
