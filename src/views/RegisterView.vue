<template>
  <form @submit.prevent="register">
      <input v-model="name" id="name" type="text" placeholder="Name">
      <p v-if="!isNameValid">*Name is not valid.</p>

      <input v-model="email" id="email" type="email" placeholder="Email">
      <p v-if="!isEmailValid">*Email is not valid.</p>

      <input v-model="password" id="password" type="password" placeholder="******************">
      <p v-if="!isPasswordValid">*Password is not valid.</p>

      <input v-model="password_confirmation" id="password_confirmation" type="password" placeholder="******************">
      <p v-if="!isPasswordConfirmationValid">*Passwords do not match.</p>

      <p v-if="successMessage">{{ successMessage }}</p>

      <button type="submit">Register</button>
  </form>
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

      // handle registration
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