<template>
    <div>
        <h2 class="text-warning">Create Unit</h2>
        <hr>
        
        <form @submit.prevent="save()" class="row justify-content-center pt-3">

            <div class="col-lg-6">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" v-model="name" required>
                </div>
        
                <div class="d-flex justify-content-end gap-2">
                    <nuxt-link class="btn btn-secondary" to="/warehouse/data-management/unit">
                        <i class="fas fa-chevron-left"></i> Back
                    </nuxt-link>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Save
                    </button>
                </div>
            </div>
        </form>


    </div>

</template>


<script setup lang="ts">

    definePageMeta({
        layout: "layout-admin"
    })

    import * as api from '~/composables/warehouse/unit/unit.api'
    import type { CreateUnitInput, Unit } from '~/composables/warehouse/unit/unit.types';
    import Swal from 'sweetalert2'

    const router = useRouter();
    const name = ref('')

    async function save() {

        const data: CreateUnitInput = {
            name: name.value
        }
        
        const response = await api.create(data)

        console.log('response', response)

        if(response.success && response.data) {

            router.push(`/warehouse/data-management/unit/success/${response.data.id}`);
            
        }else{
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }

    }

</script>