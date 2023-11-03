// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
        children: [
          {
            path: '/edit/:bugId',
            name: 'BugEdit',
            component: () => import('@/views/BugEdit.vue'),
          },
          {
            path: '/new',
            name: 'BugNew',
            component: () => import('@/views/BugNew.vue'),
          },
        ]
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
