<template>
    <div class="wrapper">
      <div class="form-signin">
        <form>
          <div class="img-container">
            <img src="~/assets/img/leyeco-logo.png" alt="" width="72" height="57">
          </div>
          <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
  
          <div class="form-floating">
            <input
              v-model="email"
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder=" "
              @focus="addFocusClass"
              @blur="removeFocusClass"
            >
            <label for="floatingInput">Email address</label>
          </div>
          <div class="form-floating" style="margin-top: 10px;">
            <input
              v-model="password"
              type="password"
              class="form-control"
              id="floatingPassword"
              placeholder=" "
              @focus="addFocusClass"
              @blur="removeFocusClass"
            >
            <label for="floatingPassword">Password</label>
          </div>
  
          <div class="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me"> Remember me
            </label>
          </div>
          <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
          <p class="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const email = ref('');
  const password = ref('');
  
  const addFocusClass = (event) => {
    event.target.parentNode.classList.add('focused');
  };
  
  const removeFocusClass = (event) => {
    if (event.target.value === '') {
      event.target.parentNode.classList.remove('focused');
    }
  };
  </script>
  
  <style scoped>
  .wrapper {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center; /* Center horizontally */
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }
  
  .form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    text-align: center; /* Center text and child elements */
  }
  
  .form-signin .checkbox {
    font-weight: 400;
  }
  
  .form-signin .form-floating {
    position: relative;
    margin-bottom: 10px; /* Added margin between fields */
  }
  
  .form-signin .form-floating input {
    padding-top: 25px;
  }
  
  .form-signin .form-floating label {
    position: absolute;
    top: 0;
    left: 0;
    transition: top 0.3s, font-size 0.3s;
  }
  
  .form-signin .form-floating.focused label,
  .form-signin .form-floating input:focus + label {
    top: -20px;
    font-size: 1rem;
  }
  
  .form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  
  .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  
  .img-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  </style>
  