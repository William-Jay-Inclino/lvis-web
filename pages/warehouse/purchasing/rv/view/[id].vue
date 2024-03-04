<template>

    <div class="row justify-content-center">

        <div class="col-lg-9">

            <div v-if="item">
                
                <div class="row pt-3">
                    <div class="col">
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <i class="fas fa-info-circle"></i> RV Info
                                </h5>
                            <hr class="result">
                        </div>
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover">
                                <tbody>
                                    <tr>
                                        <td class="text-muted">Status</td>
                                        <td>
                                            <div :class="{[`badge bg-${approvalStatus[item.status].color}`]: true}"> 
                                                {{ approvalStatus[item.status].label }} 
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">RC Number</td>
                                        <td>
                                            <nuxt-link :to="'/warehouse/purchasing/canvass/view/' + item.canvass.id">{{ item.canvass.rc_number }}</nuxt-link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">RV Number</td>
                                        <td> {{ item.rv_number }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">MEQS Number</td>
                                        <td>
                                            <div v-if="item.meqs">
                                                <nuxt-link :to="'/warehouse/purchasing/meqs/view/' + item.meqs.id">{{ item.meqs.meqs_number }}</nuxt-link>
                                            </div>
                                            <div v-else>
                                                N/A
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">PO Number/s</td>
                                        <td>
                                            <div v-if="hasPO">
                                                <div v-for="meqsSupplier in item.meqs!.meqs_suppliers">
                                                    <nuxt-link v-if="meqsSupplier.po" :to="'/warehouse/purchasing/po/view/' + meqsSupplier.po.id">{{ meqsSupplier.po.po_number }}</nuxt-link>
                                                </div>
                                            </div>
                                            <div v-else>
                                                N/A
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">RR Number/s</td>
                                        <td>
                                            <div v-if="hasPO">
                                                <div v-for="meqsSupplier in item.meqs?.meqs_suppliers">
                                                    <nuxt-link v-if="meqsSupplier.po && meqsSupplier.po.rr" :to="'/warehouse/purchasing/rr/view/' + meqsSupplier.po.rr.id">{{ meqsSupplier.po.rr.rr_number }}</nuxt-link>
                                                </div>
                                            </div>
                                            <div v-else>
                                                N/A
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Date</td>
                                        <td> {{ formatDate(item.date_requested) }} </td>
                                    </tr>
                                    <!-- <tr>
                                        <td class="text-muted">Requisitioner</td>
                                        <td> {{ getFullname(item.canvass.requested_by!.firstname, item.canvass.requested_by!.middlename, item.canvass.requested_by!.lastname) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Purpose</td>
                                        <td> {{ item.canvass.purpose }} </td>
                                    </tr> -->
                                    <tr>
                                        <td class="text-muted">Imd. Sup.</td>
                                        <td> {{ getFullname(item.supervisor.firstname, item.supervisor.middlename, item.supervisor.lastname) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Classification</td>
                                        <td> {{ item.classification?.name }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Work Order No.</td>
                                        <td> {{ item.work_order_no }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Work Order Date</td>
                                        <td> {{ formatDate(item.work_order_date) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Notes</td>
                                        <td> {{ item.notes }} </td>
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
                                        <i class="fas fa-users"></i> Approvers
                                    </h5>
                                <hr class="result">
                            </div>

                            <div class="table-responsive">
                                <table class="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th class="bg-secondary text-white"> Order </th>
                                            <th class="bg-secondary text-white"> Label </th>
                                            <th class="bg-secondary text-white"> Approver </th>
                                            <th class="bg-secondary text-white"> Status </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="i, count in item.rv_approvers">
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

                        <div v-else>

                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <i class="fas fa-users"></i> Approvers
                                    </h5>
                                <hr class="result">
                            </div>

                            <div v-for="i, count in item.rv_approvers" class="table-responsive">

                                <table class="table table-hover table-bordered">
                                    <tbody> 
                                        <tr>
                                            <td width="50%" class="bg-secondary text-white"> Order </td>
                                            <td class="bg-secondary text-white"> {{ i.order }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Label </td>
                                            <td> {{ i.label }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Approver </td>
                                            <td> {{ getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Status </td>
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
                </div>

                <hr>

                <div class="row mb-3 pt-3">
                    <div class="col">
                        <div class="d-flex justify-content-between">
                            <div>
                                <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/rv">
                                    <i class="fas fa-chevron-left"></i> Back to Search
                                </nuxt-link>
                            </div>
                            <div v-if="!item.is_deleted && !item.is_cancelled">
                                <nuxt-link class="btn btn-success me-2" :to="`/warehouse/purchasing/rv/${item.id}`">
                                    <i class="fas fa-sync"></i> Update
                                </nuxt-link>
                                <nuxt-link class="btn btn-primary" to="/warehouse/purchasing/rv/create">
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

    import * as api from '~/composables/warehouse/rv/rv.api'
    import type { RV } from '~/composables/warehouse/rv/rv.types';
    import { MOBILE_WIDTH } from '~/utils/config';
    import { approvalStatus } from '~/utils/constants'

    const route = useRoute()
    const item = ref<RV | undefined>()
    const isMobile = ref(false)

    onMounted( async() => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        item.value = await api.findOne(route.params.id as string)

    })


    const hasPO = computed( () => {

        if(!item.value) return false 

        if(item.value.meqs && item.value.meqs.meqs_suppliers) {

            const po = item.value.meqs.meqs_suppliers.find(i => !!i.po)

            if(po) {
                return true 
            }

            return false 

        }else {
            return false
        }

    })


    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }


</script>