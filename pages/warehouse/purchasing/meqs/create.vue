<template>
    <div>

        <h2 class="text-warning">Create MEQS</h2>
        <hr>

        <div class="row pt-3">
            <div class="col">
                <span class="text-secondary">
                    Step {{ currentStep }} of 3: 
                    <span v-show="currentStep === 1"> Add MEQS info </span>
                    <span v-show="currentStep === 2"> Add Suppliers </span>
                    <span v-show="currentStep === 3"> Add Price & Award Supplier </span>
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
                                        <!-- <v-select :options="rvs" label="rv_number" v-model="meqsData.rv" v-show="transactionType === 'RV'"></v-select> -->
                                        <v-select @option:selected="onRvNumberSelected" :options="rvs" label="rv_number" v-model="meqsData.rv">
                                            <template v-slot:option="option">
                                                <div v-if="option.status !== APPROVAL_STATUS.APPROVED" class="row">
                                                    <div class="col">
                                                        <span class="text-danger">{{ option.rv_number }}</span>
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
                                                        <span class="text-danger">{{ option.rv_number }}</span>
                                                    </div>
                                                    <div class="col text-end">
                                                        <small class="text-muted fst-italic">
                                                            Referenced
                                                        </small>
                                                    </div>
                                                </div>
                                                <div v-else class="row">
                                                    <div class="col">
                                                        <span>{{ option.rv_number }}</span>
                                                    </div>
                                                    <div class="col text-end">
                                                        <small class="text-success fst-italic"> Available </small>
                                                    </div>
                                                </div>
                                            </template>
                                        </v-select>
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

                        <div class="mb-3">
                            <label class="form-label">
                                Notes
                            </label>
                            <textarea v-model="meqsData.notes" class="form-control" rows="3"></textarea>
                            <small class="text-muted fst-italic">This note will be use during print out</small>
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
                                    :is-initial="isInitialStep3"
                                    :meqs_suppliers="meqsData.meqs_suppliers"
                                    :canvass_items="canvassItems"
                                    @update-price="updatePrice"
                                    @award-supplier-item="awardSupplierItem"
                                    @attach-note="attachNote"
                                />
                            </div>
                        </div>

                        <div class="d-flex justify-content-end gap-2 mt-3">
                            <button @click="goToStep2()" type="button" class="btn btn-secondary" :disabled="!hasReference">
                                <i class="fas fa-chevron-left"></i> Back
                            </button>
                            <button @click="onSaveMeqs()" type="button" class="btn btn-primary" :disabled="isSavingMeqs">
                                <i class="fas fa-save"></i> {{ isSavingMeqs ? 'Saving MEQS...' : 'Save MEQS' }}
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>

        <button v-show="false" ref="requiredNotesBtn" data-bs-toggle="modal" data-bs-target="#requiredNotesModal"></button>

        <WarehouseMeqsRequiredNotes 
            :items-needing-justification="itemsNeedingJustification" 
            @update-notes="updateNotes"
            @save="saveMeqs"
        />

    </div>
</template>


<script setup lang="ts">

import moment from 'moment';
import type { CanvassItemWithSuppliers, CreateMeqsInput, CreateMeqsSupplierItemSubInput, CreateMeqsSupplierSubInput, Supplier } from '~/composables/warehouse/meqs/meqs.types';
import type { RV } from '~/composables/warehouse/rv/rv.types';
import * as meqsApi from '~/composables/warehouse/meqs/meqs.api'
import type { CanvassItem } from '~/composables/warehouse/canvass/canvass-item.types';
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2'

definePageMeta({
    layout: "layout-admin"
})

// DEPENDENCIES
const toast = useToast();
const config = useRuntimeConfig()
const router = useRouter();

// CONSTANTS
const today = moment().format('YYYY-MM-DD')
const transactionTypes = ref(['RV', 'SPR', 'JO'])
const requiredNotesBtn = ref<HTMLButtonElement>()
const API_URL = config.public.apiUrl

// FLAGS 
const isMobile = ref(false)
const isInitialStep3 = ref(true)
const isSavingMeqs = ref(false)

// ARRAYS
const rvs = ref<RV[]>([])
const jos = ref([])
const sprs = ref([])
const suppliers = ref<Supplier[]>([])

const currentStep = ref(1)
const transactionType = ref<'RV' | 'SPR' | 'JO'>('RV')

const itemsNeedingJustification = ref<CanvassItemWithSuppliers[]>([])

// Immutable state for rc number field
let currentRv: RV | null = null

// FORM DATA
const meqsData = ref<CreateMeqsInput>({
    jo: null,
    rv: null,
    spr: null,
    notes: '',
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
    meqsData.value.approvers = response.approvers

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
const rvId = computed( () => {
    if(meqsData.value.rv) {
        return meqsData.value.rv.id
    }
    return null
})




// ======================== WATCHERS ========================  
// set currentCanvass to null if rc number field is deselected
watch(rvId, (val) => {

    if(!val) {
        console.log('rv number deselected')
        currentRv = null
    }

})



// ======================== FUNCTIONS ======================== 

// check if rv is approved. If true then rollback to previous rv else set new current rv
function onRvNumberSelected(payload: RV) {
    console.log('onRvNumberSelected()', payload)

    if(payload.status === APPROVAL_STATUS.APPROVED && !payload.is_referenced) {
        currentRv = payload
    }else {
        if(currentRv) {
            meqsData.value.rv = currentRv
        }else{
            meqsData.value.rv = null
        }
    }
}

function onSaveMeqs() {

    isInitialStep3.value = false

    const isValid = isValidStep3(meqsData.value.meqs_suppliers, canvassItems.value)

    if(!isValid) {

        Swal.fire({
            title: 'The form contains errors',
            text: 'Each item must have an associated awarded supplier, and a price is mandatory. If a supplier does not offer a specific item, please set the price to -1',
            icon: 'error',
            position: 'top',
        })

        return 

    }

    const items = getItemsNeedingJustification(canvassItems.value, meqsData.value.meqs_suppliers)

    if(items.length > 0) {
        itemsNeedingJustification.value = items
        requiredNotesBtn.value?.click()
        return
    }

    saveMeqs()

}

async function saveMeqs(closeRequiredNotesBtn?: HTMLButtonElement) {
    console.log('saving MEQS...')

    // if saving meqs is from Notes component, needs to close the modal
    if(closeRequiredNotesBtn) {
        closeRequiredNotesBtn.click()
    }

    console.log('meqsData.value', meqsData.value)

    // upload attachments and update supplier.attachments of the uploaded response which is an array of sources (kung asa naka store ang images sa backend)
    for(let supplier of meqsData.value.meqs_suppliers) {

        if(supplier.attachments.length === 0) {
            continue
        }

        console.log(`uploading attachments of ${supplier.supplier?.name}...`)
        const attachmentSources = await meqsApi.uploadAttachments(supplier.attachments, API_URL)
        console.log('attachments uploaded', attachmentSources)
        if(attachmentSources) {
            supplier.attachments = attachmentSources
        }else{
            supplier.attachments = []
        }

    }

    console.log('meqsData.value', meqsData.value)

    isSavingMeqs.value = true
    const response = await meqsApi.create(meqsData.value)
    isSavingMeqs.value = false

    if(response.success && response.data) {
        router.push(`/warehouse/purchasing/meqs/success/${response.data.id}`);
    }else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

function getItemsNeedingJustification(canvassItems: CanvassItem[], meqsSuppliers: CreateMeqsSupplierSubInput[]): CanvassItemWithSuppliers[] {
    const items: CanvassItemWithSuppliers[] = []

    for(let canvassItem of canvassItems) {
        
        const itemsByCanvassId = getSupplierItemsByCanvassId(canvassItem.id, meqsSuppliers)

        const lowestPriceItem = getLowestPriceItem(itemsByCanvassId)
        const awardedItem = itemsByCanvassId.find(i => i.is_awarded)

        if(!awardedItem) {
            console.error('No awardedItem')
            continue
        }

        const isAwardedNotLowest = lowestPriceItem.meqsSupplier?.supplier?.id !== awardedItem.meqsSupplier?.supplier?.id 
        const hasEmptyNotes = awardedItem.notes.trim() === ''

        if(isAwardedNotLowest && hasEmptyNotes) {

            items.push({
                canvassItem,
                lowestPriceItem,
                awardedItem
            })

        }

    }

    return items
}

function getSupplierItemsByCanvassId(canvassId: string, suppliers: CreateMeqsSupplierSubInput[]): CreateMeqsSupplierItemSubInput[] {

    const itemsByCanvassId: CreateMeqsSupplierItemSubInput[] = []

    for(let supplier of suppliers) {

        const canvassItem = supplier.meqs_supplier_items.find(i => i.canvass_item.id === canvassId)
        if(canvassItem) {
            canvassItem.meqsSupplier = supplier 
            itemsByCanvassId.push(canvassItem)
        }

    }

    return itemsByCanvassId

}

function getLowestPriceItem(items: CreateMeqsSupplierItemSubInput[]): CreateMeqsSupplierItemSubInput {

    const getInitialItemIndx = items.findIndex(i => i.price !== -1)

    const lowestPriceItem = items.reduce((lowest, item) => {
        return (item.price < lowest.price && item.price !== -1) ? item : lowest;
    }, items[getInitialItemIndx]);

    return lowestPriceItem

}



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




// ======================== CHILD FUNCTIONS: AWARD ======================== 

function updatePrice(meqsSupplier: CreateMeqsSupplierSubInput, canvass_item_id: string, price: number) {

    console.log('updatePrice', price)
    
    const item = meqsSupplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

    if(!item) return

    item.price = price

    if(isInvalidPrice(item.price)) {
        item['invalidPrice'] = true
    } else {
        item['invalidPrice'] = false
    }

}

function awardSupplierItem(meqsSupplier: CreateMeqsSupplierSubInput, canvass_item_id: string) {

    console.log('awardSupplierItem')

    const item = meqsSupplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

    if(!item) return

    if(isInvalidPrice(item.price)) {
        toast.error('Supplier cannot be awarded if their price is invalid')
        return 
    } else if(item.price === -1) {
        toast.error('Supplier cannot be awarded if item is unavailable')
        return 
    } else {
        // in order to toggle. Should only award 1 supplier in each canvass item
        removeAwardForAllSuppliersWith(canvass_item_id)
        
        console.log('executed')
        // set the award
        item.is_awarded = true
    }


}

function removeAwardForAllSuppliersWith(canvass_item_id: string) {

    for(let meqsSupplier of meqsData.value.meqs_suppliers) {

        const item = meqsSupplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

        if(item) {
            item.is_awarded = false
        }

    }

}

function attachNote(canvass_item_id: string, note: string) {

    for(let supplier of meqsData.value.meqs_suppliers) {

        const item = supplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

        if(item) {
            item.notes = note
        }

    }

    toast.success('Note attached!')

}



// ======================== CHILD FUNCTIONS: NOTES ======================== 


function updateNotes(canvass_item_id: string, note: string) {

    console.log('updateNotes', canvass_item_id, note)

    for(let supplier of meqsData.value.meqs_suppliers) {

        const item = supplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

        if(item) {
            item.notes = note
        }
    }

}


// ======================== UTILS ======================== 

const checkMobile = () => isMobile.value = window.innerWidth < MOBILE_WIDTH
const goToStep1 = () => currentStep.value = 1
const goToStep2 = () => currentStep.value = 2
const goToStep3 = () => currentStep.value = 3

const isInvalidPrice = (price: number): boolean => {
    if(price < -1 || price === 0) {
        return true 
    } else {
        return false
    }
}

function isValidStep3(meqsSuppliers: CreateMeqsSupplierSubInput[], canvassItems: CanvassItem[]): boolean {
    
    let hasInvalidPrice = false 

    for(let supplier of meqsSuppliers) {

        for(let item of supplier.meqs_supplier_items) {

            if(isInvalidPrice(item.price)) {
                item['invalidPrice'] = true 
                hasInvalidPrice = true 
            }else {
                item['invalidPrice'] = false 
            }

        }

    }

    // validate if item has no awarded supplier 
    
    let hasErrorCanvassItem = false 

    for(let item of canvassItems) {

        const hasAwardedSupplier = meqsSuppliers.find(i => i.meqs_supplier_items.find(j => j.canvass_item.id === item.id && j.is_awarded))
        if(hasAwardedSupplier) {
            item['hasAwardedSupplier'] = true 
        }else {
            item['hasAwardedSupplier'] = false
            hasErrorCanvassItem = true 
        }


    }

    if(hasErrorCanvassItem || hasInvalidPrice) {
        return false 
    }

    return true

}

</script>