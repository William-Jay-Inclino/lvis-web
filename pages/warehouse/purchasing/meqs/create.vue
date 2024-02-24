<template>
    <div>

        <h2 class="text-warning">Create MEQS</h2>
        <hr>

        <div class="row pt-3">
            <div class="col">
                <span class="text-secondary">
                    Step {{ currentStep }} of 4: 
                    <span v-if="currentStep === 1"> Get Reference </span>
                    <span v-if="currentStep === 2"> Add Suppliers </span>
                    <span v-if="currentStep === 3"> Add Price & Award Supplier </span>
                </span>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col">
                <div class="row justify-content-center pt-5">

                    <div v-show="currentStep === 1" class="col-lg-6">
                        <div class="mb-3">
                            <label class="form-label">Reference</label>
                            <div class="row g-0">
                                <div class="col-4">
                                    <client-only>
                                        <v-select :options="transactionTypes" v-model="transactionType" :clearable="false"></v-select>
                                    </client-only>
                                </div>
                                <div class="col-8">
                                    <client-only>
                                        <v-select :options="rvs" label="rv_number" v-model="meqsData.rv" v-show="transactionType === 'RV'"></v-select>
                                        <v-select :options="jos" label="spr_number" v-model="meqsData.spr" v-show="transactionType === 'SPR'"></v-select>
                                        <v-select :options="sprs" label="jo_number" v-model="meqsData.jo" v-show="transactionType === 'JO'"></v-select>
                                    </client-only>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner
                            </label>

                            <input type="text" :value="requisitioner" class="form-control" disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner Purpose
                            </label>
                            <textarea :value="purpose" class="form-control" rows="3" disabled></textarea>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner Notes
                            </label>
                            <textarea :value="requisitionerNotes" class="form-control" rows="3" disabled></textarea>
                        </div>

                        <div class="d-flex justify-content-end gap-2">
                            <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/meqs">
                                <i class="fas fa-chevron-left"></i> Back
                            </nuxt-link>
                            <button @click="goToStep2()" type="button" class="btn btn-primary" :disabled="!canProceedStep2">
                                <i class="fas fa-chevron-right"></i> Next
                            </button>
                        </div>
                    </div>

                    <div v-show="currentStep === 2" class="col-lg-10 col-md-11 col-sm-12">

                        <div class="row">
                            <div class="col">
                                <WarehouseMeqsSupplier
                                  :suppliers="suppliers"
                                  :meqs_suppliers="meqsData.meqs_suppliers"
                                  :canvass_items="canvassItems" 
                                  @add-supplier="addSupplier"
                                  @edit-supplier="editSupplier"
                                  @remove-supplier="removeSupplier"
                                />
                            </div>
                        </div>

                        <div class="d-flex justify-content-end gap-2">
                            <button @click="goToStep1()" type="button" class="btn btn-secondary" :disabled="!hasReference">
                                <i class="fas fa-chevron-left"></i> Back
                            </button>
                            <button @click="goToStep3()" type="button" class="btn btn-primary" :disabled="!canProceedStep3">
                                <i class="fas fa-chevron-right"></i> Next
                            </button>
                        </div>

                    </div>

                    <div v-show="currentStep === 3" class="col-12">

                        <div class="row">
                            <div class="col">
                                <WarehouseMeqsAward 
                                    :meqs_suppliers="meqsData.meqs_suppliers"
                                    :canvass_items="canvassItems"
                                    @update-price="updatePrice"
                                    @award-supplier-item="awardSupplierItem"
                                />
                            </div>
                        </div>

                        <div class="d-flex justify-content-end gap-2">
                            <button @click="goToStep2()" type="button" class="btn btn-secondary" :disabled="!hasReference">
                                <i class="fas fa-chevron-left"></i> Back
                            </button>
                            <button type="button" class="btn btn-primary" :disabled="!canProceedStep3">
                                <i class="fas fa-chevron-right"></i> Next
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import moment from 'moment';
import type { CreateMeqsInput, CreateMeqsSupplierSubInput, Supplier } from '~/composables/warehouse/meqs/meqs.types';
import type { RV } from '~/composables/warehouse/rv/rv.types';
import * as meqsApi from '~/composables/warehouse/meqs/meqs.api'
import type { CanvassItem } from '~/composables/warehouse/canvass/canvass-item.types';
import { useToast } from "vue-toastification";

definePageMeta({
    layout: "layout-admin"
})

// DEPENDENCIES
const toast = useToast();

// CONSTANTS
const isMobile = ref(false)
const today = moment().format('YYYY-MM-DD')
const transactionTypes = ref(['RV', 'SPR', 'JO'])

// ARRAYS
const rvs = ref<RV[]>([])
const jos = ref([])
const sprs = ref([])
const suppliers = ref<Supplier[]>([])

const currentStep = ref(1)
const transactionType = ref<'RV' | 'SPR' | 'JO'>('RV')


// FORM DATA
const meqsData = ref<CreateMeqsInput>({
    jo: null,
    rv: null,
    spr: null,
    notes: '',
    request_type: null,
    meqs_date: today,
    approvers: [],
    meqs_suppliers: []
})


onMounted( async() => {

    isMobile.value = window.innerWidth < MOBILE_WIDTH

    window.addEventListener('resize', checkMobile);

    const response = await meqsApi.fetchFormDataInCreate()

    rvs.value = response.rvs
    suppliers.value = response.suppliers


})



// ======================== COMPUTED ======================== 

const referenceIsRv = computed( (): boolean => !!meqsData.value.rv) 
const referenceIsJo = computed( (): boolean => !!meqsData.value.rv) 
const referenceIsSpr = computed( (): boolean => !!meqsData.value.rv) 
const hasReference = computed( (): boolean => !!referenceIsRv.value || !!referenceIsJo.value || !!referenceIsSpr.value )
const canProceedStep2 = computed( (): boolean => !!hasReference.value)
const canProceedStep3 = computed( (): boolean => meqsData.value.meqs_suppliers.length > 0)

const purpose = computed( () => {

    if(!hasReference.value) {
        return ''
    }

    if(referenceIsRv.value) return meqsData.value.rv!.canvass.purpose

    // todo: get purpose for jo and spr
    return ''

})
const requisitionerNotes = computed( () => {

    if(!hasReference.value) {
        return ''
    }

    if(referenceIsRv.value) return meqsData.value.rv!.canvass.notes

    // todo: get purpose for jo and spr
    return ''

})
const requisitioner = computed( () => {
    if(!hasReference.value) {
        return ''
    }

    let employee

    if(referenceIsRv.value){
        employee = meqsData.value.rv?.canvass.requested_by
    }

    // todo: get employee data for jo and spr

    return getFullname(employee!.firstname, employee!.middlename, employee!.lastname)
})
const canvassItems = computed( (): CanvassItem[] => {

    if(referenceIsRv.value) {

        return meqsData.value.rv!.canvass.canvass_items

    }

    return []

})



// ======================== CHILD FUNCTIONS: SUPPLIER ======================== 

function addSupplier(data: CreateMeqsSupplierSubInput) {
    console.log('addSupplier()', data)
    
    meqsData.value.meqs_suppliers.push({...data})

    toast.success('Supplier Added!')
}

function editSupplier(data: CreateMeqsSupplierSubInput, indx: number) {
    console.log('editSupplier()', data)

    meqsData.value.meqs_suppliers[indx] = {...data}

    toast.success('Supplier Edited!')
}

function removeSupplier(indx: number) {
    meqsData.value.meqs_suppliers.splice(indx, 1)

    toast.success('Supplier Removed!')
}



function updatePrice(meqsSupplier: CreateMeqsSupplierSubInput, canvass_item_id: string, price: number) {
    
    const item = meqsSupplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

    if(!item) return

    item.price = price

}

function awardSupplierItem(meqsSupplier: CreateMeqsSupplierSubInput, canvass_item_id: string) {

    // in order to toggle. Should only award 1 supplier in each canvass item
    removeAwardForAllSuppliersWith(canvass_item_id)

    const item = meqsSupplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

    if(!item) return
    
    // set the award
    item.is_awarded = true

}


function removeAwardForAllSuppliersWith(canvass_item_id: string) {

    for(let meqsSupplier of meqsData.value.meqs_suppliers) {

        const item = meqsSupplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

        if(item) {
            item.is_awarded = false
        }

    }

}




// ======================== UTILS ======================== 

const checkMobile = () => isMobile.value = window.innerWidth < MOBILE_WIDTH
const goToStep1 = () => currentStep.value = 1
const goToStep2 = () => currentStep.value = 2
const goToStep3 = () => currentStep.value = 3

</script>