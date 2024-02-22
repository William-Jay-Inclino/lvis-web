<template>
    <div v-if="rvData && rvData.canvass && !rvData.is_deleted && !rvData.is_cancelled" class="mb-3">
        <h2 class="text-warning">Update RV</h2>
        <hr>

        <div class="row pt-3">
            <div class="col">
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item" @click="isRVDetailForm = true">
                        <a class="nav-link" :class="{'active': isRVDetailForm}" href="#">
                            <i class="fas fa-info-circle"></i> RV Info
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


                <div class="mb-3 d-flex align-items-center">
                    <label class="form-label me-2 mb-0">Status:</label>
                    <div :class="{[`badge bg-${rvStatus.color}`]: true}"> 
                        {{ rvStatus.label }} 
                    </div>
                </div>

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
        

            </div>
        </div>

        <div v-show="!isRVDetailForm" class="row justify-content-center pt-5">

            <div class="col-lg-12 col-md-12 col-sm-12">
                <WarehouseApprover 
                    :approvers="rvData.rv_approvers"
                    :employees="employees"
                    :isUpdatingApproverOrder="isUpdatingApproverOrder"
                    :isAddingRvApprover="isAddingRvApprover"
                    :isEditingRvApprover="isEditingRvApprover"
                    @changeApproverOrder="changeApproverOrder"
                    @addApprover="addApprover"
                    @editApprover="editApprover"
                    @removeApprover="removeApprover"
                />
            </div>


        </div>


        <div class="row justify-content-center">
            <div :class="{'col-lg-6': isRVDetailForm, 'col-lg-12 col-md-12 col-sm-12': !isRVDetailForm}">

                <div class="d-flex justify-content-end gap-2 pt-3">
                    <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/rv">
                        <i class="fas fa-chevron-left"></i> Back
                    </nuxt-link>
                    <button @click="onCancelRv" class="btn btn-danger">
                        <i class="fas fa-cancel"></i> Cancel
                    </button>
                    <button type="button" class="btn btn-primary">
                        <i class="fas fa-print"></i> Print
                    </button>
                    <button v-if="isRVDetailForm" @click="updateRvDetail()" type="button" class="btn btn-success" :disabled="isUpdating">
                        <i class="fas fa-sync"></i> {{ isUpdating ? 'Updating...' : 'Update' }}
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
    import { getFullname, formatToValidHtmlDate} from '~/utils/helpers'
    import { useToast } from "vue-toastification";
    import * as rvApi from '~/composables/warehouse/rv/rv.api'
    import * as rvApproverApi from '~/composables/warehouse/rv/rv-approver.api'
    import type { Classification } from '~/composables/warehouse/canvass/canvass.types';
    import { type RV } from '~/composables/warehouse/rv/rv.types';
    import { MOBILE_WIDTH } from '~/utils/config';
    import { approvalStatus } from '~/utils/constants';
    import type { CreateApproverInput, UpdateApproverInput } from '~/composables/warehouse/rv/rv-approver.types';


    // DEPENDENCIES
    const route = useRoute()
    const router = useRouter();
    const toast = useToast();

    // FLAGS
    const isMobile = ref(false)
    const isRVDetailForm = ref(true)
    const isUpdating = ref(false)
    const isUpdatingApproverOrder = ref(false)
    const isAddingRvApprover = ref(false)
    const isEditingRvApprover = ref(false)

    
    // CONSTANTS
    const _rvDataErrorsInitial = {
        supervisor: false,
    }



    // DROPDOWNS
    const employees = ref<Employee[]>([])
    const classifications = ref<Classification[]>([])
    

    // FORM DATA
    const rvDataErrors = ref({..._rvDataErrorsInitial})
    const rvData = ref<RV>({} as RV)



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


    // ======================== INIT ========================  

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
            i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval) : null
            i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
            return i
        })

        rvData.value = data

    }





    // ======================== COMPUTED ========================  

    const rvStatus = computed( () => {

        const approvers = rvData.value.rv_approvers
        
        if(rvData.value.is_cancelled) {

            return approvalStatus[APPROVAL_STATUS.CANCELLED]

        }

        const hasDisapproved = approvers.find(i => i.status === APPROVAL_STATUS.DISAPPROVED)

        if(hasDisapproved) {
            return approvalStatus[APPROVAL_STATUS.DISAPPROVED]
        }

        const hasPending = approvers.find(i => i.status === APPROVAL_STATUS.PENDING)

        if(hasPending) {
            return approvalStatus[APPROVAL_STATUS.PENDING]
        }

        return approvalStatus[APPROVAL_STATUS.APPROVED]

    })

    // ======================== API CALLS ========================  

    async function updateRvDetail() {

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

            rvData.value.rv_approvers = response.data.rv_approvers.map(i => {
                i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval) : null
                i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
                return i
            })

        } else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }

    }

    async function cancelRv() {

        const response = await rvApi.cancel(rvData.value.id)

        if(response.success) {
            toast.success(response.msg)
            rvData.value.is_cancelled = true 

            router.push('/warehouse/purchasing/rv')

        }else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }


    } 

    async function changeApproverOrder(
        data: {id: string, order: number}[],
        modalCloseBtn: HTMLButtonElement
    ) {

        console.log('data', data)
        console.log('modalCloseBtn', modalCloseBtn)

        isUpdatingApproverOrder.value = true
        const response = await rvApproverApi.updateApproverOrder(data)
        isUpdatingApproverOrder.value = false

        if(response.success && response.approvers) {
            toast.success(response.msg)

            rvData.value.rv_approvers = response.approvers.map(i => {
                i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval) : null
                i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
                return i
            })
            modalCloseBtn.click()

        }else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }

    }
    
    async function addApprover(
        data: CreateApproverInput,
        modalCloseBtn: HTMLButtonElement
    ) {
        
        console.log('data', data)

        isAddingRvApprover.value = true
        const response = await rvApproverApi.create(rvData.value.id, data)
        isAddingRvApprover.value = false

        if(response.success && response.data) {
            toast.success(response.msg)

            const approver = response.data.approver

            approver!.fullname = getFullname(approver!.firstname, approver!.middlename, approver!.lastname)

            response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval) : null

            rvData.value.rv_approvers.push(response.data)
            modalCloseBtn.click()
        }else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }
    }
    
    async function editApprover(
        data: UpdateApproverInput,
        modalCloseBtn: HTMLButtonElement
    ) {
        isEditingRvApprover.value = true
        const response = await rvApproverApi.update(data)
        isEditingRvApprover.value = false

        if(response.success && response.data) {
            toast.success(response.msg)

            const prevApproverItemIndx = rvData.value.rv_approvers.findIndex(i => i.id === data.id)

            response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval) : null

            const a = response.data.approver

            response.data.approver!['fullname'] = getFullname(a!.firstname, a!.middlename, a!.lastname)

            rvData.value.rv_approvers[prevApproverItemIndx] = {...response.data}

            modalCloseBtn.click()

        }else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }
    }

    async function removeApprover(id: string) {

        const indx = rvData.value.rv_approvers.findIndex(i => i.id === id)

        const item = rvData.value.rv_approvers[indx]

        if(!item){
            console.error('approver not found with id of: ' + id)
            return 
        }

        Swal.fire({
            title: "Are you sure?",
            text: `${item.approver?.fullname} will be removed!`,
            position: "top",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74a3b",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: async(remove) => {
                
                if(remove) {
                    const response = await rvApproverApi.remove(item.id)

                    if(response.success) {
                        
                        toast.success(`${item.approver?.fullname} removed!`)

                        rvData.value.rv_approvers.splice(indx, 1)

                    }else {

                        Swal.fire({
                            title: 'Error!',
                            text: response.msg,
                            icon: 'error',
                            position: 'top',
                        })

                    }
                }

            },
            allowOutsideClick: () => !Swal.isLoading()
        })

    }
    
    // ======================== VALIDATIONS ========================  
    
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




    // ======================== BUTTONS ========================  



    async function onCancelRv() {

        Swal.fire({
            title: "Are you sure?",
            text: `This RV will be cancelled!`,
            position: "top",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74a3b",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, cancel it!",
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: async(remove) => {
                
                if(remove) {
                    await cancelRv()
                }

            },
            allowOutsideClick: () => !Swal.isLoading()
        })

    }



    // ======================== UTILS ========================  
    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }




</script>


