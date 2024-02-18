<template>
    <div>
        <h2 class="text-warning">Create Canvass</h2>
        <hr>
        
        <div class="row pt-3">
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
                            <input type="date" :value="formData.date_requested" class="form-control" disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="formData.requested_by"></v-select>
                            </client-only>
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

                    <div v-show="currentStep === 2" class="col-lg-10 col-md-10 col-sm-12">

                        <div class="row">
                            <div class="col">

                                <div v-if="!isMobile">
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
                                                    <td> {{ item.brand ? item.brand.name : '' }} </td>
                                                    <td> {{ item.unit ? item.unit.name : '' }} </td>
                                                    <td class="text-muted"> {{ item.quantity }} </td>
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

                                <div v-else>

                                    <div class="row">
                                        <div class="col">
                                            <div v-for="item, i in formData.canvass_items" class="table-responsive">
                                                <table class="table table-hover table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td width="50%" class="text-white bg-secondary">No.</td>
                                                            <td class="text-white bg-secondary"> {{ i + 1 }} </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-muted">Description</td>
                                                            <td> {{ item.description }} </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-muted">Brand</td>
                                                            <td> {{ item.brand ? item.brand.name : 'N/A' }} </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-muted">Unit</td>
                                                            <td> {{ item.unit ? item.unit.name : 'N/A' }} </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="text-muted">Quantity</td>
                                                            <td> {{ item.quantity }} </td>
                                                        </tr>
                                                        <tr class="text-center">
                                                            <td colspan="2">
                                                                <button @click="removeCanvassItem(i)" class="btn btn-sm btn-light w-100">
                                                                <i class="fas fa-trash text-danger"></i>
                                                        </button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col d-flex justify-content-center">
                                            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addItemModal">
                                                Add Item
                                            </button>
                                        </div>
                                    </div>

                                    <hr>

                                </div>

                            </div>
                        </div>

                        <div class="d-flex justify-content-end gap-2 mb-3">
                            <button @click="currentStep--" type="button" class="btn btn-secondary">Back</button>
                            <button @click="save()" :disabled="formData.canvass_items.length === 0" type="button" class="btn btn-primary">Save</button>
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
                        <client-only>
                            <v-select :options="brands" label="name" v-model="addCanvassItemData.brand"></v-select>
                        </client-only>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Unit</label>
                        <client-only>
                            <v-select :options="units" label="name" v-model="addCanvassItemData.unit"></v-select>
                        </client-only>
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

    const isMobile = ref(false)
    const mobileWidth = 768
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

    const _addCanvassItemDataInitial: CreateCanvassItemSubInput = {
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

        isMobile.value = window.innerWidth < mobileWidth

        window.addEventListener('resize', checkMobile);

        const response = await api.fetchFormDataInCreate()

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

    async function save() {

        const response = await api.create(formData.value)

        if(response.success && response.data) {
            router.push(`/warehouse/purchasing/canvass/success/${response.data.id}`);
        }else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }

    }

    function checkMobile() {
        isMobile.value = window.innerWidth < mobileWidth
    }

</script>

