import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import Settings from '../views/Settings.vue'
import Shots from '../views/Shots.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/shots',
    name: 'Shots',
    component: Shots,
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
