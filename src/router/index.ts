import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import Shots from '../views/Shots.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
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
