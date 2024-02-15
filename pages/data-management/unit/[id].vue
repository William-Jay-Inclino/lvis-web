<template>
    <div>

        <h1 class="text-secondary">Update Unit</h1>
        <hr>
        
        <form @submit.prevent="update()" class="row justify-content-center pt-5" v-if="item">

            <div class="col-lg-6">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" v-model="item.name" required>
                </div>
        
                <div class="d-flex justify-content-end gap-2">
                    <nuxt-link class="btn btn-secondary" to="/data-management/unit">Back</nuxt-link>
                    <button type="button" @click="remove()" class="btn btn-danger">Delete</button>
                    <button type="submit" class="btn btn-success">Update</button>
                </div>
            </div>
        </form>


    </div>

</template>


<script setup lang="ts">

    definePageMeta({
        layout: "layout-admin"
    })

    import * as api from './unit.api'
    import type { CreateUnitInput, Unit } from './unit.types';
    import Swal from 'sweetalert2'

    const route = useRoute()
    const router = useRouter();
    const item = ref<Unit>({} as Unit)
    

    onMounted( async() => {

        const response = await api.findOne(route.params.id as string)

        if(response) {
            item.value = response
        }

    })

    async function update() {

        const data: CreateUnitInput = {
            name: item.value.name
        }
        
        const response = await api.update(item.value.id, data)

        console.log('response', response)

        if(response.success && response.data) {

            Swal.fire({
                title: 'Success!',
                text: response.msg,
                icon: 'success',
                position: 'top',
            })
            
        }else{
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }
    }

    async function remove() {
        Swal.fire({
            title: "Are you sure?",
            text: item.value.name + " will be removed!",
            position: "top",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74a3b",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
            reverseButtons: true,
            }).then( async(result) => {
            if (result.isConfirmed) {
                
                const response = await api.remove(item.value.id)

                if(response.success) {
                    Swal.fire({
                        title: 'Success!',
                        text: response.msg,
                        icon: 'success',
                        position: 'top',
                    })

                    router.push(`/data-management/unit`);

                }else {

                    Swal.fire({
                        title: 'Error!',
                        text: response.msg,
                        icon: 'error',
                        position: 'top',
                    })

                }

            }
        });
    }

</script>