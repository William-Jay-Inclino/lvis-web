<template>
    <div>

        <h2 class="text-warning">Create Classification</h2>

        <hr>

        <form @submit.prevent="onSubmit">

            <div class="row justify-content-center pt-3">
                <div class="col-lg-6">
                    <div class="mb-3">
                        <label class="form-label">
                            Name <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" v-model="formData.name" required>
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

definePageMeta({
    layout: "layout-system"
})

import * as api from '~/composables/system/classification/classification.api'
import type { CreateClassificationInput } from '~/composables/system/classification/classification'
import Swal from 'sweetalert2'

const router = useRouter()
const isSaving = ref(false)

const _initialFormData: CreateClassificationInput = {
    name: '',
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

        router.push(`/system/data-management/classification/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}



const onClickGoToList = () => router.push('/system/data-management/classification')

</script>