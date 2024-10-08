<template>
    <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="pendingModal" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-warning" id="exampleModalLabel">
                        Approval Confirmation
                    </h5>
                    <button @click="closeModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" v-if="pendingApproval">
                    <div class="alert alert-info" role="alert">
                        Are you sure you want to <b>APPROVE</b> transaction <b>{{
                            pendingApproval.description }}</b> ?
                    </div>
                    <div class="mb-3">
                        <label class="form-label"> Remarks </label>
                        <textarea class="form-control" rows="3" v-model="remarks"></textarea>
                        <small class="text-muted fst-italic">
                            This field is optional </small>
                        <small class="text-danger fst-italic" v-if="formErrors.remarks">
                            This field is required </small>
                    </div>
                    <div class="mb-3" v-if="employee.is_budget_officer">
                        <label class="form-label"> Classification </label>
                        <client-only>
                            <v-select :options="classifications" label="name" v-model="classification"></v-select>
                        </client-only>
                        <small class="text-danger fst-italic" v-if="formErrors.classification">
                            This field is required </small>
                    </div>
                    <div class="mb-3" v-if="employee.is_finance_manager">
                        <label class="form-label"> Fund Source </label>
                        <client-only>
                            <v-select :options="accounts" label="name" v-model="fundSource"></v-select>
                        </client-only>
                        <small class="text-danger fst-italic" v-if="formErrors.fundSource">
                            This field is required </small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="closeModal" ref="closePendingModal" class="btn btn-secondary"
                        data-bs-dismiss="modal">
                        Cancel
                    </button>
                    <button @click="approve"
                        class="btn btn-success" :disabled="isApproving">
                        {{ isApproving ? 'Approving...' : 'Approve' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>



<script setup lang="ts">
import { type Pending } from '~/composables/e-forms/pendings/pendings.types';
import type { Account } from '~/composables/system/account/account';
import type { Employee } from '~/composables/system/employee/employee.types';

const emits = defineEmits([
    'approve-budget-officer',
    'approve-finance-manager',
])

const props = defineProps<{
    employee: Employee,
    pendingApproval: Pending | null,
    accounts: Account[],
    classifications: Classification[],
    isApproving: boolean
}>();

const _initialFormErrors = {
    remarks: false,
    classification: false,
    fundSource: false,
    account: false,
}

const closePendingModal = ref<HTMLButtonElement>()

const classification = ref<Classification>()
const fundSource = ref<Account>()
const remarks = ref('')

const formErrors = ref({ ..._initialFormErrors })

function approve() {
    console.log('approve')

    if (!isValidApprove()) return


    if (props.employee.is_budget_officer) {
        const payload = {
            pendingApproval: props.pendingApproval,
            classification: classification.value,
            remarks: remarks.value
        }
        emits('approve-budget-officer', payload, closePendingModal.value)

        return
    }


    if (props.employee.is_finance_manager) {
        const payload = {
            pendingApproval: props.pendingApproval,
            fundSource: fundSource.value,
            remarks: remarks.value
        }
        emits('approve-finance-manager', payload, closePendingModal.value)

        return
    }


}

function isValidApprove() {

    formErrors.value = { ..._initialFormErrors }

    if (!!props.employee.is_budget_officer && !classification.value) {
        formErrors.value.classification = true
    }

    if (!!props.employee.is_finance_manager && !fundSource.value) {
        formErrors.value.fundSource = true
    }

    const hasError = Object.values(formErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}


function closeModal() {
    remarks.value = ''
    classification.value = undefined
    fundSource.value = undefined
    formErrors.value = { ..._initialFormErrors }
}

</script>