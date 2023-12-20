<template>
    <div class="flex items-center justify-center h-screen">
      <form @submit.prevent="register" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            Name
          </label>
          <input v-model="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name">
          <p v-if="!isNameValid" class="text-orange-300 text-xs italic">*Name is not valid.</p>
        </div>
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
        </div>
        <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password_confirmation">
          Confirm Password
        </label>
        <input v-model="password_confirmation" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password_confirmation" type="password" placeholder="******************">
        <p v-if="!isPasswordConfirmationValid" class="text-orange-300 text-xs italic">*Passwords do not match.</p>
        <p v-if="successMessage" class="text-green-500 text-xs italic">{{ successMessage }}</p>
        
      </div>
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import axios from 'axios';
  import { apiUrl } from '../../utils/utils.js';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const name = ref('');
      const email = ref('');
      const password = ref('');
      const password_confirmation = ref('');
      const router = useRouter();
      const successMessage = ref('');

      const isNameValid = computed(() => name.value.trim() !== '');
      const isEmailValid = computed(() => /\S+@\S+\.\S+/.test(email.value));
      const isPasswordValid = computed(() => password.value.length >= 6);
      const isPasswordConfirmationValid = computed(() => password.value === password_confirmation.value);
    
      const register = async () => {
        if (!isNameValid.value || !isEmailValid.value || !isPasswordValid.value || !isPasswordConfirmationValid.value) {
        return;
      }
        try {
          const response = await axios.post(`${apiUrl}/register`, {
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value,
          });
  
          localStorage.setItem('token', response.data.token);
          successMessage.value = 'Registration successful!';
          setTimeout(() => {
            router.push({ name: 'login' });
          }, 2000);
        } catch (error) {
          console.error(error);
        }
      };
  
      return {
        name,
        email,
        password,
        password_confirmation,
        register,
        isNameValid,
        isEmailValid,
        isPasswordValid,
        isPasswordConfirmationValid,
        successMessage
      };
    },
  };
  </script>