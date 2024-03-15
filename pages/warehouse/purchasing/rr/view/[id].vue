<template>
    <div v-if="item">
        
        <div class="row pt-3 justify-content-center">
            <div class="col-lg-12">
                <div class="h5wrapper mb-3">
                    <hr class="result">
                        <h5 class="text-warning fst-italic">
                            <i class="fas fa-info-circle"></i> RR Info
                        </h5>
                    <hr class="result">
                </div>

                <div class="table-responsive">
                    <table class="table table-bordered table-hover"> 
                        <tbody>
                            <tr>
                                <td class="text-muted">Status</td>
                                <td>
                                    <div :class="{[`badge bg-${approvalStatus[item.status].color}`]: true}"> 
                                        {{ approvalStatus[item.status].label }} 
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="isRV">
                                <td class="text-muted"> RC Number </td>
                                <td>
                                    <nuxt-link :to="'/warehouse/purchasing/canvass/view/' + meqsReference?.canvass.id">{{ meqsReference?.canvass.rc_number }}</nuxt-link>
                                </td>
                            </tr>
                            <tr v-if="isRV">
                                <td class="text-muted"> RV Number </td>
                                <td>
                                    <nuxt-link :to="'/warehouse/purchasing/rv/view/' + meqsReference?.id">{{ meqsReference?.rv_number }}</nuxt-link>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-muted">MEQS Number</td>
                                <td>
                                    <nuxt-link :to="'/warehouse/purchasing/meqs/view/' + item.po.meqs_supplier.meqs.id">{{ item.po.meqs_supplier.meqs.meqs_number }}</nuxt-link>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-muted">PO Number</td>
                                <td>
                                    <nuxt-link :to="'/warehouse/purchasing/po/view/' + item.po.id">{{ item.po.po_number }}</nuxt-link>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-muted">RR Number</td>
                                <td> {{ item.rr_number }} </td>
                            </tr>
                            <tr>
                                <td class="text-muted">Date</td>
                                <td> {{ formatDate(item.rr_date) }} </td>
                            </tr>
                            <tr>
                                <td class="text-muted">Invoice Number</td>
                                <td> {{ item.invoice_number }} </td>
                            </tr>
                            <tr>
                                <td class="text-muted">Delivery Number</td>
                                <td> {{ item.delivery_number }} </td>
                            </tr>
                            <tr>
                                <td class="text-muted">Delivery Charge</td>
                                <td> {{ formatToPhpCurrency(item.delivery_charge) }} </td>
                            </tr>
                            <tr>
                                <td class="text-muted">Received By</td>
                                <td> {{ getFullname(item.received_by.firstname, item.received_by.middlename, item.received_by.lastname) }} </td>
                            </tr>
                            <tr>
                                <td class="text-muted">Notes</td>
                                <td> {{ item.notes }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

        <div class="row pt-4 justify-content-center">
            <div class="col-lg-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                        <h5 class="text-warning fst-italic">
                            <i class="fas fa-users"></i> Approvers
                        </h5>
                    <hr class="result">
                </div>

                <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th class="bg-secondary text-white"> Order </th>
                                <th class="bg-secondary text-white"> Label </th>
                                <th class="bg-secondary text-white"> Approver </th>
                                <th class="bg-secondary text-white"> Status </th>
                                <th class="bg-secondary text-white"> Notes </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i, count in item.rr_approvers">
                                <td class="align-middle"> {{ i.order }} </td>
                                <td class="align-middle"> {{ i.label }} </td>
                                <td class="align-middle"> {{ getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname) }} </td>
                                <td class="text-muted text-center align-middle">
                                    <div :class="{[`badge bg-${approvalStatus[i.status].color}`]: true}"> 
                                        {{ approvalStatus[i.status].label }} 
                                    </div>
                                    <div class="fst-italic" v-if="i.date_approval">
                                        <small> {{ formatDate(i.date_approval) }} </small>
                                    </div>
                                </td>
                                <td>
                                    <textarea rows="3" class="form-control" disabled :value="i.notes"></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            </div>
        </div>

        <div class="row pt-4 justify-content-center">
            <div class="col-lg-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                        <h5 class="text-warning fst-italic">
                            <i class="fas fa-shopping-cart"></i> RR Items
                        </h5>
                    <hr class="result">
                </div>

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

                <div class="row mt-3">
                    <div class="col">
                        <div class="table-responsive">
                            <table class="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th v-show="showDescription" class="bg-secondary text-white">Description</th>
                                        <th v-show="showItemCode" class="bg-secondary text-white">Item Code</th>
                                        <th v-show="showClass" class="bg-secondary text-white">Class</th>
                                        <th v-show="showBrand" class="bg-secondary text-white">Brand</th>
                                        <th v-show="showUnit" class="bg-secondary text-white">Unit</th>
                                        <th v-show="showDelivered" class="bg-secondary text-white">Qty Request</th>
                                        <th v-show="showAccepted" class="bg-secondary text-white">Qty Accepted</th>
                                        <th v-show="showVat" class="bg-secondary text-white">VAT</th>
                                        <th v-show="showGrossPrice" class="bg-secondary text-white">Gross Price</th>
                                        <th v-show="showNetPrice" class="bg-secondary text-white">Net Price</th>
                                        <th v-show="showGrossTotal" class="bg-secondary text-white">Gross Total</th>
                                        <th v-show="showVatTotal" class="bg-secondary text-white">VAT Total</th>
                                        <th v-show="showNetTotal" class="bg-secondary text-white">Net Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="rrItem, i in item.rr_items" :key="i">
                                        <td class="text-muted"> {{ i + 1 }} </td>
                                        <td v-show="showDescription" class="text-muted">
                                            <div class="input-group input-group-sm">
                                                {{ i + 1 }}.
                                                <textarea class="form-control ms-2" rows="3" :value="rrItem.meqs_supplier_item.canvass_item.description" disabled></textarea>
                                            </div>
                                        </td>
                                        <td v-show="showClass" class="text-muted align-middle">
                                            {{ rrItem.meqs_supplier_item.canvass_item.item ? 'Stock' : 'Non-Stock' }}
                                        </td>
                                        <td v-show="showBrand" class="text-muted align-middle">
                                            {{ rrItem.meqs_supplier_item.canvass_item.brand ? rrItem.meqs_supplier_item.canvass_item.brand.name : 'N/A' }}
                                        </td>
                                        <td v-show="showUnit" class="text-muted align-middle">
                                            {{ rrItem.meqs_supplier_item.canvass_item.unit ? rrItem.meqs_supplier_item.canvass_item.unit.name : 'N/A' }}
                                        </td>
                                        <td v-show="showDelivered" class="text-muted text-center align-middle">
                                            {{ rrItem.meqs_supplier_item.canvass_item.quantity }}
                                        </td>
                                        <td v-show="showAccepted" class="text-muted text-center align-middle">
                                            {{ rrItem.quantity_accepted }}
                                        </td>
                                        <td v-show="showVat" class="text-muted text-center align-middle">
                                            {{ VAT[rrItem.meqs_supplier_item.vat_type].label }}
                                        </td>
                                        <td v-show="showGrossPrice" class="text-muted text-center align-middle">
                                            {{ formatToPhpCurrency(rrItem.meqs_supplier_item.price) }}
                                        </td>
                                        <td v-show="showNetPrice" class="text-muted text-center align-middle">
                                            {{ 
                                                formatToPhpCurrency(
                                                    getNetPrice({
                                                        grossPrice: rrItem.meqs_supplier_item.price,
                                                        vatAmount: getVatAmount(rrItem.meqs_supplier_item.price, rrItem.meqs_supplier_item.vat_type)
                                                    })
                                                ) 
                                            }}
                                        </td>
                                        <td v-show="showGrossTotal" class="text-muted text-center align-middle">
                                            {{ 
                                                formatToPhpCurrency(
                                                    getGrossTotal({
                                                        price: rrItem.meqs_supplier_item.price,
                                                        quantity: rrItem.quantity_accepted
                                                    })
                                                ) 
                                            }}
                                        </td>
                                        <td v-show="showVatTotal" class="text-muted text-center align-middle">
                                            {{ 
                                                formatToPhpCurrency(
                                                    getVatTotal({
                                                        price: rrItem.meqs_supplier_item.price,
                                                        quantity: rrItem.quantity_accepted,
                                                        vatType: rrItem.meqs_supplier_item.vat_type
                                                    })
                                                )
                                            }}
                                        </td>
                                        <td v-show="showNetTotal" class="text-muted text-center align-middle">
                                            {{ 
                                                formatToPhpCurrency(
                                                    getTotalNetPrice({
                                                        pricePerUnit: rrItem.meqs_supplier_item.price,
                                                        vatPerUnit: getVatAmount(rrItem.meqs_supplier_item.price, rrItem.meqs_supplier_item.vat_type),
                                                        quantity: rrItem.quantity_accepted
                                                    })
                                                ) 
                                            }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="row justify-content-end">
            <div class="col-4">
                <div class="table-responsive">
                    <table class="table table-hover table-bordered table-striped">
                        <tbody>
                            <tr>
                                <td class="fst-italic"> Summary (Gross Total) </td>
                                <td class="fw-bold"> {{ formatToPhpCurrency(grossTotalSummary) }} </td>
                            </tr>
                            <tr>
                                <td class="fst-italic"> Delivery Charge </td>
                                <td class="fw-bold"> {{ formatToPhpCurrency(item.delivery_charge) }} </td>
                            </tr>
                            <tr>
                                <td class="fst-italic"> Total </td>
                                <td class="fw-bold"> {{ formatToPhpCurrency(totalPriceSummary) }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="row mb-3 pt-3 justify-content-center">
            <div class="col-lg-12">
                <hr>
                <div class="d-flex justify-content-between">
                    <div>
                        <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/rr">
                            <i class="fas fa-chevron-left"></i> Back to Search
                        </nuxt-link>
                    </div>
                    <div v-if="!item.cancelled_at && isAdminOrOwner(item.created_by, authUser)">
                        <nuxt-link class="btn btn-success me-2" :to="`/warehouse/purchasing/rr/${item.id}`">
                            <i class="fas fa-sync"></i> Update
                        </nuxt-link>
                        <nuxt-link class="btn btn-primary" to="/warehouse/purchasing/rr/create">
                            <i class="fas fa-plus"></i> Add New
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">

    definePageMeta({
        layout: "layout-admin"
    })

    import * as rrApi from '~/composables/warehouse/rr/rr.api'
    import type { RR } from '~/composables/warehouse/rr/rr.types';
    import { MOBILE_WIDTH } from '~/utils/config';
    import { approvalStatus } from '~/utils/constants'
    import { getTotalNetPrice, getVatAmount, getNetPrice, getGrossTotal, getVatTotal } from '~/utils/helpers';

    const authUser = ref<AuthUser>({} as AuthUser)
    const route = useRoute()
    const item = ref<RR | undefined>()
    const isMobile = ref(false)

    const showDescription = ref(true)
    const showItemCode = ref(true)
    const showClass = ref(true)
    const showBrand = ref(false)
    const showUnit = ref(false)
    const showDelivered = ref(true)
    const showAccepted = ref(true)
    const showVat = ref(true)
    const showGrossPrice = ref(true)
    const showNetPrice = ref(true)
    const showGrossTotal = ref(true)
    const showVatTotal = ref(true)
    const showNetTotal = ref(true)

    onMounted( async() => {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
        window.addEventListener('resize', checkMobile);
        authUser.value = getAuthUser()
        const rr = await rrApi.findOne(route.params.id as string)
        item.value = rr
    })

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }

    const isRV = computed( () => {
        const meqs = item.value?.po.meqs_supplier.meqs

        if(meqs?.rv) {
            return true 
        }
        return false 

    })

    const grossTotalSummary = computed( () => {

        let ctr = 0

        for(let rrItem of item.value!.rr_items) {
            ctr += rrItem.meqs_supplier_item.price * rrItem.quantity_accepted
        }

        return ctr

    })

    const totalPriceSummary = computed( () => grossTotalSummary.value - item.value!.delivery_charge) 


    const meqsReference = computed( () => {

        const meqs = item.value?.po.meqs_supplier.meqs

        if(isRV.value) {
            return meqs?.rv
        }

    })



</script>