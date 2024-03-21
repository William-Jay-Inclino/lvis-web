<template>
    <div>

        <h2 class="text-warning">Create RR</h2>
        <hr>

        <div class="row pt-3">
            <div class="col">
                <span class="text-secondary">
                    Step {{ currentStep }} of 2:
                    <span v-if="currentStep === 1"> Fill up RR info </span>
                    <span v-if="currentStep === 2"> Add Items </span>
                </span>
            </div>
        </div>

        <div v-show="currentStep === 1" class="row justify-content-center pt-5">
            <div class="col-lg-6">

                <div class="mb-3">
                    <label class="form-label">
                        PO Number <span class="text-danger">*</span>
                    </label>
                    <client-only>
                        <v-select @option:selected="onPoSelected" :options="pos" label="po_number" v-model="rrData.po"
                            :clearable="false">
                            <template v-slot:option="option">
                                <div v-if="option.status !== APPROVAL_STATUS.APPROVED" class="row">
                                    <div class="col">
                                        <span class="text-danger">{{ option.po_number }}</span>
                                    </div>
                                    <div class="col text-end">
                                        <small class="text-muted fst-italic">
                                            {{
                        // @ts-ignore
                        approvalStatus[option.status].label
                    }}
                                        </small>
                                    </div>
                                </div>
                                <div v-else class="row">
                                    <div class="col">
                                        <span>{{ option.po_number }}</span>
                                    </div>
                                    <div class="col text-end">
                                        <small class="text-success fst-italic"> Available </small>
                                    </div>
                                </div>
                            </template>
                        </v-select>
                    </client-only>
                    <div>
                        <nuxt-link v-if="rrData.po" class="btn btn-sm btn-light text-primary"
                            :to="'/warehouse/purchasing/po/view/' + rrData.po.id" target="_blank">View PO
                            details</nuxt-link>
                    </div>
                    <div v-if="rrData.po && rrData.po.rrs.length > 0">
                        <small class="text-muted fst-italic"> Other assigned RR: </small>
                        <ul>
                            <li v-for="rr in rrData.po.rrs">
                                <nuxt-link :to="'/warehouse/purchasing/rr/view/' + rr.id" target="_blank">
                                    {{ rr.rr_number }}
                                </nuxt-link>
                            </li>
                        </ul>
                    </div>
                    <small class="text-danger fst-italic" v-if="rrDataErrors.po"> This field is required </small>
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
                    <small class="text-danger fst-italic" v-if="rrDataErrors.delivery_charge"> This field is invalid
                    </small>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Invoice <span class="text-danger">*</span>
                    </label>
                    <input type="text" class="form-control" v-model="rrData.invoice_number">
                    <small class="text-danger fst-italic" v-if="rrDataErrors.invoice_number"> This field is required
                    </small>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Received By <span class="text-danger">*</span>
                    </label>
                    <client-only>
                        <v-select :options="employees" label="fullname" v-model="rrData.received_by"></v-select>
                    </client-only>
                    <small class="text-danger fst-italic" v-if="rrDataErrors.received_by"> This field is required
                    </small>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Notes
                    </label>
                    <textarea class="form-control" rows="3" v-model="rrData.notes"></textarea>
                </div>

            </div>
        </div>

        <div v-show="currentStep === 2" class="row justify-content-center pt-5">
            <div class="col-12">

                <div v-if="!isMobile">

                    <WarehouseRRItems :rr-items="rrData.rr_items" />

                </div>

            </div>
        </div>

        <hr v-show="currentStep === 2">

        <div v-show="currentStep === 2" class="row justify-content-end">
            <div class="col-4">
                <div class="table-responsive">
                    <table class="table table-hover table-bordered table-striped">
                        <tbody>
                            <tr>
                                <td class="fst-italic"> Summary (Gross Total) </td>
                                <td class="fw-bold">
                                    {{ formatToPhpCurrency(grossTotalSummary) }}
                                </td>
                            </tr>
                            <tr>
                                <td class="fst-italic"> Delivery Charge </td>
                                <td class="fw-bold"> {{ formatToPhpCurrency(rrData.delivery_charge) }} </td>
                            </tr>
                            <tr>
                                <td class="fst-italic"> Total </td>
                                <td class="fw-bold">
                                    {{ formatToPhpCurrency(totalPriceSummary) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="row justify-content-center pt-3">
            <div :class="{ 'col-6': currentStep === 1, 'col-12': currentStep === 2 }">
                <div class="d-flex justify-content-between">

                    <div>
                        <nuxt-link v-show="currentStep === 1" class="btn btn-secondary" to="/warehouse/purchasing/rr">
                            <i class="fas fa-chevron-left"></i> Back to Search
                        </nuxt-link>

                        <button v-show="currentStep === 2" @click="goToStep1" class="btn btn-secondary">
                            <i class="fas fa-chevron-left"></i> Back
                        </button>

                    </div>

                    <button v-show="currentStep === 1" @click="goToStep2" class="btn btn-primary">
                        <i class="fas fa-chevron-right"></i> Next
                    </button>
                    <button @click="save()" v-show="currentStep === 2" class="btn btn-primary" :disabled="isSaving">
                        <i class="fas fa-save"></i> {{ isSaving ? 'Saving...' : 'Save' }}
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>



<script script setup lang="ts">

definePageMeta({
    layout: "layout-admin"
})

import type { PO } from '~/composables/warehouse/po/po.types';
import type { CreateRrInput } from '~/composables/warehouse/rr/rr.types';
import * as rrApi from '~/composables/warehouse/rr/rr.api';
import type { MeqsSupplierItem } from '~/composables/warehouse/meqs/meqs-supplier-item';
import type { RrItem } from '~/composables/warehouse/rr/rr-item.types';
import Swal from 'sweetalert2'
import { useToast } from "vue-toastification";
import { getNetPrice } from '~/utils/helpers';
import type { Item } from '~/composables/warehouse/item/item.type';

// CONSTANTS
const router = useRouter();
const toast = useToast();

// FLAGS
const isMobile = ref(false)
const isSaving = ref(false)

const currentStep = ref(1)

let currentPOselected: PO | null = null

const pos = ref<PO[]>([])

const _rrDataErrorsInitial = {
    po: false,
    received_by: false,
    invoice_number: false,
    delivery_charge: false,
}

const rrData = ref<CreateRrInput>({
    po: null,
    received_by: null,
    invoice_number: '',
    delivery_number: '',
    notes: '',
    delivery_charge: 0,
    approvers: [],
    rr_items: []
})

const rrDataErrors = ref({ ..._rrDataErrorsInitial })

// DROPDOWNS
const employees = ref<Employee[]>([])
const brands = ref<Brand[]>([])
const units = ref<Unit[]>([])
const items = ref<Item[]>([])

// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    isMobile.value = window.innerWidth < MOBILE_WIDTH

    window.addEventListener('resize', checkMobile);

    const response = await rrApi.fetchFormDataInCreate()

    employees.value = response.employees.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })
    brands.value = response.brands
    units.value = response.units
    rrData.value.approvers = response.approvers
    pos.value = response.pos
    items.value = response.items.map(i => ({ ...i, label: `${i.code} - ${i.name}` }))

})

const poId = computed(() => {

    if (rrData.value.po) {
        return rrData.value.po.id
    }

    return null

})

const grossTotalSummary = computed(() => {

    let ctr = 0

    for (let item of rrData.value.rr_items) {
        ctr += item.meqs_supplier_item.price * item.quantity_accepted
    }

    return ctr

})

const totalPriceSummary = computed(() => grossTotalSummary.value - rrData.value.delivery_charge)

watch(poId, () => {

    if (poId) {
        populateRrItems(rrData.value.po!.meqs_supplier.meqs_supplier_items)
    }

})

function onPoSelected(payload: PO) {
    console.log('onPoSelected()', payload)
    if (payload.status === APPROVAL_STATUS.APPROVED && !payload.is_referenced) {
        currentPOselected = payload
    } else {
        if (currentPOselected) {
            rrData.value.po = currentPOselected
        } else {
            rrData.value.po = null
        }
    }

}

function populateRrItems(items: MeqsSupplierItem[]) {

    console.log('populateRrItems()', items)

    const rrItems: RrItem[] = []

    for (let item of items) {

        if (!item.is_awarded) continue

        const vatAmount = getVatAmount(item.price, item.vat_type)
        const netPrice = getNetPrice({
            grossPrice: item.price,
            vatAmount
        })

        const rrItem: RrItem = {
            id: '',
            rr_id: '',
            meqs_supplier_item_id: item.id,
            meqs_supplier_item: item,
            quantity_accepted: -1,
            isInvalidQtyAccepted: true
        }

        rrItems.push(rrItem)

    }

    console.log('rrItems', rrItems)
    rrData.value.rr_items = rrItems

}

async function save() {
    console.log('save', rrData.value)

    if (!isValidStep2()) {
        toast.error("Unable to save. Form has an invalid quantity")
        return
    }

    console.log('saving...')

    isSaving.value = true
    const response = await rrApi.create(rrData.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/purchasing/rr/view/${response.data.id}`);
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }
}

function isValidStep1(): boolean {

    rrDataErrors.value = { ..._rrDataErrorsInitial }

    if (!rrData.value.po) {
        rrDataErrors.value.po = true
    }

    if (rrData.value.delivery_charge < 0) {
        rrDataErrors.value.delivery_charge = true
    }

    if (rrData.value.invoice_number.trim() === '') {
        rrDataErrors.value.invoice_number = true
    }

    if (!rrData.value.received_by) {
        rrDataErrors.value.received_by = true
    }

    const hasError = Object.values(rrDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true
}

function isValidStep2(): boolean {

    let isValid = true

    for (let item of rrData.value.rr_items) {

        item.isInvalidQtyAccepted = false

        if (!item.quantity_accepted || item.quantity_accepted < 0) {
            item.isInvalidQtyAccepted = true
            isValid = false
        }

    }

    return isValid

}

// ======================== CHILD FUNCTIONS <Items.vue> ======================== 

// function addItem(data: RrItem, modalCloseBtn: HTMLButtonElement) {

//     console.log('addItem', data)

//     rrData.value.rr_items.push(data)

//     modalCloseBtn.click()

//     toast.success('Item added!')

// }

// function removeItem(indx: number) {

//     console.log('removeItem', indx)

//     const rrItem = rrData.value.rr_items[indx]

//     Swal.fire({
//         title: "Are you sure?",
//         text:  `Item no. ${ indx + 1 } with description of ${rrItem.meqs_supplier_item.canvass_item.description}  will be removed!`,
//         position: "top",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#e74a3b",
//         cancelButtonColor: "#6c757d",
//         confirmButtonText: "Yes, remove it!",
//         reverseButtons: true,
//         }).then( async(result) => {
//         if (result.isConfirmed) {

//             rrData.value.rr_items.splice(indx, 1)

//             toast.success('Item removed!')

//         }
//     });



// }

// function editItem(indx: number, data: RrItem, modalCloseBtn: HTMLButtonElement) {
//     console.log('editItem', indx, data)
//     console.log('modalCloseBtn', modalCloseBtn)

//     rrData.value.rr_items[indx] = {...data}

//     modalCloseBtn.click()

//     toast.success('Item edited!')

// }

// ======================== UTILS ======================== 

function checkMobile() {
    isMobile.value = window.innerWidth < MOBILE_WIDTH
}

const goToStep1 = () => currentStep.value = 1
const goToStep2 = () => {

    if (!(isValidStep1())) return

    currentStep.value = 2

}

</script>
