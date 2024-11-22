import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
import home from '../views/home.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
    },
  ],
})

export default router
