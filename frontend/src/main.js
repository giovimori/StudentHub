import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // Attiva Pinia
app.use(router)      // Attiva il Router

app.mount('#app')