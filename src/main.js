import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import { setupFirebaseBridge } from './composables/useFirebase.js'

setupFirebaseBridge()
createApp(App).mount('#app')
