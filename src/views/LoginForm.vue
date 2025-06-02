<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>Login</h2>
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
      <p class="link">Don't have an account? <router-link to="/register">Register here</router-link></p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import "@/assets/styles/Login.css";
import createApi from '@/api/axios';
export default {
  name: 'LoginFormView',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    

    async handleLogin() {
        try {
            const api = createApi();
            
            const response = await api.post('/users/login', {
                email: this.email,
                password: this.password
            });

            const data = response.data;

            alert('Login successful!');

            // Save token to localStorage
            localStorage.setItem('token', data.token);
            // Redirect to main page (change route as needed)
            this.$router.push('/chargers');

        } catch (err) {
            console.log(err.message);
            this.error = 'Network error. Please try again.';
        }
    }
}

};
</script>


