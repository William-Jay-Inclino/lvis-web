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
                                    <button class="btn btn-light w-50">
                                        <i class="fas fa-times-circle text-danger"></i>
                                    </button>
                                    <button class="btn btn-light w-50">
                                        <i class="fas fa-check-circle text-success"></i>
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
    import { PENDING_APPROVAL_TYPE, type PendingApproval } from '~/composables/e-forms/pendings/pendings.types';
    import * as pendingsApi from '~/composables/e-forms/pendings/pendings.api'


    definePageMeta({
        layout: "layout-e-form"
    })

    const pendings = ref<PendingApproval[]>([])
    
    onMounted( async() => {
        const authUser = getAuthUser()
        console.log('authUser', authUser)
        const response = await pendingsApi.getPendingsByEmployeeId(authUser.user.user_employee.employee.id)

        pendings.value = response.pendings

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

</script>