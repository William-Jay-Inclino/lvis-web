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
                                <v-select :options="jos" label="jo_number" v-model="jo"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">RC Number</label>
                            <client-only>
                                <v-select :options="canvasses" label="rc_number" v-model="canvass"></v-select>
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
                                <!-- </div> -->
        
                                <!-- <div v-else>
        
                                    <div v-for="i in items" class="table-responsive">
        
                                        <table class="table table-hover table-bordered">
        
                                            <tbody>
                                                <tr>
                                                    <td width="50%" class="bg-secondary text-white"> JO Number </td>
                                                    <td class="bg-secondary text-white"> {{ i.jo_number }} </td>
                                                </tr>
                                                <tr>
                                                    <td class="text-muted"> RC Number </td>
                                                    <td> {{ i.canvass.rc_number }} </td>
                                                </tr>
                                                <tr>
                                                    <td class="text-muted"> Requisitioner </td>
                                                    <td> {{ getFullname(i.canvass.requested_by!.firstname,
                                    i.canvass.requested_by!.middlename, i.canvass.requested_by!.lastname) }}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="text-muted"> Date </td>
                                                    <td> {{ formatDate(i.date_requested) }} </td>
                                                </tr>
                                                <tr>
                                                    <td class="text-muted"> Status </td>
                                                    <td>
                                                        <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                            {{ approvalStatus[i.status].label }}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="text-center"
                                                        :colspan="isAdminOrOwner(i.created_by, authUser) ? 1 : 2">
                                                        <nuxt-link class="btn btn-sm btn-light text-info w-100"
                                                            :to="'/warehouse/purchasing/jo/view/' + i.id">
                                                            <i class="fas fa-info-circle text-info"></i> View Details
                                                        </nuxt-link>
                                                    </td>
                                                    <td v-if="isAdminOrOwner(i.created_by, authUser)" class="text-center">
                                                        <button @click="onClickEdit(i.id)"
                                                            class="btn btn-sm btn-light text-primary w-100">
                                                            <i class="fas fa-edit"></i>
                                                            Edit JO
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
        
                                        </table>
        
        
                                    </div>
        
                                </div> -->
        
        
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
    employees.value = response.employees.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })

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



// ======================== UTILS ======================== 

const onClickViewDetails = (id: string) => router.push('/warehouse/purchasing/jo/view/' + id)
const onClickEdit = (id: string) => router.push('/warehouse/purchasing/jo/' + id)
const onClickAdd = () => router.push('/warehouse/purchasing/jo/create')


</script>
