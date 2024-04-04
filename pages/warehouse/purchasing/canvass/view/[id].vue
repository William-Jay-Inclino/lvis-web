<template>

    <div v-if="!isLoadingPage && authUser" class="row justify-content-center">

        <div class="col-lg-9">

            <div v-if="item">

                <div class="row pt-3">
                    <div class="col">
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <i class="fas fa-info-circle"></i> Canvass Info
                            </h5>
                            <hr class="result">
                        </div>
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover">
                                <tbody>
                                    <tr>
                                        <td class="text-muted">RC Number</td>
                                        <td> {{ item.rc_number }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">RV Number</td>
                                        <td>
                                            <div v-if="item.rv">
                                                <nuxt-link :to="'/warehouse/purchasing/rv/view/' + item.rv.id">{{
        item.rv.rv_number }}</nuxt-link>
                                            </div>
                                            <div v-else>
                                                N/A
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">JO Number</td>
                                        <td>
                                            <div v-if="item.jo">
                                                <nuxt-link :to="'/warehouse/purchasing/jo/view/' + item.jo.id">{{
        item.jo.jo_number }}</nuxt-link>
                                            </div>
                                            <div v-else>
                                                N/A
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">SPR Number</td>
                                        <td>
                                            <div v-if="item.spr">
                                                <nuxt-link :to="'/warehouse/purchasing/spr/view/' + item.spr.id">{{
        item.spr.spr_number }}</nuxt-link>
                                            </div>
                                            <div v-else>
                                                N/A
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">MEQS Number</td>
                                        <td>
                                            <div v-if="item.rv && item.rv.meqs">
                                                <nuxt-link :to="'/warehouse/purchasing/meqs/view/' + item.rv.meqs.id">
                                                    {{ item.rv.meqs.meqs_number }}
                                                </nuxt-link>
                                            </div>
                                            <div v-if="item.jo && item.jo.meqs">
                                                <nuxt-link :to="'/warehouse/purchasing/meqs/view/' + item.jo.meqs.id">
                                                    {{ item.jo.meqs.meqs_number }}
                                                </nuxt-link>
                                            </div>
                                            <div v-if="item.spr && item.spr.meqs">
                                                <nuxt-link :to="'/warehouse/purchasing/meqs/view/' + item.spr.meqs.id">
                                                    {{ item.spr.meqs.meqs_number }}
                                                </nuxt-link>
                                            </div>
                                            <div v-else>
                                                N/A
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">PO Number/s</td>
                                        <td>
                                            <div v-if="hasPO">
                                                <div v-if="item.rv"
                                                    v-for="meqsSupplier in item.rv.meqs!.meqs_suppliers">
                                                    <nuxt-link v-if="meqsSupplier.po"
                                                        :to="'/warehouse/purchasing/po/view/' + meqsSupplier.po.id">
                                                        {{ meqsSupplier.po.po_number }}
                                                    </nuxt-link>
                                                </div>
                                                <div v-else-if="item.jo"
                                                    v-for="meqsSupplier in item.jo.meqs!.meqs_suppliers">
                                                    <nuxt-link v-if="meqsSupplier.po"
                                                        :to="'/warehouse/purchasing/po/view/' + meqsSupplier.po.id">
                                                        {{ meqsSupplier.po.po_number }}
                                                    </nuxt-link>
                                                </div>
                                                <div v-if="item.spr"
                                                    v-for="meqsSupplier in item.spr.meqs!.meqs_suppliers">
                                                    <nuxt-link v-if="meqsSupplier.po"
                                                        :to="'/warehouse/purchasing/po/view/' + meqsSupplier.po.id">
                                                        {{ meqsSupplier.po.po_number }}
                                                    </nuxt-link>
                                                </div>
                                            </div>
                                            <div v-else>
                                                N/A
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">RR Number/s</td>
                                        <td>
                                            <div v-if="hasPO">
                                                <div v-if="item.rv"
                                                    v-for="meqsSupplier in item.rv.meqs!.meqs_suppliers">
                                                    <div v-if="meqsSupplier.po && meqsSupplier.po.rrs.length > 0">
                                                        <div v-for="rr in meqsSupplier.po.rrs">
                                                            <nuxt-link :to="'/warehouse/purchasing/rr/view/' + rr.id">
                                                                {{ rr.rr_number }}
                                                            </nuxt-link>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-if="item.jo"
                                                    v-for="meqsSupplier in item.jo.meqs!.meqs_suppliers">
                                                    <div v-if="meqsSupplier.po && meqsSupplier.po.rrs.length > 0">
                                                        <div v-for="rr in meqsSupplier.po.rrs">
                                                            <nuxt-link :to="'/warehouse/purchasing/rr/view/' + rr.id">
                                                                {{ rr.rr_number }}
                                                            </nuxt-link>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-if="item.spr"
                                                    v-for="meqsSupplier in item.spr.meqs!.meqs_suppliers">
                                                    <div v-if="meqsSupplier.po && meqsSupplier.po.rrs.length > 0">
                                                        <div v-for="rr in meqsSupplier.po.rrs">
                                                            <nuxt-link :to="'/warehouse/purchasing/rr/view/' + rr.id">
                                                                {{ rr.rr_number }}
                                                            </nuxt-link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-else>
                                                N/A
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Date Requested</td>
                                        <td> {{ formatDate(item.date_requested) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Purpose</td>
                                        <td> {{ item.purpose }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Notes</td>
                                        <td> {{ item.notes }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Requisitioner</td>
                                        <td> {{ getFullname(item.requested_by!.firstname, item.requested_by!.middlename,
        item.requested_by!.lastname) }} </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>

                </div>




                <div class="row pt-3">
                    <div class="col">

                        <div v-if="!isMobile">

                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <i class="fas fa-shopping-cart"></i> Canvass Items
                                </h5>
                                <hr class="result">
                            </div>

                            <div class="table-responsive">
                                <table class="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th class="bg-secondary text-white"> No. </th>
                                            <th class="bg-secondary text-white"> Description </th>
                                            <th class="bg-secondary text-white"> Item Class </th>
                                            <th class="bg-secondary text-white"> Brand </th>
                                            <th class="bg-secondary text-white"> Unit </th>
                                            <th class="bg-secondary text-white"> Quantity </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="i, count in item.canvass_items">
                                            <td> {{ count + 1 }} </td>
                                            <td> {{ i.description }} </td>
                                            <td> {{ i.item ? 'Stock' : 'Non-Stock' }} </td>
                                            <td> {{ i.brand ? i.brand.name : 'N/A' }} </td>
                                            <td> {{ i.unit ? i.unit.name : 'N/A' }} </td>
                                            <td> {{ i.quantity }} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- <div v-else>

                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <i class="fas fa-shopping-cart"></i> Canvass Items
                                </h5>
                                <hr class="result">
                            </div>

                            <div v-for="i, count in item.canvass_items" class="table-responsive">

                                <table class="table table-hover table-bordered">
                                    <tbody>
                                        <tr>
                                            <td class="bg-secondary text-white"> No. </td>
                                            <td class="bg-secondary text-white"> {{ count + 1 }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Description </td>
                                            <td> {{ i.description }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Brand </td>
                                            <td> {{ i.brand ? i.brand.name : 'N/A' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Unit </td>
                                            <td> {{ i.unit ? i.unit.name : 'N/A' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Quantity </td>
                                            <td> {{ i.description }} </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                        </div> -->

                    </div>
                </div>

                <hr>

                <div class="row mb-3 pt-3">
                    <div class="col">
                        <div class="d-flex justify-content-end">
                            <div class="me-2">
                                <nuxt-link v-if="canSearch(authUser, 'canManageCanvass')" class="btn btn-secondary me-2"
                                    to="/warehouse/purchasing/canvass">
                                    <i class="fas fa-search"></i> Search Canvass
                                </nuxt-link>
                                <button class="btn btn-danger">
                                    <i class="fas fa-print"></i> Print Canvass
                                </button>
                            </div>
                            <div v-if="!item.deleted_at">
                                <nuxt-link v-if="!!item.can_update" class="btn btn-success me-2"
                                    :to="`/warehouse/purchasing/canvass/${item.id}`">
                                    <i class="fas fa-sync"></i> Update Canvass
                                </nuxt-link>
                                <nuxt-link v-if="canCreate(authUser, 'canManageCanvass')" class="btn btn-primary"
                                    to="/warehouse/purchasing/canvass/create">
                                    <i class="fas fa-plus"></i> Add New Canvass
                                </nuxt-link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>

    <div v-else>
        <LoaderSpinner />
    </div>

</template>


<script setup lang="ts">

import * as api from '~/composables/warehouse/canvass/canvass.api'
import type { Canvass } from '~/composables/warehouse/canvass/canvass.types';
import { MOBILE_WIDTH } from '~/utils/config';
import { ROUTES } from '~/utils/constants';

definePageMeta({
    name: ROUTES.CANVASS_VIEW,
    layout: "layout-warehouse",
    middleware: ['auth']
})

const isLoadingPage = ref(true)

const authUser = ref<AuthUser>({} as AuthUser)
const route = useRoute()
const item = ref<Canvass | undefined>()
const isMobile = ref(false)

onMounted(async () => {

    isMobile.value = window.innerWidth < MOBILE_WIDTH

    window.addEventListener('resize', checkMobile);

    authUser.value = getAuthUser()

    item.value = await api.findOne(route.params.id as string)


    isLoadingPage.value = false

})

function checkMobile() {
    isMobile.value = window.innerWidth < MOBILE_WIDTH
}

const hasPO = computed(() => {

    if (!item.value) return false

    if (item.value.rv && item.value.rv.meqs && item.value.rv.meqs.meqs_suppliers) {

        const po = item.value.rv.meqs.meqs_suppliers.find(i => !!i.po)

        if (po) {
            return true
        }

        return false

    }

    if (item.value.spr && item.value.spr.meqs && item.value.spr.meqs.meqs_suppliers) {

        const po = item.value.spr.meqs.meqs_suppliers.find(i => !!i.po)

        if (po) {
            return true
        }

        return false

    }

    if (item.value.jo && item.value.jo.meqs && item.value.jo.meqs.meqs_suppliers) {

        const po = item.value.jo.meqs.meqs_suppliers.find(i => !!i.po)

        if (po) {
            return true
        }

        return false

    }

})




</script>
