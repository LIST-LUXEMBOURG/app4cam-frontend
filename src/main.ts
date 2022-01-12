import { createApp } from 'vue'
import { Notify, Quasar } from 'quasar'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'

import App from './App.vue'
import router from './router/index'
import store from './store/index'

createApp(App)
  .use(Quasar, {
    plugins: {
      Notify,
    },
  })
  .use(router)
  .use(store)
  .mount('#app')
