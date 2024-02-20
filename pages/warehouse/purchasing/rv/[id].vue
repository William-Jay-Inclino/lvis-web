<template>
    <div v-if="rvData && rvData.canvass">
        <h2 class="text-warning">Update RV</h2>
        <hr>

        <div class="row pb-3">
            <div class="col">
                <div class="row justify-content-center pt-3">
        
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
                            <small class="text-danger" v-if="rvDataErrors.supervisor"> This field is required </small>
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
                
                        <div class="d-flex justify-content-end gap-2">
                            <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/rv">
                                <i class="fas fa-times"></i> Cancel
                            </nuxt-link>
                            <button @click="update()" type="button" class="btn btn-success">
                                <i class="fas fa-sync"></i> Update
                            </button>
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

    import Swal from 'sweetalert2'
    import moment from 'moment';
    import { getFullname, formatToValidHtmlDate } from '~/utils/helpers'
    import { useToast } from "vue-toastification";
    import * as rvApi from '~/composables/warehouse/rv/rv.api'
    import type { Employee } from '~/composables/warehouse/canvass/canvass.types';
    import type { RV, UpdateRvInput } from '~/composables/warehouse/rv/rv.types';

    const route = useRoute()
    const router = useRouter();
    const isMobile = ref(false)
    const mobileWidth = 768
    const toast = useToast();
    const today = moment().format('YYYY-MM-DD')

    const _rvDataErrorsInitial = {
        supervisor: false,
    }

    const rvDataErrors = ref({..._rvDataErrorsInitial})

    const rvData = ref<RV>({} as RV)

    const employees = ref<Employee[]>([])

    onMounted( async() => {

        isMobile.value = window.innerWidth < mobileWidth

        window.addEventListener('resize', checkMobile);

        let response = await rvApi.fetchFormDataInUpdate(route.params.id as string)

        if(response.rv) {
            setRvData(response.rv) 
        }

        employees.value = response.employees.map((i) => {
            i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
            return i
        })

    })

    function setRvData(data: RV) {
        data.date_requested = formatToValidHtmlDate(data.date_requested)
            
        const requestedBy = data.canvass.requested_by
        requestedBy!['fullname'] = getFullname(requestedBy!.firstname, requestedBy!.middlename, requestedBy!.lastname)

        const supervisor = data.supervisor
        supervisor['fullname'] = getFullname(supervisor.firstname, supervisor.middlename, supervisor.lastname)

        if(data.work_order_date) {
            data.work_order_date = moment(data.date_requested).format('YYYY-MM-DD')
        }

        data.rv_approvers.map(i => {
            i.date_approval = moment(i.date_approval).format('YYYY-MM-DD')
            return i
        })

        rvData.value = data

    }

    async function update() {

        console.log('update')

        // if(!isValid()){
        //     return 
        // }

        // console.log('saving...')

        // const response = await rvApi.create(rvData.value)

        // if(response.success && response.data) {
        //     router.push(`/warehouse/purchasing/rv/success/${response.data.id}`);
        // }else {
        //     Swal.fire({
        //         title: 'Error!',
        //         text: response.msg,
        //         icon: 'error',
        //         position: 'top',
        //     })
        // }

    }

    // function isValid(): boolean {

    //     rvDataErrors.value = {..._rvDataErrorsInitial}

    //     if(!rvData.value.canvass) {
    //         rvDataErrors.value.canvass = true
    //     }

    //     if(!rvData.value.supervisor) {
    //         rvDataErrors.value.supervisor = true
    //     }

    //     const hasError = Object.values(rvDataErrors.value).includes(true);

    //     if(hasError) {
    //         return false
    //     }

    //     return true

    // }

    function checkMobile() {
        isMobile.value = window.innerWidth < mobileWidth
    }

</script>

