<template>

    <div>

        <div class="row">

            <div class="col-lg-4 col-md-6">
                <div class="accordion" id="accordionFlushExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingOne">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            Table Filters
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
                            <tr v-for="rrItem, i in rrItems" :key="i">
                                <td v-show="showDescription" class="text-muted">
                                    <div class="input-group input-group-sm">
                                        {{ i + 1 }}.
                                        <textarea class="form-control ms-2" rows="3" :value="rrItem.description" disabled></textarea>
                                    </div>
                                </td>
                                <td v-show="showItemCode" class="text-muted align-middle">
                                    <div class="input-group input-group-sm">
                                        <textarea class="form-control ms-2" rows="3" :value="rrItem.item ? rrItem.item.label : ''" disabled></textarea>
                                    </div>
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
                                            getNetPrice({
                                                grossPrice: rrItem.gross_price,
                                                vatAmount: getVatAmount(rrItem.gross_price, rrItem.vat.value)
                                            })
                                        ) 
                                    }}
                                </td>
                                <td v-show="showGrossTotal" class="text-muted text-center align-middle">
                                    {{ 
                                        formatToPhpCurrency(
                                            getGrossTotal({
                                                price: rrItem.gross_price,
                                                quantity: rrItem.quantity_accepted
                                            })
                                        ) 
                                    }}
                                </td>
                                <td v-show="showVatTotal" class="text-muted text-center align-middle">
                                    {{ 
                                        formatToPhpCurrency(
                                            getVatTotal({
                                                price: rrItem.gross_price,
                                                quantity: rrItem.quantity_accepted,
                                                vatType: rrItem.vat.value
                                            })
                                        )
                                    }}
                                </td>
                                <td v-show="showNetTotal" class="text-muted text-center align-middle">
                                    {{ 
                                        formatToPhpCurrency(
                                            getTotalNetPrice({
                                                pricePerUnit: rrItem.gross_price,
                                                vatPerUnit: getVatAmount(rrItem.gross_price, rrItem.vat.value),
                                                quantity: rrItem.quantity_accepted
                                            })
                                        ) 
                                    }}
                                </td>
                                <td class="align-middle">
                                    <button @click="emits('removeItem', i)" class="btn btn-light btn-sm w-50">
                                        <i class="fas fa-trash text-danger"></i>
                                    </button>
                                    <button @click="onClickEditItem(i)" class="btn btn-light btn-sm w-50" data-bs-toggle="modal" data-bs-target="#addItemModal">
                                        <i class="fas fa-edit text-info"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="text-center"> 
                        <button @click="onClickAddItem" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addItemModal">
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
                    <h5 class="modal-title text-warning" id="exampleModalLabel">{{ formIsAdd ? 'Add' : 'Edit' }} Item</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="onCloseModal"></button>
                </div>
                <div class="modal-body">

                    <div class="mb-3">
                        <label class="form-label">
                            Description <span class="text-danger">*</span>
                        </label>
                        <textarea v-model="itemData.description" class="form-control" rows="3"></textarea>
                        <small class="text-danger fst-italic" v-if="itemDataErrors.description"> This field is required </small>
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
                            <v-select :options="items" label="label" v-model="itemData.item"></v-select>
                        </client-only>
                        <small class="text-danger fst-italic" v-if="itemDataErrors.item"> This field is invalid </small>
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
                        <small class="text-danger fst-italic" v-if="itemDataErrors.quantityDelivered"> This field is invalid </small>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">
                            Quantity Accepted <span class="text-danger">*</span>
                        </label>
                        <input type="number" class="form-control" v-model="itemData.quantity_accepted">
                        <small class="text-danger fst-italic" v-if="itemDataErrors.quantityAccepted"> This field is invalid </small>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">
                            VAT <span class="text-danger">*</span>
                        </label>
                        <client-only>
                            <v-select :options="vatArray" label="label" v-model="itemData.vat" :clearable="false"></v-select>
                        </client-only>
                    </div>

                    <div class="mb-3">
                        <div class="row">
                            <div class="col">
                                <label class="form-label">
                                    Gross Price <span class="text-danger">*</span>
                                </label>
                                <input type="number" class="form-control" v-model="itemData.gross_price">
                                <small class="text-muted fst-italic"> {{ formatToPhpCurrency(itemData.gross_price) }} </small>
                                <small class="text-danger fst-italic" v-if="itemDataErrors.grossPrice"> This field is invalid </small>
                            </div>
                            <div class="col">
                                <label class="form-label">
                                    Gross Total 
                                    <i
                                        class="fas fa-info-circle text-warning ms-1"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="GT = GP * QA"
                                    ></i>
                                </label>
                                <input type="text" class="form-control" :value="formatToPhpCurrency(grossTotal)" disabled>
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <div class="row">
                            <div class="col">
                                <label class="form-label">
                                    VAT Amount
                                    <i
                                        class="fas fa-info-circle text-warning ms-1"
                                        data-bs-toggle="tooltip"
                                        data-bs-html="true"
                                        data-bs-placement="top"
                                        :title="vatPriceToolTip"
                                    ></i>
                                </label>
                                <input type="text" class="form-control" :value="formatToPhpCurrency(getVatAmount(itemData.gross_price, itemData.vat.value))" disabled>
                            </div>
                            <div class="col">
                                <label class="form-label">
                                    VAT Total
                                </label>
                                <i
                                    class="fas fa-info-circle text-warning ms-1"
                                    data-bs-toggle="tooltip"
                                    data-bs-html="true"
                                    data-bs-placement="top"
                                    title="VT = VA * QA"
                                ></i>
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
                                <i
                                    class="fas fa-info-circle text-warning ms-1"
                                    data-bs-toggle="tooltip"
                                    data-bs-html="true"
                                    data-bs-placement="top"
                                    title="NP = GP - VA"
                                ></i>
                                <input type="text" class="form-control" :value="formatToPhpCurrency(netPrice)" disabled>
                            </div>
                            <div class="col">
                                <label class="form-label">
                                    Net Total
                                    <i
                                        class="fas fa-info-circle text-warning ms-1"
                                        data-bs-toggle="tooltip"
                                        data-bs-html="true"
                                        data-bs-placement="top"
                                        title="NT = GT - VT"
                                    ></i>
                                </label>
                                <input type="text" class="form-control" :value="formatToPhpCurrency(netTotal)" disabled>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button @click="onCloseModal" ref="rrCloseItemModalBtn" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-close"></i> Close
                    </button>
                    <button v-if="formIsAdd" @click="addItem" type="button" class="btn btn-primary" :disabled="isAdding">
                        <i class="fas fa-plus-circle"></i> {{ isAdding ? 'Adding Item...' : 'Add Item' }}
                    </button>
                    <button v-else @click="editItem" type="button" class="btn btn-primary" :disabled="isEditing">
                        <i class="fas fa-plus-circle"></i> {{ isEditing ? 'Editing Item...' : 'Edit Item' }}
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
    import { getTotalNetPrice, getVatAmount, getNetPrice } from '~/utils/helpers';
    

    const emits = defineEmits(['addItem', 'removeItem', 'editItem']);

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
        isAdding: {
            type: Boolean,
            default: false
        },
        isEditing: {
            type: Boolean,
            default: false
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

    const rrCloseItemModalBtn = ref<HTMLButtonElement>()

    const showDescription = ref(true)
    const showItemCode = ref(true)
    const showClass = ref(false)
    const showBrand = ref(false)
    const showUnit = ref(false)
    const showDelivered = ref(true)
    const showAccepted = ref(true)
    const showVat = ref(true)
    const showGrossPrice = ref(true)
    const showNetPrice = ref(false)
    const showGrossTotal = ref(true)
    const showVatTotal = ref(true)
    const showNetTotal = ref(true)

    const formIsAdd = ref(true)
    // use in editing
    const indxToEdit = ref()
    
    const _itemDataErrorsInitial = {
        description: false,
        item: false,
        quantityDelivered: false,
        quantityAccepted: false,
        grossPrice: false,
    } 

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
        gross_price: 0,
        net_price: 0,
        vat_amount: 0,
    }

    const itemData = ref<RrItem>({..._itemDataInitial})
    const itemDataErrors = ref({..._itemDataErrorsInitial})

    onMounted(() => {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')) as Element[];
        // @ts-ignore
        let tooltipList = tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    })


    const vatTotal = computed( () => {

        if(!itemData.value.quantity_accepted || !itemData.value.gross_price) return 0 

        return getVatTotal({
            price: itemData.value.gross_price,
            quantity: itemData.value.quantity_accepted,
            vatType: itemData.value.vat.value
        })

    })

    const grossTotal = computed( () => {

        if(!itemData.value.quantity_accepted || !itemData.value.gross_price) return 0 

        return getGrossTotal({
            price: itemData.value.gross_price,
            quantity: itemData.value.quantity_accepted
        })

    })

    const netPrice = computed( () => {

        if(!itemData.value.quantity_accepted || !itemData.value.gross_price) return 0 

        const vatPerUnit = getVatAmount(itemData.value.gross_price, itemData.value.vat.value)

        return getNetPrice({
            grossPrice: itemData.value.gross_price,
            vatAmount: vatPerUnit
        })

    })

    const netTotal = computed( () => {

        if(!itemData.value.quantity_accepted || !itemData.value.gross_price) return 0 

        return getTotalNetPrice({
            pricePerUnit: itemData.value.gross_price,
            vatPerUnit: getVatAmount(itemData.value.gross_price, itemData.value.vat.value),
            quantity: itemData.value.quantity_accepted
        })

    })

    const vatPriceToolTip = computed( () => {

        let t = `let VAT_RATE = <b>${VAT_RATE}</b>`
        t += '<br>'
        t += '<br>'

        t += '<em>if VAT = None:</em>'
        t += '<br>'
        t += '<b>VA = 0</b>'

        t += '<br>'
        t += '<br>'

        t += '<em>if VAT = EXC:</em>'
        t += '<br>'
        t += '<b>VA = GP * VAT_RATE</b>'

        t += '<br>'
        t += '<br>'

        t += '<em>if VAT = INC:</em>'
        t += '<br>'
        t += '<b>VA = (GP * VAT_RATE) / (1 + VAT_RATE)</b>'

        return t

    })

    function getVatTotal(payload: { price: number, quantity: number, vatType: VAT_TYPE }) {

        const { price, quantity, vatType } = payload
        const vatPerUnit = getVatAmount(price, vatType)
        return vatPerUnit * quantity

    } 

    function getGrossTotal(payload: { price: number, quantity: number }) {
        const { price, quantity } = payload 

        return ( price * quantity )

    }

    function addItem() {

        if(!isValidItemData()) {
            return 
        }

        emits("addItem", itemData.value, rrCloseItemModalBtn.value)

    }

    function editItem() {

        if(!isValidItemData()) {
            return 
        }

        console.log('rrCloseItemModalBtn.value', rrCloseItemModalBtn.value)

        itemData.value.vat_amount = getVatAmount(itemData.value.gross_price, itemData.value.vat.value)
        itemData.value.net_price = getNetPrice({
            grossPrice: itemData.value.gross_price,
            vatAmount: itemData.value.vat_amount
        })

        emits("editItem", indxToEdit.value, itemData.value, rrCloseItemModalBtn.value)

    }

    function onClickAddItem() {
        console.log('onClickAddItem')

        formIsAdd.value = true

    }

    function onClickEditItem(indx: number) {
        console.log('onClickEditItem')

        const item = props.rrItems[indx]

        formIsAdd.value = false 
        indxToEdit.value = indx 

        itemData.value = {...item}

    }

    function isValidItemData(): boolean {

        itemDataErrors.value = {..._itemDataErrorsInitial}

        if(itemData.value.description.trim() === '') {
            itemDataErrors.value.description = true 
        }

        if(itemData.value.quantity_delivered <= 0) {
            itemDataErrors.value.quantityDelivered = true 
        }

        if(itemData.value.quantity_accepted <= 0) {
            itemDataErrors.value.quantityAccepted = true 
        }

        if(itemData.value.gross_price <= 0) {
            itemDataErrors.value.grossPrice = true 
        }

        if(itemData.value.item_class.value === ITEM_CLASS.STOCK && !itemData.value.item) {
            itemDataErrors.value.item = true
        }

        const hasError = Object.values(itemDataErrors.value).includes(true);

        if(hasError) {
            return false 
        }

        return true

    }

    function onCloseModal() {
        itemData.value = {..._itemDataInitial}
        itemDataErrors.value = {..._itemDataErrorsInitial}
        indxToEdit.value = undefined
    }


</script>




<style scoped>
    th {
        white-space: nowrap;
    }
</style>