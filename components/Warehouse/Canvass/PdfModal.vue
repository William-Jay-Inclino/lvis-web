<template>
    <!-- Modal -->
    <div class="modal fade" id="canvassPdfModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="ratio ratio-1x1">
                        <iframe v-if="pdfUrl" :src="pdfUrl" type="application/pdf"></iframe>
                    </div>
                    <!-- <embed v-if="pdfUrl" :src="pdfUrl" type="application/pdf" width="100%" height="600px" /> -->
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">

const props = defineProps<{
    pdfUrl: string | null,
}>();

</script>