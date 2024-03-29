<template>
    <div>

        <h2 class="text-warning">Create User</h2>

        <hr>


        <div class="row pt-3">
            <div class="col">
                <span class="text-secondary">
                    Step {{ currentStep }} of 3:
                    <span v-show="currentStep === 1"> Add User info </span>
                    <span v-show="currentStep === 2"> Add Login credentials </span>
                    <span v-show="currentStep === 3"> Add User Permissions </span>
                </span>
            </div>
        </div>


        <div v-show="currentStep === 1" class="row justify-content-center pt-3">

            <div class="col-lg-6">

                <div class="mb-3">
                    <label class="form-label">
                        Is employee?
                    </label>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" v-model="isEmployee">
                        <label class="form-check-label">
                            {{ isEmployee ? 'Yes' : 'No' }}
                        </label>
                    </div>
                </div>

                <div v-if="isEmployee" class="mb-3">
                    <label class="form-label">
                        Select Employee <span class="text-danger">*</span>
                    </label>
                    <client-only>
                        <v-select :options="employees" label="fullname" v-model="formData.employee"
                            @option:selected="onChangeEmployee"></v-select>
                    </client-only>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Firstname <span class="text-danger">*</span>
                    </label>
                    <input type="text" class="form-control" v-model="formData.firstname" required
                        :disabled="isEmployee">
                </div>
                <div class="mb-3">
                    <label class="form-label">
                        Middlename
                    </label>
                    <input type="text" class="form-control" v-model="formData.middlename" :disabled="isEmployee">
                </div>
                <div class="mb-3">
                    <label class="form-label">
                        Lastname <span class="text-danger">*</span>
                    </label>
                    <input type="text" class="form-control" v-model="formData.lastname" required :disabled="isEmployee">
                </div>

                <div class="d-flex justify-content-between">
                    <button @click="onClickGoToList" type="button" class="btn btn-primary" :disabled="!canProceedStep2">
                        <i class="fas fa-chevron-left"></i> Back to User List
                    </button>
                    <button @click="goToStep2()" type="button" class="btn btn-primary" :disabled="!canProceedStep2">
                        <i class="fas fa-chevron-right"></i> Next
                    </button>
                </div>

            </div>

        </div>


        <div v-show="currentStep === 2" class="row justify-content-center pt-3">

            <div class="col-lg-6">

                <SystemUserLoginCredentials :username="formData.username" :password="formData.password"
                    :is-username-exist="isUsernameExist" :is-checking-un-availability="isCheckingUnAvailability"
                    @check-username-availability="checkUsernameAvailability" @update-username="onUpdateUsername" />

                <div class="d-flex justify-content-between">
                    <button @click="goToStep1()" type="button" class="btn btn-secondary">
                        <i class="fas fa-chevron-right"></i> Back
                    </button>
                    <button @click="goToStep3()" type="button" class="btn btn-primary"
                        :disabled="!canProceedStep3 || isCheckingUnAvailability">
                        <i class="fas fa-chevron-right"></i> Next
                    </button>
                </div>

            </div>

        </div>


    </div>

</template>


<script setup lang="ts">

definePageMeta({
    layout: "layout-system"
})

import * as api from '~/composables/system/user/user.api'
import type { CreateUserInput } from '~/composables/system/user/user.types'
import Swal from 'sweetalert2'

const router = useRouter()
const isSaving = ref(false)

const currentStep = ref(1)

const isEmployee = ref(false)
const isUsernameExist = ref(false)
const isCheckingUnAvailability = ref(false)

const employees = ref<Employee[]>([])

const _initialFormData: CreateUserInput = {
    employee: null,
    username: '',
    password: '',
    firstname: '',
    middlename: '',
    lastname: '',
    role: ROLE.USER,
    permissions: null
}

const formData = ref({ ..._initialFormData })



// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    const response = await api.fetchFormDataInCreate()

    employees.value = response.employees.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })

})


const canProceedStep2 = computed(() => {

    if (!!isEmployee.value && !formData.value.employee) {
        return false
    }

    if (!formData.value.firstname || !formData.value.lastname) {
        return false
    }


    return true

})

const canProceedStep3 = computed(() => {

    if (formData.value.username.trim() === '' || formData.value.password.trim() === '') return false

    if (isUsernameExist.value) return false

    return true

})


watch(isEmployee, (val) => {

    if (!val) {
        formData.value.employee = null
        formData.value.firstname = ''
        formData.value.middlename = ''
        formData.value.lastname = ''
    }

})


function onChangeEmployee() {

    console.log('onChangeEmployee()')

    if (!isEmployee.value || !formData.value.employee) return

    formData.value.firstname = formData.value.employee.firstname
    formData.value.middlename = formData.value.employee.middlename
    formData.value.lastname = formData.value.employee.lastname

}


async function checkUsernameAvailability(username: string) {

    console.log('checkUsernameAvailability()')

    isCheckingUnAvailability.value = true
    const response = await api.isUsernameExist(username)
    isCheckingUnAvailability.value = false

    if (response.success) {
        isUsernameExist.value = response.data
    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}

// ======================== UTILS ======================== 

const onClickGoToList = () => router.push('/system/user')
const goToStep1 = () => currentStep.value = 1
const goToStep2 = async () => {
    currentStep.value = 2
    formData.value.password = 'temp' + generateRandom3Digits()
    formData.value.username = generateUsername(formData.value.firstname, formData.value.lastname)
    await checkUsernameAvailability(formData.value.username)
}
const goToStep3 = async () => {
    await checkUsernameAvailability(formData.value.username)
    if (!isUsernameExist.value) {
        currentStep.value = 3
    }
}
const generateRandom3Digits = () => Math.floor(Math.random() * 900) + 100;
const onUpdateUsername = (val: string) => formData.value.username = val

const generateUsername = (firstName: string, lastName: string) => {
    const formattedFirstName = firstName.toLowerCase().replace(/\s+/g, '');
    const formattedLastName = lastName.toLowerCase().replace(/\s+/g, '');
    const username = `${formattedFirstName}.${formattedLastName}`;
    return username;
};

</script>