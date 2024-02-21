<template>
    <div v-if="rvData && rvData.canvass" class="mb-3">
        <h2 class="text-warning">Update RV</h2>
        <hr>

        <div class="row">
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
                    <button type="button" class="btn btn-danger">
                        <i class="fas fa-cancel"></i> Cancel
                    </button>
                    <button type="button" class="btn btn-primary">
                        <i class="fas fa-print"></i> Print
                    </button>
                    <button @click="updateRvDetail()" type="button" class="btn btn-success" :disabled="isUpdating">
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
                                    <th class="bg-secondary text-white">Order</th>
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
                                        {{ getFullname(item.approver!.firstname, item.approver!.middlename, item.approver!.lastname) }}
                                    </td>
                                    <td class="text-muted text-center align-middle">
                                        <div :class="{[`badge bg-${approvalStatus[item.status].color}`]: true}"> 
                                            {{ approvalStatus[item.status].label }} 
                                        </div>
                                        <div class="fst-italic" v-if="item.date_approval">
                                            <small> {{ item.date_approval }} </small>
                                        </div>
                                    </td>
                                    <td class="text-muted align-middle">
                                        <textarea class="form-control" rows="3" v-model="item.notes" readonly></textarea>
                                    </td>
                                    <td class="text-center align-middle">
                                        <button class="btn btn-sm btn-light w-50">
                                            <i class="fas fa-trash text-danger"></i>
                                        </button>
                                        <button class="btn btn-sm btn-light w-50">
                                            <i class="fas fa-edit text-primary"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="7">
                                        <div class="text-center">
                                            <button @click="onClickAddApprover" class="btn btn-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#addApproverModal">
                                                <i class="fas fa-plus-circle"></i> Add Approver
                                            </button>
                                            <button @click="onClickChangeApprover" class="btn btn-sm btn-dark" data-bs-toggle="modal" data-bs-target="#changeApproverOrderModal">
                                                <i class="fas fa-sort"></i> Change Order
                                            </button>
                                        </div>
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
                    <button type="button" class="btn btn-danger">
                        <i class="fas fa-cancel"></i> Cancel
                    </button>
                    <button type="button" class="btn btn-primary">
                        <i class="fas fa-print"></i> Print
                    </button>
                </div>

            </div>

        </div>

        <!-- Change approver order modal-->
        <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="changeApproverOrderModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-warning" id="exampleModalLabel">Change Order</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <small class="text-muted fst-italic">
                        Drag items to reorder
                    </small>

                    <div class="pt-4">
                        <draggable
                            v-model="approvers"
                            item-key="id"
                            tag="div"
                            :component-data="{
                                tag: 'ul',
                                type: 'transition-group',
                                name: !drag ? 'flip-list' : null
                            }"
                            v-bind="dragOptions"
                            @start="drag = true"
                            @end="drag = false"
                        >
                            <template #item="{ element }">
                                <div class="draggable-item position-relative">

                                    <span class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-primary">
                                        <!-- add counter here -->
                                        {{ getCounter(element) }}
                                    </span>

                                    <div class="row">
                                        <div class="col">                                            
                                            <span> {{ element.label }} </span>
                                        </div>
                                        <div class="col">
                                            <span class="text-muted fst-italic">
                                                {{ element.approver.fullname }} 
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </draggable>
                    </div>
                        
                        
                </div>
                <div class="modal-footer">
                    <button @click="onCloseChangeOrderModal" ref="closeChangeOrderModal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-close"></i> Close
                    </button>
                    <button @click="updateApproverOrder" type="button" class="btn btn-primary" :disabled="isUpdatingApproverOrder">
                        <i class="fas fa-save"></i> {{ isUpdatingApproverOrder ? 'Saving...' : 'Save' }}
                    </button>
                </div>
                </div>
            </div>
        </div>


        <!-- Add approver modal-->
        <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="addApproverModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-warning" id="exampleModalLabel">
                        {{ isRvApproverModalAdd ? 'Add' : 'Edit' }} Approver
                    </h5>
                    <button @click="onCloseAddApproverModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    
                    <div class="mb-3">
                        <label class="form-label">
                            Approver <span class="text-danger">*</span>
                        </label>
                        <client-only>
                            <v-select :options="employees" label="fullname" v-model="addApproverData.approver"></v-select>
                        </client-only>
                        <small class="text-danger fst-italic" v-show="addApproverErrors.approver">
                            This field is required
                        </small>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">
                            Label <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" v-model="addApproverData.label">
                        <small class="text-danger fst-italic" v-show="addApproverErrors.label">
                            This field is required
                        </small>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">
                            Order
                        </label>
                        <input type="number" class="form-control" :value="addApproverData.order" disabled>
                    </div>
                        
                </div>
                <div class="modal-footer">
                    <button @click="onCloseAddApproverModal" ref="closeAddApproverModal" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-close"></i> Close
                    </button>
                    <button @click="addApprover" class="btn btn-primary" :disabled="isAddingRvApprover">
                        <i class="fas fa-user-plus"></i> {{ isAddingRvApprover ? 'Adding...' : 'Add' }}
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
    import moment from 'moment';
    import { getFullname, formatToValidHtmlDate, formatDate } from '~/utils/helpers'
    import { useToast } from "vue-toastification";
    import * as rvApi from '~/composables/warehouse/rv/rv.api'
    import type { Classification, Employee } from '~/composables/warehouse/canvass/canvass.types';
    import { APPROVAL_STATUS, type CreateRvApproverInput, type RV, type RVApprover, type UpdateRvInput } from '~/composables/warehouse/rv/rv.types';
    import { MOBILE_WIDTH } from '~/utils/config';
    import { approvalStatus } from '~/utils/constants';

    const drag = ref(false)

    const dragOptions = {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
    };

    const route = useRoute()
    const router = useRouter();

    const isMobile = ref(false)
    const isRVDetailForm = ref(true)
    const isUpdating = ref(false)
    const isUpdatingApproverOrder = ref(false)
    const isRvApproverModalAdd = ref(false)
    const isAddingRvApprover = ref(false)
    const isEditingRvApprover = ref(false)

    const toast = useToast();
    const today = moment().format('YYYY-MM-DD')

    const _rvDataErrorsInitial = {
        supervisor: false,
    }
    const _addApproverInitial: CreateRvApproverInput = {
        rv_id: '',
        approver: null,
        label: '',
        order: 0
    }
    const _addApproverErrorsInitial = {
        approver: false,
        label: false
    }

    const closeChangeOrderModal = ref<HTMLButtonElement>()
    const closeAddApproverModal = ref<HTMLButtonElement>()
    const rvDataErrors = ref({..._rvDataErrorsInitial})
    const rvData = ref<RV>({} as RV)
    const employees = ref<Employee[]>([])
    const classifications = ref<Classification[]>([])
    const approvers = ref<RVApprover[]>([])
    const addApproverData = ref<CreateRvApproverInput>({..._addApproverInitial})
    const addApproverErrors = ref({..._addApproverErrorsInitial})

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

    function getCounter(element: RVApprover) {
        return approvers.value.indexOf(element) + 1;
    }

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
            i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
            return i
        })

        rvData.value = data

    }

    async function updateRvDetail() {

        console.log('update')

        if(!isValid()){
            return 
        }

        console.log('updating...')

        isUpdating.value = true
        const response = await rvApi.updateRV(rvData.value.id, rvData.value)
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

    async function updateApproverOrder() {

        // Create a shallow copy of the array
        const _approvers = approvers.value.map(approver => ({ ...approver }))

        let ctr = 1
        for(let approver of _approvers) {
            approver.order = ctr 
            ctr++
        }

        const data = _approvers.map(i => {
            return {
                id: i.id,
                order: i.order
            }
        })

        console.log('data', data)

        isUpdatingApproverOrder.value = true
        const response = await rvApi.updateApproverOrder(data)
        isUpdatingApproverOrder.value = false

        if(response.success && response.approvers) {
            toast.success(response.msg)
            rvData.value.rv_approvers = response.approvers
            closeChangeOrderModal.value?.click()

        }else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }
        
    }

    async function addApprover() {

        if(!isValidAddApprover()){
            return 
        }

        isAddingRvApprover.value = true
        const response = await rvApi.createRvApprover(addApproverData.value)
        isAddingRvApprover.value = false

        if(response.success && response.data) {
            toast.success(response.msg)
            rvData.value.rv_approvers.push(response.data)
            closeAddApproverModal.value?.click()
        }else {
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

    function isValidAddApprover(): boolean {

        addApproverErrors.value = {..._addApproverErrorsInitial}

        if(!addApproverData.value.approver) {
            addApproverErrors.value.approver = true
        }

        if(addApproverData.value.label.trim() === '') {
            addApproverErrors.value.label = true
        }

        const hasError = Object.values(addApproverErrors.value).includes(true);

        if(hasError) {
            return false
        }

        return true

    }

    function onClickChangeApprover() {
        approvers.value = [...rvData.value.rv_approvers]
    }

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }

    function onCloseChangeOrderModal() {
        approvers.value = []
    }

    function onCloseAddApproverModal() {
        addApproverData.value = {..._addApproverInitial}
        addApproverErrors.value = {..._addApproverErrorsInitial}
    }

    function onClickAddApprover() {
        isRvApproverModalAdd.value = true
        addApproverData.value.order = rvData.value.rv_approvers.length + 1
        addApproverData.value.rv_id = rvData.value.id
    }

</script>


<style scoped>
    .draggable-item {
        cursor: pointer;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 8px;
        margin-bottom: 20px;
        background-color: #f9f9f9;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05); /* Increased elevation and shadow */
    }

    .draggable-item:hover {
        background-color: #f0f0f0; 
    }

    .flip-list-move {
        transition: transform 0.5s;
    }

    .no-move {
        transition: transform 0s;
    }

    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }

    .list-group {
        min-height: 20px;
    }

    .list-group-item {
        cursor: move;
    }

    .list-group-item i {
        cursor: pointer;
    }
</style>