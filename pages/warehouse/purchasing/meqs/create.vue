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
                            <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/canvass">
                                <i class="fas fa-chevron-left"></i> Back
                            </nuxt-link>
                            <button @click="onClickNextStep1()" type="button" class="btn btn-primary" :disabled="!hasReference">
                                <i class="fas fa-chevron-right"></i> Next
                            </button>
                        </div>
                    </div>

                    <div v-show="currentStep === 2" class="col-lg-10 col-md-10 col-sm-12">

                        <div class="row">
                            <div class="col">
                                <WarehouseSupplier
                                  :suppliers="suppliers"
                                  :meqs_suppliers="meqsData.meqs_suppliers"
                                  :canvass_items="canvassItems" 
                                  @add-supplier="addSupplier"
                                  @edit-supplier="editSupplier"
                                />
                            </div>
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

definePageMeta({
    layout: "layout-admin"
})

const isMobile = ref(false)
const today = moment().format('YYYY-MM-DD')
const currentStep = ref(1)
const transactionTypes = ref(['RV', 'SPR', 'JO'])
const transactionType = ref<'RV' | 'SPR' | 'JO'>('RV')
const rvs = ref<RV[]>([])
const jos = ref([])
const sprs = ref([])
const suppliers = ref<Supplier[]>([])

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




const referenceIsRv = computed( (): boolean => !!meqsData.value.rv) 
const referenceIsJo = computed( (): boolean => !!meqsData.value.rv) 
const referenceIsSpr = computed( (): boolean => !!meqsData.value.rv) 
const hasReference = computed( (): boolean => !!referenceIsRv.value || !!referenceIsJo.value || !!referenceIsSpr.value )
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


function addSupplier(data: CreateMeqsSupplierSubInput) {
    console.log('addSupplier()', data)
    
    meqsData.value.meqs_suppliers.push({...data})
}

function editSupplier(data: CreateMeqsSupplierSubInput, indx: number) {
    console.log('editSupplier()', data)

    meqsData.value.meqs_suppliers[indx] = {...data}
}

function checkMobile() {
    isMobile.value = window.innerWidth < MOBILE_WIDTH
}

function onClickNextStep1() {
    currentStep.value++
}
</script>