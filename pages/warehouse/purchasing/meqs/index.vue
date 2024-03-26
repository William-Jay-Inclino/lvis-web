<template>
    <div>
        <h2 class="text-warning">Search MEQS</h2>

        <hr>

        <div class="row pt-3">
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">MEQS Number</label>
                    <client-only>
                        <v-select :options="meqsArray" label="meqs_number" v-model="meqs"></v-select>
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
                                <v-select :options="rvs" label="rv_number" v-model="rv"
                                    v-show="transactionType === 'RV'"></v-select>
                                <v-select :options="jos" label="jo_number" v-model="jo"
                                    v-show="transactionType === 'JO'"></v-select>
                                <v-select :options="sprs" label="spr_number" v-model="spr"
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
                        <v-select :options="employees" label="fullname" v-model="requested_by"></v-select>
                    </client-only>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end gap-2">
            <button @click="search()" class="btn btn-primary" :disabled="isSearching">
                <i class="fas fa-search"></i> {{ isSearching ? 'Searching...' : 'Search' }}
            </button>
            <nuxt-link class="btn btn-primary float-end" to="/warehouse/purchasing/meqs/create">
                <i class="fas fa-plus"></i> Create MEQS
            </nuxt-link>
        </div>

        <div class="h6wrapper mb-3 mt-3" v-show="!isInitialLoad && !isSearching && !isPaginating">
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
                                            <td class="text-muted align-middle" v-if="i.spr">
                                                SPR#{{ i.spr.spr_number }}
                                            </td>
                                            <td class="text-muted align-middle" v-if="i.rv">
                                                {{
                            getFullname(i.rv.canvass.requested_by!.firstname,
                                i.rv.canvass.requested_by!.middlename,
                                i.rv.canvass.requested_by!.lastname)
                        }}
                                            </td>
                                            <td class="text-muted align-middle" v-else-if="i.jo">
                                                {{
                            getFullname(i.jo.canvass.requested_by!.firstname,
                                i.jo.canvass.requested_by!.middlename,
                                i.jo.canvass.requested_by!.lastname)
                        }}
                                            </td>
                                            <td class="text-muted align-middle" v-if="i.spr">
                                                {{
                            getFullname(i.spr.canvass.requested_by!.firstname,
                                i.spr.canvass.requested_by!.middlename,
                                i.spr.canvass.requested_by!.lastname)
                        }}
                                            </td>
                                            <td class="text-muted align-middle"> {{ formatDate(i.meqs_date) }} </td>
                                            <td class="text-center align-middle">
                                                <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                    {{ approvalStatus[i.status].label }}
                                                </div>
                                            </td>
                                            <td class="text-muted align-middle">
                                                <nuxt-link class="btn btn-light w-50"
                                                    :to="'/warehouse/purchasing/meqs/view/' + i.id">
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
                                            <td width="50%" class="bg-secondary text-white"> MEQS Number </td>
                                            <td class="bg-secondary text-white"> {{ i.meqs_number }} </td>
                                        </tr>
                                        <tr v-if="i.rv">
                                            <td class="text-muted"> RV Number </td>
                                            <td> {{ i.rv.rv_number }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Requisitioner </td>
                                            <td v-if="i.rv">
                                                {{ getFullname(i.rv.canvass.requested_by!.firstname,
                            i.rv.canvass.requested_by!.middlename,
                            i.rv.canvass.requested_by!.lastname) }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Date </td>
                                            <td> {{ formatDate(i.meqs_date) }} </td>
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
                                                    :to="'/warehouse/purchasing/meqs/view/' + i.id">
                                                    <i class="fas fa-info-circle text-info"></i> View Details
                                                </nuxt-link>
                                            </td>
                                            <td v-if="isAdminOrOwner(i.created_by, authUser)" class="text-center">
                                                <button @click="onClickEdit(i.id)"
                                                    class="btn btn-sm btn-light text-primary w-100">
                                                    <i class="fas fa-edit"></i>
                                                    Edit MEQS
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
import type { MEQS } from '~/composables/warehouse/meqs/meqs.types';
import type { RV } from '~/composables/warehouse/rv/rv.types';
import * as meqsApi from '~/composables/warehouse/meqs/meqs.api'
import type { JO } from '~/composables/warehouse/jo/jo.types';
import type { SPR } from '~/composables/warehouse/spr/spr.types';


definePageMeta({
    name: ROUTES.MEQS_INDEX,
    layout: "layout-warehouse",
    middleware: ['auth'],
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
    isMobile.value = window.innerWidth < MOBILE_WIDTH

    window.addEventListener('resize', checkMobile);

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

// ======================== UTILS ======================== 

function checkMobile() {
    isMobile.value = window.innerWidth < MOBILE_WIDTH
}

function onClickEdit(id: string) {
    router.push('/warehouse/purchasing/meqs/' + id)
}


</script>









<style scoped>
hr.result {
    flex: 1;
    margin: 0 10px;
    border: none;
    border-top: 1px solid #333;
}

h6 {
    margin: 0;
}

.h6wrapper {
    display: flex;
    align-items: center;
}
</style>