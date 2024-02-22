<template>

    <div class="row justify-content-center">

        <div class="col-lg-9">

            <div v-if="item">
                <div class="alert alert-success" role="alert">
                    RV created successfully! 
                </div>
                
                <div class="row pt-3">
                    <div class="col">
                        <div class="h6wrapper mb-3">
                            <hr>
                                <h6 class="text-warning"><i>RV Details</i></h6>
                            <hr>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td class="text-muted">RV Number</td>
                                        <td> {{ item.rv_number }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">RC Number</td>
                                        <td>
                                            <nuxt-link :to="'/warehouse/purchasing/canvass/' + item.canvass.id" target="_blank">{{ item.canvass.rc_number }}</nuxt-link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Date</td>
                                        <td> {{ formatDate(item.date_requested) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Requisitioner</td>
                                        <td> {{ getFullname(item.canvass.requested_by!.firstname, item.canvass.requested_by!.middlename, item.canvass.requested_by!.lastname) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Purpose</td>
                                        <td> {{ item.canvass.purpose }} </td>
                                    </tr>
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
                            
                            <div class="h6wrapper mb-3">
                                <hr>
                                    <h6 class="text-warning"><i>Approvers</i></h6>
                                <hr>
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

                            <div class="h6wrapper mb-3">
                                <hr>
                                    <h6 class="text-warning"><i>Approvers</i></h6>
                                <hr>
                            </div>

                            <div v-for="i, count in item.rv_approvers" class="table-responsive">

                                <table class="table table-hovered table-bordered">
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

                <div class="row mb-3 pt-3">
                    <div class="col">
                        <div class="d-flex justify-content-end gap-2">
                            <div class="d-flex justify-content-end gap-2">
                                <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/rv">
                                    <i class="fas fa-search"></i> Search
                                </nuxt-link>
                                <nuxt-link class="btn btn-success" :to="`/warehouse/purchasing/rv/${item.id}`">
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

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
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