import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import SearchView from '@/views/SearchView.vue'
import CitizenListView from '@/views/CitizenListView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Início',
      subtitle: 'Bem-vindo ao Cadastro CPF',
      menu: 'inicio',
    },
  },
  {
    path: '/cadastrar',
    name: 'register',
    component: RegisterView,
    meta: {
      title: 'Cadastrar cidadão',
      subtitle: 'Informe os dados do cidadão para cadastro',
      menu: 'cadastrar',
    },
  },
  {
    path: '/consultar',
    name: 'search',
    component: SearchView,
    meta: {
      title: 'Consultar CPF',
      subtitle: 'Busque por nome ou CPF do cidadão',
      menu: 'consultar',
    },
  },
  {
    path: '/citizens',
    name: 'citizen-list',
    component: CitizenListView,
    meta: {
      title: 'Lista de cidadãos',
      subtitle: 'Visualize todos os cidadãos cadastrados',
      menu: 'lista',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} | Cadastro CPF`
    : 'Cadastro CPF'
})

export default router
