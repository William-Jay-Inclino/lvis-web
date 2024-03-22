<template>

    <div class="row justify-content-center">

        <div class="col-lg-6">

            <div v-if="item">
                <div class="alert alert-success" role="alert">
                    Unit created successfully!
                </div>

                <div class="row pt-3">
                    <div class="col">
                        <table class="table table-bordered">
                            <tbody>
                                <tr>
                                    <td class="text-muted">Name</td>
                                    <td> {{ item.name }} </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div class="d-flex justify-content-end gap-2">
                            <div class="d-flex justify-content-end gap-2">
                                <nuxt-link class="btn btn-secondary" to="/warehouse/data-management/unit">
                                    <i class="fas fa-search"></i> Search
                                </nuxt-link>
                                <nuxt-link class="btn btn-success" :to="`/warehouse/data-management/unit/${item.id}`">
                                    <i class="fas fa-sync"></i> Update
                                </nuxt-link>
                                <nuxt-link class="btn btn-primary" to="/warehouse/data-management/unit/create">
                                    <i class="fas fa-plus"></i> Add New
                                </nuxt-link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>

</template>


<script setup lang="ts">

definePageMeta({
    layout: "layout-warehouse"
})

import * as api from '~/composables/warehouse/unit/unit.api'
import type { CreateUnitInput, Unit } from '~/composables/warehouse/unit/unit.types';

const route = useRoute()
const item = ref<Unit | undefined>()

onMounted(async () => {

    item.value = await api.findOne(route.params.id as string)

})


</script>~/composables/warehouse/unit2/unit.api~/composables/warehouse/unit2/unit.types