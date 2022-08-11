import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/DashboardView.vue'),
        name: 'Dashboard',
      },
      {
        path: 'settings',
        component: () => import('pages/SettingsView.vue'),
        name: 'Settings',
      },
      {
        path: 'shots',
        component: () => import('pages/ShotsView.vue'),
        name: 'Shots',
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
