<template>
    <div>

        <h2 class="text-warning">Warehouse Settings</h2>
        <hr>

        <div class="row">
            <div class="col">
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item" @click="rootTab = ROOT_TABS.PURCHASING">
                        <a class="nav-link" :class="{ 'active': rootTab === ROOT_TABS.PURCHASING }" href="#">
                            <i class="fas fa-shopping-cart"></i>
                            Purchasing
                        </a>
                    </li>
                    <li class="nav-item" @click="rootTab = ROOT_TABS.WAREHOUSING">
                        <a class="nav-link" :class="{ 'active': rootTab === ROOT_TABS.WAREHOUSING }" href="#">
                            <i class="fas fa-warehouse"></i>
                            Warehousing
                        </a>
                    </li>
                    <li class="nav-item" @click="rootTab = ROOT_TABS.MOTORPOOL">
                        <a class="nav-link" :class="{ 'active': rootTab === ROOT_TABS.MOTORPOOL }" href="#">

                            <i class="fas fa-car"></i>
                            Motorpool
                        </a>
                    </li>
                    <li class="nav-item" @click="rootTab = ROOT_TABS.PROJECT">
                        <a class="nav-link" :class="{ 'active': rootTab === ROOT_TABS.PROJECT }" href="#">
                            <i class="fas fa-folder-open"></i>
                            Project
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div v-if="rootTab === ROOT_TABS.PURCHASING" class="row pt-5 justify-content-center">
            <div class="col-3 border-end pe-5" style="height: 60vh">
                <ul class="nav nav-pills flex-column">
                    <li class="nav-item">
                        <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">
                            <i class="fas fa-users"></i>
                            Default Approvers
                        </a>
                    </li>
                    <li @click="onChangePurchasingTab(PURCHASING_TABS.RV_APPROVERS)" class="nav-item">
                        <a class="nav-link" :class="{ 'active': purchasingTab === PURCHASING_TABS.RV_APPROVERS }"
                            href="#">RV</a>
                    </li>
                    <li @click="onChangePurchasingTab(PURCHASING_TABS.SPR_APPROVERS)" class="nav-item">
                        <a class="nav-link" :class="{ 'active': purchasingTab === PURCHASING_TABS.SPR_APPROVERS }"
                            href="#">SPR</a>
                    </li>
                    <li @click="onChangePurchasingTab(PURCHASING_TABS.JO_APPROVERS)" class="nav-item">
                        <a class="nav-link" :class="{ 'active': purchasingTab === PURCHASING_TABS.JO_APPROVERS }"
                            href="#">JO</a>
                    </li>
                    <li @click="onChangePurchasingTab(PURCHASING_TABS.MEQS_APPROVERS)" class="nav-item">
                        <a class="nav-link" :class="{ 'active': purchasingTab === PURCHASING_TABS.MEQS_APPROVERS }"
                            href="#">MEQS</a>
                    </li>
                    <li @click="onChangePurchasingTab(PURCHASING_TABS.PO_APPROVERS)" class="nav-item">
                        <a class="nav-link" :class="{ 'active': purchasingTab === PURCHASING_TABS.PO_APPROVERS }"
                            href="#">PO</a>
                    </li>
                    <li @click="onChangePurchasingTab(PURCHASING_TABS.RR_APPROVERS)" class="nav-item">
                        <a class="nav-link" :class="{ 'active': purchasingTab === PURCHASING_TABS.RR_APPROVERS }"
                            href="#">RR</a>
                    </li>
                </ul>
            </div>

            <div class="col-1 vertical-line"></div>

            <div class="col-8">

                <div v-show="isLoadingMainContent">
                    <LoaderSpinner />
                </div>


                <div v-show="!isLoadingMainContent">
                    <div v-if="isPurchasingApproversTab">
                        <SystemSettingsApprover @add-approver="addApprover" @remove-approver="removeApprover"
                            @edit-approver="editApprover" :approvers="approvers" :employees="employees"
                            :is-adding-approver="purchasing.isAddingApprover"
                            :is-editing-approver="purchasing.isEditingApprover"
                            :is-updating-approver-order="purchasing.isUpdatingApproverOrder" />
                    </div>
                </div>


            </div>

        </div>

    </div>
</template>

<script setup lang="ts">
import type { ApproverSetting, CreateApproverSetting, UpdateApproverSetting } from '~/composables/system/settings/warehouse.types';
import * as warehouseApi from '~/composables/system/settings/warehouse.api'
import Swal from 'sweetalert2'
import { useToast } from "vue-toastification";

definePageMeta({
    layout: "layout-system"
})

const toast = useToast();

const enum ROOT_TABS {
    PURCHASING,
    WAREHOUSING,
    MOTORPOOL,
    PROJECT,
}

const enum PURCHASING_TABS {
    RV_APPROVERS,
    SPR_APPROVERS,
    JO_APPROVERS,
    MEQS_APPROVERS,
    PO_APPROVERS,
    RR_APPROVERS,
}

const isLoadingMainContent = ref(true)

const purchasing = ref({
    isAddingApprover: false,
    isEditingApprover: false,
    isUpdatingApproverOrder: false,
})

const rootTab = ref<ROOT_TABS>(ROOT_TABS.PURCHASING)
const purchasingTab = ref(PURCHASING_TABS.RV_APPROVERS)
const approvers = ref<ApproverSetting[]>([])
const employees = ref<Employee[]>([])

onMounted(async () => {

    const _approvers = await warehouseApi.findAllDefaultApprovers('rvApproverSettings')

    approvers.value = _approvers.map(i => {
        i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
        return i
    })

    const response = await warehouseApi.initPurchasingTabData()
    employees.value = response.employees.map(i => {
        i['fullname'] = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })

    isLoadingMainContent.value = false


})

const isPurchasingApproversTab = computed(() => {

    if (purchasingTab.value === PURCHASING_TABS.RV_APPROVERS) return true
    if (purchasingTab.value === PURCHASING_TABS.SPR_APPROVERS) return true
    if (purchasingTab.value === PURCHASING_TABS.JO_APPROVERS) return true
    if (purchasingTab.value === PURCHASING_TABS.MEQS_APPROVERS) return true
    if (purchasingTab.value === PURCHASING_TABS.PO_APPROVERS) return true
    if (purchasingTab.value === PURCHASING_TABS.RR_APPROVERS) return true


    return false

})

async function onChangePurchasingTab(tab: PURCHASING_TABS) {
    console.log('onChangePurchasingTab', tab)

    purchasingTab.value = tab
    isLoadingMainContent.value = true

    if (tab === PURCHASING_TABS.RV_APPROVERS) {
        approvers.value = await warehouseApi.findAllDefaultApprovers('rvApproverSettings')
        isLoadingMainContent.value = false
        return
    }

    if (tab === PURCHASING_TABS.SPR_APPROVERS) {
        approvers.value = await warehouseApi.findAllDefaultApprovers('sprApproverSettings')
        isLoadingMainContent.value = false
        return
    }

    if (tab === PURCHASING_TABS.JO_APPROVERS) {
        approvers.value = await warehouseApi.findAllDefaultApprovers('joApproverSettings')
        isLoadingMainContent.value = false
        return
    }

    if (tab === PURCHASING_TABS.MEQS_APPROVERS) {
        approvers.value = await warehouseApi.findAllDefaultApprovers('meqsApproverSettings')
        isLoadingMainContent.value = false

    }

    if (tab === PURCHASING_TABS.PO_APPROVERS) {
        approvers.value = await warehouseApi.findAllDefaultApprovers('poApproverSettings')
        isLoadingMainContent.value = false
        return
    }

    if (tab === PURCHASING_TABS.RR_APPROVERS) {
        approvers.value = await warehouseApi.findAllDefaultApprovers('rrApproverSettings')
        isLoadingMainContent.value = false
        return
    }

}

async function addApprover(payload: CreateApproverSetting, closeModalBtn: HTMLButtonElement) {
    console.log('addApprover', payload, closeModalBtn)

    let transaction = ''

    if (purchasingTab.value === PURCHASING_TABS.RV_APPROVERS) transaction = 'createRvApproverSetting'
    if (purchasingTab.value === PURCHASING_TABS.SPR_APPROVERS) transaction = 'createSprApproverSetting'
    if (purchasingTab.value === PURCHASING_TABS.JO_APPROVERS) transaction = 'createJoApproverSetting'
    if (purchasingTab.value === PURCHASING_TABS.MEQS_APPROVERS) transaction = 'createMeqsApproverSetting'
    if (purchasingTab.value === PURCHASING_TABS.PO_APPROVERS) transaction = 'createPoApproverSetting'
    if (purchasingTab.value === PURCHASING_TABS.RR_APPROVERS) transaction = 'createRrApproverSetting'


    purchasing.value.isAddingApprover = true
    const response = await warehouseApi.createApprover(payload, transaction)
    purchasing.value.isAddingApprover = false

    if (response.success && response.data) {
        toast.success(response.msg)

        const approver = response.data.approver

        approver!.fullname = getFullname(approver!.firstname, approver!.middlename, approver!.lastname)

        approvers.value.push(response.data)

        closeModalBtn.click()

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

async function removeApprover(id: string) {

    const indx = approvers.value.findIndex(i => i.id === id)

    const item = approvers.value[indx]

    if (!item) {
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
        preConfirm: async (remove) => {

            if (remove) {

                let transaction = ''

                if (purchasingTab.value === PURCHASING_TABS.RV_APPROVERS) transaction = 'removeRvApproverSetting'
                if (purchasingTab.value === PURCHASING_TABS.SPR_APPROVERS) transaction = 'removeSprApproverSetting'
                if (purchasingTab.value === PURCHASING_TABS.JO_APPROVERS) transaction = 'removeJoApproverSetting'
                if (purchasingTab.value === PURCHASING_TABS.MEQS_APPROVERS) transaction = 'removeMeqsApproverSetting'
                if (purchasingTab.value === PURCHASING_TABS.PO_APPROVERS) transaction = 'removePoApproverSetting'
                if (purchasingTab.value === PURCHASING_TABS.RR_APPROVERS) transaction = 'removeRrApproverSetting'


                const response = await warehouseApi.removeApprover(item.id, transaction)

                if (response.success) {
                    toast.success(`${item.approver?.fullname} removed!`)
                    approvers.value.splice(indx, 1)

                } else {

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

async function editApprover(
    payload: UpdateApproverSetting,
    closeModalBtn: HTMLButtonElement
) {

    let transaction = ''

    if (purchasingTab.value === PURCHASING_TABS.RV_APPROVERS) transaction = 'updateRvApproverSetting'
    if (purchasingTab.value === PURCHASING_TABS.SPR_APPROVERS) transaction = 'updateSprApproverSetting'
    if (purchasingTab.value === PURCHASING_TABS.JO_APPROVERS) transaction = 'updateJoApproverSetting'
    if (purchasingTab.value === PURCHASING_TABS.MEQS_APPROVERS) transaction = 'updateMeqsApproverSetting'
    if (purchasingTab.value === PURCHASING_TABS.PO_APPROVERS) transaction = 'updatePoApproverSetting'
    if (purchasingTab.value === PURCHASING_TABS.RR_APPROVERS) transaction = 'updateRrApproverSetting'

    purchasing.value.isEditingApprover = true
    const response = await warehouseApi.updateApprover(payload, transaction)
    purchasing.value.isEditingApprover = true

    if (response.success && response.data) {
        toast.success(response.msg)

        const prevApproverItemIndx = approvers.value.findIndex(i => i.id === payload.id)


        const a = response.data.approver

        response.data.approver!['fullname'] = getFullname(a!.firstname, a!.middlename, a!.lastname)

        approvers.value[prevApproverItemIndx] = { ...response.data }

        closeModalBtn.click()

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }
}


</script>



<style scoped>
.vertical-line {
    border-left: 1px solid black;
    height: 100%;
}
</style>