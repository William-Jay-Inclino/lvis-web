<template>
    <div>
        
        <div class="mb-5" v-for="item in itemsNeedingJustification">
            <label class="form-label"> {{ item.canvassItem.description }} </label>
            <!-- <textarea rows="3" class="form-control" @input="updateNotes(item.canvassItem.id, $event)"></textarea> -->
            <v-select taggable multiple push-tags :options="noteOptions" @option:selected="updateNotes(item.canvassItem.id, $event)"/>
            <small class="text-muted fst-italic">
                Why choose
                <span class="fw-bold">
                    {{ item.awardedItem.meqsSupplier?.supplier?.name }} at
                    <span class="text-primary"> {{ item.awardedItem.price.toFixed(2) }} </span> PHP
                </span> 
                over the lowest price item
                <span class="fw-bold">
                    {{ item.lowestPriceItem.meqsSupplier?.supplier?.name }} at
                    <span class="text-primary"> {{ item.lowestPriceItem.price.toFixed(2) }} </span> PHP ?
                </span>
            </small>
        </div>

        <div class="mb-5">
            <label class="form-label">Notes (for printout)</label>
            <textarea rows="3" class="form-control"></textarea>
            <button @click="autoGeneratePrintOutNotes" class="btn btn-outline-primary btn-sm mt-2"> Auto generate notes for print out</button>
        </div>

    </div>
</template>


<script setup lang="ts">
import type { AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';
import type { CanvassItem } from '~/composables/warehouse/canvass/canvass-item.types';
import type { CanvassItemWithSuppliers, CreateMeqsSupplierItemSubInput, CreateMeqsSupplierSubInput } from '~/composables/warehouse/meqs/meqs.types';
import { NOTE_OPTIONS } from '~/utils/constants'


const emits = defineEmits(['saveNotes', 'updateNotes']);
const config = useRuntimeConfig()


const noteOptions = ref(NOTE_OPTIONS)


const props = defineProps({
    meqs_suppliers: {
        type: Array as () => CreateMeqsSupplierSubInput[],
        default: () => [],
    },
    canvass_items: {
        type: Array as () => CanvassItem[],
        default: () => [],
    }
});


const itemsNeedingJustification = computed( (): CanvassItemWithSuppliers[] => {

    console.log('itemsNeedingJustification')

    const items: CanvassItemWithSuppliers[] = []

    for(let canvassItem of props.canvass_items) {
        
        const itemsByCanvassId = getSupplierItemsByCanvassId(canvassItem.id, props.meqs_suppliers)

        const lowestPriceItem = getLowestPriceItem(itemsByCanvassId)
        const awardedItem = itemsByCanvassId.find(i => i.is_awarded)

        console.log('lowestPriceItem', lowestPriceItem)
        console.log('awardedItem', awardedItem)

        if(!awardedItem) {
            console.error('No awardedItem')
            continue
        }

        if(lowestPriceItem.meqsSupplier?.supplier?.id !== awardedItem.meqsSupplier?.supplier?.id) {

            items.push({
                canvassItem,
                lowestPriceItem,
                awardedItem
            })

        }

    }

    return items

})


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

    const lowestPriceItem = items.reduce((lowest, item) => {
        return item.price < lowest.price ? item : lowest;
    }, items[0]);

    return lowestPriceItem

}


function updateNotes(canvass_item_id: string, tags: string[]) {

    const notes = tags.join(', ')

    console.log('notes', notes)

    emits('updateNotes', canvass_item_id, notes)

}

function autoGeneratePrintOutNotes() {

    console.log('autoGeneratePrintOutNotes')

    const apiKey = config.public.chatGptApiKey;
    console.log('apiKey', apiKey)
    const url = "https://api.openai.com/v1/engines/davinci/completions";

    const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
    };

    const data = {
    prompt: "Once upon a time",
    max_tokens: 50
    };

    axios.post(url, data, { headers })
    .then((response: AxiosResponse<any>) => {
        console.log(response.data.choices[0].text.trim());
    })
    .catch((error: AxiosError<any>) => {
        console.error("Error:", error);
    });

}

</script>