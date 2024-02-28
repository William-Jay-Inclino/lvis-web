<template>

    <div v-if="meqsData && reference && !meqsData.is_cancelled && !meqsData.is_deleted">
        <h2 class="text-warning">Update MEQS</h2>
        <hr>

        <div class="row pt-3">
            <div class="col">
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item" @click="isMEQSDetailForm = true">
                        <a class="nav-link" :class="{'active': isMEQSDetailForm}" href="#">
                            <i class="fas fa-info-circle"></i> MEQS Info
                        </a>
                    </li>
                    <li class="nav-item" @click="isMEQSDetailForm = false">
                        <a class="nav-link" :class="{'active': !isMEQSDetailForm}" href="#">
                            <i class="fas fa-users"></i> Approvers
                        </a>
                    </li>
                </ul>
            </div>
        </div>


        <div v-show="isMEQSDetailForm" class="row justify-content-center pt-5">

            <div class="col-lg-6">

                <div class="mb-3 d-flex align-items-center">
                    <label class="form-label me-2 mb-0">Status:</label>
                    <div :class="{[`badge bg-${meqsStatus.color}`]: true}"> 
                        {{ meqsStatus.label }} 
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Reference</label>
                    <input type="text" class="form-control" :value="referenceNumber" disabled>
                    <nuxt-link v-if="meqsData.rv" class="btn btn-sm btn-light text-primary" :to="'/warehouse/purchasing/rv/view/' + meqsData.rv.id" target="_blank">View info</nuxt-link>
                </div>

                <div class="mb-3">
                    <label class="form-label">Requisitioner</label>
                    <input type="text" class="form-control" :value="getFullname(reference!.canvass.requested_by!.firstname, reference!.canvass.requested_by!.middlename, reference!.canvass.requested_by!.lastname)" disabled>
                </div>

                <div class="mb-3">
                    <label class="form-label">Requisitioner Purpose</label>
                    <input type="text" class="form-control" :value="reference.canvass.purpose" disabled>
                </div>

                <div class="mb-3">
                    <label class="form-label">Requisitioner Notes</label>
                    <input type="text" class="form-control" :value="reference.canvass.notes" disabled>
                </div>

                <div class="mb-3">
                    <label class="form-label">Notes</label>
                    <textarea v-model="meqsData.notes" class="form-control" rows="3"></textarea>
                    <small class="text-muted fst-italic">This note will be use during print out</small>
                </div>

            </div>

        </div>


        <div v-show="!isMEQSDetailForm" class="row justify-content-center pt-5">
            
            <div class="col-12">
                <WarehouseApprover 
                    :approvers="meqsData.meqs_approvers"
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
            <div :class="{'col-lg-6': isMEQSDetailForm, 'col-12': !isMEQSDetailForm}">
                <div class="d-flex justify-content-between pt-3">
                    <div>
                        <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/meqs">
                            <i class="fas fa-chevron-left"></i> Back to Search
                        </nuxt-link>
                    </div>
                    <div>
                        <button @click="onCancelMeqs" class="btn btn-danger me-2">
                            <i class="fas fa-cancel"></i> Cancel
                        </button>
                        <button type="button" class="btn btn-primary me-2">
                            <i class="fas fa-print"></i> Print
                        </button>
                        <button v-if="isMEQSDetailForm" @click="updateMeqsInfo()" type="button" class="btn btn-success" :disabled="isUpdating">
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
    import type { MEQS } from '~/composables/warehouse/meqs/meqs.types';
    import * as meqsApi from '~/composables/warehouse/meqs/meqs.api'
    import * as meqsApproverApi from '~/composables/warehouse/meqs/meqs-approver.api'

    // DEPENDENCIES
    const route = useRoute()
    const router = useRouter();
    const toast = useToast();

    // FLAGS
    const isMobile = ref(false)
    const isMEQSDetailForm = ref(true)
    const isUpdating = ref(false)
    const isUpdatingApproverOrder = ref(false)
    const isAddingApprover = ref(false)
    const isEditingApprover = ref(false)

    const meqsData = ref<MEQS>({} as MEQS)

    const employees = ref<Employee[]>([])

    // ======================== LIFECYCLE HOOKS ========================  

    onMounted( async() => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        let response = await meqsApi.fetchFormDataInUpdate(route.params.id as string)

        if(response && response.meqs) {
            populateForm(response.meqs)
        }

        employees.value = response.employees.map((i) => {
            i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
            return i
        })

    })


    // ======================== COMPUTED ========================  

    const meqsStatus = computed( () => {

        const approvers = meqsData.value.meqs_approvers
        
        if(meqsData.value.is_cancelled) {

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


    const reference = computed( () => {

        if(meqsData.value.rv) {
            return meqsData.value.rv
        }

    })

    const referenceNumber = computed( () => {
        if(meqsData.value.rv) {
            return 'RV#' + meqsData.value.rv.rv_number
        }
        return ''
    })


    // ======================== FUNCTIONS ========================  
    function populateForm(data: MEQS) {
        console.log('populateForm', data)
        meqsData.value = data

        data.meqs_approvers.map(i => {
            i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval) : null
            i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
            return i
        })
    }

    async function updateMeqsInfo() {
        console.log('updateMeqsInfo')

        console.log('updating...')

        isUpdating.value = true
        const response = await meqsApi.update(meqsData.value.id, meqsData.value)
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

    async function cancelMeqs() {
        const response = await meqsApi.cancel(meqsData.value.id)

        if(response.success) {
            toast.success(response.msg)
            meqsData.value.is_cancelled = true 

            // router.push('/warehouse/purchasing/meqs')

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
        const response = await meqsApproverApi.create(meqsData.value.id, data)
        isAddingApprover.value = false

        if(response.success && response.data) {
            toast.success(response.msg)

            const approver = response.data.approver

            approver!.fullname = getFullname(approver!.firstname, approver!.middlename, approver!.lastname)

            response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval) : null

            meqsData.value.meqs_approvers.push(response.data)
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
        const response = await meqsApproverApi.update(data)
        isEditingApprover.value = false

        if(response.success && response.data) {
            toast.success(response.msg)

            const prevApproverItemIndx = meqsData.value.meqs_approvers.findIndex(i => i.id === data.id)

            response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval) : null

            const a = response.data.approver

            response.data.approver!['fullname'] = getFullname(a!.firstname, a!.middlename, a!.lastname)

            meqsData.value.meqs_approvers[prevApproverItemIndx] = {...response.data}

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
        const indx = meqsData.value.meqs_approvers.findIndex(i => i.id === id)

        const item = meqsData.value.meqs_approvers[indx]

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
                    const response = await meqsApproverApi.remove(item.id)

                    if(response.success) {
                        
                        toast.success(`${item.approver?.fullname} removed!`)

                        meqsData.value.meqs_approvers.splice(indx, 1)

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
        const response = await meqsApproverApi.updateApproverOrder(data)
        isUpdatingApproverOrder.value = false

        if(response.success && response.approvers) {
            toast.success(response.msg)

            meqsData.value.meqs_approvers = response.approvers.map(i => {
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

    async function onCancelMeqs() {
        Swal.fire({
            title: "Are you sure?",
            text: `This MEQS will be cancelled!`,
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
                    await cancelMeqs()
                }

            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }

</script>