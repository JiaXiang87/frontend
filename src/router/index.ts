import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../components/Dashboard.vue';
import { Components } from 'ant-design-vue/es/date-picker/generatePicker';

const routes = [
  {
    path: '/',
    component: DashboardView,
    children: [
      {
        path: '/oldpersons',
        name: 'oldpersons',
        component: () => import('../views/relative/Oldperson.vue'),
      },
      {
        path: '/employees',
        name: 'employees',
        component: () => import('../views/relative/Employees.vue'),
      },
      {
        path: '/volunteers',
        name: 'volunteers',
        component: () => import('../views/relative/Volunteers.vue'),
      },
      {
        path: '/monitors',
        name: 'monitors',
        component: () => import('../views/MonitorView.vue'),
      },
      {
        path: '/events',
        name: 'events',
        component: () => import('../views/event/EventView.vue'),
      },
      {
        path: '/aiChat',
        name: 'aiChat',
        component: () => import('../views/AIChatView.vue'),
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
