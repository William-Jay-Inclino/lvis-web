<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser" class="row justify-content-center">
        
                <div class="col-lg-10">
        
                    <div v-if="item">
        
                        <div class="row pt-3">
                            <div class="col">
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <i class="fas fa-info-circle"></i> SPR Info
                                    </h5>
                                    <hr class="result">
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <tbody>
                                            <tr>
                                                <td class="text-muted">Status</td>
                                                <td>
                                                    <div :class="{ [`badge bg-${approvalStatus[item.status].color}`]: true }">
                                                        {{ approvalStatus[item.status].label }}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">RC Number</td>
                                                <td>
                                                    <nuxt-link v-if="item.canvass" :to="'/warehouse/purchasing/canvass/view/' + item.canvass.id">{{
                item.canvass.rc_number }}</nuxt-link>
                                                    <div v-else> N/A </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">SPR Number</td>
                                                <td> {{ item.spr_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">MEQS Number</td>
                                                <td>
                                                    <div v-if="item.meqs">
                                                        <nuxt-link :to="'/warehouse/purchasing/meqs/view/' + item.meqs.id">{{
                item.meqs.meqs_number }}</nuxt-link>
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
                                                        <div v-for="meqsSupplier in item.meqs!.meqs_suppliers">
                                                            <nuxt-link v-if="meqsSupplier.po"
                                                                :to="'/warehouse/purchasing/po/view/' + meqsSupplier.po.id">{{
                meqsSupplier.po.po_number }}</nuxt-link>
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
                                                        <div v-for="meqsSupplier in item.meqs?.meqs_suppliers">
                                                            <div v-if="meqsSupplier.po && meqsSupplier.po.rrs.length > 0">
                                                                <div v-for="rr in meqsSupplier.po.rrs">
                                                                    <nuxt-link :to="'/warehouse/purchasing/rr/view/' + rr.id">{{
                rr.rr_number }}</nuxt-link>
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
                                                <td class="text-muted">Date</td>
                                                <td> {{ formatDate(item.date_requested) }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Imd. Sup.</td>
                                                <td> {{ getFullname(item.supervisor.firstname, item.supervisor.middlename,
                item.supervisor.lastname) }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Vehicle</td>
                                                <td> {{ item.vehicle.name }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Classification</td>
                                                <td> {{ item.classification?.name }} </td>
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
        
        
        
        
                        <div class="row pt-3">
                            <div class="col">
        
        
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <i class="fas fa-users"></i> Approvers
                                    </h5>
                                    <hr class="result">
                                </div>
        
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
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
                                            <tr v-for="i, count in item.spr_approvers">
                                                <td class="align-middle"> {{ i.order }} </td>
                                                <td class="align-middle"> {{ i.label }} </td>
                                                <td class="align-middle"> {{ getFullname(i.approver!.firstname,
                i.approver!.middlename, i.approver!.lastname) }} </td>
                                                <td v-if="!isBlankStatus(item.status, i.status)" class="text-muted text-center align-middle">
                                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                        {{ approvalStatus[i.status].label }}
                                                    </div>
                                                    <div class="fst-italic" v-if="i.date_approval">
                                                        <small> {{ formatDate(i.date_approval, true) }} </small>
                                                    </div>
                                                </td>
                                                <td v-else class="text-muted text-center align-middle fst-italic">
                                                    N/A
                                                </td>
                                                <td>
                                                    <textarea rows="3" class="form-control" disabled
                                                        :value="i.notes"></textarea>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
        
        
                            </div>
                        </div>
        
                        <hr>


                        <div class="row pt-3">
                            <div class="col">
        
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <i class="fas fa-shopping-cart"></i> Items
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
                                                <th class="bg-secondary text-white"> Unit </th>
                                                <th class="bg-secondary text-white"> Quantity </th>
                                            </tr>
                                        </thead>
                                        <tbody v-if="item.canvass">
                                            <tr v-for="i, count in item.canvass.canvass_items">
                                                <td> {{ count + 1 }} </td>
                                                <td> {{ i.item ? `${ i.item.code } - ${ i.description }` : i.description }} </td>
                                                <td> {{ i.item ? 'Stock' : 'Non-Stock' }} </td>
                                                <td> {{ i.unit ? i.unit.name : 'N/A' }} </td>
                                                <td> {{ i.quantity }} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
        
                            </div>
                        </div>
        
                        <hr>

        
                        <div class="row mb-3 pt-3">
                            <div class="col">
                                <div class="d-flex justify-content-end">
                                    <div class="me-2">
                                        <nuxt-link v-if="canSearch(authUser, 'canManageSPR')" class="btn btn-secondary me-2"
                                            to="/warehouse/purchasing/spr">
                                            <i class="fas fa-search"></i> Search SPR
                                        </nuxt-link>
                                        <button v-if="item.status === APPROVAL_STATUS.APPROVED && canPrint(authUser, 'canManageSPR')" @click="onClickPrint" class="btn btn-danger">
                                            <i class="fas fa-print"></i> Print SPR
                                        </button>
                                        <button ref="printBtn" v-show="false" data-bs-toggle="modal"
                                            data-bs-target="#purchasingPdfModal">print</button>
                                    </div>
                                    <div v-if="!item.cancelled_at">
                                        <button v-if="isAdminOrOwner(item.created_by, authUser) && !item.meqs" class="btn btn-warning me-2"
                                            @click="onCancelSpr()">
                                            <i class="fas fa-times-circle"></i> Cancel SPR
                                        </button>
                                        <button v-if="!!item.can_update" class="btn btn-success me-2"
                                            @click="onClickUpdate(item.id)">
                                            <i class="fas fa-sync"></i> Update SPR
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageSPR')" class="btn btn-primary me-2"
                                            @click="onClickAdd">
                                            <i class="fas fa-plus"></i> Add New SPR
                                        </button>
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
        
            <WarehousePdfModal :is-loading-pdf="isLoadingPdf" :pdf-url="pdfUrl" />
            
        </div>
    </div>



</template>


<script setup lang="ts">

import * as api from '~/composables/warehouse/spr/spr.api'
import type { SPR } from '~/composables/warehouse/spr/spr.types';
import { approvalStatus } from '~/utils/constants'
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2'
import axios from 'axios';

definePageMeta({
    name: ROUTES.SPR_VIEW,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const isLoadingPdf = ref(false)

const config = useRuntimeConfig()
const WAREHOUSE_API_URL = config.public.warehouseApiUrl

const router = useRouter()
const route = useRoute()

const toast = useToast();

const printBtn = ref<HTMLButtonElement>()

const item = ref<SPR | undefined>()

const pdfUrl = ref('')


onMounted(async () => {

    authUser.value = getAuthUser()

    item.value = await api.findOne(route.params.id as string)

    isLoadingPage.value = false

})


const hasPO = computed(() => {

    if (!item.value) return false

    if (item.value.meqs && item.value.meqs.meqs_suppliers) {

        const po = item.value.meqs.meqs_suppliers.find(i => !!i.po)

        if (po) {
            return true
        }

        return false

    } else {
        return false
    }

})

async function onCancelSpr() {

    Swal.fire({
        title: "Are you sure?",
        text: `This SPR will be cancelled!`,
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74a3b",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, cancel it!",
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async (remove) => {

            if (remove) {
                await cancelSpr()
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function cancelSpr() {

    if (!item.value) return

    const response = await api.cancel(item.value.id)

    if (response.success) {
        toast.success(response.msg)
        item.value.cancelled_at = response.cancelled_at!

        router.push('/warehouse/purchasing/spr')

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }


}


async function onClickPrint() {
    console.log('onClickPrint()');


    if(!item.value?.classification) {

        Swal.fire({
            icon: "error",
            title: "Unable to print",
            text: "Classification is required!",
        });

        return

    }

    printBtn.value?.click()


    try {

        const accessToken = authUser.value.access_token

        isLoadingPdf.value = true

        const response = await axios.get(WAREHOUSE_API_URL + '/spr/pdf/' + item.value?.id, {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${accessToken}`, // Include Authorization header
            },
        });

        isLoadingPdf.value = false

        const blob = new Blob([response.data], { type: 'application/pdf' });
        pdfUrl.value = window.URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error loading PDF:', error);
    }
}


const onClickAdd = () => router.push('/warehouse/purchasing/spr/create')
const onClickUpdate = (id: string) => router.push('/warehouse/purchasing/spr/' + id)

</script>