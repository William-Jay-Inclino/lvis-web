<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Search JO</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col-lg-3 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">JO Number</label>
                            <client-only>
                                <v-select @search="handleSearchJoNumber" :options="jos" label="jo_number" v-model="jo"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">RC Number</label>
                            <client-only>
                                <v-select @search="handleSearchRcNumber" :options="canvasses" label="rc_number" v-model="canvass"></v-select>
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
                                <v-select @search="handleSearchEmployees" :options="employees" label="fullname" v-model="requested_by"></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>
        
                <div class="d-flex justify-content-end gap-2">
                    <button @click="search()" class="btn btn-primary" :disabled="isSearching">
                        <i class="fas fa-search"></i> {{ isSearching ? 'Searching...' : 'Search' }}
                    </button>
                    <button v-if="canCreate(authUser, 'canManageJO')" @click="onClickAdd" class="btn btn-primary float-end">
                        <i class="fas fa-plus"></i> Create JO
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
        
        
                                <!-- <div v-if="!isMobile"> -->
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white">JO Number</th>
                                                <th class="bg-secondary text-white">RC Number</th>
                                                <th class="bg-secondary text-white">Requisitioner</th>
                                                <th class="bg-secondary text-white">Date</th>
                                                <th class="bg-secondary text-white text-center">Status</th>
                                                <th class="text-center bg-secondary text-white">
                                                    <i class="fas fa-cogs"></i>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i in items">
                                                <td class="text-muted align-middle"> {{ i.jo_number }} </td>
                                                <td class="text-muted align-middle"> {{ i.canvass ? i.canvass.rc_number : 'N/A'  }} </td>
                                                <td class="text-muted align-middle"> {{ i.canvass ?
                getFullname(i.canvass.requested_by!.firstname,
                    i.canvass.requested_by!.middlename, i.canvass.requested_by!.lastname) : 'N/A' }}
                                                </td>
                                                <td class="text-muted align-middle"> {{ formatDate(i.date_requested) }}
                                                </td>
                                                <td class="text-center align-middle">
                                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                        {{ approvalStatus[i.status].label }}
                                                    </div>
                                                </td>
                                                <td class="text-muted align-middle">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light w-50"
                                                        :disabled="!canViewDetails(authUser, 'canManageJO')">
                                                        <i class="fas fa-info-circle"
                                                            :class="{ 'text-info': canViewDetails(authUser, 'canManageJO') }"></i>
                                                    </button>
                                                    <button :disabled="!i.can_update || i.status === APPROVAL_STATUS.CANCELLED" @click="onClickEdit(i.id)"
                                                        class="btn btn-light w-50">
                                                        <i class="fas fa-edit" :class="{ 'text-primary': !!i.can_update && i.status !== APPROVAL_STATUS.CANCELLED }"></i>
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

import type { Canvass } from '~/composables/warehouse/canvass/canvass.types';
import { type JO } from '~/composables/warehouse/jo/jo.types';
import * as joApi from '~/composables/warehouse/jo/jo.api'
import { getFullname, formatDate } from '~/utils/helpers'
import { PAGINATION_SIZE } from '~/utils/config'
import { ROUTES, approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/system/employee/employee.types';
import { fetchRcNumbers } from '~/composables/warehouse/canvass/canvass.api';
import { fetchEmployees } from '~/composables/system/employee/employee.api';
import { addPropertyFullName } from '~/composables/system/employee/employee';

definePageMeta({
    name: ROUTES.JO_INDEX,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)


const router = useRouter()

// flags
// const isMobile = ref(false)
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
const canvass = ref<Canvass | null>(null)
const jo = ref<JO | null>(null)
const date_requested = ref(null)
const requested_by = ref<Employee | null>(null)
const canvasses = ref<Canvass[]>([])
const jos = ref<JO[]>([])
const employees = ref<Employee[]>([])
// ----------------


// table data
const items = ref<JO[]>([])



// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {
    // isMobile.value = window.innerWidth < MOBILE_WIDTH

    // window.addEventListener('resize', checkMobile);

    authUser.value = getAuthUser()

    const response = await joApi.fetchDataInSearchFilters()

    canvasses.value = response.canvasses
    jos.value = response.jos
    employees.value = addPropertyFullName(response.employees)

    isLoadingPage.value = false

})


// ======================== COMPUTED ======================== 



// ======================== FUNCTIONS ======================== 



async function changePage(page: number) {

    isPaginating.value = true

    const { data, currentPage, totalItems, totalPages } = await joApi.findAll({
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

async function search() {

    isInitialLoad.value = false
    isSearching.value = true

    items.value = []

    // find by JO NUMBER
    if (jo.value) {
        const response = await joApi.findByJoNumber(jo.value.jo_number)
        isSearching.value = false
        if (response) {
            items.value.push(response)
            return
        }
        return
    }

    // find by RC NUMBER
    if (canvass.value) {
        const response = await joApi.findByRcNumber(canvass.value.rc_number)
        isSearching.value = false
        if (response) {
            items.value.push(response)
            return
        }
        return
    }


    // find by DATE REQUESTED and/or REQUISITIONER
    const { data, currentPage, totalItems, totalPages } = await joApi.findAll({
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

async function handleSearchJoNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        jos.value = []
        return
    } 

    debouncedSearchJoNumbers(input, loading)

}

async function handleSearchRcNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        canvasses.value = []
        return
    } 

    debouncedSearchRcNumbers(input, loading)

}

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        employees.value = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

}

async function searchJoNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchJoNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await joApi.fetchJoNumbers(input);
        console.log('response', response);
        jos.value = response;
    } catch (error) {
        console.error('Error fetching JO numbers:', error);
    } finally {
        loading(false);
    }
}

async function searchRcNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchRcNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchRcNumbers(input);
        console.log('response', response);
        canvasses.value = response;
    } catch (error) {
        console.error('Error fetching RC numbers:', error);
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

const onClickViewDetails = (id: string) => router.push('/warehouse/purchasing/jo/view/' + id)
const onClickEdit = (id: string) => router.push('/warehouse/purchasing/jo/' + id)
const onClickAdd = () => router.push('/warehouse/purchasing/jo/create')

const debouncedSearchJoNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchJoNumbers(input, loading);
}, 500);

const debouncedSearchRcNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchRcNumbers(input, loading);
}, 500);

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

</script>
