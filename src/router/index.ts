import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import SettingsView from '../views/SettingsView.vue'
import ShotsView from '../views/ShotsView.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
  },
  {
    path: '/shots',
    name: 'Shots',
    component: ShotsView,
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
