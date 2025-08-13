<template>
  <section class="dev-section dev-legal-page">
    <div class="dev-container">
      <h1 class="dev-legal-title">Terms of Service</h1>
      <p class="dev-legal-last-updated">Last Updated: {{ formattedDate }}</p>
      
      <div class="dev-legal-content">
        <section class="dev-legal-section">
          <h2>1. Introduction</h2>
          <p>Welcome to DigitalArchitect. These Terms of Service ("Terms", "Terms of Service") govern your use of our website and services offered by DigitalArchitect ("we," "us," or "our").</p>
          <p>By accessing or using our website and services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access our website or use our services.</p>
        </section>

        <section class="dev-legal-section">
          <h2>2. Services</h2>
          <p>DigitalArchitect offers web development, design, and related digital services as outlined on our website. Our services include, but are not limited to:</p>
          <ul>
            <li>Website design and development</li>
            <li>Web application development</li>
            <li>Mobile application development</li>
            <li>E-commerce solutions</li>
            <li>UI/UX design</li>
            <li>Digital strategy consulting</li>
          </ul>
          <p>We reserve the right to modify, suspend, or discontinue any part of our services at any time without notice.</p>
        </section>

        <section class="dev-legal-section">
          <h2>3. Quotes and Proposals</h2>
          <p>Quotes and proposals provided by DigitalArchitect are valid for 30 days from the date of issue unless otherwise specified. All quotes are based on our understanding of your requirements at the time of submission.</p>
          <p>Any changes to project scope, features, or requirements after a quote has been accepted may result in additional charges and timeline adjustments.</p>
        </section>

        <section class="dev-legal-section">
          <h2>4. Project Timeline and Delivery</h2>
          <p>Project timelines provided are estimates and depend on various factors including client feedback, content delivery, and technical complexity. We will make reasonable efforts to meet agreed deadlines but cannot guarantee specific completion dates unless explicitly stated in a written contract.</p>
          <p>Delays caused by client-side factors, including but not limited to delayed feedback, content provision, or decision-making, may extend project timelines and are not the responsibility of DigitalArchitect.</p>
        </section>

        <section class="dev-legal-section">
          <h2>5. Payment Terms</h2>
          <p>Unless otherwise agreed in writing, our payment terms are as follows:</p>
          <ul>
            <li>50% non-refundable deposit is required to secure your project and commence work</li>
            <li>25% is due at the midpoint of the project</li>
            <li>25% final payment is due before the final deliverables are transferred or published</li>
          </ul>
          <p>Invoices are payable within 14 days of receipt. Late payments may incur additional fees and result in work being suspended until payment is received.</p>
        </section>

        <section class="dev-legal-section">
          <h2>6. Intellectual Property Rights</h2>
          <p><strong>Your Content:</strong> You retain all rights to any content, data, or materials you provide to us for inclusion in your project.</p>
          <p><strong>Our Work:</strong> Until final payment is received in full, DigitalArchitect retains ownership of all designs, code, and other deliverables created during your project. Upon final payment, you will be granted a non-exclusive, perpetual license to use these deliverables for their intended purpose.</p>
          <p><strong>Third-Party Assets:</strong> For any third-party assets used in your project (such as stock photos, plugins, themes, or libraries), rights are subject to the licenses of those assets, which may have separate terms.</p>
        </section>

        <section class="dev-legal-section">
          <h2>7. Client Responsibilities</h2>
          <p>As a client, you are responsible for:</p>
          <ul>
            <li>Providing clear, accurate project requirements</li>
            <li>Supplying content (text, images, videos, etc.) in a timely manner</li>
            <li>Reviewing and providing feedback on deliverables within agreed timeframes</li>
            <li>Ensuring you have the necessary rights to any content or materials you provide</li>
            <li>Testing and approving deliverables before final launch</li>
          </ul>
        </section>

        <section class="dev-legal-section">
          <h2>8. Limitation of Liability</h2>
          <p>DigitalArchitect will not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
          <ul>
            <li>Your use or inability to use our services</li>
            <li>Any content obtained from our services</li>
            <li>Unauthorized access to your account or data</li>
            <li>Statements or conduct of any third party on our services</li>
          </ul>
          <p>Our liability for any claim arising out of these Terms shall be limited to the amount you paid us during the six months prior to such claim.</p>
        </section>

        <section class="dev-legal-section">
          <h2>9. Warranty and Disclaimer</h2>
          <p>DigitalArchitect warrants that the services we provide will be performed in a professional manner consistent with industry standards. This warranty is valid for 30 days following the completion of services.</p>
          <p>EXCEPT FOR THE EXPRESS WARRANTIES SET FORTH ABOVE, OUR SERVICES ARE PROVIDED "AS IS" AND WE EXPRESSLY DISCLAIM ALL OTHER WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
        </section>

        <section class="dev-legal-section">
          <h2>10. Termination</h2>
          <p>Either party may terminate a project with written notice if:</p>
          <ul>
            <li>The other party breaches these Terms and fails to remedy such breach within 14 days</li>
            <li>The other party becomes insolvent, enters into liquidation, or has a receiver appointed</li>
          </ul>
          <p>If you terminate a project after work has commenced, you remain responsible for payment for all work completed and expenses incurred up to the termination date, plus any applicable cancellation fees as outlined in your contract.</p>
        </section>

        <section class="dev-legal-section">
          <h2>11. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the state of [State/Province], without regard to its conflict of law principles.</p>
        </section>

        <section class="dev-legal-section">
          <h2>12. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. If we make changes, we will provide notice by updating the "Last Updated" date at the top of these Terms. Your continued use of our services following the posting of revised Terms means that you accept and agree to the changes.</p>
        </section>

        <section class="dev-legal-section">
          <h2>13. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
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
  name: 'TermsOfService',
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
  line-height: a.6;
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