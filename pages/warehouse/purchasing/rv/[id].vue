<template>
    <div v-if="rvData && rvData.canvass" class="mb-3">
        <h2 class="text-warning">Update RV</h2>
        <hr>

        <div class="row">
            <div class="col">
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item" @click="isRVDetailForm = true">
                        <a class="nav-link" :class="{'active': isRVDetailForm}" href="#">
                            <i class="fas fa-info-circle"></i> RV Detail
                        </a>
                    </li>
                    <li class="nav-item" @click="isRVDetailForm = false">
                        <a class="nav-link" :class="{'active': !isRVDetailForm}" href="#">
                            <i class="fas fa-users"></i> Approvers
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div v-show="isRVDetailForm" class="row justify-content-center pt-5">
            <div class="col-lg-6">
                <div class="mb-3">
                    <label class="form-label">
                        Date
                    </label>
                    <input type="date" class="form-control" :value="rvData.date_requested" disabled>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        RC Number <span class="text-danger">*</span>
                    </label>
                    <input type="text" class="form-control" :value="rvData.canvass.rc_number" disabled>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Requisitioner
                    </label>
                    <input 
                        :value="rvData.canvass.requested_by?.fullname" 
                        type="text" 
                        class="form-control" 
                        disabled
                    >
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Purpose
                    </label>
                    <textarea :value="rvData.canvass.purpose" class="form-control" rows="3" disabled> </textarea>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Imd. Sup. <span class="text-danger">*</span>
                    </label>
                    <client-only>
                        <v-select :options="employees" label="fullname" v-model="rvData.supervisor"></v-select>
                    </client-only>
                    <small class="text-danger fst-italic" v-if="rvDataErrors.supervisor"> This field is required </small>
                    <small class="text-muted fst-italic">
                        Note: Updating the supervisor will also update the designated approver
                    </small>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Classification
                    </label>
                    <client-only>
                        <v-select :options="classifications" label="name" v-model="rvData.classification"></v-select>
                    </client-only>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Work Order No.
                    </label>
                    <input type="text" class="form-control" v-model="rvData.work_order_no">
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Work Order Date
                    </label>
                    <input type="date" class="form-control" v-model="rvData.work_order_date">
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Notes
                    </label>
                    <textarea class="form-control" rows="3" v-model="rvData.notes"></textarea>
                </div>
        
                <div class="d-flex justify-content-end gap-2 pt-3">
                    <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/rv">
                        <i class="fas fa-chevron-left"></i> Back
                    </nuxt-link>
                    <button @click="update()" type="button" class="btn btn-danger">
                        <i class="fas fa-cancel"></i> Cancel
                    </button>
                    <button @click="update()" type="button" class="btn btn-primary">
                        <i class="fas fa-print"></i> Print
                    </button>
                    <button @click="update()" type="button" class="btn btn-success" :disabled="isUpdating">
                        <i class="fas fa-sync"></i> {{ isUpdating ? 'Updating...' : 'Update' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-show="!isRVDetailForm" class="row justify-content-center pt-5">

            <div class="col-lg-12 col-md-12 col-sm-12">

                <div v-if="!isMobile">
                    
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th class="bg-secondary text-white">#</th>
                                    <th class="bg-secondary text-white">Label</th>
                                    <th class="bg-secondary text-white">Approver</th>
                                    <th class="bg-secondary text-white text-center">Status</th>
                                    <th class="bg-secondary text-white">Notes</th>
                                    <th class="bg-secondary text-white text-center">
                                        <i class="fas fa-cog"></i>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in rvData.rv_approvers">
                                    <td class="text-muted align-middle">
                                        {{ item.order }}
                                    </td>
                                    <td class="text-muted align-middle">
                                        {{ item.label }}
                                    </td>
                                    <td class="text-muted align-middle">
                                        {{ getFullname(item.approver.firstname, item.approver.middlename, item.approver.lastname) }}
                                    </td>
                                    <td class="text-muted text-center">
                                        <div :class="{[`badge bg-${approvalStatus[item.status].color}`]: true}"> 
                                            {{ approvalStatus[item.status].label }} 
                                        </div>
                                        <div class="fst-italic" v-if="item.date_approval">
                                            <small> {{ item.date_approval }} </small>
                                        </div>
                                    </td>
                                    <td class="text-muted align-middle">
                                        {{ item.notes }}
                                    </td>
                                    <td class="text-muted text-center">
                                        <button class="btn btn-sm btn-light w-33">
                                            <i class="fas fa-sort text-muted"></i>
                                        </button>
                                        <button class="btn btn-sm btn-light w-33">
                                            <i class="fas fa-trash text-danger"></i>
                                        </button>
                                        <button class="btn btn-sm btn-light w-33">
                                            <i class="fas fa-edit text-primary"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="7" class="text-center">
                                        <button type="button" class="btn btn-primary btn-sm">
                                            <i class="fas fa-plus-circle"></i> Add Approver
                                        </button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                </div>

                <div class="d-flex justify-content-end gap-2 pt-3">
                    <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/rv">
                        <i class="fas fa-chevron-left"></i> Back
                    </nuxt-link>
                    <button @click="update()" type="button" class="btn btn-danger">
                        <i class="fas fa-cancel"></i> Cancel
                    </button>
                    <button @click="update()" type="button" class="btn btn-primary">
                        <i class="fas fa-print"></i> Print
                    </button>
                </div>

            </div>

        </div>

    </div>

</template>


<script setup lang="ts">

    definePageMeta({
        layout: "layout-admin"
    })

    import Swal from 'sweetalert2'
    import moment from 'moment';
    import { getFullname, formatToValidHtmlDate, formatDate } from '~/utils/helpers'
    import { useToast } from "vue-toastification";
    import * as rvApi from '~/composables/warehouse/rv/rv.api'
    import type { Classification, Employee } from '~/composables/warehouse/canvass/canvass.types';
    import type { RV, UpdateRvInput } from '~/composables/warehouse/rv/rv.types';
    import { MOBILE_WIDTH } from '~/utils/config';
    import { approvalStatus } from '~/utils/constants';

    const route = useRoute()
    const router = useRouter();

    const isMobile = ref(false)
    const isRVDetailForm = ref(true)
    const isUpdating = ref(false)

    const toast = useToast();
    const today = moment().format('YYYY-MM-DD')

    const _rvDataErrorsInitial = {
        supervisor: false,
    }

    const rvDataErrors = ref({..._rvDataErrorsInitial})

    const rvData = ref<RV>({} as RV)

    const employees = ref<Employee[]>([])
    const classifications = ref<Classification[]>([])

    onMounted( async() => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        let response = await rvApi.fetchFormDataInUpdate(route.params.id as string)

        if(response.rv) {
            setRvData(response.rv) 
        }

        employees.value = response.employees.map((i) => {
            i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
            return i
        })

        classifications.value = response.classifications

    })

    function setRvData(data: RV) {
        data.date_requested = formatToValidHtmlDate(data.date_requested)
            
        const requestedBy = data.canvass.requested_by
        requestedBy!['fullname'] = getFullname(requestedBy!.firstname, requestedBy!.middlename, requestedBy!.lastname)

        const supervisor = data.supervisor
        supervisor['fullname'] = getFullname(supervisor.firstname, supervisor.middlename, supervisor.lastname)

        if(data.work_order_date) {
            data.work_order_date = formatToValidHtmlDate(data.work_order_date)
        }

        data.rv_approvers.map(i => {
            i.date_approval = formatDate(i.date_approval)
            return i
        })

        rvData.value = data

    }

    async function update() {

        console.log('update')

        if(!isValid()){
            return 
        }

        console.log('updating...')

        isUpdating.value = true
        const response = await rvApi.update(rvData.value.id, rvData.value)
        isUpdating.value = false

        if(response.success && response.data) {
            Swal.fire({
                title: 'Success!',
                text: response.msg,
                icon: 'success',
                position: 'top',
            })

            rvData.value.rv_approvers = response.data.rv_approvers

        } else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }

    }

    function isValid(): boolean {

        rvDataErrors.value = {..._rvDataErrorsInitial}

        if(!rvData.value.supervisor) {
            rvDataErrors.value.supervisor = true
        }

        const hasError = Object.values(rvDataErrors.value).includes(true);

        if(hasError) {
            return false
        }

        return true

    }

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }

</script>

