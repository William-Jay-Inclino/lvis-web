<template>
    <div>
        <h2 class="text-warning">Search RV</h2>

        <hr>

        <div class="row pt-3">
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">RV Number</label>
                    <client-only>
                        <v-select :options="rvs" label="rv_number" v-model="rv"></v-select>
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
            <nuxt-link class="btn btn-primary float-end" to="/warehouse/purchasing/rv/create">
                <i class="fas fa-plus"></i> Create RV
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

            <div class="text-center text-muted fst-italic" v-show="items.length === 0 && (!isInitialLoad && !isSearching)">
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
                                            <th class="bg-secondary text-white">RV Number</th>
                                            <th class="bg-secondary text-white">RC Number</th>
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
                                            <td class="text-muted"> {{ i.rv_number }} </td>
                                            <td class="text-muted"> {{ i.canvass.rc_number }} </td>
                                            <td class="text-muted"> {{ getFullname(i.canvass.requested_by!.firstname, i.canvass.requested_by!.middlename, i.canvass.requested_by!.lastname) }} </td>
                                            <td class="text-muted"> {{ formatDate(i.date_requested) }} </td>
                                            <td class="text-center">
                                                <div :class="{[`badge bg-${approvalStatus[i.status].color}`]: true}"> 
                                                    {{ approvalStatus[i.status].label }} 
                                                </div>
                                            </td>
                                            <td class="text-center">
                                                <button v-if="i.status !== APPROVAL_STATUS.CANCELLED" @click="onClickEdit(i.id)" class="btn btn-sm btn-light text-primary">
                                                    <i class="fas fa-edit"></i>
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
                                            <td width="50%" class="bg-secondary text-white"> RV Number </td>
                                            <td class="bg-secondary text-white"> {{ i.rv_number }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> RC Number </td>
                                            <td> {{ i.canvass.rc_number }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Requisitioner </td>
                                            <td> {{ getFullname(i.canvass.requested_by!.firstname, i.canvass.requested_by!.middlename, i.canvass.requested_by!.lastname) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Date </td>
                                            <td> {{ formatDate(i.date_requested) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> Status </td>
                                            <td>
                                                <div :class="{[`badge bg-${approvalStatus[i.status].color}`]: true}"> 
                                                    {{ approvalStatus[i.status].label }} 
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" class="text-center">
                                                <button @click="onClickEdit(i.id)" class="btn btn-sm btn-light text-primary w-100">
                                                    View Details
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
                                <a class="page-link" @click="changePage(pagination.currentPage - 1)" href="#">Previous</a>
                            </li>
                            <li v-for="page in pagination.totalPages" :key="page" class="page-item" :class="{ active: pagination.currentPage === page }">
                                <a class="page-link" @click="changePage(page)" href="#">{{ page }}</a>
                            </li>
                            <li class="page-item" :class="{ disabled: pagination.currentPage === pagination.totalPages }">
                                <a class="page-link" @click="changePage(pagination.currentPage + 1)" href="#">Next</a>
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
    import type { Canvass } from '~/composables/warehouse/canvass/canvass.types';
    import { type RV } from '~/composables/warehouse/rv/rv.types';
    import * as rvApi from '~/composables/warehouse/rv/rv.api'
    import moment from 'moment'
    import { getFullname, formatDate } from '~/utils/helpers'
    import { MOBILE_WIDTH, PAGINATION_SIZE } from '~/utils/config'
    import { approvalStatus } from '~/utils/constants';


    definePageMeta({
        layout: "layout-admin"
    })

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
    const pagination = ref({..._paginationInitial})


    // search filters
    const canvass = ref<Canvass | null>(null)
    const rv = ref<RV | null>(null)
    const date_requested = ref(null)
    const requested_by = ref<Employee | null>(null)
    const canvasses = ref<Canvass[]>([])
    const rvs = ref<RV[]>([])
    const employees = ref<Employee[]>([])
    // ----------------

    
    // table data
    const items = ref<RV[]>([])



    // ======================== LIFECYCLE HOOKS ======================== 

    onMounted( async() => {
        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        const response = await rvApi.fetchDataInSearchFilters()

        canvasses.value = response.canvasses
        rvs.value = response.rvs
        employees.value = response.employees.map((i) => {
            i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
            return i
        })

    })


    // ======================== COMPUTED ======================== 



    // ======================== FUNCTIONS ======================== 



    async function changePage(page: number) {

        isPaginating.value = true

        const { data, currentPage, totalItems, totalPages } = await rvApi.findAll({
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

        // find by RV NUMBER
        if(rv.value) {
            const response = await rvApi.findByRvNumber(rv.value.rv_number)
            isSearching.value = false
            if(response) {
                items.value.push(response)
                return
            }
            return
        }

        // find by RC NUMBER
        if(canvass.value) {
            const response = await rvApi.findByRcNumber(canvass.value.rc_number)
            isSearching.value = false
            if(response) {
                items.value.push(response)
                return
            }
            return
        }


        // find by DATE REQUESTED and/or REQUISITIONER
        const { data, currentPage, totalItems, totalPages } = await rvApi.findAll({
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

    function getStatus(rv: RV) {
        
        const approvers = rv.rv_approvers
        
        if(rv.is_cancelled) {

            return approvalStatus[APPROVAL_STATUS.CANCELLED]

        }

        const hasDisapproved = approvers.find(i => i.status === APPROVAL_STATUS.DISAPPROVED)

        if(hasDisapproved) {
            return approvalStatus[APPROVAL_STATUS.DISAPPROVED]
        }

        const hasPending = approvers.find(i => i.status === APPROVAL_STATUS.PENDING)

        if(hasPending) {
            return approvalStatus[APPROVAL_STATUS.PENDING]
        }

        return approvalStatus[APPROVAL_STATUS.APPROVED]
    }

    function onClickEdit(id: string) {
        router.push('/warehouse/purchasing/rv/' + id)
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