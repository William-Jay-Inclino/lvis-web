<template>

    <div class="table-responsive">

        <small class="text-secondary fst-italic"> Click the star icon to award the supplier </small>

        <table class="table table-hover table-sm">

            <thead>
                <tr>
                    <th class="bg-secondary text-white"> No. </th>
                    <th class="bg-secondary text-white"> Item </th>
                    <th class="bg-secondary text-white"> Vat </th>
                    <th class="bg-dark text-white text-center" v-for="meqsSupplier in meqs_suppliers">
                        {{ `${meqsSupplier.supplier?.name} (${meqsSupplier.payment_terms})` }}
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="item, i in canvass_items">
                    <td class="text-muted align-middle"> {{ i + 1 }} </td>
                    <td class="text-muted align-middle nowrap"> {{ item.description }} </td>
                    <td>
                        <select class="form-select form-select-sm select-responsive" aria-label="Default select example">
                            <option :value="vat.id" v-for="vat in vatArray">
                                {{ vat.label }}
                            </option>
                        </select>
                    </td>
                    <td v-for="meqsSupplier in meqs_suppliers">
                        <div class="d-flex justify-content-center align-items-center">
                            <input
                              type="number"
                              @input="updatePrice($event, meqsSupplier, item.id)"
                              class="form-control me-2"
                              style="width: 100px"
                              placeholder="0.00">
                            <i
                              class="fas fa-star clickable-icon fs-5"
                              @click="emits('awardSupplierItem', meqsSupplier, item.id)"
                              :class="{'text-warning': isAwarded(meqsSupplier, item.id)}"></i>
                        </div>
                    </td>
                </tr>
            </tbody>

        </table>
    </div>

</template>



<script setup lang="ts">
import type { CanvassItem } from '~/composables/warehouse/canvass/canvass-item.types';
import type { CreateMeqsSupplierSubInput } from '~/composables/warehouse/meqs/meqs.types';
import { VAT } from '~/utils/constants';


const emits = defineEmits(['updatePrice', 'awardSupplierItem']);
    
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

const vatArray = ref([
    {
        id: VAT_TYPE.NONE,
        label: VAT[VAT_TYPE.NONE].label
    },
    {
        id: VAT_TYPE.INC,
        label: VAT[VAT_TYPE.INC].label
    },
    {
        id: VAT_TYPE.EXC,
        label: VAT[VAT_TYPE.EXC].label
    }
])


function updatePrice(event: Event, meqsSupplier: CreateMeqsSupplierSubInput, canvass_item_id: string) {

    console.log('updatePrice')
    console.log('meqsSupplier', meqsSupplier)
    console.log('canvass_item_id', canvass_item_id)

    // @ts-ignore
    const price = Number(event.target.value)

    emits('updatePrice', meqsSupplier, canvass_item_id, price)
}

function isAwarded(meqsSupplier: CreateMeqsSupplierSubInput, canvass_item_id: string) {

    const item = meqsSupplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

    if(!item) return
    
    return item.is_awarded

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