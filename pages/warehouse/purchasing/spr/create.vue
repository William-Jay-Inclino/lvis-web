<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Create SPR</h2>
                <hr>
        
                <div class="row pb-3">
                    <div class="col">
                        <div class="row justify-content-center pt-3">
        
                            <div class="col-lg-6">
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        RC Number <span class="text-danger">*</span>
                                    </label>
                                    <client-only>
                                        <v-select @search="handleSearchRcNumber" @option:selected="onRcNumberSelected" :options="canvasses" label="rc_number"
                                            v-model="sprData.canvass">
                                            <template v-slot:option="option">
                                                <div v-if="option.is_referenced" class="row">
                                                    <div class="col">
                                                        <span class="text-danger">{{ option.rc_number }}</span>
                                                    </div>
                                                    <div class="col text-end">
                                                        <small class="text-muted fst-italic">
                                                            Referenced
                                                        </small>
                                                    </div>
                                                </div>
                                                <div v-else class="row">
                                                    <div class="col">
                                                        <span>{{ option.rc_number }}</span>
                                                    </div>
                                                    <div class="col text-end">
                                                        <small class="text-success fst-italic"> Available </small>
                                                    </div>
                                                </div>
                                            </template>
                                        </v-select>
                                    </client-only>
                                    <nuxt-link v-if="sprData.canvass" class="btn btn-sm btn-light text-primary"
                                        :to="'/warehouse/purchasing/canvass/view/' + sprData.canvass.id" target="_blank">View
                                        canvass details</nuxt-link>
                                    <small class="text-danger fst-italic" v-if="sprDataErrors.canvass"> This field is required
                                    </small>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Requisitioner
                                    </label>
                                    <input v-if="sprData.canvass"
                                        :value="getFullname(sprData.canvass.requested_by!.firstname, sprData.canvass.requested_by!.middlename, sprData.canvass.requested_by!.lastname)"
                                        type="text" class="form-control" disabled>
                                    <input v-else type="text" class="form-control" disabled>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Purpose
                                    </label>
                                    <textarea v-if="sprData.canvass" :value="sprData.canvass.purpose" class="form-control"
                                        rows="3" disabled>
            </textarea>
                                    <textarea v-else class="form-control" rows="3" disabled> </textarea>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Requisitioner Notes
                                    </label>
                                    <textarea v-if="sprData.canvass" :value="sprData.canvass.notes" class="form-control"
                                        rows="3" disabled> </textarea>
                                    <textarea v-else class="form-control" rows="3" disabled> </textarea>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Imd. Sup. <span class="text-danger">*</span>
                                    </label>
                                    <client-only>
                                        <v-select @search="handleSearchEmployees" :options="employees" label="fullname" v-model="sprData.supervisor"></v-select>
                                    </client-only>
                                    <small class="text-danger fst-italic" v-if="sprDataErrors.supervisor"> This field is
                                        required
                                    </small>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Vehicle <span class="text-danger">*</span>
                                    </label>
                                    <client-only>
                                        <v-select :options="vehicles" label="name" v-model="sprData.vehicle"></v-select>
                                    </client-only>
                                    <small class="text-danger fst-italic" v-if="sprDataErrors.vehicle"> This field is required
                                    </small>
                                </div>
        
                                <div class="mb-3" v-if="isAdmin(authUser)">
                                    <label class="form-label">
                                        Classification
                                    </label>
                                    <client-only>
                                        <v-select :options="classifications" label="name"
                                            v-model="sprData.classification"></v-select>
                                    </client-only>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Notes
                                    </label>
                                    <textarea class="form-control" rows="3" v-model="sprData.notes"></textarea>
                                </div>
        
                                <div class="d-flex justify-content-between">
                                    <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/spr">
                                        <i class="fas fa-chevron-left"></i> Back to Search
                                    </nuxt-link>
                                    <button @click="save()" type="button" class="btn btn-primary" :disabled="isSaving">
                                        <i class="fas fa-save"></i> {{ isSaving ? 'Saving...' : 'Save' }}
                                    </button>
                                </div>
        
                            </div>
        
                        </div>
                    </div>
                </div>
        
        
            </div>
        
            <div v-else>
                <LoaderSpinner />
            </div>
            
        </div>
    </div>


</template>


<script setup lang="ts">

import Swal from 'sweetalert2'
import { getFullname } from '~/utils/helpers'
import * as sprApi from '~/composables/warehouse/spr/spr.api'
import type { Canvass } from '~/composables/warehouse/canvass/canvass.types';
import type { CreateSprInput } from '~/composables/warehouse/spr/spr.types';
import type { Employee } from '~/composables/system/employee/employee.types';
import { fetchCanvassesByRcNumber } from '~/composables/warehouse/canvass/canvass.api';
import { fetchEmployees } from '~/composables/system/employee/employee.api';
import { addPropertyFullName } from '~/composables/system/employee/employee';

definePageMeta({
    name: ROUTES.SPR_CREATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})
const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

// CONSTANTS
const router = useRouter();

// FLAGS
const isSaving = ref(false)

// INITIAL DATA
const _sprDataErrorsInitial = {
    canvass: false,
    vehicle: false,
    supervisor: false,
}

// FORM DATA
const sprData = ref<CreateSprInput>({
    canvass: null,
    supervisor: null,
    classification: null,
    vehicle: null,
    notes: '',
    approvers: []
})
const sprDataErrors = ref({ ..._sprDataErrorsInitial })

let currentCanvass: Canvass | null = null


// DROPDOWNS
const canvasses = ref<Canvass[]>([])
const employees = ref<Employee[]>([])
const classifications = ref<Classification[]>([])
const vehicles = ref<Vehicle[]>([])



// ======================== LIFECYCLE HOOKS ========================  
onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await sprApi.fetchFormDataInCreate()

    canvasses.value = response.canvasses

    employees.value = addPropertyFullName(response.employees)

    sprData.value.approvers = response.approvers
    classifications.value = response.classifications
    vehicles.value = response.vehicles

    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

const canvassId = computed(() => {
    if (sprData.value.canvass) {
        return sprData.value.canvass.id
    }
    return null
})



// ======================== WATCHERS ========================  
// set currentCanvass to null if rc number field is deselected
watch(canvassId, (val) => {

    if (!val) {
        console.log('rc number deselected')
        currentCanvass = null
    }

})



// ======================== FUNCTIONS ========================  

async function save() {

    console.log('save')

    if (!isValid()) {
        return
    }

    console.log('saving...')

    isSaving.value = true
    const response = await sprApi.create(sprData.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/purchasing/spr/view/${response.data.id}`);
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

// check if canvass is_referenced. If true then rollback to previous canvass else set new current canvass
function onRcNumberSelected(payload: Canvass) {
    console.log('onRcNumberSelected()', payload)
    if (payload.is_referenced) {
        if (currentCanvass) {
            sprData.value.canvass = currentCanvass
        } else {
            sprData.value.canvass = null
        }
    } else {
        currentCanvass = payload
    }
}

async function handleSearchRcNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        canvasses.value = []
        return
    } 

    debouncedSearchRcNumbers(input, loading)

}

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        employees.value = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

}

async function searchEmployees(input: string, loading: (status: boolean) => void) {
    console.log('searchEmployees');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchEmployees(input);
        console.log('response', response);
        employees.value = addPropertyFullName(response)
    } catch (error) {
        console.error('Error fetching Employees:', error);
    } finally {
        loading(false);
    }
}


async function searchRcNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchRcNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchCanvassesByRcNumber(input);
        console.log('response', response);
        canvasses.value = response;
    } catch (error) {
        console.error('Error fetching RC numbers:', error);
    } finally {
        loading(false);
    }
}

// ======================== UTILS ========================  

function isValid(): boolean {

    sprDataErrors.value = { ..._sprDataErrorsInitial }

    if (!sprData.value.canvass) {
        sprDataErrors.value.canvass = true
    }

    if (!sprData.value.supervisor) {
        sprDataErrors.value.supervisor = true
    }

    if (!sprData.value.vehicle) {
        sprDataErrors.value.vehicle = true
    }

    const hasError = Object.values(sprDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}

const debouncedSearchRcNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchRcNumbers(input, loading);
}, 500);

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

</script>
