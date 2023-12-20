<template>
    <div class="flex items-center justify-center h-screen">

      <form @submit.prevent="login" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input v-model="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email">
          <p v-if="!isEmailValid" class="text-orange-300 text-xs italic">*Email is not valid.</p>
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Password
          </label>
          <input v-model="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************">
          <p v-if="!isPasswordValid" class="text-orange-300 text-xs italic">*Password is not valid.</p>
          <p v-if="error.message" class="text-red-500 text-xs italic">{{ error.message }}</p>
          <p v-if="successMessage" class="text-green-500 text-xs italic">{{ successMessage }}</p>


        </div>

        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Log in
          </button>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" @click="navigateToLogin">
            Register
          </button>
        </div>
      </form>
    </div>
  </template>

<script>
import axios from 'axios';
import { apiUrl } from '../../utils/utils.js';
import { ref, computed, reactive, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

export default {

    methods: {
        // navigate to the registration page
        navigateToLogin() {
            this.$router.push({name: 'register'})
        }
    },
    setup () {

        const router = useRouter()
        const email = ref('')
        const password = ref('')

        const successMessage = ref('')
        const error = reactive({ message: ''})

        const isEmailValid = computed(() => /\S+@\S+\.\S+/.test(email.value));
        const isPasswordValid = computed(() => password.value.length >= 6);

        let navigateTo = ref(null);

        
       // handle login 
       const login = async () => {
        if (!isEmailValid.value || !isPasswordValid.value) {
        return;
      }        
        try {
            const response = await axios.post(`${apiUrl}/login`, {
                email: email.value,
                password: password.value
            })

            localStorage.setItem('token', response.data.token)

            successMessage.value = 'You have successfully logged in.'
            console.log(successMessage.value);

            setTimeout(() => {
              navigateTo.value = {name: 'taskList'};
               }, 2000)            

        }
        catch(err) {
          if (err.response && err.response.status === 401) {
              error.message = 'Wrong credentials. Please try again.';
            }
          else {
            console.error(err)

          }      
        }

       }


       // Watch for changes in navigateTo and navigate when it changes
       watchEffect(() => {
        if (navigateTo.value) {
           router.push(navigateTo.value);
        }
      })

        return {email,password,login,isEmailValid,isPasswordValid,error, successMessage}
    }
}
</script>

