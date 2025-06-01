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

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.register-container {
    background-color: #c4fcef;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.register-form {
    background-color: #ffffff;
    border: 2px solid #4d8076;
    border-radius: 10px;
    padding: 30px;
    width: 320px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h2 {
    text-align: center;
    color: #005245;
}

.link {
    text-align: center;
    margin-top: 15px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    font-weight: bold;
    color: #005245;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 8px;
    border: 1px solid #4d8076;
    border-radius: 5px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #005245;
    color: white;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
}

button:hover {
    background-color: #4d8076;
}

.error {
    color: red;
    margin-top: 10px;
    text-align: center;
}
</style>