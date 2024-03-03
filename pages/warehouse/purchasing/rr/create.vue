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
                        <v-select @option:selected="onPoSelected" :options="pos" label="po_number" v-model="rrData.po" :clearable="false">
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
                                <div v-else-if="option.is_referenced" class="row">
                                    <div class="col">
                                        <span class="text-danger">{{ option.po_number }}</span>
                                    </div>
                                    <div class="col text-end">
                                        <small class="text-muted fst-italic">
                                            Referenced
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
                    <nuxt-link v-if="rrData.po" class="btn btn-sm btn-light text-primary" :to="'/warehouse/purchasing/po/view/' + rrData.po.id" target="_blank">View info</nuxt-link>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Delivery Number 
                    </label>
                    <input type="text" class="form-control" v-model="rrData.delivery_number">
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Invoice <span class="text-danger">*</span>
                    </label>
                    <input type="text" class="form-control" v-model="rrData.invoice_number">
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Received By <span class="text-danger">*</span>
                    </label>
                    <client-only>
                        <v-select :options="employees" label="fullname" v-model="rrData.received_by"></v-select>
                    </client-only>
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

                    <WarehouseRRItems 
                        :items="items"
                        :brands="brands"
                        :units="units"
                        :rr-items="rrData.rr_items"
                    />

                </div>

            </div>
        </div>

        <div class="row justify-content-center pt-3">
            <div :class="{'col-6': currentStep === 1, 'col-12': currentStep === 2}">
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
                    <button @click="save()" v-show="currentStep === 2" class="btn btn-primary">
                        <i class="fas fa-save"></i> Save
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
        
    import type { Brand, Unit } from '~/composables/warehouse/canvass/canvass.types';
    import type { PO } from '~/composables/warehouse/po/po.types';
    import type { CreateRrInput } from '~/composables/warehouse/rr/rr.types';
    import * as rrApi from '~/composables/warehouse/rr/rr.api';
    import type { MeqsSupplierItem } from '~/composables/warehouse/meqs/meqs-supplier-item';
    import { itemClass } from '~/utils/constants';
import type { RrItem } from '~/composables/warehouse/rr/rr-item.types';


    // CONSTANTS
    const router = useRouter();

    // FLAGS
    const isMobile = ref(false)
    const isSaving = ref(false)

    const currentStep = ref(1)

    let currentPOselected: PO | null = null

    const pos = ref<PO[]>([])

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

    // DROPDOWNS
    const employees = ref<Employee[]>([])
    const brands = ref<Brand[]>([])
    const units = ref<Unit[]>([])
    const items = ref<Item[]>([])
    const itemClassArray = ref([
        {
            value: ITEM_CLASS.NON_STOCK,
            label: itemClass[ITEM_CLASS.NON_STOCK].label
        },
        {
            value: ITEM_CLASS.STOCK,
            label: itemClass[ITEM_CLASS.STOCK].label
        }
    ])

    const vatArray = ref([
        {
            value: VAT_TYPE.NONE,
            label: VAT[VAT_TYPE.NONE].label
        },
        {
            value: VAT_TYPE.INC,
            label: VAT[VAT_TYPE.INC].label
        },
        {
            value: VAT_TYPE.EXC,
            label: VAT[VAT_TYPE.EXC].label
        }
    ])

    // ======================== LIFECYCLE HOOKS ======================== 

    onMounted( async() => {

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

    })

    const poId = computed( () => {

        if(rrData.value.po) {
            return rrData.value.po.id
        }

        return null

    })

    watch(poId, () => {

        if(poId) {
            populateRrItems(rrData.value.po!.meqs_supplier.meqs_supplier_items)
        }

    })

    function onPoSelected(payload: PO) {
        console.log('onPoSelected()', payload)
        if(payload.status === APPROVAL_STATUS.APPROVED) {
            currentPOselected = payload
        }else {
            if(currentPOselected) {
                rrData.value.po = currentPOselected
            }else{
                rrData.value.po = null
            }
        }

    }

    function populateRrItems(items: MeqsSupplierItem[]) {

        console.log('populateRrItems()', items)

        const rrItems: RrItem[] = []

        for(let item of items) {

            const rrItem: RrItem = {
                id: '',
                item: null,
                item_brand: item.canvass_item.brand || null,
                unit: item.canvass_item.unit || null,
                item_class: ITEM_CLASS.NON_STOCK,
                quantity_delivered: 0,
                quantity_accepted: 0,
                description: item.canvass_item.description,
                vat: {
                    value: item.vat_type,
                    label: VAT[item.vat_type].label
                },
                gross_price: 0,
            }

            rrItems.push(rrItem)

        }

        console.log('rrItems', rrItems)
        rrData.value.rr_items = rrItems

    }

    function save() {
        console.log('save')
        console.log('rrData.value', rrData.value)
    }


    // ======================== UTILS ======================== 

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }

    const goToStep1 = () => currentStep.value = 1
    const goToStep2 = () => currentStep.value = 2

</script>


