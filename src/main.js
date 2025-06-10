import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './css/global.css'
import './scss/global.scss'
import './scss/index.scss'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.mount('#app')
