<template>
    <div>
        <h2 class="text-warning">Search Item</h2>
        <hr>

        <div class="row pt-3">
            <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">Item Code</label>
                    <client-only>
                        <v-select :options="itemOptions" label="rc_number" v-model="searchItem"></v-select>
                    </client-only>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">Item Type</label>
                    <client-only>
                        <v-select :options="itemTypes" label="fullname" v-model="searchItemType"></v-select>
                    </client-only>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input v-model="searchName" type="text" class="form-control">
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end gap-2">
            <button @click="search" class="btn btn-primary" :disabled="isSearching">
                <i class="fas fa-search"></i> {{ isSearching ? 'Searching...' : 'Search' }}
            </button>
            <button class="btn btn-primary float-end">
                <i class="fas fa-plus"></i> Add Stock Item
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


                        <div v-if="!isMobile">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th class="bg-secondary text-white">Item Code</th>
                                            <th class="bg-secondary text-white">Name</th>
                                            <th class="bg-secondary text-white">Description</th>
                                            <th class="bg-secondary text-white">Type</th>
                                            <th class="bg-secondary text-white">GWA Price</th>
                                            <th class="bg-secondary text-white">Quantity</th>
                                            <th class="text-center bg-secondary text-white">
                                                <i class="fas fa-cogs"></i>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="i in items">
                                            <td class="text-muted align-middle"> {{ i.code }} </td>
                                            <td class="text-muted align-middle"> {{ i.name }} </td>
                                            <td class="text-muted align-middle"> {{ i.description }} </td>
                                            <td class="text-muted align-middle"> {{ i.item_type.name }} </td>
                                            <td class="text-muted align-middle"> {{ formatToPhpCurrency(i.GWAPrice) }}
                                            </td>
                                            <td class="text-muted align-middle"> {{ i.total_quantity }} </td>
                                            <td class="text-muted align-middle">
                                                <nuxt-link class="btn btn-light w-50"
                                                    :to="'/warehouse/stock-inventory/item/view/' + i.id">
                                                    <i class="fas fa-info-circle text-info"></i>
                                                </nuxt-link>
                                                <button @click="onClickEdit(i.id)" class="btn btn-light w-50">
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
                                            <td width="50%" class="bg-secondary text-white"> Item Code </td>
                                            <td class="bg-secondary text-white"> {{ i.code }} </td>
                                        </tr>
                                        <tr>
                                            <td width="50%" class="bg-secondary text-white"> Name </td>
                                            <td class="bg-secondary text-white"> {{ i.name }} </td>
                                        </tr>
                                        <tr>
                                            <td width="50%" class="bg-secondary text-white"> Description </td>
                                            <td class="bg-secondary text-white"> {{ i.description }} </td>
                                        </tr>
                                        <tr>
                                            <td width="50%" class="bg-secondary text-white"> Item Type </td>
                                            <td class="bg-secondary text-white"> {{ i.item_type.name }} </td>
                                        </tr>
                                        <tr>
                                            <td width="50%" class="bg-secondary text-white"> GWA Price </td>
                                            <td class="bg-secondary text-white"> {{ formatToPhpCurrency(i.GWAPrice) }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="50%" class="bg-secondary text-white"> Quantity </td>
                                            <td class="bg-secondary text-white"> {{ i.total_quantity }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-center">
                                                <nuxt-link class="btn btn-sm btn-light text-primary w-100"
                                                    :to="'/warehouse/stock-inventory/item/view/' + i.id">
                                                    View Details
                                                </nuxt-link>
                                            </td>
                                            <td class="text-center">
                                                <button @click="onClickEdit(i.id)"
                                                    class="btn btn-sm btn-light text-primary w-100">
                                                    Edit Item
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

import * as api from '~/composables/warehouse/item/item.api'
import type { Item } from '~/composables/warehouse/item/item.type';
import { MOBILE_WIDTH, PAGINATION_SIZE } from '~/utils/config'

definePageMeta({
    name: ROUTES.ITEM_INDEX,
    layout: "layout-warehouse",
    middleware: ['auth'],
})


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
const itemOptions = ref<Item[]>([])
const itemTypes = ref<ItemType[]>([])
const searchItem = ref<Item | null>(null)
const searchName = ref('')
const searchItemType = ref<ItemType | null>(null)
// ----------------


// container for search result
const items = ref<Item[]>([])

// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {
    isMobile.value = window.innerWidth < MOBILE_WIDTH

    window.addEventListener('resize', checkMobile);

    const response = await api.fetchDataInSearchFilters()

    itemOptions.value = response.items
    itemTypes.value = response.itemTypes

})



// ======================== FUNCTIONS ======================== 

function onClickEdit(id: string) {
    console.log('onClickEdit', id)
    // router.push('/warehouse/purchasing/canvass/' + id)
}

async function changePage(page: number) {

    isPaginating.value = true

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page,
        pageSize: pagination.value.pageSize,
        name: searchName.value,
        item_type_id: searchItemType.value ? searchItemType.value.id : null

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

    if (searchItem.value) {

        const response = await api.findByCode(searchItem.value.code)
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
        name: searchName.value,
        item_type_id: searchItemType.value ? searchItemType.value.id : null

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