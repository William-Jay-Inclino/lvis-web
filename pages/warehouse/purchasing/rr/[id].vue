<template>
<div v-if="rrData && rrData.po && !rrData.is_cancelled && !rrData.is_deleted">
        <h2 class="text-warning">Update RR</h2>
        <hr>

        <div class="row pt-3">
            <div class="col">
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item" @click="isRRDetailForm = true">
                        <a class="nav-link" :class="{'active': isRRDetailForm}" href="#">
                            <i class="fas fa-info-circle"></i> RR Info
                        </a>
                    </li>
                    <li class="nav-item" @click="isRRDetailForm = false">
                        <a class="nav-link" :class="{'active': !isRRDetailForm}" href="#">
                            <i class="fas fa-users"></i> Approvers
                        </a>
                    </li>
                </ul>
            </div>
        </div>


        <div v-show="isRRDetailForm" class="row justify-content-center pt-5">

            <div class="col-lg-6">

                <div class="mb-3 d-flex align-items-center">
                    <label class="form-label me-2 mb-0">Status:</label>
                    <div :class="{[`badge bg-${rrStatus.color}`]: true}"> 
                        {{ rrStatus.label }} 
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">RR Number</label>
                    <input type="text" class="form-control" :value="rrData.rr_number" disabled>
                    <nuxt-link class="btn btn-sm btn-light text-primary" :to="'/warehouse/purchasing/rr/view/' + rrData.id" target="_blank">View RR details</nuxt-link>
                </div>

                <div class="mb-3">
                    <label class="form-label">PO Number</label>
                    <input type="text" class="form-control" :value="rrData.po.po_number" disabled>
                    <nuxt-link class="btn btn-sm btn-light text-primary" :to="'/warehouse/purchasing/po/view/' + rrData.po.id" target="_blank">View PO details</nuxt-link>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Delivery Number 
                    </label>
                    <input type="text" class="form-control" v-model="rrData.delivery_number">
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Delivery Charge
                    </label>
                    <input type="number" class="form-control" v-model="rrData.delivery_charge">
                    <small class="text-danger fst-italic" v-if="rrDataErrors.delivery_charge"> This field is invalid </small>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Invoice <span class="text-danger">*</span>
                    </label>
                    <input type="text" class="form-control" v-model="rrData.invoice_number">
                    <small class="text-danger fst-italic" v-if="rrDataErrors.invoice_number"> This field is required </small>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Received By <span class="text-danger">*</span>
                    </label>
                    <client-only>
                        <v-select :options="employees" label="fullname" v-model="rrData.received_by" :clearable="false"></v-select>
                    </client-only>
                </div>

                <div class="mb-3">
                    <label class="form-label">Notes</label>
                    <textarea v-model="rrData.notes" class="form-control" rows="3"></textarea>
                </div>

            </div>

        </div>


        <div v-show="!isRRDetailForm" class="row justify-content-center pt-5">
            
            <div class="col-12">
                <WarehouseApprover 
                    :approvers="rrData.rr_approvers"
                    :employees="employees"
                    :isUpdatingApproverOrder="isUpdatingApproverOrder"
                    :isAddingApprover="isAddingApprover"
                    :isEditingApprover="isEditingApprover"
                    @changeApproverOrder="changeApproverOrder"
                    @addApprover="addApprover"
                    @editApprover="editApprover"
                    @removeApprover="removeApprover"
                />
            </div>

        </div>


        <div class="row justify-content-center pt-3">
            <div :class="{'col-lg-6': isRRDetailForm, 'col-12': !isRRDetailForm}">
                <div class="d-flex justify-content-between pt-3">
                    <div>
                        <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/rr">
                            <i class="fas fa-chevron-left"></i> Back to Search
                        </nuxt-link>
                    </div>
                    <div>
                        <button @click="onCancelRr" class="btn btn-danger me-2">
                            <i class="fas fa-cancel"></i> Cancel
                        </button>
                        <button type="button" class="btn btn-primary me-2">
                            <i class="fas fa-print"></i> Print
                        </button>
                        <button v-if="isRRDetailForm" @click="updateRrInfo()" type="button" class="btn btn-success" :disabled="isUpdating">
                            <i class="fas fa-sync"></i> {{ isUpdating ? 'Updating...' : 'Update' }}
                        </button>
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
    import { getFullname, formatToValidHtmlDate} from '~/utils/helpers'
    import { MOBILE_WIDTH } from '~/utils/config';
    import { useToast } from "vue-toastification";
    import type { RR, UpdateRrInput } from '~/composables/warehouse/rr/rr.types';
    import * as rrApi from '~/composables/warehouse/rr/rr.api'
    import * as rrApproverApi from '~/composables/warehouse/rr/rr-approver.api'

    // DEPENDENCIES
    const route = useRoute()
    const router = useRouter();
    const toast = useToast();

    // FLAGS
    const isMobile = ref(false)
    const isRRDetailForm = ref(true)
    const isUpdating = ref(false)
    const isUpdatingApproverOrder = ref(false)
    const isAddingApprover = ref(false)
    const isEditingApprover = ref(false)

    const _rrDataErrorsInitial = {
        invoice_number: false,
        delivery_charge: false,
    }

    const rrData = ref<RR>({} as RR)
    const rrDataErrors = ref({..._rrDataErrorsInitial})

    const employees = ref<Employee[]>([])

    // ======================== LIFECYCLE HOOKS ========================  

    onMounted( async() => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        let response = await rrApi.fetchFormDataInUpdate(route.params.id as string)

        if(response && response.rr) {
            populateForm(response.rr)
        }

        employees.value = response.employees.map((i) => {
            i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
            return i
        })

    })


    // ======================== COMPUTED ========================  

    const rrStatus = computed( () => {

        const approvers = rrData.value.rr_approvers
        
        if(rrData.value.is_cancelled) {

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


    // ======================== FUNCTIONS ========================  
    function populateForm(data: RR) {
        console.log('populateForm', data)

        const emp = data.received_by 

        data.received_by.fullname = getFullname(emp.firstname, emp.middlename, emp.lastname)

        rrData.value = data

        data.rr_approvers.map(i => {
            i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval) : null
            i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
            return i
        })
    }

    async function updateRrInfo() {
        console.log('updatePoInfo')

        console.log('updating...')

        // const data: UpdateRrInput = {
        //     received_by: rrData.value.received_by,
        //     invoice_number: rrData.value.invoice_number,
        //     delivery_number: rrData.value.delivery_number,
        //     notes: rrData.value.notes,
        //     delivery_charge: rrData.value.delivery_charge,
        // }

        isUpdating.value = true
        const response = await rrApi.update(rrData.value.id, rrData.value)
        isUpdating.value = false

        if(response.success && response.data) {
            Swal.fire({
                title: 'Success!',
                text: response.msg,
                icon: 'success',
                position: 'top',
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

    async function cancelRr() {
        const response = await rrApi.cancel(rrData.value.id)

        if(response.success) {
            toast.success(response.msg)
            rrData.value.is_cancelled = true 

            router.push('/warehouse/purchasing/rr')

        }else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }
    }




    // ======================== CHILD EVENTS: <WarehouseApprover> ========================  

    async function addApprover(
        data: CreateApproverInput,
        modalCloseBtn: HTMLButtonElement
    ) {
        console.log('data', data)

        isAddingApprover.value = true
        const response = await rrApproverApi.create(rrData.value.id, data)
        isAddingApprover.value = false

        if(response.success && response.data) {
            toast.success(response.msg)

            const approver = response.data.approver

            approver!.fullname = getFullname(approver!.firstname, approver!.middlename, approver!.lastname)

            response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval) : null

            rrData.value.rr_approvers.push(response.data)
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
        isEditingApprover.value = true
        const response = await rrApproverApi.update(data)
        isEditingApprover.value = false

        if(response.success && response.data) {
            toast.success(response.msg)

            const prevApproverItemIndx = rrData.value.rr_approvers.findIndex(i => i.id === data.id)

            response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval) : null

            const a = response.data.approver

            response.data.approver!['fullname'] = getFullname(a!.firstname, a!.middlename, a!.lastname)

            rrData.value.rr_approvers[prevApproverItemIndx] = {...response.data}

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
        const indx = rrData.value.rr_approvers.findIndex(i => i.id === id)

        const item = rrData.value.rr_approvers[indx]

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
                    const response = await rrApproverApi.remove(item.id)

                    if(response.success) {
                        
                        toast.success(`${item.approver?.fullname} removed!`)

                        rrData.value.rr_approvers.splice(indx, 1)

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

    async function changeApproverOrder(
        data: {id: string, order: number}[],
        modalCloseBtn: HTMLButtonElement
    ) {
        console.log('data', data)
        console.log('modalCloseBtn', modalCloseBtn)

        isUpdatingApproverOrder.value = true
        const response = await rrApproverApi.updateApproverOrder(data)
        isUpdatingApproverOrder.value = false

        if(response.success && response.approvers) {
            toast.success(response.msg)

            rrData.value.rr_approvers = response.approvers.map(i => {
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




    // ======================== UTILS ========================  

    async function onCancelRr() {
        Swal.fire({
            title: "Are you sure?",
            text: `This RR will be cancelled!`,
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
                    await cancelRr()
                }

            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }

</script>