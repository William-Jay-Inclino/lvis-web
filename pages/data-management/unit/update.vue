<template>
    <div>
        <h1 class="text-secondary">Update Unit</h1>
        <hr>

        <div class="row justify-content-center pt-5">
            <div class="col-lg-6">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control">
                </div>
        
                <div class="d-flex justify-content-end gap-2">
                    <nuxt-link class="btn btn-secondary" to="/data-management/unit">Cancel</nuxt-link>
                    <button class="btn btn-primary">Update</button>
                </div>
            </div>
        </div>


    </div>

</template>


<script setup lang="ts">

    definePageMeta({
        layout: "layout-admin"
    })

</script>