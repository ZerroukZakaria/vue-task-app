import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TaskList from '../components/TaskList.vue'
import TaskDetails from '../components/TaskDetails.vue'
import TaskCreate from '../components/TaskCreate.vue'
import TaskEdit from '../components/TaskEdit.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path: '/login',
    name: 'login',
    component: LoginView
  },

  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },

  {
    path: '/tasks',
    name: 'taskList',
    component: TaskList
  },

  {
    path: '/tasks/:id',
    name: 'taskDetails',
    component: TaskDetails,
    props: true
  },

  {
    path: '/tasks/create',
    name: 'taskCreate',
    component: TaskCreate,
  
  },

  {
    path: '/tasks/edit/:id',
    name: 'taskEdit',
    component: TaskEdit,
  
  }

  
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
