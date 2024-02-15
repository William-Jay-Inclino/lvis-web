<template>
    <div>
        <div class="row">
            <div class="col">
                <h1 class="text-secondary">Canvass</h1>
            </div>
            <div class="col">
                <nuxt-link class="btn btn-primary float-end" to="/purchasing/canvass/create">Add Canvass</nuxt-link>
            </div>
        </div>

        <hr>

        <div class="row pt-3">
            <div class="col">
                <div class="mb-3">
                    <label class="form-label">RC Number</label>
                    <input type="text" class="form-control">
                </div>
            </div>
            <div class="col">
                <div class="mb-3">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-control">
                </div>
            </div>
            <div class="col">
                <div class="mb-3">
                    <label class="form-label">Requisitioner</label>
                    <input type="text" class="form-control">
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-primary">Search</button>
        </div>

    </div>

</template>


<script setup lang="ts">

    definePageMeta({
        layout: "layout-admin"
    })

</script>