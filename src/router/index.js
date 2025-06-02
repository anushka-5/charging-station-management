import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginForm.vue';
import ChargerList from '@/views/ChargerList.vue';
import HelloWorld from '@/components/HelloWorld.vue';
import RegisterForm from '@/views/Register_Form.vue';
import MapView from '@/views/MapView.vue';

const routes = [
  { path: '/', name: 'home', component: HelloWorld },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'RegisterForm', component: RegisterForm },
  { path: '/chargers', name: 'ChargerList', component: ChargerList },
  { path: '/map', name: 'MapView', component: MapView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
