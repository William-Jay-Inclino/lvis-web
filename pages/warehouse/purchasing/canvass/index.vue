<template>
    <div>
        <h2 class="text-warning">Search Canvass</h2>

        <hr>

        <div class="row pt-3">
            <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">RC Number</label>
                    <client-only>
                        <v-select :options="canvasses" label="rc_number" v-model="canvass"></v-select>
                    </client-only>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">Date</label>
                    <input v-model="date_requested" type="date" class="form-control">
                </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
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
            <nuxt-link class="btn btn-primary float-end" to="/warehouse/purchasing/canvass/create">
                <i class="fas fa-plus"></i> Create Canvass
            </nuxt-link>
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


                        <div v-if="!isMobile">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th class="bg-secondary text-white">RC Number</th>
                                            <th class="bg-secondary text-white">Requisitioner</th>
                                            <th class="bg-secondary text-white">Date</th>
                                            <th class="text-center bg-secondary text-white">
                                                <i class="fas fa-cogs"></i>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="i in items">
                                            <td class="text-muted align-middle"> {{ i.rc_number }} </td>
                                            <td class="text-muted align-middle"> {{
                            getFullname(i.requested_by!.firstname, i.requested_by!.middlename,
                                i.requested_by!.lastname) }} </td>
                                            <td class="text-muted align-middle"> {{ formatDate(i.date_requested) }}
                                            </td>
                                            <td class="text-muted align-middle">
                                                <nuxt-link class="btn btn-light w-50"
                                                    :to="'/warehouse/purchasing/canvass/view/' + i.id">
                                                    <i class="fas fa-info-circle text-info"></i>
                                                </nuxt-link>
                                                <button v-if="isAdminOrOwner(i.created_by, authUser)"
                                                    @click="onClickEdit(i.id)" class="btn btn-light w-50">
                                                    <i class="fas fa-edit text-primary"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div v-else>

                            <div v-for="i in items" class="table-responsive">

                                <table class="table table-hover table-bordered">

                                    <tbody>
                                        <tr>
                                            <td width="50%" class="bg-secondary text-white"> RC Number </td>
                                            <td class="bg-secondary text-white"> {{ i.rc_number }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Requisitioner </td>
                                            <td> {{ getFullname(i.requested_by!.firstname, i.requested_by!.middlename,
                            i.requested_by!.lastname) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Date </td>
                                            <td> {{ moment(i.date_requested).format('YYYY-MM-DD') }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-center"
                                                :colspan="isAdminOrOwner(i.created_by, authUser) ? 1 : 2">
                                                <nuxt-link class="btn btn-sm btn-light text-info w-100"
                                                    :to="'/warehouse/purchasing/canvass/view/' + i.id">
                                                    <i class="fas fa-info-circle text-info"></i> View Details
                                                </nuxt-link>
                                            </td>
                                            <td v-if="isAdminOrOwner(i.created_by, authUser)" class="text-center">
                                                <button @click="onClickEdit(i.id)"
                                                    class="btn btn-sm btn-light text-primary w-100">
                                                    <i class="fas fa-edit"></i>
                                                    Edit Canvass
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>


                            </div>

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

</template>


<script setup lang="ts">

import * as api from '~/composables/warehouse/canvass/canvass.api'
import type { Canvass } from '~/composables/warehouse/canvass/canvass.types';
import { getFullname, formatDate, isAdminOrOwner } from '~/utils/helpers'
import moment from 'moment'
import { MOBILE_WIDTH, PAGINATION_SIZE } from '~/utils/config'
import { ROUTES } from '~/utils/constants';

definePageMeta({
    name: ROUTES.CANVASS_INDEX,
    layout: "layout-warehouse",
    middleware: ['auth']
})

const authUser = ref<AuthUser>({} as AuthUser)

const router = useRouter()

// flags
const isMobile = ref(false)
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
const date_requested = ref(null)
const requested_by = ref<Employee | null>(null)
const canvasses = ref<Canvass[]>([])
const employees = ref<Employee[]>([])
// ----------------


// container for search result
const items = ref<Canvass[]>([])


// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {
    isMobile.value = window.innerWidth < MOBILE_WIDTH

    window.addEventListener('resize', checkMobile);

    authUser.value = getAuthUser()

    const response = await api.fetchDataInSearchFilters()

    canvasses.value = response.canvasses
    employees.value = response.employees.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })

})


// ======================== FUNCTIONS ======================== 

function onClickEdit(id: string) {
    router.push('/warehouse/purchasing/canvass/' + id)
}

async function changePage(page: number) {

    isPaginating.value = true

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
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

    if (canvass.value) {

        const response = await api.findByRcNumber(canvass.value.rc_number)
        isSearching.value = false

        console.log('response', response)

        if (response) {
            items.value.push(response)
            return
        }

        return

    }

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
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

function checkMobile() {
    isMobile.value = window.innerWidth < MOBILE_WIDTH
}

</script>
