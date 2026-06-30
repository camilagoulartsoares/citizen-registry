import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CitizenListView from '@/views/CitizenListView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Início' },
  },
  {
    path: '/citizens',
    name: 'citizen-list',
    component: CitizenListView,
    meta: { title: 'Lista de Cidadãos' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} | Cadastro de Cidadãos`
    : 'Cadastro de Cidadãos'
})

export default router
