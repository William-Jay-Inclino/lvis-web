<template>
    <div v-if="pdfLoaded">
        <embed :src="pdfUrl" type="application/pdf" width="100%" height="600px" />
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';

const pdfUrl = ref('');
const pdfLoaded = ref(false);

onMounted(async () => {
    try {
        const response = await axios.get('http://192.168.1.9:4002/canvass/pdf', {
            responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        pdfUrl.value = window.URL.createObjectURL(blob);
        pdfLoaded.value = true;
    } catch (error) {
        console.error('Error loading PDF:', error);
    }
});
</script>