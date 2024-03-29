<template>
    <div v-if="canvass" class="mb-3">

        <h2 class="text-warning">Update Canvass</h2>
        <hr>

        <div class="row">
            <div class="col">
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item" @click="isCanvassDetailForm = true">
                        <a class="nav-link" :class="{ 'active': isCanvassDetailForm }" href="#">
                            <i class="fas fa-info-circle"></i> Canvass Info
                        </a>
                    </li>
                    <li class="nav-item" @click="isCanvassDetailForm = false">
                        <a class="nav-link" :class="{ 'active': !isCanvassDetailForm }" href="#">
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
                    <nuxt-link class="btn btn-sm btn-light text-primary"
                        :to="'/warehouse/purchasing/canvass/view/' + canvass.id" target="_blank">View canvass
                        details</nuxt-link>
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
                    <small class="text-danger fst-italic" v-if="canvassErrors.requisitioner"> This field is required
                    </small>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Purpose <span class="text-danger">*</span>
                    </label>
                    <textarea class="form-control" rows="3" v-model="canvass.purpose"></textarea>
                    <small class="text-danger fst-italic" v-show="canvassErrors.purpose"> This field is required
                    </small>
                </div>

                <div class="mb-3">
                    <label class="form-label">Notes</label>
                    <textarea class="form-control" rows="3" v-model="canvass.notes"></textarea>
                </div>

            </div>
        </div>

        <div v-show="!isCanvassDetailForm" class="row justify-content-center pt-5">
            <div class="col-lg-10 col-md-10 col-sm-12">

                <WarehouseCanvassItems :canvass-is-reference-in-r-r="canvass.is_reference_in_rr"
                    :canvass-items="canvass.canvass_items" :brands="brands" :units="units" :items="items"
                    :is-adding="isAddingItem" :is-editing="isEditingItem" @add-item="addCanvassItem"
                    @edit-item="editCanvassItem" @remove-item="removeCanvassItem" />

            </div>

        </div>


        <div class="row justify-content-center">
            <div
                :class="{ 'col-lg-6 col-md-8 col-sm-12': isCanvassDetailForm, 'col-lg-10 col-md-10 col-sm-12': !isCanvassDetailForm }">
                <div class="d-flex justify-content-between pt-3">
                    <div>
                        <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/canvass">
                            <i class="fas fa-chevron-left"></i> Back to Search
                        </nuxt-link>
                    </div>
                    <div v-if="isCanvassDetailForm">
                        <button @click="updateCanvassDetail()" class="btn btn-success" :disabled="isUpdating">
                            <i class="fas fa-sync"></i> {{ isUpdating ? 'Updating...' : 'Update' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>


    </div>

</template>


<script setup lang="ts">
import type { Canvass, UpdateCanvassInput } from '~/composables/warehouse/canvass/canvass.types';
import * as canvassApi from '~/composables/warehouse/canvass/canvass.api'
import * as canvassItemApi from '~/composables/warehouse/canvass/canvass-item.api'
import Swal from 'sweetalert2'
import type { CanvassItem } from '~/composables/warehouse/canvass/canvass-item.types';
import { useToast } from "vue-toastification";
import { formatToValidHtmlDate } from '~/utils/helpers'
import { MOBILE_WIDTH } from '~/utils/config';
import type { Item } from '~/composables/warehouse/item/item.type';

definePageMeta({
    name: ROUTES.CANVASS_UPDATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

// CONSTANTS
const toast = useToast();
const route = useRoute()

// FLAGS
const isMobile = ref(false)
const isCanvassDetailForm = ref(true)
const isUpdating = ref(false)
const isAddingItem = ref(false)
const isEditingItem = ref(false)


// INITIAL DATA
const _canvassErrorsInitial = {
    requisitioner: false,
    purpose: false
}


// DROPDOWNS
const employees = ref<Employee[]>([])
const brands = ref<Brand[]>([])
const units = ref<Unit[]>([])
const items = ref<Item[]>([])


// CANVASS FORM DATA
const canvass = ref<Canvass>({} as Canvass)
const canvassErrors = ref({ ..._canvassErrorsInitial })


// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    isMobile.value = window.innerWidth < MOBILE_WIDTH

    window.addEventListener('resize', checkMobile);

    let response = await canvassApi.fetchFormDataInUpdate(route.params.id as string)

    if (response.canvass) {
        response.canvass.date_requested = formatToValidHtmlDate(response.canvass.date_requested)

        const requestedBy = response.canvass.requested_by
        requestedBy!['fullname'] = getFullname(requestedBy!.firstname, requestedBy!.middlename, requestedBy!.lastname)

        const canvassItems = response.canvass.canvass_items.map(i => {
            if (i.item) {
                i.item['label'] = `${i.item.code} - ${i.item.name}`
            }
            return i
        })

        response.canvass.canvass_items = canvassItems

        canvass.value = response.canvass



    }

    employees.value = response.employees.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })
    brands.value = response.brands
    units.value = response.units
    items.value = response.items.map(i => ({ ...i, label: `${i.code} - ${i.name}` }))

})



// ======================== FUNCTIONS ======================== 



async function updateCanvassDetail() {

    canvassErrors.value = { ..._canvassErrorsInitial }

    if (!canvass.value.requested_by) {
        canvassErrors.value.requisitioner = true
    }

    if (canvass.value.purpose.trim() === '') {
        canvassErrors.value.purpose = true
    }

    const hasError = Object.values(canvassErrors.value).includes(true);

    if (hasError) {
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

    if (response.success && response.data) {
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



async function addCanvassItem(data: CanvassItem, closeBtnModal: HTMLInputElement) {

    isAddingItem.value = true
    data.canvass_id = canvass.value.id
    console.log('canvass.value', canvass.value)
    console.log('data', data)
    const response = await canvassItemApi.create(data)
    isAddingItem.value = false

    if (response.success && response.data) {

        toast.success(response.msg)

        if (response.data.item) {
            const item = response.data.item
            response.data.item['label'] = `${item.code} - ${item.name}`
        }

        canvass.value.canvass_items.push(response.data)
        closeBtnModal.click()

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}

async function editCanvassItem(data: CanvassItem, closeBtnModal: HTMLInputElement, indx: number) {

    isEditingItem.value = true
    const response = await canvassItemApi.update(data.id, data)
    isEditingItem.value = false

    if (response.success && response.data) {

        toast.success(response.msg)

        if (response.data.item) {
            const item = response.data.item
            response.data.item['label'] = `${item.code} - ${item.name}`
        }

        canvass.value.canvass_items[indx] = { ...response.data }
        closeBtnModal.click()

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
        confirmButtonText: "Yes, remove it!",
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async (remove) => {

            if (remove) {
                const response = await canvassItemApi.remove(item.id)

                if (response.success) {

                    canvass.value.canvass_items.splice(indx, 1)
                    toast.success('Item removed!')


                } else {

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


// ======================== UTILS ======================== 

function checkMobile() {
    isMobile.value = window.innerWidth < MOBILE_WIDTH
}




</script>