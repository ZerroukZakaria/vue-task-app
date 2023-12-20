import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import TaskList from './components/TaskList'
import './assets/tailwind.css'


const app = createApp(App)


app.component('TaskList', TaskList)

app.use(router)

app.mount('#app')

