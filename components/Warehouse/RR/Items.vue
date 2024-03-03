<template>

    <div class="table-responsive">
        <table class="table table-hover table-sm" style="min-width: 1600px;">
            <thead>
                <tr>
                    <th class="bg-secondary text-white">No</th>
                    <th class="bg-secondary text-white" style="width: 300px;">Description</th>
                    <th class="bg-secondary text-white" style="width: 300px;">Item Code & Description</th>
                    <th class="bg-secondary text-white" style="width: 300px;">Class</th>
                    <th class="bg-secondary text-white" style="width: 300px;">Brand</th>
                    <th class="bg-secondary text-white" style="width: 300px;">Unit</th>
                    <th class="bg-secondary text-white" style="width: 150px;">Delivered</th>
                    <th class="bg-secondary text-white" style="width: 150px;">Accepted</th>
                    <th class="bg-secondary text-white" style="width: 200px;">VAT</th>
                    <th class="bg-secondary text-white" style="width: 150px;">Gross Price</th>
                    <th class="bg-secondary text-white" style="width: 150px;">Net Price</th>
                    <th class="bg-secondary text-white" style="width: 150px;">Gross Total</th>
                    <th class="bg-secondary text-white" style="width: 150px;">VAT Total</th>
                    <th class="bg-secondary text-white" style="width: 150px;">Net Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, i in rrItems">
                    <td class="text-muted"> {{ i + 1 }} </td>
                    <td class="text-muted">
                        <textarea class="form-control" rows="3" :value="item.description"></textarea>
                    </td>
                    <td class="text-muted">
                        <client-only>
                            <v-select :options="items" label="label"></v-select>
                        </client-only>
                    </td>
                    <td class="text-muted">
                        <client-only>
                            <v-select :options="itemClassArray" label="label" v-model="item.item_class"></v-select>
                        </client-only>
                    </td>
                    <td class="text-muted">
                        <client-only>
                            <v-select :options="brands" label="name" v-model="item.item_brand"></v-select>
                        </client-only>
                    </td>
                    <td class="text-muted">
                        <client-only>
                            <v-select :options="units" label="name" v-model="item.unit"></v-select>
                        </client-only>
                    </td>
                    <td class="text-muted">
                        <input type="number" class="form-control">
                    </td>
                    <td class="text-muted">
                        <input type="number" class="form-control">
                    </td>
                    <td class="text-muted">
                        <client-only>
                            <v-select :options="vatArray" label="label" v-model="item.vat" :clearable="false"></v-select>
                        </client-only>
                    </td>
                    <td class="text-muted">
                        <input type="number" class="form-control">
                    </td>
                    <td class="text-muted">
                        <input type="number" class="form-control">
                    </td>
                    <td class="text-muted">
                        <input type="text" class="form-control">
                    </td>
                    <td class="text-muted">
                        <input type="text" class="form-control">
                    </td>
                    <td class="text-muted">
                        <input type="text" class="form-control">
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</template>



<script setup lang="ts">
    import type { Brand, Unit } from '~/composables/warehouse/canvass/canvass.types';
    import type { RrItem } from '~/composables/warehouse/rr/rr-item.types';


    const props = defineProps({
        rrItems: {
            type: Array as () => RrItem[],
            default: () => [],
        },
        brands: {
            type: Array as () => Brand[],
            default: () => [],
        },
        units: {
            type: Array as () => Unit[],
            default: () => [],
        },
        items: {
            type: Array as () => Item[],
            default: () => [],
        },
    });


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

</script>




<style scoped>

    th {
        white-space: nowrap;
    }

</style>