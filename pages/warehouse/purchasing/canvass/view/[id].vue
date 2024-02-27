<template>

    <div class="row justify-content-center">

        <div class="col-lg-9">

            <div v-if="item">
                
                <div class="row pt-3">
                    <div class="col">
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <i class="fas fa-info-circle"></i> Canvass Info
                                </h5>
                            <hr class="result">
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
                            
                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <i class="fas fa-shopping-cart"></i> Canvass Items
                                    </h5>
                                <hr class="result">
                            </div>

                            <div class="table-responsive">
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th class="bg-secondary text-white"> No. </th>
                                            <th class="bg-secondary text-white"> Description </th>
                                            <th class="bg-secondary text-white"> Brand </th>
                                            <th class="bg-secondary text-white"> Unit </th>
                                            <th class="bg-secondary text-white"> Quantity </th>
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

                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <i class="fas fa-shopping-cart"></i> Canvass Items
                                    </h5>
                                <hr class="result">
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

                <div class="row mb-3 pt-3">
                    <div class="col">
                        <div class="d-flex justify-content-between">
                            <div>
                                <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/canvass">
                                    <i class="fas fa-chevron-left"></i> Back to Search
                                </nuxt-link>
                            </div>
                            <div>
                                <nuxt-link class="btn btn-success me-2" :to="`/warehouse/purchasing/canvass/${item.id}`">
                                    <i class="fas fa-sync"></i> Update
                                </nuxt-link>
                                <nuxt-link class="btn btn-primary" to="/warehouse/purchasing/canvass/create">
                                    <i class="fas fa-plus"></i> Add New
                                </nuxt-link>
                            </div>
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
    import type { Canvass } from '~/composables/warehouse/canvass/canvass.types';
    import { MOBILE_WIDTH } from '~/utils/config';

    const route = useRoute()
    const item = ref<Canvass | undefined>()
    const isMobile = ref(false)

    onMounted( async() => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        item.value = await api.findOne(route.params.id as string)

    })

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }


</script>
