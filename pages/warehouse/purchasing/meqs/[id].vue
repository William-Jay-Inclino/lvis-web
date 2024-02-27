<template>

    <div v-if="meqsData && reference">
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


    // ======================== LIFECYCLE HOOKS ========================  

    onMounted( async() => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        let response = await meqsApi.fetchFormDataInUpdate(route.params.id as string)

        if(response && response.meqs) {
            populateForm(response.meqs)
        }

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
    }

    function updateMeqsInfo() {
        console.log('updateMeqsInfo')
    }

    function cancelMeqs() {
        console.log('cancelMeqs')
    }




    // ======================== CHILD EVENTS: <WarehouseApprover> ========================  

    async function addApprover(
        data: CreateApproverInput,
        modalCloseBtn: HTMLButtonElement
    ) {
        console.log('addApprover')
    }

    async function editApprover(
        data: UpdateApproverInput,
        modalCloseBtn: HTMLButtonElement
    ) {
        console.log('editApprover')
    }

    async function removeApprover(id: string) {
        console.log('removeApprover')
    }

    async function changeApproverOrder(
        data: {id: string, order: number}[],
        modalCloseBtn: HTMLButtonElement
    ) {
        console.log('changeApproverOrder')
    }




    // ======================== UTILS ========================  

    async function onCancelMeqs() {

    }

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }

    function isValidMeqsInfo(): boolean {

        return false 

    }

</script>