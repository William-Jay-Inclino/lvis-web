<template>
    <div>
        <h2 class="text-warning">Search MEQS</h2>
        
        <hr>

        <div class="row pt-3">
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">MEQS Number</label>
                    <!-- <client-only>
                        <v-select :options="rvs" label="rv_number" v-model="rv"></v-select>
                    </client-only> -->
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">Date</label>
                    <!-- <client-only>
                        <v-select :options="canvasses" label="rc_number" v-model="canvass"></v-select>
                    </client-only> -->
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">Transaction</label>
                    <!-- <input v-model="date_requested" type="date" class="form-control"> -->
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">Requisitioner</label>
                    <!-- <client-only>
                        <v-select :options="employees" label="fullname" v-model="requested_by"></v-select>
                    </client-only> -->
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