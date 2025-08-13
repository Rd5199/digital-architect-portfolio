<template>
  <section class="dev-section dev-legal-page">
    <div class="dev-container">
      <h1 class="dev-legal-title">Privacy Policy</h1>
      <p class="dev-legal-last-updated">Last Updated: {{ formattedDate }}</p>
      
      <div class="dev-legal-content">
        <section class="dev-legal-section">
          <h2>1. Introduction</h2>
          <p>Welcome to DigitalArchitect ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
          <p>This privacy policy applies to all information collected through our website, as well as any related services, sales, marketing, or events.</p>
        </section>

        <section class="dev-legal-section">
          <h2>2. Information We Collect</h2>
          <p>We collect several types of information from and about users of our website, including:</p>
          <ul>
            <li><strong>Personal Data:</strong> Name, email address, phone number, and any other information you provide when contacting us or requesting a quote.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, services, and products.</li>
            <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system, and platform.</li>
            <li><strong>Marketing Data:</strong> Your preferences in receiving marketing from us.</li>
          </ul>
        </section>

        <section class="dev-legal-section">
          <h2>3. How We Collect Your Data</h2>
          <p>We use different methods to collect data from and about you including through:</p>
          <ul>
            <li><strong>Direct interactions:</strong> You may give us your identity and contact data by filling in forms or by corresponding with us by post, phone, email, or otherwise.</li>
            <li><strong>Automated technologies or interactions:</strong> As you interact with our website, we may automatically collect technical data about your equipment, browsing actions, and patterns.</li>
            <li><strong>Third parties:</strong> We may receive personal data about you from various third parties such as analytics providers and advertising networks.</li>
          </ul>
        </section>

        <section class="dev-legal-section">
          <h2>4. How We Use Your Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul>
            <li>To register you as a new customer.</li>
            <li>To process and deliver your order or service.</li>
            <li>To manage our relationship with you.</li>
            <li>To improve our website, products/services, marketing, or customer relationships.</li>
            <li>To recommend products or services that may be of interest to you.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section class="dev-legal-section">
          <h2>5. Cookies and Similar Technologies</h2>
          <p>We use cookies and similar tracking technologies to track the activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.</p>
          <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.</p>
        </section>

        <section class="dev-legal-section">
          <h2>6. Data Security</h2>
          <p>We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.</p>
        </section>

        <section class="dev-legal-section">
          <h2>7. Data Retention</h2>
          <p>We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.</p>
        </section>

        <section class="dev-legal-section">
          <h2>8. Your Legal Rights</h2>
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
          <ul>
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>
          <p>If you wish to exercise any of these rights, please contact us using the details provided below.</p>
        </section>

        <section class="dev-legal-section">
          <h2>9. Third-Party Links</h2>
          <p>Our website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.</p>
        </section>

        <section class="dev-legal-section">
          <h2>10. Changes to the Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this page. You are advised to review this Privacy Policy periodically for any changes.</p>
        </section>

        <section class="dev-legal-section">
          <h2>11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>Email: info@digitalarchitect.com</p>
          <p>Address: 123 Web Design Street, Digital City, DC 12345</p>
        </section>
      </div>

      <div class="dev-legal-back">
        <router-link to="/" class="dev-btn dev-btn-outline">Back to Home</router-link>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'PrivacyPolicy',
  setup() {
    const currentDate = new Date();
    const formattedDate = computed(() => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(currentDate);
    });

    return {
      formattedDate
    };
  }
});
</script>

<style scoped>
.dev-legal-page {
  padding-top: 120px;
  min-height: 100vh;
}

.dev-legal-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: var(--spacing-xs);
}

.dev-legal-last-updated {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: var(--spacing-lg);
}

.dev-legal-content {
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  margin-bottom: var(--spacing-lg);
}

.dev-legal-section {
  margin-bottom: var(--spacing-md);
}

.dev-legal-section h2 {
  color: var(--primary-color);
  font-size: 1.5rem;
  margin-bottom: var(--spacing-sm);
}

.dev-legal-section p {
  margin-bottom: var(--spacing-sm);
  line-height: 1.6;
}

.dev-legal-section ul {
  padding-left: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.dev-legal-section li {
  margin-bottom: var(--spacing-xs);
}

.dev-legal-back {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-md);
}
</style> 