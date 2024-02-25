<template>
    <div v-if="canvass" class="mb-3">

        <h2 class="text-warning">Update Canvass</h2>
        <hr>

        <div class="row">
            <div class="col">
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item" @click="isCanvassDetailForm = true">
                        <a class="nav-link" :class="{'active': isCanvassDetailForm}" href="#">
                            <i class="fas fa-info-circle"></i> Canvass Info
                        </a>
                    </li>
                    <li class="nav-item" @click="isCanvassDetailForm = false">
                        <a class="nav-link" :class="{'active': !isCanvassDetailForm}" href="#">
                            <i class="fas fa-shopping-cart"></i> Canvass Items
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        
        
        <div v-show="isCanvassDetailForm" class="row justify-content-center pt-5">
            <div class="col-lg-6">

                <div class="mb-3">
                    <label class="form-label">
                        RC Number
                    </label>
                    <input type="text" :value="canvass.rc_number" class="form-control" disabled>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Date
                    </label>
                    <input type="date" :value="canvass.date_requested" class="form-control" disabled>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Requisitioner <span class="text-danger">*</span>
                    </label>
                    <client-only>
                        <v-select :options="employees" label="fullname" v-model="canvass.requested_by"></v-select>
                    </client-only>
                    <small class="text-danger fst-italic" v-if="canvassErrors.requisitioner"> This field is required </small>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Purpose <span class="text-danger">*</span>
                    </label>
                    <textarea class="form-control" rows="3" v-model="canvass.purpose"></textarea>
                    <small class="text-danger fst-italic" v-show="canvassErrors.purpose"> This field is required </small>
                </div>

                <div class="mb-3">
                    <label class="form-label">Notes</label>
                    <textarea class="form-control" rows="3" v-model="canvass.notes"></textarea>
                </div>
        
                <div class="d-flex justify-content-end gap-2 pt-3">
                    <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/canvass">
                        <i class="fas fa-chevron-left"></i> Back
                    </nuxt-link>
                    <button class="btn btn-primary">
                        <i class="fas fa-print"></i> Print
                    </button>
                    <button @click="updateCanvassDetail()" class="btn btn-success" :disabled="isUpdating">
                        <i class="fas fa-sync"></i> {{ isUpdating ? 'Updating...' : 'Update' }}
                    </button>
                </div>

            </div>
        </div>

        <div v-show="!isCanvassDetailForm" class="row justify-content-center pt-5">

            <div class="col-lg-10 col-md-10 col-sm-12">
                <div v-if="!isMobile">
    
                    <div class="table-responsive">
            
                        <table class="table table-hover">
    
                            <thead>
                                <tr>
                                    <th class="bg-secondary text-white">No.</th>
                                    <th class="bg-secondary text-white">Description</th>
                                    <th class="bg-secondary text-white">Brand</th>
                                    <th class="bg-secondary text-white">Unit</th>
                                    <th class="bg-secondary text-white">Quantity </th>
                                    <th class="bg-secondary text-white text-center">
                                        <i class="fas fa-cog"></i>
                                    </th>
                                </tr>
                            </thead>
    
                            <tbody>
                                <tr v-for="item, i in canvass.canvass_items">
                                    <td class="text-muted"> {{ i + 1 }} </td>
                                    <td class="text-muted"> {{ item.description }} </td>
                                    <td class="text-muted"> {{ item.brand ? item.brand.name : 'N/A' }} </td>
                                    <td class="text-muted"> {{ item.unit ? item.unit.name : 'N/A' }} </td>
                                    <td class="text-muted"> {{ item.quantity }} </td>
                                    <td class="text-muted text-center">
                                        <button @click="removeCanvassItem(i)" class="btn btn-sm btn-light w-50">
                                            <i class="fas fa-trash text-danger"></i>
                                        </button>
                                        <button @click="onClickEditCanvassItem(i)" class="btn btn-sm btn-light w-50">
                                            <i class="fas fa-edit text-primary"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
    
                            <tfoot>
                                <tr>
                                    <td colspan="6" class="text-center">
                                        <button @click="onClickAddCanvassItem()" type="button" class="btn btn-primary btn-sm">
                                            <i class="fas fa-plus-circle"></i> Add Item
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
                            <div v-for="item, i in canvass.canvass_items" class="table-responsive">
            
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
                                                <button @click="removeCanvassItem(i)" class="btn btn-sm btn-light w-50">
                                                    <i class="fas fa-trash text-danger"></i>
                                                </button>

                                                <button @click="onClickEditCanvassItem(i)" class="btn btn-sm btn-light w-50">
                                                    <i class="fas fa-edit text-primary"></i>
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
                            <button @click="onClickAddCanvassItem()" type="button" class="btn btn-primary btn-sm">
                                <i class="fas fa-plus-circle"></i> Add Item
                            </button>
                        </div>
                    </div>
    
                    <hr>
    
                </div>
    
    
                <div class="d-flex justify-content-end gap-2 mb-3 pt-3">
                    <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/canvass">
                        <i class="fas fa-chevron-left"></i> Back
                    </nuxt-link>
                </div>
            </div>



        </div>

        <button ref="canvassItemModalBtn" v-show="false" data-bs-toggle="modal" data-bs-target="#addItemModal">
            open canvass item modal
        </button>

        <!-- Modal -->
        <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="addItemModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-warning" id="exampleModalLabel">{{ isCanvassItemModalAdd ? 'Add' : 'Edit' }} Item</h5>
                    <button @click="onClickCloseModal()" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">
                            Description <span class="text-danger">*</span>
                        </label>
                        <textarea v-model="canvassItem.description" class="form-control" rows="3"></textarea>
                        <small class="text-danger" v-show="canvassItemErrors.description">
                            This field is required
                        </small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Brand</label>
                        <client-only>
                            <v-select v-model="canvassItem.brand" :options="brands" label="name"></v-select>
                        </client-only>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Unit</label>
                        <client-only>
                            <v-select v-model="canvassItem.unit" :options="units" label="name"></v-select>
                        </client-only>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Quantity <span class="text-danger">*</span>
                        </label>
                        <input v-model="canvassItem.quantity" type="number" class="form-control">
                        <small class="text-danger" v-show="canvassItemErrors.quantity">
                            This field is required and quantity must be greater than 0
                        </small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="onClickCloseModal()" ref="closeItemModal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-close"></i> Close
                    </button>
                    <button v-if="isCanvassItemModalAdd" @click="createCanvassItem()" :disabled="isAddingItem" class="btn btn-primary">
                        <i class="fas fa-plus-circle"></i> {{ isAddingItem ? 'Adding Item...' : 'Add Item' }}
                    </button>
                    <button v-else @click="updateCanvassItem()"  :disabled="isEditingItem" class="btn btn-success">
                        <i class="fas fa-edit"></i> {{ isEditingItem ? 'Editing Item...' : 'Edit Item' }}
                    </button>
                </div>
                </div>
            </div>
        </div>

    </div>

</template>


<script setup lang="ts">
    import type { Brand, Canvass, Unit, UpdateCanvassInput } from '~/composables/warehouse/canvass/canvass.types';
    import * as canvassApi from '~/composables/warehouse/canvass/canvass.api'
    import * as canvassItemApi from '~/composables/warehouse/canvass/canvass-item.api'
    import moment from 'moment';
    import Swal from 'sweetalert2'
    import type { CanvassItem, CreateCanvassItemInput, UpdateCanvassItemInput } from '~/composables/warehouse/canvass/canvass-item.types';
    import { useToast } from "vue-toastification";
    import { formatToValidHtmlDate } from '~/utils/helpers'
    import { MOBILE_WIDTH } from '~/utils/config';

    definePageMeta({
        layout: "layout-admin"
    })

    // CONSTANTS
    const toast = useToast();
    const route = useRoute()

    // HTML ELEMENTS
    const closeItemModal = ref<HTMLButtonElement>()
    const canvassItemModalBtn = ref<HTMLButtonElement>()

    // FLAGS
    const isMobile = ref(false)
    const isCanvassItemModalAdd = ref(false)
    const isCanvassDetailForm = ref(true)
    const isUpdating = ref(false)
    const isAddingItem = ref(false)
    const isEditingItem = ref(false)


    // INITIAL DATA
    const _canvassErrorsInitial = {
        requisitioner: false,
        purpose: false
    }

    const _canvassItemErrorsInitial = {
        description: false,
        quantity: false
    }

    const _canvassItemInitial: CanvassItem = {
        id: '',
        canvass_id: '',
        description: '',
        brand: null,
        unit: null,
        quantity: 0
    }


    // DROPDOWNS
    const employees = ref<Employee[]>([])
    const brands = ref<Brand[]>([])
    const units = ref<Unit[]>([])


    // CANVASS FORM DATA
    const canvass = ref<Canvass>({} as Canvass)
    const canvassErrors = ref({..._canvassErrorsInitial})

    // CANVASS ITEM FORM DATA
    const canvassItem = ref<CanvassItem>({..._canvassItemInitial})
    const canvassItemErrors = ref({..._canvassItemErrorsInitial})



    // ======================== LIFECYCLE HOOKS ======================== 

    onMounted( async() => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        let response = await canvassApi.fetchFormDataInUpdate(route.params.id as string)

        if(response.canvass) {
            response.canvass.date_requested = formatToValidHtmlDate(response.canvass.date_requested)
            
            const requestedBy = response.canvass.requested_by 
            requestedBy!['fullname'] = getFullname(requestedBy!.firstname, requestedBy!.middlename, requestedBy!.lastname)
            canvass.value = response.canvass
        }

        employees.value = response.employees.map((i) => {
            i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
            return i
        })
        brands.value = response.brands
        units.value = response.units

    })



    // ======================== FUNCTIONS ======================== 



    async function updateCanvassDetail() {

        canvassErrors.value = {..._canvassErrorsInitial}

        if(!canvass.value.requested_by) {
            canvassErrors.value.requisitioner = true 
        }

        if(canvass.value.purpose.trim() === '') {
            canvassErrors.value.purpose = true 
        }

        const hasError = Object.values(canvassErrors.value).includes(true);

        if(hasError) {
            return 
        }

        const data: UpdateCanvassInput = {
            purpose: canvass.value.purpose,
            notes: canvass.value.notes,
            requested_by: canvass.value.requested_by
        }

        isUpdating.value = true
        const response = await canvassApi.update(canvass.value.id, data)
        isUpdating.value = false

        if(response.success && response.data) {
            Swal.fire({
                title: 'Success!',
                text: response.msg,
                icon: 'success',
                position: 'top',
            })
        } else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }

    }



    // ======================== CANVASS ITEM FUNCTIONS ======================== 



    async function createCanvassItem() {

        if(!isValidCanvassItem()) return 

        const data: CreateCanvassItemInput = {
            canvass_id: canvass.value.id,
            description: canvassItem.value.description,
            brand: canvassItem.value.brand,
            unit: canvassItem.value.unit,
            quantity: canvassItem.value.quantity
        }

        isAddingItem.value = true
        const response = await canvassItemApi.create(data)
        isAddingItem.value = false

        if(response.success && response.data) {
            toast.success(response.msg)

            canvass.value.canvass_items.push(response.data)

            canvassItem.value = {..._canvassItemInitial}

            closeItemModal.value?.click()

        } else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }

    }

    async function updateCanvassItem() {

        if(!isValidCanvassItem()) return 

        const data: UpdateCanvassItemInput = {
            description: canvassItem.value.description,
            brand: canvassItem.value.brand,
            unit: canvassItem.value.unit,
            quantity: canvassItem.value.quantity
        }

        isEditingItem.value = true
        const response = await canvassItemApi.update(canvassItem.value.id, data)
        isEditingItem.value = false

        if(response.success && response.data) {
            toast.success(response.msg)

            const prevCanvassItemIndx = canvass.value.canvass_items.findIndex(i => i.id === canvassItem.value.id)
            canvass.value.canvass_items[prevCanvassItemIndx] = {...response.data}
            canvassItem.value = {..._canvassItemInitial}

            closeItemModal.value?.click()

        } else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }

    }

    async function removeCanvassItem(indx: number) {

        const item = canvass.value.canvass_items[indx]

        Swal.fire({
            title: "Are you sure?",
            text: `Item no. ${indx + 1} with description "${item.description}" will be removed!`,
            position: "top",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74a3b",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: async(remove) => {
                
                if(remove) {
                    const response = await canvassItemApi.remove(item.id)

                    if(response.success) {
                        
                        toast.success('Item removed!')

                        canvass.value.canvass_items.splice(indx, 1)

                    }else {

                        Swal.fire({
                            title: 'Error!',
                            text: response.msg,
                            icon: 'error',
                            position: 'top',
                        })

                    }
                }

            },
            allowOutsideClick: () => !Swal.isLoading()
        })

    }

    function isValidCanvassItem(): boolean {
        canvassItemErrors.value = {..._canvassItemErrorsInitial}

        if(canvassItem.value.description.trim() === '') {
            canvassItemErrors.value.description = true 
        }

        if(canvassItem.value.quantity <= 0) {
            canvassItemErrors.value.quantity = true 
        }

        const hasError = Object.values(canvassItemErrors.value).includes(true);

        if(hasError) {
            return false 
        }

        return true
    }

    function onClickEditCanvassItem(indx: number) {

        const item = canvass.value.canvass_items[indx]

        canvassItem.value = {...item}

        isCanvassItemModalAdd.value = false
        canvassItemModalBtn.value?.click()

    }

    function onClickAddCanvassItem() {

        isCanvassItemModalAdd.value = true
        canvassItemModalBtn.value?.click()

    }

    function onClickCloseModal() {
        canvassItem.value = {..._canvassItemInitial}
        canvassItemErrors.value = {..._canvassItemErrorsInitial}
    }



    // ======================== UTILS ======================== 

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }




</script>~/composables/config