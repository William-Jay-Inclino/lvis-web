<template>

    <div class="row justify-content-center pt-5">

        <div class="col-lg-6">

            <div v-if="item">
                <div class="alert alert-success" role="alert">
                    Unit created successfully! 
                </div>
                
                <div class="row pt-3">
                    <div class="col">
                        <table class="table table-bordered">
                            <tbody>
                                <tr>
                                    <td class="text-muted">Name</td>
                                    <td> {{ item.name }} </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div class="d-flex justify-content-end gap-2">
                            <nuxt-link class="btn btn-secondary" to="/warehouse/data-management/unit">Go to list</nuxt-link>
                            <nuxt-link class="btn btn-success" :to="`/warehouse/data-management/unit/${item.id}`">Update</nuxt-link>
                            <nuxt-link class="btn btn-primary" to="/warehouse/data-management/unit/create">Add New</nuxt-link>
                        </div>
                    </div>
                </div>
    
            </div>
            
        </div>
    </div>

</template>


<script setup lang="ts">

    definePageMeta({
        layout: "layout-admin"
    })

    import type { Unit } from '../unit.types';
    import * as api from '../unit.api'

    const route = useRoute()
    const item = ref<Unit | undefined>()

    onMounted( async() => {

        item.value = await api.findOne(route.params.id as string)

    })


</script>