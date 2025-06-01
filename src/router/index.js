import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/LoginForm.vue'
import ChargerList from '@/views/ChargerList.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import Register_Form from '@/views/Register_Form.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HelloWorld
  },
   {
    path: '/login',
    name: 'login',
    component: Login
   },
   {
    path: '/register',
    name: 'RegisterFormView',
    component: Register_Form
   },
  {
    path: '/chargers',
    name: 'ChargerList',  
    component: ChargerList
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router



