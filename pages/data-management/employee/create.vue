<template>
    <div>

        <h2 class="text-warning">Create Employee</h2>

        <hr>

        <form @submit.prevent="onSubmit">

            <div class="row justify-content-center pt-3">
                <div class="col-lg-6">
                    <div class="mb-3">
                        <label class="form-label">
                            Firstname <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" v-model="formData.firstname" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Middlename>
                        </label>
                        <input type="text" class="form-control" v-model="formData.middlename">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Lastname <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" v-model="formData.lastname" required>
                    </div>
                </div>
            </div>


            <div class="row justify-content-center pt-3">
                <div class="col-lg-6">
                    <div class="d-flex justify-content-between">
                        <button type="button" @click="onClickGoToList" class="btn btn-secondary">
                            <i class="fas fa-list"></i> Go to list
                        </button>
                        <button type="submit" class="btn btn-primary" :disabled="isSaving">
                            <i class="fas fa-save"></i> {{ isSaving ? 'Saving...' : 'Save' }}
                        </button>
                    </div>
                </div>
            </div>

        </form>

    </div>

</template>


<script setup lang="ts">
import * as api from '~/composables/system/employee/employee.api'
import type { CreateEmployeeInput } from '~/composables/system/employee/employee.types'
import Swal from 'sweetalert2'

definePageMeta({
    name: ROUTES.EMPLOYEE_CREATE,
    layout: "layout-system",
    middleware: ['auth'],
})

const router = useRouter()
const isSaving = ref(false)

const _initialFormData: CreateEmployeeInput = {
    firstname: '',
    middlename: '',
    lastname: '',
}

const formData = ref({ ..._initialFormData })


async function onSubmit() {

    console.log('saving...')

    isSaving.value = true
    const response = await api.create(formData.value)
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