<template>

    <div v-if="!isLoadingPage">

        <h2 class="text-warning">Create PO</h2>
        <hr>

        <div class="row pb-3">
            <div class="col">
                <div class="row justify-content-center pt-3">

                    <div class="col-lg-6">

                        <div class="mb-3">
                            <label class="form-label">
                                MEQS Number <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select @option:selected="onMeqsSelected" :options="meqs" label="meqs_number"
                                    v-model="selectedMeqs" :clearable=false>
                                    <template v-slot:option="option">
                                        <div v-if="option.status !== APPROVAL_STATUS.APPROVED" class="row">
                                            <div class="col">
                                                <span class="text-danger">{{ option.meqs_number }}</span>
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
                                        <div v-else-if="!option.hasAvailableSupplier" class="row">
                                            <div class="col">
                                                <span class="text-danger">{{ option.meqs_number }}</span>
                                            </div>
                                            <div class="col text-end">
                                                <small class="text-muted fst-italic">
                                                    No Available Supplier
                                                </small>
                                            </div>
                                        </div>
                                        <div v-else class="row">
                                            <div class="col">
                                                <span>{{ option.meqs_number }}</span>
                                            </div>
                                            <div class="col text-end">
                                                <small class="text-success fst-italic"> Available </small>
                                            </div>
                                        </div>
                                    </template>
                                </v-select>
                            </client-only>
                            <nuxt-link v-if="selectedMeqs" class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/purchasing/meqs/view/' + selectedMeqs.id" target="_blank">View MEQS
                                details</nuxt-link>
                        </div>

                        <div v-if="selectedMeqs" class="mb-3">
                            <label class="form-label">
                                Supplier <span class="text-danger">*</span>
                            </label>
                            <v-select @option:selected="onSupplierSelected" :options="suppliers" label="label"
                                v-model="poData.meqs_supplier">
                                <template v-slot:option="option">
                                    <div v-if="option.is_referenced" class="row">
                                        <div class="col">
                                            <span class="text-danger">{{ option.label }}</span>
                                        </div>
                                        <div class="col text-end">
                                            <small class="text-muted fst-italic">
                                                Referenced
                                            </small>
                                        </div>
                                    </div>
                                    <div v-else class="row">
                                        <div class="col">
                                            <span>{{ option.label }}</span>
                                        </div>
                                        <div class="col text-end">
                                            <small class="text-success fst-italic"> Available </small>
                                        </div>
                                    </div>
                                </template>
                            </v-select>
                        </div>

                        <div v-if="poData.meqs_supplier" class="mb-3">
                            <label class="form-label">
                                Vat
                            </label>
                            <input type="text" class="form-control" disabled
                                :value="VAT[poData.meqs_supplier.supplier!.vat_type].label">
                        </div>

                        <div v-if="selectedMeqs" class="mb-3">
                            <label class="form-label">
                                Notes
                            </label>
                            <textarea class="form-control" rows="3"></textarea>
                        </div>

                        <div class="d-flex justify-content-between">
                            <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/po">
                                <i class="fas fa-chevron-left"></i> Back to Search
                            </nuxt-link>
                            <button @click="save()" type="button" class="btn btn-primary"
                                :disabled="isSaving || !canSave">
                                <i class="fas fa-save"></i> {{ isSaving ? 'Saving...' : 'Save' }}
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>

        <div v-if="selectedMeqs && poData.meqs_supplier" class="h5wrapper mb-3 pt-5">
            <hr class="result">
            <h5 class="text-warning fst-italic">
                <i class="fas fa-shopping-cart"></i> Items
            </h5>
            <hr class="result">
        </div>

        <div v-if="selectedMeqs && poData.meqs_supplier" class="row pb-3">
            <div class="col">
                <div class="table-responsive">
                    <table class="table table-hover table-sm">
                        <thead>
                            <tr>
                                <th class="bg-secondary text-white">No</th>
                                <th class="bg-secondary text-white">Description</th>
                                <th class="bg-secondary text-white">Brand</th>
                                <th class="bg-secondary text-white">Unit</th>
                                <th class="bg-secondary text-white">Qty</th>
                                <th class="bg-secondary text-white">VAT</th>
                                <th class="bg-secondary text-white">Price/Unit</th>
                                <th class="bg-secondary text-white">Vat/Unit</th>
                                <th class="bg-secondary text-white">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item, i in supplierItems">
                                <td class="text-muted"> {{ i + 1 }} </td>
                                <td class="text-muted"> {{ item.canvass_item.description }} </td>
                                <td class="text-muted"> {{ item.canvass_item.brand ? item.canvass_item.brand.name :
        'N/A' }}
                                </td>
                                <td class="text-muted"> {{ item.canvass_item.unit ? item.canvass_item.unit.name : 'N/A'
                                    }} </td>
                                <td class="text-muted"> {{ item.canvass_item.quantity }} </td>
                                <td class="text-muted"> {{ VAT[item.vat_type].label }} </td>
                                <td class="text-muted"> {{ formatToPhpCurrency(item.price) }} </td>
                                <td class="text-muted"> {{ formatToPhpCurrency(getVatAmount(item.price, item.vat_type))
                                    }} </td>
                                <td class="text-muted">
                                    {{
        formatToPhpCurrency(getTotalNetPrice({
            pricePerUnit: item.price,
            vatPerUnit: getVatAmount(item.price, item.vat_type),
            quantity: item.canvass_item.quantity
        }))
    }}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="8" class="text-end fw-bold">
                                    Summary Total
                                </td>
                                <td class="fw-bold">
                                    {{ formatToPhpCurrency(totalPriceOfAllItems) }}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot v-show="supplierItems.length === 0">
                            <tr>
                                <td colspan="9" class="text-center">
                                    <span class="text-muted fst-italic"> No awarded items </span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>


    </div>

    <div v-else>
        <LoaderSpinner />
    </div>

</template>




<script setup lang="ts">
import type { MEQS } from '~/composables/warehouse/meqs/meqs.types';
import type { CreatePoInput } from '~/composables/warehouse/po/po.types';
import * as poApi from '~/composables/warehouse/po/po.api'
import { formatToPhpCurrency } from '~/utils/helpers'
import type { MeqsSupplier } from '~/composables/warehouse/meqs/meqs-supplier';
import Swal from 'sweetalert2'
import { getTotalNetPrice, getVatAmount } from '~/utils/helpers';

definePageMeta({
    name: ROUTES.PO_CREATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

const router = useRouter();

// FLAGS
const isSaving = ref(false)

let currentMeqsSupplier: MeqsSupplier | null = null
let currentMeqs: MEQS | null = null

const selectedMeqs = ref<MEQS | null>(null)
const meqs = ref<MEQS[]>([])

const poData = ref<CreatePoInput>({
    meqs_supplier: null,
    approvers: [],
    notes: ''
})


// ======================== LIFECYCLE HOOKS ========================  
onMounted(async () => {

    const response = await poApi.fetchFormDataInCreate()

    meqs.value = response.meqs.map(i => {

        let hasAvailabelSupplier = i.meqs_suppliers.find(j => !j.is_referenced)

        if (hasAvailabelSupplier) {
            i.hasAvailableSupplier = true
        } else {
            i.hasAvailableSupplier = false
        }

        return i

    })
    poData.value.approvers = response.approvers

    isLoadingPage.value = false

})


const suppliers = computed(() => {

    if (!selectedMeqs.value) return []

    return selectedMeqs.value.meqs_suppliers.map(i => ({ ...i, label: i.supplier?.name }))

})

const canSave = computed(() => {

    if (!selectedMeqs.value || !poData.value.meqs_supplier) return false

    if (supplierItems.value.length === 0) return false

    return true

})

const supplierItems = computed(() => {

    if (!poData.value.meqs_supplier) return []

    return poData.value.meqs_supplier.meqs_supplier_items.filter(i => i.is_awarded)


})


const totalPriceOfAllItems = computed(() => {

    if (supplierItems.value.length === 0) return 0

    let totalPrice = 0

    for (let item of supplierItems.value) {

        const totalPriceOfItem = getTotalNetPrice({
            pricePerUnit: item.price,
            vatPerUnit: getVatAmount(item.price, item.vat_type),
            quantity: item.canvass_item.quantity
        })

        totalPrice += totalPriceOfItem

    }

    return totalPrice

})


async function save() {
    console.log('save')

    console.log('saving...')

    isSaving.value = true
    const response = await poApi.create(poData.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/purchasing/po/view/${response.data.id}`);
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }
}

function onMeqsSelected(payload: MEQS) {
    console.log('onMeqsSelected()', payload)

    resetSupplier()

    if (payload.status === APPROVAL_STATUS.APPROVED && payload.hasAvailableSupplier) {
        currentMeqs = payload
    } else {
        if (currentMeqs) {
            selectedMeqs.value = currentMeqs
        } else {
            selectedMeqs.value = null
        }
    }
}

function onSupplierSelected(payload: MeqsSupplier) {
    console.log('onSupplierSelected()', payload)
    if (payload.is_referenced) {
        if (currentMeqsSupplier) {
            poData.value.meqs_supplier = currentMeqsSupplier
        } else {
            poData.value.meqs_supplier = null
        }
    } else {
        currentMeqsSupplier = payload
    }
}

function resetSupplier() {
    poData.value.meqs_supplier = null
    currentMeqsSupplier = null
}

</script>