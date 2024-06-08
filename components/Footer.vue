<template>
    <footer :class="{'bg-white': !isHomeRoute}" class="footer mt-auto py-3 fixed-bottom d-flex justify-content-center align-items-center">
        <div class="text-center text-dark fw-bold" style="font-family: monospace; color: #ffd700;">
            <p>&copy; 2024 LVIS <i class="fas fa-bolt text-warning"></i> | Developed by <a target="_blank" href="https://www.facebook.com/jewell.inclino">William Jay Inclino</a></p>
        </div>
    </footer>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

console.log('route.path', route.path);
const isHomeRoute = route.path === '/home'

</script>
