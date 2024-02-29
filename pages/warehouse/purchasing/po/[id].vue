<template>

<div v-if="poData && poData.meqs_supplier && !poData.is_cancelled && !poData.is_deleted">
        <h2 class="text-warning">Update PO</h2>
        <hr>

        <div class="row pt-3">
            <div class="col">
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item" @click="isPODetailForm = true">
                        <a class="nav-link" :class="{'active': isPODetailForm}" href="#">
                            <i class="fas fa-info-circle"></i> PO Info
                        </a>
                    </li>
                    <li class="nav-item" @click="isPODetailForm = false">
                        <a class="nav-link" :class="{'active': !isPODetailForm}" href="#">
                            <i class="fas fa-users"></i> Approvers
                        </a>
                    </li>
                </ul>
            </div>
        </div>


        <div v-show="isPODetailForm" class="row justify-content-center pt-5">

            <div class="col-lg-6">

                <div class="mb-3 d-flex align-items-center">
                    <label class="form-label me-2 mb-0">Status:</label>
                    <div :class="{[`badge bg-${poStatus.color}`]: true}"> 
                        {{ poStatus.label }} 
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">PO Number</label>
                    <input type="text" class="form-control" :value="poData.po_number" disabled>
                </div>

                <div class="mb-3">
                    <label class="form-label">MEQS Number</label>
                    <input type="text" class="form-control" :value="poData.meqs_supplier.meqs.meqs_number" disabled>
                    <nuxt-link class="btn btn-sm btn-light text-primary" :to="'/warehouse/purchasing/meqs/view/' + poData.meqs_supplier.meqs.id" target="_blank">View info</nuxt-link>
                </div>

                <div class="mb-3">
                    <label class="form-label">Supplier</label>
                    <input type="text" class="form-control" :value="poData.meqs_supplier.supplier.name" disabled>
                </div>

                <div class="mb-3">
                    <label class="form-label">VAT</label>
                    <input type="text" class="form-control" :value="VAT[poData.meqs_supplier.supplier.vat_type].label" disabled>
                </div>

                <div class="mb-3">
                    <label class="form-label">Notes</label>
                    <textarea v-model="poData.notes" class="form-control" rows="3"></textarea>
                </div>

            </div>

        </div>


        <div v-show="!isPODetailForm" class="row justify-content-center pt-5">
            
            <div class="col-12">
                <WarehouseApprover 
                    :approvers="poData.po_approvers"
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
            <div :class="{'col-lg-6': isPODetailForm, 'col-12': !isPODetailForm}">
                <div class="d-flex justify-content-between pt-3">
                    <div>
                        <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/meqs">
                            <i class="fas fa-chevron-left"></i> Back to Search
                        </nuxt-link>
                    </div>
                    <div>
                        <button @click="onCancelPo" class="btn btn-danger me-2">
                            <i class="fas fa-cancel"></i> Cancel
                        </button>
                        <button type="button" class="btn btn-primary me-2">
                            <i class="fas fa-print"></i> Print
                        </button>
                        <button v-if="isPODetailForm" @click="updatePoInfo()" type="button" class="btn btn-success" :disabled="isUpdating">
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
    import type { PO } from '~/composables/warehouse/po/po.types';
    import * as poApi from '~/composables/warehouse/po/po.api'
    import * as poApproverApi from '~/composables/warehouse/po/po-approver.api'

    // DEPENDENCIES
    const route = useRoute()
    const router = useRouter();
    const toast = useToast();

    // FLAGS
    const isMobile = ref(false)
    const isPODetailForm = ref(true)
    const isUpdating = ref(false)
    const isUpdatingApproverOrder = ref(false)
    const isAddingApprover = ref(false)
    const isEditingApprover = ref(false)

    const poData = ref<PO>({} as PO)

    const employees = ref<Employee[]>([])

    // ======================== LIFECYCLE HOOKS ========================  

    onMounted( async() => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        let response = await poApi.fetchFormDataInUpdate(route.params.id as string)

        if(response && response.po) {
            populateForm(response.po)
        }

        employees.value = response.employees.map((i) => {
            i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
            return i
        })

    })


    // ======================== COMPUTED ========================  

    const poStatus = computed( () => {

        const approvers = poData.value.po_approvers
        
        if(poData.value.is_cancelled) {

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
    function populateForm(data: PO) {
        console.log('populateForm', data)
        poData.value = data

        data.po_approvers.map(i => {
            i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval) : null
            i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
            return i
        })
    }

    async function updatePoInfo() {
        console.log('updatePoInfo')

        console.log('updating...')

        isUpdating.value = true
        const response = await poApi.update(poData.value.id, poData.value)
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

    async function cancelPo() {
        const response = await poApi.cancel(poData.value.id)

        if(response.success) {
            toast.success(response.msg)
            poData.value.is_cancelled = true 

            router.push('/warehouse/purchasing/po')

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
        const response = await poApproverApi.create(poData.value.id, data)
        isAddingApprover.value = false

        if(response.success && response.data) {
            toast.success(response.msg)

            const approver = response.data.approver

            approver!.fullname = getFullname(approver!.firstname, approver!.middlename, approver!.lastname)

            response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval) : null

            poData.value.po_approvers.push(response.data)
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
        const response = await poApproverApi.update(data)
        isEditingApprover.value = false

        if(response.success && response.data) {
            toast.success(response.msg)

            const prevApproverItemIndx = poData.value.po_approvers.findIndex(i => i.id === data.id)

            response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval) : null

            const a = response.data.approver

            response.data.approver!['fullname'] = getFullname(a!.firstname, a!.middlename, a!.lastname)

            poData.value.po_approvers[prevApproverItemIndx] = {...response.data}

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
        const indx = poData.value.po_approvers.findIndex(i => i.id === id)

        const item = poData.value.po_approvers[indx]

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
                    const response = await poApproverApi.remove(item.id)

                    if(response.success) {
                        
                        toast.success(`${item.approver?.fullname} removed!`)

                        poData.value.po_approvers.splice(indx, 1)

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
        const response = await poApproverApi.updateApproverOrder(data)
        isUpdatingApproverOrder.value = false

        if(response.success && response.approvers) {
            toast.success(response.msg)

            poData.value.po_approvers = response.approvers.map(i => {
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

    async function onCancelPo() {
        Swal.fire({
            title: "Are you sure?",
            text: `This PO will be cancelled!`,
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
                    await cancelPo()
                }

            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }

</script>