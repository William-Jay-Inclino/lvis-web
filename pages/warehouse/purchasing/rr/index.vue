<template>

    <div class="card">
        <div class="card-body">
            
            <div v-if="!isLoadingPage && authUser">
        
                <h2 class="text-warning">Search RR</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col-lg-3 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">RR Number</label>
                            <client-only>
                                <v-select :options="rrs" label="rr_number" v-model="rr"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">PO Number</label>
                            <client-only>
                                <v-select :options="pos" label="po_number" v-model="po"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Date</label>
                            <input v-model="date_requested" type="date" class="form-control">
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Requisitioner</label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="requested_by"></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>
        
                <div class="d-flex justify-content-end gap-2">
                    <button @click="search()" class="btn btn-primary" :disabled="isSearching">
                        <i class="fas fa-search"></i> {{ isSearching ? 'Searching...' : 'Search' }}
                    </button>
                    <button v-if="canCreate(authUser, 'canManageRR')" @click="onClickAdd" class="btn btn-primary float-end">
                        <i class="fas fa-plus"></i> Create RR
                    </button>
                </div>
        
                <div class="h5wrapper mb-3 mt-3" v-show="!isInitialLoad && !isSearching && !isPaginating">
                    <hr class="result">
                    <h6 class="text-warning"><i>Search results...</i></h6>
                    <hr class="result">
                </div>
        
                <div class="row justify-content-center pt-3">
        
                    <div class="text-center text-muted fst-italic" v-show="isSearching || isPaginating">
                        Please wait...
                    </div>
        
                    <div class="text-center text-muted fst-italic"
                        v-show="items.length === 0 && (!isInitialLoad && !isSearching)">
                        No results found
                    </div>
        
                    <div v-show="items.length > 0" class="col-lg">
        
                        <div class="row">
                            <div class="col">
        
        
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white">RR Number</th>
                                                <th class="bg-secondary text-white">PO Number</th>
                                                <th class="bg-secondary text-white">Requisitioner</th>
                                                <th class="bg-secondary text-white">Date</th>
                                                <th class="bg-secondary text-white">Status</th>
                                                <th class="text-center bg-secondary text-white">
                                                    <i class="fas fa-cogs"></i>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i in items">
                                                <td class="text-muted align-middle"> {{ i.rr_number }} </td>
                                                <td class="text-muted align-middle"> {{ i.po ? i.po.po_number : 'N/A' }} </td>
                                                <td v-if="i.po && i.po.meqs_supplier" class="text-muted align-middle">
                                                    <span v-if="i.po.meqs_supplier.meqs!.rv">
                                                        {{
                                                            i.po.meqs_supplier.meqs!.rv.canvass ?
                getRequisitionerFullname(i.po.meqs_supplier.meqs!.rv.canvass.requested_by) : 'N/A'
            }}
                                                    </span>
                                                    <span v-else-if="i.po.meqs_supplier.meqs!.spr">
                                                        {{
                                                            i.po.meqs_supplier.meqs!.spr.canvass ?
                getRequisitionerFullname(i.po.meqs_supplier.meqs!.spr.canvass.requested_by) : 'N/A'
            }}
                                                    </span>
                                                    <span v-else-if="i.po.meqs_supplier.meqs!.jo">
                                                        {{
                                                            i.po.meqs_supplier.meqs!.jo.canvass ?
                getRequisitionerFullname(i.po.meqs_supplier.meqs!.jo.canvass.requested_by) : 'N/A'
            }}
                                                    </span>
                                                </td>
                                                <td v-else> N/A </td>
                                                <td class="text-muted align-middle"> {{ formatDate(i.rr_date) }} </td>
                                                <td>
                                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                        {{ approvalStatus[i.status].label }}
                                                    </div>
                                                </td>
                                                <td class="text-muted align-middle">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light w-50"
                                                        :disabled="!canViewDetails(authUser, 'canManageRR')">
                                                        <i class="fas fa-info-circle"
                                                            :class="{ 'text-info': (canViewDetails(authUser, 'canManageRR') && !isTransactionFailed(i) ), 'text-danger': isTransactionFailed(i) }"></i>
                                                    </button>
                                                    <button :disabled="!i.can_update || i.status === APPROVAL_STATUS.CANCELLED" @click="onClickEdit(i.id)"
                                                        class="btn btn-light w-50">
                                                        <i class="fas fa-edit" :class="{ 'text-primary': !!i.can_update && i.status !== APPROVAL_STATUS.CANCELLED}"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
        
        
        
                            </div>
                        </div>
        
                        <div class="row">
                            <div class="col">
                                <nav>
                                    <ul class="pagination justify-content-center">
                                        <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                                            <a class="page-link" @click="changePage(pagination.currentPage - 1)"
                                                href="#">Previous</a>
                                        </li>
                                        <li v-for="page in pagination.totalPages" :key="page" class="page-item"
                                            :class="{ active: pagination.currentPage === page }">
                                            <a class="page-link" @click="changePage(page)" href="#">{{ page }}</a>
                                        </li>
                                        <li class="page-item"
                                            :class="{ disabled: pagination.currentPage === pagination.totalPages }">
                                            <a class="page-link" @click="changePage(pagination.currentPage + 1)"
                                                href="#">Next</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
        
        
                    </div>
                </div>
        
            </div>
        
            <div v-else>
                <LoaderSpinner />
            </div>

        </div>
    </div>


</template>


<script setup lang="ts">

import * as rrApi from '~/composables/warehouse/rr/rr.api'
import type { RR } from '~/composables/warehouse/rr/rr.types';
import { getFullname, formatDate } from '~/utils/helpers'
import { PAGINATION_SIZE } from '~/utils/config'
import type { PO } from '~/composables/warehouse/po/po.types';
import type { Employee } from '~/composables/system/employee/employee.types';

definePageMeta({
    name: ROUTES.RR_INDEX,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const router = useRouter()

// flags
const isInitialLoad = ref(true)
const isSearching = ref(false)
const isPaginating = ref(false)

// pagination
const _paginationInitial = {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: PAGINATION_SIZE,
}
const pagination = ref({ ..._paginationInitial })

// search filters
const po = ref<PO | null>(null)
const rr = ref<RR | null>(null)
const date_requested = ref(null)
const requested_by = ref<Employee | null>(null)
const employees = ref<Employee[]>([])
const pos = ref<PO[]>([])
const rrs = ref<RR[]>([])


// container for search result
const items = ref<RR[]>([])


// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    authUser.value = getAuthUser()
    const response = await rrApi.fetchDataInSearchFilters()

    pos.value = response.pos
    rrs.value = response.rrs
    employees.value = response.employees.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })

    isLoadingPage.value = false

})



// ======================== FUNCTIONS ======================== 

async function changePage(page: number) {

    isPaginating.value = true

    const { data, currentPage, totalItems, totalPages } = await rrApi.findAll({
        page,
        pageSize: pagination.value.pageSize,
        date_requested: date_requested.value,
        requested_by_id: requested_by.value ? requested_by.value.id : null

    })

    isPaginating.value = false
    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages
}

async function search() {

    isInitialLoad.value = false
    isSearching.value = true

    items.value = []

    if (rr.value) {

        const response = await rrApi.findByRefNumber({ rr_number: rr.value.rr_number })
        isSearching.value = false

        console.log('response', response)

        if (response) {
            items.value.push(response)
            return
        }

        return

    }

    if (po.value) {

        const response = await rrApi.findByRefNumber({ po_number: po.value.po_number })
        isSearching.value = false

        console.log('response', response)

        if (response) {
            items.value.push(response)
            return
        }

        return

    }

    const { data, currentPage, totalItems, totalPages } = await rrApi.findAll({
        page: 1,
        pageSize: pagination.value.pageSize,
        date_requested: date_requested.value,
        requested_by_id: requested_by.value ? requested_by.value.id : null

    })

    isSearching.value = false

    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages
}



// ======================== UTILS ======================== 

function getRequisitionerFullname(employee?: Employee | null) {
    console.log('employee', employee)
    if (!employee) return ''
    return getFullname(employee.firstname, employee.middlename, employee.lastname)
}

function isTransactionFailed(item: RR) {

    if(item.status === APPROVAL_STATUS.APPROVED && !item.is_completed) {
        return true 
    }

    return false 

}

const onClickViewDetails = (id: string) => router.push('/warehouse/purchasing/rr/view/' + id)
const onClickEdit = (id: string) => router.push('/warehouse/purchasing/rr/' + id)
const onClickAdd = () => router.push('/warehouse/purchasing/rr/create')


</script>


<style scoped>

.border-error {
    border: 1px solid #ff7b7b;;
}


</style>