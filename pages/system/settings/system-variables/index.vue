<template>
    <div v-if="!isLoadingPage">

        <h2 class="text-warning">System Variables</h2>

        <hr>

        <div class="row justify-content-center">
            <div class="col-lg-6">

                <div class="mb-3">
                    <label class="form-label">
                        Budget Officers
                    </label>
                    <client-only>
                        <v-select multiple label="fullname" v-model="budgetOfficers" :options="employees" />
                    </client-only>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Finance Managers
                    </label>
                    <client-only>
                        <v-select multiple label="fullname" v-model="financeManagers" :options="employees" />
                    </client-only>
                </div>

            </div>
        </div>


    </div>

    <div v-else>
        <LoaderSpinner />
    </div>

</template>


<script setup lang="ts">

import * as systemApi from '~/composables/system/settings/system-variables.api'

definePageMeta({
    // name: ROUTES.ACCOUNT_INDEX,
    layout: "layout-system",
    // middleware: ['auth'],
})

const isLoadingPage = ref(true)

const employees = ref<Employee[]>([])

const budgetOfficers = ref<Employee[]>([])
const financeManagers = ref<Employee[]>([])


onMounted(async () => {

    const response = await systemApi.fetchFormDataInCreate()

    employees.value = response.employees.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })

    isLoadingPage.value = false

})

</script>