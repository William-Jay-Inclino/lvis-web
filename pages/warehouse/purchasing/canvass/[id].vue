<template>
    <div v-if="canvass">

        <h2 class="text-warning">Update Canvass</h2>
        <hr>

        <div class="row">
            <div class="col">
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item" @click="isCanvassDetailForm = true">
                        <a class="nav-link" :class="{'active': isCanvassDetailForm}" href="#">Canvass Detail Form</a>
                    </li>
                    <li class="nav-item" @click="isCanvassDetailForm = false">
                        <a class="nav-link" :class="{'active': !isCanvassDetailForm}" href="#">Canvass Items</a>
                    </li>
                </ul>
            </div>
        </div>
        
        
        <div v-show="isCanvassDetailForm" class="row justify-content-center pt-5">
            <div class="col-lg-6">

                <div class="mb-3">
                    <label class="form-label">
                        Date Requested <span class="text-danger">*</span>
                    </label>
                    <input type="date" :value="canvass.date_requested" class="form-control" readonly>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Requisitioner <span class="text-danger">*</span>
                    </label>
                    <client-only>
                        <v-select :options="employees" label="fullname" v-model="canvass.requested_by"></v-select>
                    </client-only>
                    <!-- <small class="text-danger"> This field is required </small> -->
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Purpose <span class="text-danger">*</span>
                    </label>
                    <textarea class="form-control" rows="3" v-model="canvass.purpose"></textarea>
                    <!-- <small class="text-danger" v-show="formDataErrors.purpose"> This field is required </small> -->
                </div>

                <div class="mb-3">
                    <label class="form-label">Notes</label>
                    <textarea class="form-control" rows="3" v-model="canvass.notes"></textarea>
                </div>
        
                <div class="d-flex justify-content-end gap-2 mb-3">
                    <button type="button" class="btn btn-secondary">Back</button>
                    <button type="button" class="btn btn-success">Update</button>
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
                                <tr v-for="item, i in canvassItems">
                                    <td class="text-muted"> {{ i + 1 }} </td>
                                    <td class="text-muted"> {{ item.description }} </td>
                                    <td class="text-muted"> {{ item.brand ? item.brand.name : '' }} </td>
                                    <td class="text-muted"> {{ item.unit ? item.unit.name : '' }} </td>
                                    <td class="text-muted"> {{ item.quantity }} </td>
                                    <td class="text-muted text-center">
                                        <button class="btn btn-sm btn-light">
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
                            <div class="table-responsive">
            
                                <table v-for="item, i in canvassItems" class="table table-hover table-bordered">
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
                                            <td> {{ item.brand ? item.brand.name : '' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Unit</td>
                                            <td> {{ item.unit ? item.unit.name : '' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Quantity</td>
                                            <td> {{ item.quantity }} </td>
                                        </tr>
                                        <tr class="text-center">
                                            <td colspan="2">
                                                <button class="btn btn-sm btn-light">
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
    
    
                <div class="d-flex justify-content-end gap-2 mb-3">
                    <button type="button" class="btn btn-secondary">Back</button>
                    <button type="button" class="btn btn-success">Update</button>
                </div>
            </div>



        </div>


    </div>

</template>


<script setup lang="ts">
    import type { Brand, Canvass, CanvassItem, Employee, Unit } from '~/composables/warehouse/canvass/canvass.types';
    import * as api from '~/composables/warehouse/canvass/canvass.api'
    import moment from 'moment';

    definePageMeta({
        layout: "layout-admin"
    })

    const isMobile = ref(false)
    const mobileWidth = 768
    const route = useRoute()
    const isCanvassDetailForm = ref(true)
    const canvass = ref<Canvass>({} as Canvass)
    const canvassItems = ref<CanvassItem[]>([])

    const employees = ref<Employee[]>([])
    const brands = ref<Brand[]>([])
    const units = ref<Unit[]>([])

    onMounted( async() => {

        isMobile.value = window.innerWidth < mobileWidth

        window.addEventListener('resize', checkMobile);

        let response = await api.fetchFormDataInUpdate(route.params.id as string)

        if(response.canvass) {
            response.canvass.date_requested = moment(response.canvass.date_requested).format('YYYY-MM-DD')
            
            const requestedBy = response.canvass.requested_by 
            requestedBy!['fullname'] = getFullname(requestedBy!.firstname, requestedBy!.middlename, requestedBy!.lastname)
            canvass.value = response.canvass
            canvassItems.value = canvass.value.canvass_items
        }

        employees.value = response.employees.map((i) => {
            i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
            return i
        })
        brands.value = response.brands
        units.value = response.units

    })

    function checkMobile() {
        isMobile.value = window.innerWidth < mobileWidth
    }


</script>