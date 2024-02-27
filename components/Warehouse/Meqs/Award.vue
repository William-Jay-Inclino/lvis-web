<template>

    <div class="table-responsive">

        <div class="row">
            <div class="col">
                <small class="text-secondary fst-italic">1. Click the star icon to award the supplier </small>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <small class="text-secondary fst-italic">2. If the supplier has no item, set the value to -1 </small>
            </div>
        </div>

        <table class="table table-hover table-sm mt-3">

            <thead>
                <tr>
                    <th class="bg-secondary text-white"> No. </th>
                    <th class="bg-secondary text-white"> Item </th>
                    <th class="bg-secondary text-white text-center" v-for="meqsSupplier in meqs_suppliers">
                        {{ `${meqsSupplier.supplier?.name} (${meqsSupplier.payment_terms})` }}
                    </th>
                    <th class="bg-secondary text-white text-center"></th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="item, i in canvass_items" :class="{'table-danger': !item.hasAwardedSupplier && !isInitial}">
                    <td class="text-muted align-middle"> {{ i + 1 }} </td>
                    <td class="text-muted align-middle nowrap">{{ item.description }}</td>
                    <td v-for="meqsSupplier in meqs_suppliers">
                        <div class="d-flex justify-content-center align-items-center">
                            <input
                              type="number"
                              @input="updatePrice($event, meqsSupplier, item.id)"
                              class="form-control me-2 border border-2"
                              :class="{
                                'border-danger': !isInitial && isPriceInvalid(meqsSupplier, item.id),
                                'border-success': !isInitial && !isPriceInvalid(meqsSupplier, item.id)
                                }
                              "
                              style="width: 100px">
                            <i
                              class="fas fa-star clickable-icon fs-5"
                              @click="emits('awardSupplierItem', meqsSupplier, item.id)"
                              :class="{'text-warning': isAwarded(meqsSupplier, item.id)}"></i>
                        </div>
                    </td>
                    <td class="align-middle">
                        <button @click="onClickAttachNote(item.id)" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#attachNoteModal">
                            <i class="fas fa-book"></i>
                            Note
                        </button>
                    </td>
                </tr>
            </tbody>

        </table>

        <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="attachNoteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-warning" id="exampleModalLabel">
                        Attach Note
                    </h5>
                    <button @click="onCloseAttachModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <textarea rows="3" class="form-control" v-model="attachNoteData.note"></textarea>
                </div>
                <div class="modal-footer">
                    <button @click="onCloseAttachModal" ref="closeattachNoteModal" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-close"></i> Close
                    </button>
                    <button @click="attachNote" class="btn btn-primary">
                        <i class="fas fa-paperclip"></i> Attach
                    </button>
                </div>
                </div>
            </div>
        </div>

    </div>

</template>



<script setup lang="ts">
import type { CanvassItem } from '~/composables/warehouse/canvass/canvass-item.types';
import type { CreateMeqsSupplierSubInput } from '~/composables/warehouse/meqs/meqs.types';
import { VAT } from '~/utils/constants';


const emits = defineEmits(['updatePrice', 'awardSupplierItem', 'attachNote']);
    
const props = defineProps({
    meqs_suppliers: {
        type: Array as () => CreateMeqsSupplierSubInput[],
        default: () => [],
    },
    canvass_items: {
        type: Array as () => CanvassItem[],
        default: () => [],
    },
    isInitial: {
        type: Boolean,
        default: () => true
    }
});

interface AttachNoteData {
    canvass_item_id: string,
    note: string
}

const _attachNoteDataInitial = {
    canvass_item_id: '',
    note: ''
}

const attachNoteData = ref<AttachNoteData>({..._attachNoteDataInitial})
const closeattachNoteModal = ref<HTMLButtonElement>()


function updatePrice(event: Event, meqsSupplier: CreateMeqsSupplierSubInput, canvass_item_id: string) {

    // @ts-ignore
    const price = Number(event.target.value)

    emits('updatePrice', meqsSupplier, canvass_item_id, price)
}

function isAwarded(meqsSupplier: CreateMeqsSupplierSubInput, canvass_item_id: string) {

    const item = meqsSupplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

    if(!item) return

    return item.is_awarded

}

function isPriceInvalid(meqsSupplier: CreateMeqsSupplierSubInput, canvass_item_id: string) {
    const item = meqsSupplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

    if(!item) return

    if(item.invalidPrice) {
        return true 
    }
    return false

}

function attachNote() {
    console.log('attachNote', attachNoteData)

    emits('attachNote', attachNoteData.value.canvass_item_id, attachNoteData.value.note)
    closeattachNoteModal.value?.click()
}

function onClickAttachNote(canvassItemId: string) {
    attachNoteData.value.canvass_item_id = canvassItemId
    
    let note = ''
    for(let supplier of props.meqs_suppliers) {

        const item = supplier.meqs_supplier_items.find(i => i.canvass_item.id === canvassItemId)

        if(item) {
            note = item.notes
            break
        }

    }

    attachNoteData.value.note = note

}


function onCloseAttachModal() {
    attachNoteData.value = { ..._attachNoteDataInitial }
}

</script>


<style scoped>

.clickable-icon {
    cursor: pointer;
    color: #6c757d; /* Default color similar to text-muted */
    transition: color 0.3s; /* Add transition for smooth color change */
}

.clickable-icon:hover {
    color: #ffc107; /* Hover color similar to text-warning */
}

.nowrap {
    white-space: nowrap;
}

.select-responsive {
    max-width: 100%;
    width: auto;
}

</style>