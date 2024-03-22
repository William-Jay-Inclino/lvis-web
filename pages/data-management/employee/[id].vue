<template>
    <div v-if="!isLoadingPage">

        <h2 class="text-warning">Update Employee</h2>

        <hr>

        <form v-if="item" @submit.prevent="onSubmit">

            <div class="row justify-content-center pt-3">
                <div class="col-lg-6">
                    <div class="mb-3">
                        <label class="form-label">
                            Firstname <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" v-model="item.firstname" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Middlename
                        </label>
                        <input type="text" class="form-control" v-model="item.middlename">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Lastname <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" v-model="item.lastname" required>
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

definePageMeta({
    layout: "layout-system"
})

import * as api from '~/composables/system/employee/employee.api'
import type { CreateEmployeeInput, Employee } from '~/composables/system/employee/employee.types'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const isSaving = ref(false)

const item = ref<Employee>()
const isLoadingPage = ref(true)

onMounted(async () => {

    const response = await api.findOne(route.params.id as string)
    isLoadingPage.value = false

    if (!response) {
        console.error('Employee not found')
        return
    }

    item.value = response

})


async function onSubmit() {

    if (!item.value) return

    console.log('saving...')

    const data: CreateEmployeeInput = {
        firstname: item.value.firstname,
        middlename: item.value.middlename,
        lastname: item.value.lastname,
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

        router.push(`/data-management/employee/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}



const onClickGoToList = () => router.push('/data-management/employee')

</script>