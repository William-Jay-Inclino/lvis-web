<template>
    <div>

        <div class="row">
            <div class="col">
                <h1 class="text-secondary">Unit</h1>
            </div>
            <div class="col">
                <nuxt-link class="btn btn-primary float-end" to="unit/create">Add Unit</nuxt-link>
            </div>
        </div>

        <hr>

        <div class="row justify-content-center pt-3">
            <div class="col-lg-6">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Enter name..." v-model="searchValue">
                    <button class="btn btn-primary" @click="search()">Search</button>
                </div>
            </div>
        </div>

        <div class="row justify-content-center pt-3">

            <div class="text-center text-muted" v-show="items.length === 0">
                No results found
            </div>

            <div v-show="items.length > 0" class="col-lg-6">

                <div class="row">
                    <div class="col">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th class="text-center">
                                            <i class="fas fa-cog"></i>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in items">
                                        <td> {{ item.name }} </td>
                                        <td class="text-center">
                                            <button @click="onClickEdit(item.id)" class="btn btn-sm btn-light">
                                                <i class="fas fa-edit text-primary"></i>
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

    import * as api from '~/composables/warehouse/unit/unit.api'
    import type { Unit } from '~/composables/warehouse/unit/unit.types';

    definePageMeta({
        layout: "layout-admin"
    })

    const router = useRouter()
    const items = ref<Unit[]>([])
    const _paginationInitial = {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        pageSize: 3,
    }
    const searchField = ref('name') 
    const searchValue = ref(null) 

    const pagination = ref({..._paginationInitial}) 

    onMounted( async() => {
        const { data, currentPage, totalItems, totalPages } = await api.findAll({
            page: 1,
            pageSize: pagination.value.pageSize,
            searchField: searchField.value,
            searchValue: searchValue.value
        })
        items.value = data
        pagination.value.totalItems = totalItems
        pagination.value.currentPage = currentPage
        pagination.value.totalPages = totalPages
    })

    function onClickEdit(id: string) {
        router.push('/warehouse/data-management/unit/' + id)
    }

    async function changePage(page: number) {
        const { data, currentPage, totalItems, totalPages } = await api.findAll({
            page,
            pageSize: pagination.value.pageSize,
            searchField: null,
            searchValue: null
            
        })
        items.value = data
        pagination.value.totalItems = totalItems
        pagination.value.currentPage = currentPage
        pagination.value.totalPages = totalPages
    }

    async function search() {
        const { data, currentPage, totalItems, totalPages } = await api.findAll({
            page: 1,
            pageSize: pagination.value.pageSize,
            searchField: searchField.value,
            searchValue: searchValue.value
            
        })
        items.value = data
        pagination.value.totalItems = totalItems
        pagination.value.currentPage = currentPage
        pagination.value.totalPages = totalPages  
    }

</script>