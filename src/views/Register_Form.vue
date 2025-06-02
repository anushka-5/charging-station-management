<template>
    <div class="register-container">
        <form @submit.prevent="handleRegister" class="register-form">
            <h2>Register</h2>
            <div class="form-group">
                <label>Username</label>
                <input type="text" v-model="username" required />
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="email" required />
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" v-model="password" required />
            </div>
            <button type="submit">register</button>
            <p class="link">Already have an account? <router-link to="/login">Login here</router-link></p>
            <p v-if="error" class="error">{{ error }}</p>
        </form>
    </div>
</template>

<script>
import "@/assets/styles/Register.css";
import createApi from '@/api/axios';

export default {
    name: 'RegisterFormView',
    data() {
        return {
            username: '',
            email: '',
            password: '',
            error: ''
        };
    },
    methods: {
        async handleRegister() {
            try {
                const api = createApi();
                
                const response = await api.post('/users/register', {
                    username: this.username,
                    email: this.email,
                    password: this.password
                });

                const data = response.data;

                alert('Registration successful!');

                // Save token to localStorage
                localStorage.setItem('token', data.token);
                // Redirect to main page (change route as needed)
                this.$router.push('/chargers');

            } catch (err) {
                console.log(err.message)
                this.error = 'Network error. Please try again.';
            }
        }
    }
};
</script>

