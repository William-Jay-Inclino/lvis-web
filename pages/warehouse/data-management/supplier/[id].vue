<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Update Supplier</h2>
        
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
                            <div class="mb-3">
                                <label class="form-label">
                                    Contact <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="item.contact" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Address <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control" v-model="item.address" rows="3" required />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Tin Number <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="item.tin_no" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    VAT Status <span class="text-danger">*</span>
                                </label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" v-model="item.is_vat_registered" :value="false">
                                    <label class="form-check-label" for="exampleRadios1">
                                        Non-VAT Registered
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio"  v-model="item.is_vat_registered" :value="true">
                                    <label class="form-check-label" for="exampleRadios1">
                                        VAT Registered
                                    </label>
                                </div>
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
            
        </div>
    </div>


</template>


<script setup lang="ts">

import * as api from '~/composables/warehouse/supplier/supplier.api'
import type { CreateSupplierInput, Supplier } from '~/composables/warehouse/supplier/supplier'
import Swal from 'sweetalert2'

definePageMeta({
    name: ROUTES.SUPPLIER_UPDATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const route = useRoute()
const router = useRouter()
const isSaving = ref(false)

const item = ref<Supplier>()

onMounted(async () => {

    const response = await api.findOne(route.params.id as string)

    if (!response) {
        console.error('Supplier not found')
        return
    }

    item.value = response

    isLoadingPage.value = false
})


async function onSubmit() {

    if (!item.value) return

    console.log('saving...')

    const data: CreateSupplierInput = {
        name: item.value.name,
        contact: item.value.contact,
        address: item.value.address,
        tin_no: item.value.tin_no,
        is_vat_registered: item.value.is_vat_registered,
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

        router.push(`/warehouse/data-management/supplier/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}



const onClickGoToList = () => router.push('/warehouse/data-management/supplier')

</script>