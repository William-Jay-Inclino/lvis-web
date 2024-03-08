<template>
    <div>
        
        <h3 class="text-warning">Pending for Approval/Disapproval</h3>

        <hr>

        <div class="row justify-content-center pt-3">
            <div class="col-lg-10">
                
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th class="bg-secondary text-white"> No </th>
                                <th class="bg-secondary text-white"> Transaction </th>
                                <th class="bg-secondary text-white"> Date </th>
                                <th class="text-center bg-secondary text-white">
                                    Approve / Disapprove
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="item, i in pendings" :key="i">
                                <td class="text-muted align-middle"> {{ i + 1 }} </td>
                                <td class="text-muted align-middle">
                                    {{ item.description }}
                                    <nuxt-link class="btn btn-outline-light btn-sm" :to="getLink(item.type, item.reference_id)" target="_blank">
                                        <small class="text-info fst-italic"> View details </small>
                                    </nuxt-link>
                                </td>
                                <td class="text-muted align-middle"> {{ formatDate(item.transaction_date) }} </td>
                                <td class="text-center align-middle">
                                    <button @click="onApprove(i)" class="btn btn-light w-50">
                                        <i class="fas fa-check-circle text-success"></i>
                                    </button>
                                    <button @click="onDisapprove(i)" class="btn btn-light w-50">
                                        <i class="fas fa-times-circle text-danger"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>

            </div>
        </div>

    </div>
</template>


<script setup lang="ts">

    definePageMeta({
        layout: "layout-e-form"
    })

    import { PENDING_APPROVAL_TYPE, type PendingApproval } from '~/composables/e-forms/pendings/pendings.types';
    import * as pendingsApi from '~/composables/e-forms/pendings/pendings.api'
    import Swal from 'sweetalert2'
    import { useToast } from "vue-toastification";
    import { APPROVAL_STATUS } from '#imports';


    const toast = useToast();
    const pendings = ref<PendingApproval[]>([])
    
    onMounted( async() => {
        const authUser = getAuthUser()
        console.log('authUser', authUser)

        if(authUser.user.user_employee) {

            const response = await pendingsApi.getPendingsByEmployeeId(authUser.user.user_employee.employee.id)
    
            pendings.value = response.pendings
        }


    })

    
    function getLink(type: PENDING_APPROVAL_TYPE, id: string) {

        if(type === PENDING_APPROVAL_TYPE.RV) {
            return '/warehouse/purchasing/rv/view/' + id
        }

        if(type === PENDING_APPROVAL_TYPE.MEQS) {
            return '/warehouse/purchasing/meqs/view/' + id
        }

        if(type === PENDING_APPROVAL_TYPE.PO) {
            return '/warehouse/purchasing/po/view/' + id
        }

        if(type === PENDING_APPROVAL_TYPE.RR) {
            return '/warehouse/purchasing/rr/view/' + id
        }

    }

    function onApprove(indx: number) {

        const item = pendings.value[indx]
        const status = APPROVAL_STATUS.APPROVED

        Swal.fire({
            title: "Approve Confirmation",
            text: `Are you sure you want to approve transaction ${item.description}?`,
            input: 'text',
            inputPlaceholder: 'Enter remarks (optional)...',
            position: "top",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#198754",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Approve!",
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: async(confirm) => {
                
                const inputValue = Swal.getInput()?.value;
                const notes = inputValue || '';

                await executeTransaction(item.type, indx, {
                    id: item.id,
                    notes,
                    status
                })

            },
            allowOutsideClick: () => !Swal.isLoading()
        })

    }

    function onDisapprove(indx: number) {

        const item = pendings.value[indx]
        const status = APPROVAL_STATUS.DISAPPROVED


        Swal.fire({
            title: "Disapprove Confirmation",
            text: `Are you sure you want to disapprove transaction ${item.description}?`,
            input: 'text',
            inputPlaceholder: 'Enter remarks...',
            position: "top",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74a3b",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Disapprove!",
            reverseButtons: true,
            showLoaderOnConfirm: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to enter a remark!';
                }
            },
            preConfirm: async(confirm) => {
                
                const inputValue = Swal.getInput()?.value;
                const notes = inputValue || '';

                await executeTransaction(item.type, indx, {
                    id: item.id,
                    notes,
                    status
                })

            },
            allowOutsideClick: () => !Swal.isLoading()
        })

    }

    async function executeTransaction(type: PENDING_APPROVAL_TYPE, indx: number, payload: {
        id: string,
        status: APPROVAL_STATUS,
        notes: string
    }) {

        console.log('executeTransaction', type, indx, payload)

        let response

        if(type === PENDING_APPROVAL_TYPE.RV) {
            response = await pendingsApi.updateRvStatus(payload)
        }else if(type === PENDING_APPROVAL_TYPE.MEQS) {
            response = await pendingsApi.updateMeqsStatus(payload)
        }

        if(!response) return


        if(response.success) {

            Swal.fire({
                title: 'Approved!',
                text: response.msg,
                icon: 'success',
                position: 'top',
            });

            pendings.value.splice(indx, 1)

        } else {

            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })

        }

    }

</script>