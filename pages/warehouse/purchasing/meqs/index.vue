<template>

    <div class="card">
        <div class="card-body">
            
            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Search MEQS</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col-lg-3 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">MEQS Number</label>
                            <client-only>
                                <v-select @search="handleSearchMeqsNumber" :options="meqsArray" label="meqs_number" v-model="meqs"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Transaction</label>
                            <div class="row g-0">
                                <div class="col-4">
                                    <client-only>
                                        <v-select @option:selected="onChangeTransactionType" :options="transactionTypes"
                                            v-model="transactionType" :clearable="false"></v-select>
                                    </client-only>
                                </div>
                                <div class="col-8">
                                    <client-only>
                                        <v-select @search="handleSearchRvNumber" :options="rvs" label="rv_number" v-model="rv"
                                            v-show="transactionType === 'RV'"></v-select>
                                        <v-select @search="handleSearchJoNumber" :options="jos" label="jo_number" v-model="jo"
                                            v-show="transactionType === 'JO'"></v-select>
                                        <v-select @search="handleSearchSprNumber" :options="sprs" label="spr_number" v-model="spr"
                                            v-show="transactionType === 'SPR'"></v-select>
                                    </client-only>
                                </div>
                            </div>
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
                                <v-select @search="handleSearchEmployees" :options="employees" label="fullname" v-model="requested_by"></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>
        
                <div class="d-flex justify-content-end gap-2">
                    <button @click="search()" class="btn btn-primary" :disabled="isSearching">
                        <i class="fas fa-search"></i> {{ isSearching ? 'Searching...' : 'Search' }}
                    </button>
                    <button v-if="canCreate(authUser, 'canManageMEQS')" @click="onClickAdd" class="btn btn-primary float-end">
                        <i class="fas fa-plus"></i> Create MEQS
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
                                                <th class="bg-secondary text-white">MEQS Number</th>
                                                <th class="bg-secondary text-white">Reference</th>
                                                <th class="bg-secondary text-white">Requisitioner</th>
                                                <th class="bg-secondary text-white">Date</th>
                                                <th class="bg-secondary text-white text-center">Status</th>
                                                <th class="text-center bg-secondary text-white">
                                                    <i class="fas fa-info-circle"></i>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i in items">
                                                <td class="text-muted align-middle"> {{ i.meqs_number }} </td>
                                                <td class="text-muted align-middle" v-if="i.rv">
                                                    RV#{{ i.rv.rv_number }}
                                                </td>
                                                <td class="text-muted align-middle" v-else-if="i.jo">
                                                    JO#{{ i.jo.jo_number }}
                                                </td>
                                                <td class="text-muted align-middle" v-else-if="i.spr">
                                                    SPR#{{ i.spr.spr_number }}
                                                </td>
                                                <td v-else>
                                                    N/A
                                                </td>
                                                <td class="text-muted align-middle" v-if="i.rv">
                                                    {{
                                                        i.rv.canvass ?
                getFullname(i.rv.canvass.requested_by!.firstname,
                    i.rv.canvass.requested_by!.middlename,
                    i.rv.canvass.requested_by!.lastname) : 'N/A'
            }}
                                                </td>
                                                <td class="text-muted align-middle" v-else-if="i.jo">
                                                    {{
                                                        i.jo.canvass ?
                getFullname(i.jo.canvass.requested_by!.firstname,
                    i.jo.canvass.requested_by!.middlename,
                    i.jo.canvass.requested_by!.lastname) : 'N/A'
            }}
                                                </td>
                                                <td class="text-muted align-middle" v-else-if="i.spr">
                                                    {{
                                                        i.spr.canvass ?
                getFullname(i.spr.canvass.requested_by!.firstname,
                    i.spr.canvass.requested_by!.middlename,
                    i.spr.canvass.requested_by!.lastname) : 'N/A'
            }}
                                                </td>
                                                <td v-else>
                                                    N/A
                                                </td>
                                                <td class="text-muted align-middle"> {{ formatDate(i.meqs_date) }} </td>
                                                <td class="text-center align-middle">
                                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                        {{ approvalStatus[i.status].label }}
                                                    </div>
                                                </td>
                                                <td class="text-muted align-middle">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light w-50"
                                                        :disabled="!canViewDetails(authUser, 'canManageMEQS')">
                                                        <i class="fas fa-info-circle"
                                                            :class="{ 'text-info': canViewDetails(authUser, 'canManageMEQS') }"></i>
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
import type { MEQS } from '~/composables/warehouse/meqs/meqs.types';
import type { RV } from '~/composables/warehouse/rv/rv.types';
import * as meqsApi from '~/composables/warehouse/meqs/meqs.api'
import type { JO } from '~/composables/warehouse/jo/jo.types';
import type { SPR } from '~/composables/warehouse/spr/spr.types';
import { getFullname, formatDate } from '~/utils/helpers'
import type { Employee } from '~/composables/system/employee/employee.types';
import { fetchRvNumbers } from '~/composables/warehouse/rv/rv.api';
import { fetchEmployees } from '~/composables/system/employee/employee.api';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import { fetchSprNumbers } from '~/composables/warehouse/spr/spr.api';
import { fetchJoNumbers } from '~/composables/warehouse/jo/jo.api';


definePageMeta({
    name: ROUTES.MEQS_INDEX,
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


const transactionTypes = ref(['RV', 'SPR', 'JO'])

// ====== search filters ====== 

// dropdowns
const meqsArray = ref<MEQS[]>([])
const rvs = ref<RV[]>([])
const jos = ref<JO[]>([])
const sprs = ref<SPR[]>([])
const employees = ref<Employee[]>([])

// fields
const transactionType = ref(transactionTypes.value[0])
const meqs = ref<MEQS | null>(null)
const rv = ref<RV | null>(null)
const jo = ref<JO | null>(null)
const spr = ref<SPR | null>(null)
const date_requested = ref(null)
const requested_by = ref<Employee | null>(null)
// ----------------


// container for search result
const items = ref<MEQS[]>([])


onMounted(async () => {

    authUser.value = getAuthUser()
    const response = await meqsApi.fetchDataInSearchFilters()

    meqsArray.value = response.meqs
    rvs.value = response.rvs
    sprs.value = response.sprs
    jos.value = response.jos
    employees.value = response.employees.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })


    isLoadingPage.value = false

})


// ======================== COMPUTED ======================== 

async function search() {

    console.log('search')

    isInitialLoad.value = false
    isSearching.value = true

    items.value = []

    // find by MEQS NUMBER
    if (meqs.value) {
        const response = await meqsApi.findByMeqsNumber(meqs.value.meqs_number)
        isSearching.value = false
        if (response) {
            items.value.push(response)
            return
        }
        return
    }

    // find by RV/SPR/JO NUMBER
    if (rv.value || spr.value || jo.value) {

        let response

        if (rv.value) {
            response = await meqsApi.findByReferenceNumber({ rv_number: rv.value.rv_number })
        } else if (spr.value) {
            response = await meqsApi.findByReferenceNumber({ spr_number: spr.value.spr_number })
        } else if (jo.value) {
            response = await meqsApi.findByReferenceNumber({ jo_number: jo.value.jo_number })
        }

        isSearching.value = false
        if (response) {
            items.value.push(response)
            return
        }
        return
    }


    // find by DATE REQUESTED and/or REQUISITIONER
    const { data, currentPage, totalItems, totalPages } = await meqsApi.findAll({
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

async function changePage(page: number) {

    isPaginating.value = true

    const { data, currentPage, totalItems, totalPages } = await meqsApi.findAll({
        page,
        pageSize: pagination.value.pageSize,
        date_requested: null,
        requested_by_id: null

    })
    isPaginating.value = false

    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages
}

function onChangeTransactionType() {
    console.log('onChangeTransactionType')
    rv.value = null
    spr.value = null
    jo.value = null
}

async function handleSearchMeqsNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        meqsArray.value = []
        return
    } 

    debouncedSearchMeqsNumbers(input, loading)

}

async function handleSearchJoNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        jos.value = []
        return
    } 

    debouncedSearchJoNumbers(input, loading)

}

async function handleSearchSprNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        sprs.value = []
        return
    } 

    debouncedSearchSprNumbers(input, loading)

}

async function handleSearchRvNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        rvs.value = []
        return
    } 

    debouncedSearchRvNumbers(input, loading)

}

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        employees.value = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

}

async function searchMeqsNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchMeqsNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await meqsApi.fetchMeqsNumbers(input);
        console.log('response', response);
        meqsArray.value = response;
    } catch (error) {
        console.error('Error fetching MEQS numbers:', error);
    } finally {
        loading(false);
    }
}

async function searchJoNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchJoNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchJoNumbers(input);
        console.log('response', response);
        jos.value = response;
    } catch (error) {
        console.error('Error fetching JO numbers:', error);
    } finally {
        loading(false);
    }
}

async function searchSprNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchSprNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchSprNumbers(input);
        console.log('response', response);
        sprs.value = response;
    } catch (error) {
        console.error('Error fetching SPR numbers:', error);
    } finally {
        loading(false);
    }
}

async function searchRvNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchRvNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchRvNumbers(input);
        console.log('response', response);
        rvs.value = response;
    } catch (error) {
        console.error('Error fetching RV numbers:', error);
    } finally {
        loading(false);
    }
}

async function searchEmployees(input: string, loading: (status: boolean) => void) {
    console.log('searchEmployees');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchEmployees(input);
        console.log('response', response);
        employees.value = addPropertyFullName(response)
    } catch (error) {
        console.error('Error fetching Employees:', error);
    } finally {
        loading(false);
    }
}

// ======================== UTILS ======================== 

const onClickViewDetails = (id: string) => router.push('/warehouse/purchasing/meqs/view/' + id)
const onClickEdit = (id: string) => router.push('/warehouse/purchasing/meqs/' + id)
const onClickAdd = () => router.push('/warehouse/purchasing/meqs/create')

const debouncedSearchMeqsNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchMeqsNumbers(input, loading);
}, 500);

const debouncedSearchJoNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchJoNumbers(input, loading);
}, 500);

const debouncedSearchSprNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchSprNumbers(input, loading);
}, 500);

const debouncedSearchRvNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchRvNumbers(input, loading);
}, 500);

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

</script>
