<template>

    <div class="row justify-content-center">

        <div class="col-lg-9">

            <div v-if="item">
                
                <div class="row pt-3">
                    <div class="col">
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <i class="fas fa-info-circle"></i> Item Info
                                </h5>
                            <hr class="result">
                        </div>
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover">
                                <tbody>
                                    <tr>
                                        <td class="text-muted">Item Code</td>
                                        <td> {{ item.code }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Name</td>
                                        <td> {{ item.name }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Description</td>
                                        <td> {{ item.description }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Total Quantity</td>
                                        <td> {{ item.total_quantity }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Initial Quantity</td>
                                        <td> {{ item.initial_quantity }} </td>
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
                                        <i class="fas fa-history"></i> Item Transactions
                                    </h5>
                                <hr class="result">
                            </div>

                            <div class="table-responsive">
                                <table class="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th class="bg-secondary text-white"> Txn Number </th>
                                            <th class="bg-secondary text-white"> Reference </th>
                                            <th class="bg-secondary text-white"> Type </th>
                                            <th class="bg-secondary text-white"> Quantity </th>
                                            <th class="bg-secondary text-white"> Price </th>
                                            <th class="bg-secondary text-white"> Remarks </th>
                                            <th class="bg-secondary text-white"> Date </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="i in item.item_transactions">
                                            <td> {{ i.txn_number }} </td>
                                            <td>
                                                <div v-if="i.rr_item">
                                                    <nuxt-link :to="'/warehouse/purchasing/rr/view/' + i.rr_item.rr.id" target="_blank">
                                                        {{ `RR#${i.rr_item.rr.rr_number}` }}
                                                    </nuxt-link>

                                                </div>
                                            </td>
                                            <td> {{ itemTransaction[i.type].label }} </td>
                                            <td> {{ i.quantity }} </td>
                                            <td> {{ i.price }} </td>
                                            <td> {{ i.remarks }} </td>
                                            <td> {{ formatDate(i.created_at) }} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>

                <hr>

                <div class="row mb-3 pt-3">
                    <div class="col">
                        <div class="d-flex justify-content-between">
                            <div>
                                <nuxt-link class="btn btn-secondary" to="/warehouse/stock-inventory/item">
                                    <i class="fas fa-chevron-left"></i> Back to Search
                                </nuxt-link>
                            </div>
                            <div>
                                <nuxt-link class="btn btn-success me-2" :to="`/warehouse/stock-inventory/item/${item.id}`">
                                    <i class="fas fa-sync"></i> Update
                                </nuxt-link>
                                <nuxt-link class="btn btn-primary" to="/warehouse/stock-inventory/item/create">
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

    import * as itemApi from '~/composables/warehouse/item/item.api'
    import type { Item } from '~/composables/warehouse/item/item.type';
    import { MOBILE_WIDTH } from '~/utils/config';
    import { itemTransaction } from '~/utils/constants'; 

    const route = useRoute()
    const item = ref<Item | undefined>()
    const isMobile = ref(false)

    onMounted( async() => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        item.value = await itemApi.findOne(route.params.id as string)

    })

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }


</script>
