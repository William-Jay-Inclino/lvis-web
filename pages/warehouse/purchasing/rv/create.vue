<template>
    <div>
        <h2 class="text-warning">Create RV</h2>
        <hr>

        <div class="row pb-3">
            <div class="col">
                <div class="row justify-content-center pt-3">
        
                    <div class="col-lg-6">

                        <div class="mb-3">
                            <label class="form-label">
                                Date
                            </label>
                            <input type="date" class="form-control" :value="rvData.date_requested" disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                RC Number <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select @option:selected="onRcNumberSelected" :options="canvasses" label="rc_number" v-model="rvData.canvass">
                                    <template v-slot:option="option">
                                        <span v-if="option.is_referenced" class="text-danger">{{ option.rc_number }}</span>
                                        <span v-else>{{ option.rc_number }}</span>
                                    </template>
                                </v-select>
                            </client-only>
                            <nuxt-link v-if="rvData.canvass" class="btn btn-sm btn-light text-primary" :to="'/warehouse/purchasing/canvass/' + rvData.canvass.id" target="_blank">View info</nuxt-link>
                            <small class="text-danger fst-italic" v-if="rvDataErrors.canvass"> This field is required </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner
                            </label>
                            <input 
                                v-if="rvData.canvass" 
                                :value="getFullname(rvData.canvass.requested_by!.firstname, rvData.canvass.requested_by!.middlename, rvData.canvass.requested_by!.lastname)" 
                                type="text" 
                                class="form-control" 
                                disabled
                            >
                            <input v-else type="text" class="form-control" disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Purpose
                            </label>
                            <textarea v-if="rvData.canvass" :value="rvData.canvass.purpose" class="form-control" rows="3" disabled> </textarea>
                            <textarea v-else class="form-control" rows="3" disabled> </textarea>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Imd. Sup. <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="rvData.supervisor"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-if="rvDataErrors.supervisor"> This field is required </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Classification
                            </label>
                            <client-only>
                                <v-select :options="classifications" label="name" v-model="rvData.classification"></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Work Order No.
                            </label>
                            <input type="text" class="form-control" v-model="rvData.work_order_no">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Work Order Date
                            </label>
                            <input type="date" class="form-control" v-model="rvData.work_order_date">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Notes
                            </label>
                            <textarea class="form-control" rows="3" v-model="rvData.notes"></textarea>
                        </div>
                
                        <div class="d-flex justify-content-end gap-2">
                            <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/rv">
                                <i class="fas fa-chevron-left"></i> Back
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

</template>


<script setup lang="ts">

    definePageMeta({
        layout: "layout-admin"
    })

    import Swal from 'sweetalert2'
    import moment from 'moment';
    import { getFullname } from '~/utils/helpers'
    import { useToast } from "vue-toastification";
    import * as rvApi from '~/composables/warehouse/rv/rv.api'
    import type { Canvass, Classification } from '~/composables/warehouse/canvass/canvass.types';
    import type { CreateRvInput } from '~/composables/warehouse/rv/rv.types';
    import { MOBILE_WIDTH } from '~/utils/config';

    // flags
    const isMobile = ref(false)
    const isSaving = ref(false)

    const router = useRouter();
    const toast = useToast();
    const today = moment().format('YYYY-MM-DD')

    const _rvDataErrorsInitial = {
        canvass: false,
        supervisor: false,
    }

    const rvDataErrors = ref({..._rvDataErrorsInitial})

    let currentCanvass: Canvass | null = null

    const rvData = ref<CreateRvInput>({
        canvass: null,
        supervisor: null,
        classification: null,
        date_requested: today,
        work_order_no: '',
        work_order_date: null,
        notes: '',
        approvers: []
    })

    const canvasses = ref<Canvass[]>([])
    const employees = ref<Employee[]>([])
    const classifications = ref<Classification[]>([])

    onMounted( async() => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        const response = await rvApi.fetchFormDataInCreate()

        canvasses.value = response.canvasses

        employees.value = response.employees.map((i) => {
            i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
            return i
        })

        rvData.value.approvers = response.approvers
        classifications.value = response.classifications

    })

    const canvassId = computed( () => {
        if(rvData.value.canvass) {
            return rvData.value.canvass.id
        }
        return null
    })

    // set currentCanvass to null if rc number field is deselected
    watch(canvassId, (val) => {

        if(!val) {
            console.log('rc number deselected')
            currentCanvass = null
        }

    })

    async function save() {

        console.log('save')

        if(!isValid()){
            return 
        }

        console.log('saving...')

        isSaving.value = true
        const response = await rvApi.create(rvData.value)
        isSaving.value = false

        if(response.success && response.data) {
            router.push(`/warehouse/purchasing/rv/success/${response.data.id}`);
        }else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }

    }

    function isValid(): boolean {

        rvDataErrors.value = {..._rvDataErrorsInitial}

        if(!rvData.value.canvass) {
            rvDataErrors.value.canvass = true
        }

        if(!rvData.value.supervisor) {
            rvDataErrors.value.supervisor = true
        }

        const hasError = Object.values(rvDataErrors.value).includes(true);

        if(hasError) {
            return false
        }

        return true

    }

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }

    // check if canvass is_referenced. If true then rollback to previous canvass else set new current canvass
    function onRcNumberSelected(payload: Canvass) {
        console.log('onRcNumberSelected()', payload)
        if(payload.is_referenced) {
            if(currentCanvass) {
                rvData.value.canvass = currentCanvass
            }else{
                rvData.value.canvass = null
            }
        }else{
            currentCanvass = payload
        }
    }

</script>

