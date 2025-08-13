<template>
  <div class="home">
    <Hero />
    <About />
    <Services />
    <Process />
    <Portfolio />
    <TechStack />
    <Testimonials />
    <Contact />
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Hero from './Hero.vue';
import About from './About.vue';
import Services from './Services.vue';
import Process from './Process.vue';
import Portfolio from './Portfolio.vue';
import TechStack from './TechStack.vue';
import Testimonials from './Testimonials.vue';
import Contact from './Contact.vue';
import Footer from './Footer.vue';

export default defineComponent({
  name: 'Home',
  components: {
    Hero,
    About,
    Services,
    Process,
    Portfolio,
    TechStack,
    Testimonials,
    Contact,
    Footer
  }
});
</script>

<style scoped>
.home {
  width: 100%;
}
</style> 