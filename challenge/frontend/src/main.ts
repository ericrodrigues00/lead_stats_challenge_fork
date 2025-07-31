import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import { VueQueryPlugin } from '@tanstack/vue-query'

// PrimeVue styles
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// Tailwind CSS
import './style.css'

import App from './App.vue'

const app = createApp(App)

// Plugins
app.use(createPinia())
app.use(PrimeVue)
app.use(ConfirmationService)
app.use(VueQueryPlugin)

app.mount('#app')
