import { createApp } from 'vue'
import { LoadingBar, Notify, Quasar } from 'quasar'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'

import App from './App.vue'
import router from './router/index'

createApp(App)
  .use(Quasar, {
    config: {
      loadingBar: {
        color: 'amber',
        size: '7px',
      },
    },
    plugins: {
      LoadingBar,
      Notify,
    },
  })
  .use(router)
  .use(createPinia())
  .use(VueApexCharts)
  .mount('#app')
