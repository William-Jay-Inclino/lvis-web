<template>
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh; background-color: whitesmoke;">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div v-if="error.show" class="alert alert-danger mb-4" role="alert" style="width: 100%;">
                        {{ error.msg }}
                    </div>
                    <div class="card p-4">
                        <form @submit.prevent="login" class="form-signin">
                            <h1 class="h3 mb-3 font-weight-normal">Login</h1>
                            <label for="inputUsername" class="sr-only">Username</label>
                            <input type="text" id="inputUsername" v-model="email" class="form-control mb-2" placeholder="Username" required autofocus>
                            <label for="inputPassword" class="sr-only">Password</label>
                            <input type="password" id="inputPassword" v-model="password" class="form-control mb-3" placeholder="Password" required>
                            <button class="btn btn-lg btn-primary btn-block" type="submit">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import axios from 'axios'
    import { AxiosError } from 'axios'

    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const error = ref({
        show: false,
        msg: ''
    })

    async function login() {
        console.log('login()');
        try {
            const response = await axios.post('http://localhost:4000/auth/login', {
                username: email.value,
                password: password.value
            });
            console.log('response.data', response.data);

            const authUser = JSON.stringify(response.data)

            localStorage.setItem('authUser', authUser);

            router.push('/home');

        } catch (err) {
            if (err && axios.isAxiosError(err)) {
                const axiosError = err as AxiosError;
                console.log('Error:', axiosError.response);

                if (axiosError.response && axiosError.response.status === 401) {
                    error.value.show = true;
                    error.value.msg = "Access denied! It appears you lack the necessary permissions to login. Consider verifying your credentials or contacting the system administrator."
                } else {
                    error.value.show = true;
                    error.value.msg = "An error occurred. Please try again later.";
                }
            } else {
                console.log('Error:', err);
            }
        }
    }




</script>

<style scoped>
    .card {
        border: 1px solid #ccc;
        border-radius: 5px;
    }
    .form-signin .form-control {
        position: relative;
        box-sizing: border-box;
        height: auto;
        padding: 10px;
        font-size: 16px;
    }
    .form-signin .btn {
        font-size: 16px;
        padding: 10px;
    }
</style>
