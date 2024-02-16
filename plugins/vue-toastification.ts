import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import type { PluginOptions } from 'vue-toastification/dist/types/src/types';


export default defineNuxtPlugin( (nuxtApp) => {

    const toastOptions: PluginOptions = {
        // You can set your default options here
    };

    nuxtApp.vueApp.use(Toast, toastOptions)
  })