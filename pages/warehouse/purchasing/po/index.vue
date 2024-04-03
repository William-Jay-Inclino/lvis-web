<template>

    <div v-if="!isLoadingPage && authUser">

        <h2 class="text-warning">Search PO</h2>

        <hr>

        <div class="row pt-3">
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
                    <label class="form-label">MEQS Number</label>
                    <client-only>
                        <v-select :options="meqs" label="meqs_number" v-model="meq"></v-select>
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
            <button v-if="canCreate(authUser, 'canManagePO')" @click="onClickAdd" class="btn btn-primary float-end">
                <i class="fas fa-plus"></i> Create PO
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
                                        <th class="bg-secondary text-white">PO Number</th>
                                        <th class="bg-secondary text-white">MEQS Number</th>
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
                                        <td class="text-muted align-middle"> {{ i.po_number }} </td>
                                        <td class="text-muted align-middle"> {{ i.meqs_supplier.meqs!.meqs_number }}
                                        </td>
                                        <td class="text-muted align-middle">
                                            <span v-if="i.meqs_supplier.meqs!.rv">
                                                {{
        getRequisitionerFullname(i.meqs_supplier.meqs!.rv.canvass.requested_by)
    }}
                                            </span>
                                            <span v-else-if="i.meqs_supplier.meqs!.spr">
                                                {{
        getRequisitionerFullname(i.meqs_supplier.meqs!.spr.canvass.requested_by)
    }}
                                            </span>
                                            <span v-else-if="i.meqs_supplier.meqs!.jo">
                                                {{
        getRequisitionerFullname(i.meqs_supplier.meqs!.jo.canvass.requested_by)
    }}
                                            </span>
                                        </td>
                                        <td class="text-muted align-middle"> {{ formatDate(i.po_date) }} </td>
                                        <td>
                                            <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                {{ approvalStatus[i.status].label }}
                                            </div>
                                        </td>
                                        <td class="text-muted align-middle">
                                            <button @click="onClickViewDetails(i.id)" class="btn btn-light w-50"
                                                :disabled="!canViewDetails(authUser, 'canManagePO')">
                                                <i class="fas fa-info-circle"
                                                    :class="{ 'text-info': canViewDetails(authUser, 'canManagePO') }"></i>
                                            </button>
                                            <button :disabled="!i.can_update" @click="onClickEdit(i.id)"
                                                class="btn btn-light w-50">
                                                <i class="fas fa-edit" :class="{ 'text-primary': !!i.can_update }"></i>
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

</template>



<script setup lang="ts">

import * as poApi from '~/composables/warehouse/po/po.api'
import type { PO } from '~/composables/warehouse/po/po.types';
import { getFullname, formatDate } from '~/utils/helpers'
import { PAGINATION_SIZE } from '~/utils/config'
import type { MEQS } from '~/composables/warehouse/meqs/meqs.types';

definePageMeta({
    name: ROUTES.PO_INDEX,
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
const meq = ref<MEQS | null>(null)
const date_requested = ref(null)
const requested_by = ref<Employee | null>(null)
const employees = ref<Employee[]>([])
const pos = ref<PO[]>([])
const meqs = ref<MEQS[]>([])


// container for search result
const items = ref<PO[]>([])


// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    authUser.value = getAuthUser()
    const response = await poApi.fetchDataInSearchFilters()

    pos.value = response.pos
    meqs.value = response.meqs
    employees.value = response.employees.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })

    isLoadingPage.value = false

})



// ======================== FUNCTIONS ======================== 

async function changePage(page: number) {

    isPaginating.value = true

    const { data, currentPage, totalItems, totalPages } = await poApi.findAll({
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

    if (po.value) {

        const response = await poApi.findByRefNumber({ po_number: po.value.po_number })
        isSearching.value = false

        console.log('response', response)

        if (response) {
            items.value.push(response)
            return
        }

        return

    }

    if (meq.value) {

        const response = await poApi.findByRefNumber({ meqs_number: meq.value.meqs_number })
        isSearching.value = false

        console.log('response', response)

        if (response) {
            items.value.push(response)
            return
        }

        return

    }

    const { data, currentPage, totalItems, totalPages } = await poApi.findAll({
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


const onClickViewDetails = (id: string) => router.push('/warehouse/purchasing/po/view/' + id)
const onClickEdit = (id: string) => router.push('/warehouse/purchasing/po/' + id)
const onClickAdd = () => router.push('/warehouse/purchasing/po/create')


</script>