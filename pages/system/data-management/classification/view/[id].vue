<template>

    <div v-if="!isLoadingPage" class="row justify-content-center pt-3">

        <div class="col-lg-6">

            <div v-if="item">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 class="text-warning fst-italic">
                        <i class="fas fa-info-circle"></i> Classification Info
                    </h5>
                    <hr class="result">
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

                <div class="row pt-5">
                    <div class="col">
                        <div class="d-flex justify-content-end gap-2">
                            <div class="d-flex justify-content-end gap-2">
                                <button class="btn btn-secondary" @click="onClickGoToList">
                                    <i class="fas fa-list"></i> Go to List
                                </button>
                                <button class="btn btn-success" @click="onClickUpdate">
                                    <i class="fas fa-sync"></i> Update
                                </button>
                                <button class="btn btn-primary" @click="onClickAddNew">
                                    <i class="fas fa-plus"></i> Add New
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>

    <div v-else>
        <LoaderSpinner />
    </div>

</template>


<script setup lang="ts">

definePageMeta({
    layout: "layout-system"
})

import * as api from '~/composables/system/classification/classification.api'
import type { Classification } from '~/composables/system/classification/classification';

const router = useRouter()
const route = useRoute()
const item = ref<Classification | undefined>()
const isLoadingPage = ref(true)

onMounted(async () => {

    item.value = await api.findOne(route.params.id as string)
    isLoadingPage.value = false

})


const onClickGoToList = () => router.push(`/system/data-management/classification`);
const onClickAddNew = () => router.push(`/system/data-management/classification/create`);
const onClickUpdate = () => router.push(`/system/data-management/classification/${item.value?.id}`);


</script>