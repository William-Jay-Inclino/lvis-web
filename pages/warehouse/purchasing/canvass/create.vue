<template>
    <div>
        <h2 class="text-warning">Create Canvass</h2>
        <hr>

        <div class="row pt-3">
            <div class="col">
                <span class="text-secondary">
                    Step {{ currentStep }} of 2:
                    <span v-if="currentStep === 1"> Fill up canvass info </span>
                    <span v-if="currentStep === 2"> Add canvass items </span>
                </span>
            </div>
        </div>

        <div v-show="currentStep === 1" class="row justify-content-center pt-5">
            <div class="col-lg-6">
                <div class="mb-3">
                    <label class="form-label">
                        Requisitioner <span class="text-danger">*</span>
                    </label>
                    <client-only>
                        <v-select :options="employees" label="fullname" v-model="formData.requested_by"></v-select>
                    </client-only>
                    <small class="text-danger fst-italic" v-show="formDataErrors.requested_by"> This field is required
                    </small>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Purpose <span class="text-danger">*</span>
                    </label>
                    <textarea v-model="formData.purpose" class="form-control" rows="3"></textarea>
                    <small class="text-danger fst-italic" v-show="formDataErrors.purpose"> This field is required
                    </small>
                </div>

                <div class="mb-3">
                    <label class="form-label">Notes</label>
                    <textarea v-model="formData.notes" class="form-control" rows="3"></textarea>
                </div>
            </div>
        </div>



        <div v-show="currentStep === 2" class="row justify-content-center pt-5">
            <div class="col-lg-10 col-md-10 col-sm-12">

                <WarehouseCanvassItems :canvass-items="formData.canvass_items" :brands="brands" :units="units"
                    :items="items" @add-item="addCanvassItem" @edit-item="editCanvassItem"
                    @remove-item="removeCanvassItem" />

            </div>
        </div>



        <div class="row justify-content-center pt-5">
            <div :class="{ 'col-lg-6': currentStep === 1, 'col-lg-10 col-md-10 col-sm-12': currentStep === 2 }">

                <div v-if="currentStep === 1" class="d-flex justify-content-between">
                    <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/canvass">
                        <i class="fas fa-chevron-left"></i> Back to Search
                    </nuxt-link>
                    <button @click="onClickNextStep1()" type="button" class="btn btn-primary">
                        <i class="fas fa-chevron-right"></i> Next
                    </button>
                </div>

                <div v-else class="d-flex justify-content-between">
                    <button @click="currentStep--" type="button" class="btn btn-secondary">
                        <i class="fas fa-chevron-left"></i> Back
                    </button>
                    <button @click="save()" :disabled="formData.canvass_items.length === 0 || isSaving" type="button"
                        class="btn btn-primary">
                        <i class="fas fa-save"></i> {{ isSaving ? 'Saving...' : 'Save' }}
                    </button>
                </div>


            </div>
        </div>







    </div>

</template>


<script setup lang="ts">

import * as api from '~/composables/warehouse/canvass/canvass.api'
import Swal from 'sweetalert2'
import type { CreateCanvassInput } from '~/composables/warehouse/canvass/canvass.types';
import { getFullname } from '~/utils/helpers'
import { useToast } from "vue-toastification";
import { MOBILE_WIDTH } from '~/utils/config';
import type { CanvassItem } from '~/composables/warehouse/canvass/canvass-item.types';
import type { Item } from '~/composables/warehouse/item/item.type';
import { ROUTES } from '~/utils/constants';

definePageMeta({
    name: ROUTES.CANVASS_CREATE,
    layout: "layout-warehouse",
    middleware: ['auth']
})

// CONSTANTS
const router = useRouter();
const toast = useToast();

// FLAGS
const isMobile = ref(false)
const isSaving = ref(false)

// INITIAL DATA
const _formDataErrorsInitial = {
    requested_by: false,
    purpose: false,
}


const currentStep = ref(1)

// CANVASS FORM DATA
const formData = ref<CreateCanvassInput>({
    purpose: '',
    notes: '',
    requested_by: null,
    canvass_items: []
})
const formDataErrors = ref({ ..._formDataErrorsInitial })

// DROPDOWNS
const employees = ref<Employee[]>([])
const brands = ref<Brand[]>([])
const units = ref<Unit[]>([])
const items = ref<Item[]>([])



// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    isMobile.value = window.innerWidth < MOBILE_WIDTH

    window.addEventListener('resize', checkMobile);

    const response = await api.fetchFormDataInCreate()

    employees.value = response.employees.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })
    brands.value = response.brands
    units.value = response.units
    items.value = response.items.map(i => ({ ...i, label: `${i.code} - ${i.name}` }))

})



// ======================== FUNCTIONS ======================== 

async function save() {

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

        router.push(`/warehouse/purchasing/canvass/view/${response.data.id}`);
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

async function onClickNextStep1() {

    formDataErrors.value = { ..._formDataErrorsInitial }

    if (formData.value.purpose.trim() === '') {
        formDataErrors.value.purpose = true
    }

    if (!formData.value.requested_by) {
        formDataErrors.value.requested_by = true
    }

    const hasError = Object.values(formDataErrors.value).includes(true);

    if (hasError) {
        return
    }

    currentStep.value += 1
}



// ======================== CANVASSS ITEM FUNCTIONS ======================== 

async function addCanvassItem(data: CanvassItem, closeBtnModal: HTMLInputElement) {

    console.log('addCanvassItem')
    console.log('data', data)
    console.log('closeBtnModal', closeBtnModal)

    formData.value.canvass_items.push(data)

    toast.success('Item added!')

    closeBtnModal.click()

}

async function editCanvassItem(data: CanvassItem, closeBtnModal: HTMLInputElement, indx: number) {

    console.log('editCanvassItem')
    console.log('data', data)
    console.log('closeBtnModal', closeBtnModal)
    console.log('indx', indx)

    formData.value.canvass_items[indx] = { ...data }

    toast.success('Item updated!')

    closeBtnModal.click()

}

async function removeCanvassItem(indx: number) {

    const canvassItem = formData.value.canvass_items[indx]

    Swal.fire({
        title: "Are you sure?",
        text: `Item no. ${indx + 1} with description "${canvassItem.description}" will be removed!`,
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74a3b",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, remove it!",
        reverseButtons: true,
    }).then(async (result) => {
        if (result.isConfirmed) {

            formData.value.canvass_items.splice(indx, 1)
            toast.success(`Item removed!`)

        }
    });

}



// ======================== UTILS ======================== 

function checkMobile() {
    isMobile.value = window.innerWidth < MOBILE_WIDTH
}




</script>
~/composables/warehouse/unit2/unit.types