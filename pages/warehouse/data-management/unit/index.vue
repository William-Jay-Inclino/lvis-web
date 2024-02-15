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
                    <input type="text" class="form-control" placeholder="Search unit">
                    <button class="btn btn-primary">Search</button>
                </div>
            </div>
        </div>

        <div class="row justify-content-center pt-3">
            <div class="col-lg-6">
                
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
                                <button @click="onClickEdit(item.id)" class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>

        
    </div>

</template>


<script setup lang="ts">

    import * as api from './unit.api'
    import type { Unit } from './unit.types';

    definePageMeta({
        layout: "layout-admin"
    })

    const router = useRouter()
    const items = ref<Unit[]>([])

    onMounted( async() => {
        items.value = await api.findAll()
    })

    function onClickEdit(id: string) {
        router.push('/warehouse/data-management/unit/' + id)
    }

</script>