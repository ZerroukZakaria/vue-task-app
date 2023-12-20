<template>
  <div class="flex items-center justify-center min-h-screen mt-12">
    <div class="flex flex-col items-center">
      <h1 class="text-3xl font-bold mb-6 text-blue-600">Welcome User! Ready to see Your Tasks?</h1>
      <login-view/>
      <!-- <button class="mt-6 p-2 w-full sm:w-auto bg-blue-500 text-white rounded-md hover:bg-blue-600" @click="navigateToTaskList">Go to my Tasks</button> -->
    </div>
  </div>
</template>

<script>
import LoginView from './LoginView.vue'
export default {
  name: 'HomeView',
  components: {
    LoginView
    
  },
  methods: {
    navigateToTaskList() {
      this.$router.push({name: 'taskList'})
    }
  },

  setup() {
  }
}
</script>
