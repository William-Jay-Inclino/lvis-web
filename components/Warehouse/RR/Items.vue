<template>

    <div>

        <div class="row">

            <div class="col-lg-4 col-md-6">
                <div class="accordion" id="accordionFlushExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingOne">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            Column Filters
                        </button>
                        </h2>
                        <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                            <div class="accordion-body">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showDescription" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Description</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showItemCode" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Item Code</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showClass" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Class</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showBrand" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Brand</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showUnit" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Unit</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showDelivered" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Delivered</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showAccepted" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Accepted</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showVat" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">VAT</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showGrossPrice" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Gross Price</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showNetPrice" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Net Price</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showGrossTotal" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Gross Total</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showVatTotal" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">VAT Total</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showNetTotal" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Net Total</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="row pt-3">
            <div class="col">
                <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th v-show="showDescription" class="bg-secondary text-white">Description</th>
                                <th v-show="showItemCode" class="bg-secondary text-white">Item Code & Description</th>
                                <th v-show="showClass" class="bg-secondary text-white">Class</th>
                                <th v-show="showBrand" class="bg-secondary text-white">Brand</th>
                                <th v-show="showUnit" class="bg-secondary text-white">Unit</th>
                                <th v-show="showDelivered" class="bg-secondary text-white">Delivered</th>
                                <th v-show="showAccepted" class="bg-secondary text-white">Accepted</th>
                                <th v-show="showVat" class="bg-secondary text-white">VAT</th>
                                <th v-show="showGrossPrice" class="bg-secondary text-white">Gross Price</th>
                                <th v-show="showNetPrice" class="bg-secondary text-white">Net Price</th>
                                <th v-show="showGrossTotal" class="bg-secondary text-white">Gross Total</th>
                                <th v-show="showVatTotal" class="bg-secondary text-white">VAT Total</th>
                                <th v-show="showNetTotal" class="bg-secondary text-white">Net Total</th>
                                <th class="bg-secondary text-white text-center">
                                    <i class="fas fa-cog"></i>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="rrItem, i in rrItems">
                                <td v-show="showDescription" class="text-muted">
                                    <div class="input-group input-group-sm">
                                        {{ i + 1 }}.
                                        <textarea class="form-control ms-2" rows="3" :value="rrItem.description" disabled></textarea>
                                    </div>
                                </td>
                                <td v-show="showItemCode" class="text-muted align-middle">
                                    {{ rrItem.item ? rrItem.item.code : '' }}
                                </td>
                                <td v-show="showClass" class="text-muted align-middle">
                                    {{ rrItem.item_class.label }}
                                </td>
                                <td v-show="showBrand" class="text-muted align-middle">
                                    {{ rrItem.item_brand ? rrItem.item_brand.name : '' }}
                                </td>
                                <td v-show="showUnit" class="text-muted align-middle">
                                    {{ rrItem.unit ? rrItem.unit.name : '' }}
                                </td>
                                <td v-show="showDelivered" class="text-muted text-center align-middle">
                                    {{ rrItem.quantity_delivered }}
                                </td>
                                <td v-show="showAccepted" class="text-muted text-center align-middle">
                                    {{ rrItem.quantity_accepted }}
                                </td>
                                <td v-show="showVat" class="text-muted text-center align-middle">
                                    {{ rrItem.vat.label }}
                                </td>
                                <td v-show="showGrossPrice" class="text-muted text-center align-middle">
                                    {{ formatToPhpCurrency(rrItem.gross_price) }}
                                </td>
                                <td v-show="showNetPrice" class="text-muted text-center align-middle">
                                    {{ 
                                        formatToPhpCurrency(
                                            (rrItem.gross_price) +  ( getVatPerUnit(rrItem.gross_price, rrItem.vat.value) )
                                        ) 
                                    }}
                                </td>
                                <td v-show="showGrossTotal" class="text-muted text-center align-middle">
                                    {{ formatToPhpCurrency(rrItem.gross_price * rrItem.quantity_accepted) }}
                                </td>
                                <td v-show="showVatTotal" class="text-muted text-center align-middle">
                                    {{ 
                                        formatToPhpCurrency(
                                            ( getVatPerUnit(rrItem.gross_price, rrItem.vat.value) ) * rrItem.quantity_accepted
                                        )
                                    }}
                                </td>
                                <td v-show="showNetTotal" class="text-muted text-center align-middle">
                                    {{ 
                                        formatToPhpCurrency(
                                            (rrItem.gross_price * rrItem.quantity_accepted) +
                                            (
                                                getVatPerUnit(rrItem.gross_price, rrItem.vat.value)
                                            ) * rrItem.quantity_accepted
                                        ) 
                                    }}
                                </td>
                                <td class="text-muted align-middle">
                                    <button class="btn btn-light btn-sm w-50">
                                        <i class="fas fa-trash text-danger"></i>
                                    </button>
                                    <button class="btn btn-light btn-sm w-50">
                                        <i class="fas fa-edit text-info"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="text-center"> 
                        <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addItemModal">
                            Add Item
                        </button>
                    </div>
                </div>
            </div>
        </div>


            <!-- Modal -->
            <div class="modal fade" id="addItemModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-warning" id="exampleModalLabel">Add Item</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <div class="mb-3">
                            <label class="form-label">
                                Description <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="itemData.description" class="form-control" rows="3"></textarea>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Class <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="itemClassArray" label="label"  v-model="itemData.item_class" :clearable="false"></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3" v-if="itemData.item_class.value === ITEM_CLASS.STOCK">
                            <label class="form-label">
                                Item Code & Description <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="items" label="code" v-model="itemData.item"></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Brand <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="brands" label="name" v-model="itemData.item_brand"></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Unit <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="units" label="name" v-model="itemData.unit"></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Quantity Delivered <span class="text-danger">*</span>
                            </label>
                            <input type="number" class="form-control" v-model="itemData.quantity_delivered">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Quantity Accepted <span class="text-danger">*</span>
                            </label>
                            <input type="number" class="form-control" v-model="itemData.quantity_accepted">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                VAT <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="vatArray" label="label" v-model="itemData.vat"></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3">
                            <div class="row">
                                <div class="col">
                                    <label class="form-label">
                                        Gross Price <span class="text-danger">*</span>
                                    </label>
                                    <input type="number" class="form-control" v-model="itemData.gross_price">
                                </div>
                                <div class="col">
                                    <label class="form-label">
                                        Gross Total
                                    </label>
                                    <input type="text" class="form-control" :value="formatToPhpCurrency(grossTotal)" disabled>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <div class="row">
                                <div class="col">
                                    <label class="form-label">
                                        Vat Price
                                    </label>
                                    <input type="text" class="form-control" :value="formatToPhpCurrency(getVatPerUnit(itemData.gross_price, itemData.vat.value))" disabled>
                                </div>
                                <div class="col">
                                    <label class="form-label">
                                        Vat Total
                                    </label>
                                    <input type="text" class="form-control" :value="formatToPhpCurrency(vatTotal)" disabled>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <div class="row">
                                <div class="col">
                                    <label class="form-label">
                                        Net Price
                                    </label>
                                    <input type="text" class="form-control" :value="formatToPhpCurrency(netPrice)" disabled>
                                </div>
                                <div class="col">
                                    <label class="form-label">
                                        Net Total
                                    </label>
                                    <input type="text" class="form-control" :value="formatToPhpCurrency(netTotal)" disabled>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button ref="closeItemModal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-close"></i> Close
                        </button>
                        <button type="button" class="btn btn-primary">
                            <i class="fas fa-plus-circle"></i> Add Item
                        </button>
                    </div>
                    </div>
                </div>
            </div>


    </div>



</template>



<script setup lang="ts">
    import { VAT_TYPE } from '#imports';
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

    const showDescription = ref(true)
    const showItemCode = ref(true)
    const showClass = ref(false)
    const showBrand = ref(false)
    const showUnit = ref(false)
    const showDelivered = ref(true)
    const showAccepted = ref(true)
    const showVat = ref(false)
    const showGrossPrice = ref(false)
    const showNetPrice = ref(false)
    const showGrossTotal = ref(true)
    const showVatTotal = ref(true)
    const showNetTotal = ref(true)

    const _itemDataInitial: RrItem = {
        id: '',
        item: null,
        item_brand: null, 
        unit: null,
        item_class: itemClassArray.value[0],
        quantity_accepted: 0,
        quantity_delivered: 0,
        description: '',
        vat: vatArray.value[0],
        gross_price: 0
    }

    const itemData = ref<RrItem>({..._itemDataInitial})

    const vatTotal = computed( () => {

        if(!itemData.value.quantity_accepted || !itemData.value.gross_price) return 0 

        const vatPerUnit = getVatPerUnit(itemData.value.gross_price, itemData.value.vat.value)

        return (vatPerUnit * itemData.value.quantity_accepted)

    })

    const grossTotal = computed( () => {

        if(!itemData.value.quantity_accepted || !itemData.value.gross_price) return 0 

        return itemData.value.gross_price * itemData.value.quantity_accepted

    })

    const netPrice = computed( () => {

        if(!itemData.value.quantity_accepted || !itemData.value.gross_price) return 0 

        const vatPerUnit = getVatPerUnit(itemData.value.gross_price, itemData.value.vat.value)

        return (itemData.value.gross_price - vatPerUnit)

    })

    const netTotal = computed( () => {

        if(!itemData.value.quantity_accepted || !itemData.value.gross_price) return 0 

        return ( grossTotal.value - vatTotal.value )

    })



</script>




<style scoped>
    th {
        white-space: nowrap;
    }
</style>