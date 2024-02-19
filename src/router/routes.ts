// © 2022-2024 Luxembourg Institute of Science and Technology
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
        path: 'media',
        component: () => import('pages/MediaView.vue'),
        name: 'Media',
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
