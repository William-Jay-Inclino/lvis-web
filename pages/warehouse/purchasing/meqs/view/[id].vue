<template>

    <div v-if="item" class="row justify-content-center mb-3">

        <div class="col-lg-10">

            <div class="row">
                <div class="col">
                    <div class="h5wrapper mb-3">
                        <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <i class="fas fa-info-circle"></i> MEQS Info
                            </h5>
                        <hr class="result">
                    </div>

                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <tbody>
                                <tr>
                                    <td class="text-muted">MEQS Number</td>
                                    <td> {{ item?.meqs_number }} </td>
                                </tr>
                                <tr>
                                    <td class="text-muted"> {{ referenceLabel }} Number</td>
                                    <td>
                                        <nuxt-link v-if="item?.rv" :to="'/warehouse/purchasing/rv/' + item.rv.id" target="_blank">{{ item.rv.rv_number }}</nuxt-link>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-muted">Date</td>
                                    <td> {{ formatDate(item?.meqs_date) }} </td>
                                </tr>
                                <tr>
                                    <td class="text-muted">MEQS Notes</td>
                                    <td> {{ item?.notes }} </td>
                                </tr>
                                <tr>
                                    <td class="text-muted">Requisitioner</td>
                                    <td> {{ getFullname(referenceData!.canvass.requested_by!.firstname, referenceData!.canvass.requested_by!.middlename, referenceData!.canvass.requested_by!.lastname) }} </td>
                                </tr>
                                <tr>
                                    <td class="text-muted">Requisitioner Purpose</td>
                                    <td> {{ referenceData!.canvass.purpose }} </td>
                                </tr>
                                <tr>
                                    <td class="text-muted">Requisitioner Notes</td>
                                    <td> {{ referenceData!.canvass.notes }} </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                </div>
            </div>

            <div class="row pt-3">
                <div class="col">

                    <div class="h5wrapper mb-3">
                        <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <i class="fas fa-users"></i> Approvers
                            </h5>
                        <hr class="result">
                    </div>

                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th class="bg-secondary text-white"> Order </th>
                                    <th class="bg-secondary text-white"> Label </th>
                                    <th class="bg-secondary text-white"> Approver </th>
                                    <th class="bg-secondary text-white"> Status </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="i, count in item.meqs_approvers">
                                    <td class="text-muted"> {{ i.order }} </td>
                                    <td class="text-muted"> {{ i.label }} </td>
                                    <td class="text-muted"> {{ getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname) }} </td>
                                    <td>
                                        <span :class="{[`badge bg-${approvalStatus[i.status].color}`]: true}"> 
                                            {{ approvalStatus[i.status].label }} 
                                        </span> 
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

            <div class="row pt-3">
                <div class="col">

                    <div class="h5wrapper mb-3">
                        <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <i class="fas fa-truck"></i> Suppliers
                            </h5>
                        <hr class="result">
                    </div>

                    <div class="alert alert-info" role="alert">
                        <small class="text-muted fst-italic">Click the attachment to view it in a larger size</small>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th class="bg-secondary text-white"> Supplier </th>
                                    <th class="bg-secondary text-white"> Vat </th>
                                    <th class="bg-secondary text-white"> Payment Terms </th>
                                    <th class="bg-secondary text-white"> Attachments </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="i, count in item.meqs_suppliers">
                                    <td class="text-muted align-middle"> {{ i.supplier.name }} </td>
                                    <td class="text-muted align-middle"> {{ VAT[i.vat_type].label }} </td>
                                    <td class="text-muted align-middle"> {{ i.payment_terms }} </td>
                                    <td>
                                        <div class="d-flex flex-wrap">
                                            <div v-for="attachment in i.attachments" class="p-1 image-container">
                                                <a href="javascript:void(0)" @click="onClickAttachment(attachment.src)" data-bs-toggle="modal" data-bs-target="#myModal">
                                                    <img :src="getUploadsPath(attachment.src)" class="img-thumbnail small-image" :alt="attachment.src">
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

            <div class="row pt-3">
                <div class="col">

                    <div class="h5wrapper mb-3">
                        <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <i class="fas fa-shopping-cart"></i> Items
                            </h5>
                        <hr class="result">
                    </div>
                    <div class="alert alert-info" role="alert">
                        <div>
                            <small class="text-muted fst-italic">- The awarded supplier is indicated by a yellow star</small>
                        </div>
                        <div>
                            <small class="text-muted fst-italic">- A price of -1 indicates that the item is unavailable from a specific supplier</small>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th class="bg-secondary text-white"> No </th>
                                    <th class="bg-secondary text-white"> Item </th>
                                    <th class="bg-dark text-white text-center" v-for="meqsSupplier in item.meqs_suppliers">
                                        {{ `${meqsSupplier.supplier?.name}` }}
                                    </th>
                                    <th class="bg-dark text-white text-center">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="canvassItem, i in referenceData?.canvass.canvass_items">
                                    <td class="text-muted"> {{ i + 1 }} </td>
                                    <td class="text-muted"> {{ canvassItem.description }} </td>
                                    <td class="text-muted text-center" v-for="meqsSupplier in item.meqs_suppliers">
                                        <template v-for="supplierItem in meqsSupplier.meqs_supplier_items">
                                            <span v-if="supplierItem.canvass_item.id === canvassItem.id">
                                                {{ supplierItem.price.toFixed(2) }}
                                                <i class="fas fa-star fs-5" :class="{'text-warning': supplierItem.is_awarded}"></i>
                                            </span>
                                        </template>
                                    </td>
                                    <td class="text-center">
                                        <button @click="onClickNote(canvassItem.id)" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#myModal">
                                            <i class="fas fa-book"></i>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

            <div class="row mb-3 pt-3">
                <div class="col">
                    <div class="d-flex justify-content-between">
                        <div>
                            <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/meqs">
                                <i class="fas fa-chevron-left"></i> Back to Search
                            </nuxt-link>
                        </div>
                        <div>
                            <nuxt-link class="btn btn-success me-2" :to="`/warehouse/purchasing/meqs/${item.id}`">
                                <i class="fas fa-sync"></i> Update
                            </nuxt-link>
                            <nuxt-link class="btn btn-primary" to="/warehouse/purchasing/meqs/create">
                                <i class="fas fa-plus"></i> Add New
                            </nuxt-link>
                        </div>
                    </div>
                </div>
            </div>


        </div>

        <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" :class="{'modal-xl': modalToShow === 'attachment'}">
                <div class="modal-content">

                    <div class="modal-header">
                        <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body d-flex justify-content-center">
                        <div v-if="modalToShow === 'attachment'">
                            <img :src="selectedAttachment" class="img-fluid" :alt="selectedAttachment">
                        </div>
                        <div v-else>
                            <textarea rows="5" cols="50" class="form-control" :value="selectedNote" readonly></textarea>
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

    import { MOBILE_WIDTH, UPLOADS_PATH } from '~/utils/config';
    import * as meqsApi from '~/composables/warehouse/meqs/meqs.api'
    import type { MEQS } from '~/composables/warehouse/meqs/meqs.types';


    const route = useRoute()
    const item = ref<MEQS | undefined>()
    const isMobile = ref(false)
    const config = useRuntimeConfig()
    const API_FILE_ENDPOINT = config.public.apiUrl + '/api/v1/file-upload'

    const selectedAttachment = ref('')
    const selectedNote = ref('')
    const modalToShow = ref<'attachment' | 'note'>('attachment')

    onMounted( async() => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        item.value = await meqsApi.findOne(route.params.id as string)

    })
    
    const referenceData = computed( () => {

        if(item.value?.rv) {
            return item.value?.rv
        }

        // todos
    })

    const referenceLabel = computed( () => {

        if(item.value?.rv) {
            return 'RV'
        }

        // todos

        return ''

    })

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }

    function getUploadsPath(src: string) {

        const path = src.replace(UPLOADS_PATH, '')
        console.log('PATH', path)

        const uploadsPath = API_FILE_ENDPOINT + path 
        return uploadsPath

    }

    function onClickAttachment(src: string) {
        modalToShow.value = 'attachment'
        selectedAttachment.value = getUploadsPath(src)
    }

    function onClickNote(canvass_item_id: string) {

        modalToShow.value = 'note'

        for(let supplier of item.value!.meqs_suppliers) {

            const item = supplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

            if(item) {
                const emptyNote = (!item.notes || item.notes.trim() === '')
                selectedNote.value =  emptyNote ? 'No remarks' : item.notes!
                break 
            }

        }

    }


</script>


<style scoped>

.small-image {
    max-width: 100px; 
    max-height: 100px; 
}

.image-container {
    overflow: hidden;
}

.image-container img {
    transition: transform 0.3s ease;
}

.image-container:hover img {
    transform: scale(1.2);
}

</style>