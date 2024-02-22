<template>
    <div>
        <h2 class="text-warning">Search MEQS</h2>
        
        <hr>

        <div class="row pt-3">
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">MEQS Number</label>
                    <client-only>
                        <v-select :options="meqsArray" label="meqs_number" v-model="meqs"></v-select>
                    </client-only>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">Transaction</label>
                    <div class="row g-0">
                        <div class="col-4">
                            <client-only>
                                <v-select :options="transactionTypes" v-model="transactionType" :clearable="false"></v-select>
                            </client-only>
                        </div>
                        <div class="col-8">
                            <client-only>
                                <v-select :options="rvs" label="rv_number" v-model="rv" v-show="transactionType === 'RV'"></v-select>
                                <v-select :options="jos" label="rv_number" v-model="jo" v-show="transactionType === 'SPR'"></v-select>
                                <v-select :options="sprs" label="rv_number" v-model="spr" v-show="transactionType === 'JO'"></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>
            </div>


            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">Date</label>
                    <input v-model="date_requested" type="date" class="form-control">
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="mb-3">
                    <label class="form-label">Requisitioner</label>
                    <client-only>
                        <v-select :options="employees" label="fullname" v-model="requested_by"></v-select>
                    </client-only>
                </div>
            </div>
        </div>

    </div>
</template>



<script setup lang="ts">
    import type { MEQS } from '~/composables/warehouse/meqs/meqs.types';
    import type { RV } from '~/composables/warehouse/rv/rv.types';
    import * as meqsApi from '~/composables/warehouse/meqs/meqs.api'


    definePageMeta({
            layout: "layout-admin"
    })


    const isMobile = ref(false)


    const transactionTypes = ref(['RV', 'SPR', 'JO'])
    
    // ====== search filters ====== 

    // dropdowns
    const meqsArray = ref<MEQS[]>([])
    const rvs = ref<RV[]>([])
    const jos = ref([])
    const sprs = ref([])
    const employees = ref<Employee[]>([])

    // fields
    const transactionType = ref(transactionTypes.value[0])
    const meqs = ref<MEQS | null>(null)
    const rv = ref<RV | null>(null)
    const jo = ref(null)
    const spr = ref(null)
    const date_requested = ref(null)
    const requested_by = ref<Employee | null>(null)
    // ----------------

    onMounted( async() => {
        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        const response = await meqsApi.fetchDataInSearchFilters()

        meqsArray.value = response.meqs
        rvs.value = response.rvs
        employees.value = response.employees.map((i) => {
            i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
            return i
        })

    })



    // ======================== UTILS ======================== 

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }


</script>