<template>
    <div v-if="!isLoadingPage && authUser && authUser.user.user_employee">

        <div class="card">

            <div class="card-body">

                <h3 class="text-warning">Pending for Approval/Disapproval</h3>
                
                <hr>

                <div class="row justify-content-center pt-3">
                    <div class="col-lg-12">
        
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th class="bg-secondary text-white"> No </th>
                                        <th class="bg-secondary text-white"> Transaction </th>
                                        <th class="bg-secondary text-white"> Date </th>
                                        <th class="text-center bg-secondary text-white">
                                            Approve / Disapprove
                                        </th>
                                    </tr>
                                </thead>
        
                                <tbody>
                                    <tr v-for="item, i in pendings" :key="i">
                                        <td class="text-muted align-middle"> {{ i + 1 }} </td>
                                        <td class="text-muted align-middle">
                                            {{ item.description }}
                                            <nuxt-link class="btn btn-outline-light btn-sm"
                                                :to="getLink(item.reference_table, item.reference_number)" target="_blank">
                                                <small class="text-info fst-italic"> View details </small>
                                            </nuxt-link>
                                        </td>
                                        <td class="text-muted align-middle"> {{ formatDate(item.transaction_date) }} </td>
                                        <td class="text-center align-middle">
                                            <button @click="onClickApprove(i)" class="btn btn-light w-50" data-bs-toggle="modal"
                                                data-bs-target="#pendingModal">
                                                <i class="fas fa-check-circle text-success"></i>
                                            </button>
                                            <button @click="onDefaultDisapprove(i)" class="btn btn-light w-50">
                                                <i class="fas fa-times-circle text-danger"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
        
                            </table>
                        </div>
        
                    </div>
                </div>
        
                <!-- <EformsPendingModal v-if="isBudgetOfficer || isFinanceManager" :employee="authUser.user.user_employee.employee"
                    :pending-approval="modalData.pendingApproval" :pending-transaction="modalData.pendingTransaction"
                    :accounts="accounts" :classifications="classifications" :is-approving="isApproving"
                    :is-disapproving="isDisapproving" @approve-budget-officer="onApproveBudgetOfficer"
                    @disapprove-budget-officer="onDisapproveBudgetOfficer" @approve-finance-manager="onApproveFinanceManager"
                    @disapprove-finance-manager="onDisapproveFinanceManager" /> -->
    
            </div>

        </div>

    </div>

    <div v-else>
        <LoaderSpinner />
    </div>
</template>


<script setup lang="ts">

definePageMeta({
    layout: "layout-e-form"
})

import { PENDING_APPROVAL_TYPE, PENDING_TRANSACTION, type Pending, type PendingApproval } from '~/composables/e-forms/pendings/pendings.types';
import * as pendingsApi from '~/composables/e-forms/pendings/pendings.api'
import Swal from 'sweetalert2'
import { useToast } from "vue-toastification";
import { APPROVAL_STATUS, DB_ENTITY, type AuthUser } from '#imports';
import type { Account } from '~/composables/system/account/account';
import type { Classification } from '~/composables/system/classification/classification';
import { MODULE_MAPPER } from '~/utils/constants';

const isLoadingPage = ref(true)
const isApproving = ref(false)
const isDisapproving = ref(false)


const authUser = ref<AuthUser>()
const toast = useToast();
const pendings = ref<Pending[]>([])
const classifications = ref<Classification[]>([])
const accounts = ref<Account[]>([])

type ModalData = {
    pendingTransaction: PENDING_TRANSACTION,
    pendingApproval: PendingApproval | null,
    accounts: Account[],
    classifications: Classification[]
}

const modalData = ref<ModalData>({
    pendingTransaction: PENDING_TRANSACTION.APPROVE,
    pendingApproval: null,
    accounts: [],
    classifications: []
})

onMounted(async () => {
    authUser.value = getAuthUser()
    console.log('authUser', authUser)

    if (authUser.value.user.user_employee) {

        const response = await pendingsApi.getPendingsByEmployeeId(authUser.value.user.user_employee.employee.id)
        pendings.value = response.pendings
        classifications.value = response.classifications
        accounts.value = response.accounts
        updateTotalPendingsOfUser(authUser.value, pendings.value.length)
        isLoadingPage.value = false
    }


})

const isBudgetOfficer = computed(() => {
    if (!authUser.value) return
    if (!authUser.value.user.user_employee) return
    return !!authUser.value.user.user_employee.employee.is_budget_officer
})

const isFinanceManager = computed(() => {
    if (!authUser.value) return
    if (!authUser.value.user.user_employee) return
    return !!authUser.value.user.user_employee.employee.is_finance_manager
})

function getLink(entity: DB_ENTITY, reference_number: string) {
    const module = MODULE_MAPPER[entity]
    return `/warehouse/purchasing/${module}/view/` + reference_number
}

function updateTotalPendingsOfUser(authUser: AuthUser, totalPendings: number) {
    console.log('updateTotalPendingsOfUser()', authUser, totalPendings)
    authUser.user.user_employee!.employee.total_pending_approvals = totalPendings
    const updatedAuthUser = JSON.stringify(authUser)
    localStorage.setItem('authUser', updatedAuthUser);
}


function onClickApprove(indx: number) {
    console.log('onClickApprove', indx)
    // const item = pendings.value[indx]

    // modalData.value.pendingApproval = item
    // modalData.value.pendingTransaction = PENDING_TRANSACTION.APPROVE
}

function onClickDisapprove(indx: number) {
    console.log('onClickApprove', indx)
    // const item = pendings.value[indx]

    // modalData.value.pendingApproval = item
    // modalData.value.pendingTransaction = PENDING_TRANSACTION.DISAPPROVE
}


function onDefaultApprove(indx: number) {

    const item = pendings.value[indx]
    const status = APPROVAL_STATUS.APPROVED

    Swal.fire({
        title: "Approve Confirmation",
        text: `Are you sure you want to approve transaction ${item.description}?`,
        input: 'text',
        inputPlaceholder: 'Enter remarks (optional)...',
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Approve!",
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async (confirm) => {

            const inputValue = Swal.getInput()?.value;
            const notes = inputValue || '';

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

function onDefaultDisapprove(indx: number) {

    const item = pendings.value[indx]
    const status = APPROVAL_STATUS.DISAPPROVED


    Swal.fire({
        title: "Disapprove Confirmation",
        text: `Are you sure you want to disapprove transaction ${item.description}?`,
        input: 'text',
        inputPlaceholder: 'Enter remarks...',
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74a3b",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Disapprove!",
        reverseButtons: true,
        showLoaderOnConfirm: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to enter a remark!';
            }
        },
        preConfirm: async (confirm) => {

            const inputValue = Swal.getInput()?.value;
            const notes = inputValue || '';

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

</script>