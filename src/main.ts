import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import AnimationManager from './utils/AnimationManager'

// Initialize the animation manager globally
AnimationManager.start()
console.log('Animation manager started globally in main.ts')

const app = createApp(App)

app.use(router)
app.mount('#app')

// Add global styles to ensure cursor is always hidden
document.addEventListener('DOMContentLoaded', () => {
  // Force cursor to none on document and html
  // Temporarily disabled for debugging button issues
  // document.documentElement.style.cursor = 'none'
  // document.body.style.cursor = 'none'
  
  console.log('Global cursor styles disabled for debugging')
}) 