<template>
    <div>
        <h1 class="text-warning">Create Canvass</h1>
        <hr>
        
        <div class="row">
            <div class="col">
                <span class="text-secondary">
                    Step {{ currentStep }} of 2: 
                    <span v-if="currentStep === 1"> Fill up canvass details </span>
                    <span v-if="currentStep === 2"> Add canvass items </span>
                </span>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div class="row justify-content-center pt-5">
        
                    <div v-show="currentStep === 1" class="col-lg-6">

                        <div class="mb-3">
                            <label class="form-label">
                                Date Requested <span class="text-danger">*</span>
                            </label>
                            <input type="date" v-model="formData.date_requested" class="form-control" readonly>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner <span class="text-danger">*</span>
                            </label>
                            <v-select :options="employees" label="fullname" v-model="formData.requested_by"></v-select>
                            <small class="text-danger" v-show="formDataErrors.requested_by"> This field is required </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Purpose <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="formData.purpose" class="form-control" rows="3"></textarea>
                            <small class="text-danger" v-show="formDataErrors.purpose"> This field is required </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Notes</label>
                            <textarea v-model="formData.notes" class="form-control" rows="3"></textarea>
                        </div>
                
                        <div class="d-flex justify-content-end gap-2">
                            <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/canvass">Cancel</nuxt-link>
                            <button @click="onClickNextStep1()" type="button" class="btn btn-primary">Next</button>
                        </div>

                    </div>

                    <div v-show="currentStep === 2" class="col-lg-12">

                        <div class="row">
                            <div class="col">
                                <div class="table-responsive">
        
                                    <table class="table table-hover">
        
                                        <thead>
                                            <tr>
                                                <th class="text-muted">No.</th>
                                                <th class="text-muted">
                                                    Description <span class="text-danger"> * </span>
                                                </th>
                                                <th class="text-muted">Brand</th>
                                                <th class="text-muted">Unit</th>
                                                <th class="text-muted">
                                                    Quantity <span class="text-danger"> * </span>
                                                </th>
                                                <th class="text-muted text-center">
                                                    Remove
                                                </th>
                                            </tr>
                                        </thead>
        
                                        <tbody>
                                            <tr v-for="item, i in formData.canvass_items">
                                                <td class="text-muted"> {{ i + 1 }} </td>
                                                <td class="text-muted"> {{ item.description }} </td>
                                                <td class="text-muted"> {{ item.brand?.name }} </td>
                                                <td class="text-muted"> {{ item.unit?.name }} </td>
                                                <td class="text-muted"> {{ item.description }} </td>
                                                <td class="text-center">
                                                    <button @click="removeCanvassItem(i)" class="btn btn-sm btn-light">
                                                        <i class="fas fa-trash text-danger"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>

                                        <tfoot>
                                            <tr>
                                                <td colspan="6" class="text-center">
                                                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addItemModal">
                                                        Add Item
                                                    </button>
                                                </td>
                                            </tr>
                                        </tfoot>
        
                                    </table>
        
                                </div>
                            </div>
                        </div>

                        <div class="d-flex justify-content-end gap-2">
                            <button @click="currentStep--" type="button" class="btn btn-secondary">Back</button>
                            <button :disabled="formData.canvass_items.length === 0" type="button" class="btn btn-primary">Save</button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
        


        <!-- Modal -->
        <div class="modal fade" id="addItemModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Add Item</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">
                            Description <span class="text-danger">*</span>
                        </label>
                        <textarea v-model="addCanvassItemData.description" class="form-control" rows="3"></textarea>
                        <small class="text-danger" v-show="addCanvassItemDataErrors.description">
                            This field is required
                        </small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Brand</label>
                        <select v-model="addCanvassItemData.brand" class="form-select" aria-label="Default select example">
                            <option selected>Select Brand</option>
                            <option v-for="brand in brands" :value="brand"> {{ brand.name }} </option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Unit</label>
                        <select v-model="addCanvassItemData.unit" class="form-select" aria-label="Default select example">
                            <option selected>Select Unit</option>
                            <option v-for="unit in units" :value="unit"> {{ unit.name }} </option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Quantity <span class="text-danger">*</span>
                        </label>
                        <input v-model="addCanvassItemData.quantity" type="number" class="form-control">
                        <small class="text-danger" v-show="addCanvassItemDataErrors.quantity">
                            This field is required and quantity must be greater than 0
                        </small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button ref="closeItemModal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button @click="addCanvassItem()" type="button" class="btn btn-primary">Add Item</button>
                </div>
                </div>
            </div>
        </div>



    </div>

</template>


<script setup lang="ts">

    definePageMeta({
        layout: "layout-admin"
    })

    import * as api from '~/composables/warehouse/canvass/canvass.api'
    import type { Unit } from '~/composables/warehouse/unit/unit.types';
    import Swal from 'sweetalert2'
    import type { Brand, CreateCanvassInput, CreateCanvassItemSubInput, Employee } from '~/composables/warehouse/canvass/canvass.types';
    import moment from 'moment';
    import { getFullname } from '~/composables/helpers'
    import { useToast } from "vue-toastification";

    const router = useRouter();
    const toast = useToast();
    const currentStep = ref(1)
    const today = moment().format('YYYY-MM-DD')
    const closeItemModal = ref<HTMLButtonElement>()

    const _formDataErrorsInitial = {
        requested_by: false,
        purpose: false,
    }

    const _addCanvassItemDataErrorsInitial = {
        description: false,
        quantity: false,
    }

    const _addCanvassItemDataInitial = {
        description: '',
        brand: null,
        unit: null,
        quantity: 0
    }

    const formData = ref<CreateCanvassInput>({
        date_requested: today,
        purpose: '',
        notes: '',
        requested_by: null,
        canvass_items: []
    })

    const formDataErrors = ref({..._formDataErrorsInitial})
    const addCanvassItemData = ref<CreateCanvassItemSubInput>({..._addCanvassItemDataInitial})
    const addCanvassItemDataErrors = ref({..._addCanvassItemDataErrorsInitial})
    const employees = ref<Employee[]>([])
    const brands = ref<Brand[]>([])
    const units = ref<Unit[]>([])

    onMounted( async() => {

        const response = await api.fetchFormData()

        employees.value = response.employees.map((i) => {
            i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
            return i
        })
        brands.value = response.brands
        units.value = response.units

    })


    async function onClickNextStep1() {

        formDataErrors.value = {..._formDataErrorsInitial}

        if(formData.value.purpose.trim() === '') {
            formDataErrors.value.purpose = true
        }

        if(!formData.value.requested_by) {
            formDataErrors.value.requested_by = true
        }

        const hasError = Object.values(formDataErrors.value).includes(true);

        if(hasError) {
            return 
        }

        currentStep.value += 1 
    }

    async function addCanvassItem() {

        addCanvassItemDataErrors.value = {..._addCanvassItemDataErrorsInitial}

        if(addCanvassItemData.value.description.trim() === '') {
            addCanvassItemDataErrors.value.description = true
        }

        if(!addCanvassItemData.value.quantity) {
            addCanvassItemDataErrors.value.quantity = true
        }else if(addCanvassItemData.value.quantity <= 0) {
            addCanvassItemDataErrors.value.quantity = true
        }

        const hasError = Object.values(addCanvassItemDataErrors.value).includes(true);

        if(hasError) {
            return 
        }

        formData.value.canvass_items.push({...addCanvassItemData.value})
        addCanvassItemData.value = {..._addCanvassItemDataInitial}

        closeItemModal.value?.click()

        toast.success('Item added!')
    }

    async function removeCanvassItem(indx: number) {

        const item = formData.value.canvass_items[indx]

        Swal.fire({
            title: "Are you sure?",
            text: `Item with description "${item.description}" will be removed!`,
            position: "top",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74a3b",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
            reverseButtons: true,
            }).then( async(result) => {
            if (result.isConfirmed) {
                
                formData.value.canvass_items.splice(indx)

                toast.success(`Item removed!`)

            }
        });

    }

</script>

