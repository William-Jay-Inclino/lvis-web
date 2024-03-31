<template>
    <div v-if="!isLoadingPage">

        <h2 class="text-warning">Update Item Brand</h2>

        <hr>

        <form v-if="item" @submit.prevent="onSubmit">

            <div class="row justify-content-center pt-3">
                <div class="col-lg-6">
                    <div class="mb-3">
                        <label class="form-label">
                            Name <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" v-model="item.name" required>
                    </div>

                </div>
            </div>


            <div class="row justify-content-center pt-3">
                <div class="col-lg-6">
                    <div class="d-flex justify-content-between">
                        <button type="button" @click="onClickGoToList" class="btn btn-secondary">
                            <i class="fas fa-list"></i> Go to list
                        </button>
                        <button type="submit" class="btn btn-success" :disabled="isSaving">
                            <i class="fas fa-sync"></i> {{ isSaving ? 'Updating...' : 'Update' }}
                        </button>
                    </div>
                </div>
            </div>

        </form>

    </div>

    <div v-else>
        <LoaderSpinner />
    </div>

</template>


<script setup lang="ts">

import * as api from '~/composables/warehouse/item-brand/item-brand.api'
import type { CreateItemBrandInput } from '~/composables/warehouse/item-brand/item-brand.types'
import Swal from 'sweetalert2'

definePageMeta({
    name: ROUTES.ITEM_BRAND_UPDATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

const route = useRoute()
const router = useRouter()
const isSaving = ref(false)

const item = ref<ItemType>()

onMounted(async () => {

    const response = await api.findOne(route.params.id as string)

    if (!response) {
        console.error('Item brand not found')
        return
    }

    item.value = response

    isLoadingPage.value = false
})


async function onSubmit() {

    if (!item.value) return

    console.log('saving...')

    const data: CreateItemBrandInput = {
        name: item.value.name
    }

    isSaving.value = true
    const response = await api.update(item.value.id, data)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/stock-inventory/item-brand/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}



const onClickGoToList = () => router.push('/warehouse/stock-inventory/item-brand')

</script>