<template>

    <div class="row justify-content-center">

        <div class="col-lg-9">

            <div v-if="item">
                <div class="alert alert-success" role="alert">
                    Canvass created successfully! 
                </div>
                
                <div class="row pt-3">
                    <div class="col">
                        <div class="h6wrapper mb-3">
                            <hr>
                                <h6 class="text-warning"><i>Canvass Details</i></h6>
                            <hr>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td class="text-muted">RC Number</td>
                                        <td> {{ item.rc_number }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Date Requested</td>
                                        <td> {{ item.date_requested }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Purpose</td>
                                        <td> {{ item.purpose }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Notes</td>
                                        <td> {{ item.notes }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Requisitioner</td>
                                        <td> {{ getFullname(item.requested_by!.firstname, item.requested_by!.middlename, item.requested_by!.lastname) }} </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>

                </div>




                <div class="row pt-3">
                    <div class="col">

                        <div v-if="!isMobile">
                            
                            <div class="h6wrapper mb-3">
                                <hr>
                                    <h6 class="text-warning"><i>Canvass Items</i></h6>
                                <hr>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th class="text-muted"> No. </th>
                                            <th class="text-muted"> Description </th>
                                            <th class="text-muted"> Brand </th>
                                            <th class="text-muted"> Unit </th>
                                            <th class="text-muted"> Quantity </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="i, count in item.canvass_items">
                                            <td> {{ count + 1 }} </td>
                                            <td> {{ i.description }} </td>
                                            <td> {{ i.brand ? i.brand.name : '' }} </td>
                                            <td> {{ i.unit ? i.unit.name : '' }} </td>
                                            <td> {{ i.quantity }} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div v-else>

                            <div class="h6wrapper mb-3">
                                <hr>
                                    <h6 class="text-warning"><i>Canvass Items</i></h6>
                                <hr>
                            </div>

                            <div v-for="i, count in item.canvass_items" class="table-responsive">

                                <table class="table table-hovered table-bordered">
                                    <tbody> 
                                        <tr>
                                            <td class="bg-secondary text-white"> No. </td>
                                            <td class="bg-secondary text-white"> {{ count + 1 }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Description </td>
                                            <td> {{ i.description }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Brand </td>
                                            <td> {{ i.brand ? i.brand.name : '' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Unit </td>
                                            <td> {{ i.unit ? i.unit.name : '' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Quantity </td>
                                            <td> {{ i.description }} </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                        </div>

                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col">
                        <div class="d-flex justify-content-end gap-2">
                            <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/canvass">Go to list</nuxt-link>
                            <nuxt-link class="btn btn-success" :to="`/warehouse/purchasing/canvass/${item.id}`">Update</nuxt-link>
                            <nuxt-link class="btn btn-primary" to="/warehouse/purchasing/canvass/create">Add New</nuxt-link>
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

    import * as api from '~/composables/warehouse/canvass/canvass.api'
    import type { CreateCanvassInput, Canvass } from '~/composables/warehouse/canvass/canvass.types';

    const route = useRoute()
    const item = ref<Canvass | undefined>()
    const isMobile = ref(false)
    const mobileWidth = 768

    onMounted( async() => {

        isMobile.value = window.innerWidth < mobileWidth

        window.addEventListener('resize', checkMobile);

        item.value = await api.findOne(route.params.id as string)

    })

    function checkMobile() {
        isMobile.value = window.innerWidth < mobileWidth
    }


</script>


<style scoped>
    hr {
        flex: 1;
        margin: 0 10px;
        border: none;
        border-top: 1px solid #333;
        }

    h6 {
        margin: 0;
    }

    .h6wrapper {
        display: flex;
        align-items: center;
    }

</style>