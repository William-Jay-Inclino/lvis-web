<template>

    <div v-if="item">

        <div class="row pt-3 justify-content-center">
            <div class="col-lg-9">
                <div class="h5wrapper mb-3">
                    <hr class="result">
                        <h5 class="text-warning fst-italic">
                            <i class="fas fa-info-circle"></i> PO Info
                        </h5>
                    <hr class="result">
                </div>

                <div class="table-responsive">
                    <table class="table table-bordered"> 
                        <tbody>
                            <tr>
                                <td class="text-muted">Status</td>
                                <td>
                                    <div :class="{[`badge bg-${approvalStatus[item.status].color}`]: true}"> 
                                        {{ approvalStatus[item.status].label }} 
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="isRV">
                                <td class="text-muted"> RC Number </td>
                                <td>
                                    <nuxt-link :to="'/warehouse/purchasing/canvass/view/' + meqsReference?.canvass.id">{{ meqsReference?.canvass.rc_number }}</nuxt-link>
                                </td>
                            </tr>
                            <tr v-if="isRV">
                                <td class="text-muted"> RV Number </td>
                                <td>
                                    <nuxt-link :to="'/warehouse/purchasing/rv/view/' + meqsReference?.id">{{ meqsReference?.rv_number }}</nuxt-link>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-muted">MEQS Number</td>
                                <td>
                                    <nuxt-link :to="'/warehouse/purchasing/meqs/view/' + item.meqs_supplier.meqs.id">{{ item.meqs_supplier.meqs.meqs_number }}</nuxt-link>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-muted">PO Number</td>
                                <td> {{ item.po_number }} </td>
                            </tr>
                            <tr>
                                <td class="text-muted">Date</td>
                                <td> {{ formatDate(item.po_date) }} </td>
                            </tr>
                            <tr>
                                <td class="text-muted">Notes</td>
                                <td> {{ item.notes }} </td>
                            </tr>
                            <!-- <tr>
                                <td class="text-muted">Requisitioner</td>
                                <td> {{ requisitioner }} </td>
                            </tr> -->
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

        <div class="row pt-3 justify-content-center">
            <div class="col-lg-9">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                        <h5 class="text-warning fst-italic">
                            <i class="fas fa-users"></i> Approvers
                        </h5>
                    <hr class="result">
                </div>

                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th class="bg-secondary text-white"> Order </th>
                                <th class="bg-secondary text-white"> Label </th>
                                <th class="bg-secondary text-white"> Approver </th>
                                <th class="bg-secondary text-white"> Status </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i, count in item.po_approvers">
                                <td> {{ i.order }} </td>
                                <td> {{ i.label }} </td>
                                <td> {{ getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname) }} </td>
                                <td>
                                    <span :class="{[`badge bg-${approvalStatus[i.status].color}`]: true}"> 
                                        {{ approvalStatus[i.status].label }} 
                                    </span> 
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            </div>
        </div>

        <div class="row pt-3 justify-content-center">
            <div class="col-lg-9">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                        <h5 class="text-warning fst-italic">
                            <i class="fas fa-shopping-cart"></i> Items
                        </h5>
                    <hr class="result">
                </div>

                <div class="table-responsive">
                    <table class="table table-hover table-sm">
                        <thead>
                            <tr>
                                <th class="bg-secondary text-white">No</th>
                                <th class="bg-secondary text-white">Description</th>
                                <th class="bg-secondary text-white">Brand</th>
                                <th class="bg-secondary text-white">Unit</th>
                                <th class="bg-secondary text-white">Qty</th>
                                <th class="bg-secondary text-white">Unit Price</th>
                                <th class="bg-secondary text-white">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item, i in supplierItems">
                                <td class="text-muted"> {{ i + 1 }} </td>
                                <td class="text-muted"> {{ item.canvass_item.description }} </td>
                                <td class="text-muted"> {{ item.canvass_item.brand ? item.canvass_item.brand.name : 'N/A' }} </td>
                                <td class="text-muted"> {{ item.canvass_item.unit ? item.canvass_item.unit.name : 'N/A' }} </td>
                                <td class="text-muted"> {{ item.canvass_item.quantity }} </td>
                                <td class="text-muted"> {{ formatToPhpCurrency(item.price) }} </td>
                                <td class="text-muted"> {{ formatToPhpCurrency(item.price * item.canvass_item.quantity) }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            </div>
        </div>

        

        <div class="row mb-3 pt-3 justify-content-center">
            <div class="col-lg-9">
                <hr>
                <div class="d-flex justify-content-between">
                    <div>
                        <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/po">
                            <i class="fas fa-chevron-left"></i> Back to Search
                        </nuxt-link>
                    </div>
                    <div v-if="!item.is_deleted && !item.canceller_id">
                        <nuxt-link class="btn btn-success me-2" :to="`/warehouse/purchasing/po/${item.id}`">
                            <i class="fas fa-sync"></i> Update
                        </nuxt-link>
                        <nuxt-link class="btn btn-primary" to="/warehouse/purchasing/po/create">
                            <i class="fas fa-plus"></i> Add New
                        </nuxt-link>
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

    import * as poApi from '~/composables/warehouse/po/po.api'
    import type { PO } from '~/composables/warehouse/po/po.types';
    import { MOBILE_WIDTH } from '~/utils/config';
    import { approvalStatus } from '~/utils/constants'

    const route = useRoute()
    const item = ref<PO | undefined>()
    const isMobile = ref(false)

    onMounted( async() => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        item.value = await poApi.findOne(route.params.id as string)

    })

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }

    const isRV = computed( () => {
        const meqs = item.value?.meqs_supplier.meqs

        if(meqs?.rv) {
            return true 
        }
        return false 

    })

    const meqsReference = computed( () => {

        const meqs = item.value?.meqs_supplier.meqs

        if(isRV.value) {
            return meqs?.rv
        }

    })

    const requisitioner = computed( () => {

        const employee = meqsReference.value?.canvass.requested_by 

        return getFullname(employee!.firstname, employee!.middlename, employee!.lastname)

    }) 

    const supplierItems = computed( () => {

        return item.value!.meqs_supplier.meqs_supplier_items.filter(i => i.is_awarded)


    })

</script>