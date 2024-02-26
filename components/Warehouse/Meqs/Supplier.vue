<template>

    <div class="table-responsive">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th class="bg-secondary text-white"> Supplier </th>
                    <th class="bg-secondary text-white"> Payment Terms </th>
                    <th class="bg-secondary text-white"> Attachments </th>
                    <th class="bg-secondary text-white text-center">
                        <i class="fas fa-cog"></i>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, i in meqs_suppliers">
                    <td class="text-muted align-middle"> {{ item.supplier?.name }} </td>
                    <td class="text-muted align-middle"> {{ item.payment_terms }} </td>
                    <td class="text-muted align-middle">
                        <ul class="list-group">
                            <li class="list-group-item" v-for="attachment in item.attachments"> {{ attachment.filename }} </li>
                        </ul>
                    </td>
                    <td class="align-middle">
                        <button @click="removeSupplier(i)" class="btn btn-sm btn-light w-50">
                            <i class="fas fa-trash text-danger"></i>
                        </button>
                        <button @click="onClickEdit(i)" class="btn btn-sm btn-light w-50" data-bs-toggle="modal" data-bs-target="#addSupplierModal">
                            <i class="fas fa-edit text-primary"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" class="text-center">
                        <button @click="onClickAdd()" type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addSupplierModal">
                            <i class="fas fa-plus-circle"></i> Add Supplier
                        </button>
                    </td>
                </tr>
            </tfoot>
        </table>


        <!-- Modal -->
        <div class="modal fade" id="addSupplierModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-warning" id="exampleModalLabel">{{ formIsAdd ? 'Add' : 'Edit' }} Supplier</h5>
                    <button @click="onCloseModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label"> Supplier </label> <span class="text-danger">*</span>
                        <client-only>
                            <v-select :options="availableSuppliers" v-model="formData.supplier" label="name"></v-select>
                        </client-only>
                        <small class="text-danger fst-italic" v-if="formDataErrors.supplier">This field is required</small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Payment Terms <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" v-model="formData.payment_terms">
                        <small class="text-danger fst-italic" v-if="formDataErrors.paymentTerms">This field is required</small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Attachments <i class="text-muted"></i> <span class="text-danger">*</span>
                        </label>
                        <small class="text-muted fst-italic">(Max files: 3 & Max size per file: 5mb)</small>
                        <client-only>
                            <file-pond
                                name="test"
                                :files="formData.attachments"
                                ref="filepond"
                                label-idle="Drop files here..."
                                :allow-multiple="true"
                                accepted-file-types="image/jpeg, image/png"
                                :max-files="3"
                                @updatefiles="handleFileProcessing"
                                @removefile="handleFileRemove"
                                fileSizeBase="1000"
                            />
                        </client-only>
                        <small class="text-danger fst-italic" v-if="formDataErrors.attachments">This field is required</small>
                    </div>

                    <div v-for="file of unallowedFiles" class="mb-1">
                        <small class="text-muted fst-italic" v-html="
                            `The file <b class='text-danger'>${file.name}</b> 
                            (<b class='text-danger'>${(file.size / (1024 * 1024)).toFixed(2)} MB</b>) 
                            exceeds the maximum allowed size of <b class=text-danger>${MAX_FILE_SIZE / (1024 * 1024)} MB</b>`
                        ">
                        </small>

                    </div>

                </div>
                <div class="modal-footer">
                    <button @click="onCloseModal()" ref="closeSupplierModal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-close"></i> Close
                    </button>
                    <button v-if="formIsAdd" @click="addSupplier()" type="button" class="btn btn-primary" :disabled="!canAddSupplier">
                        <i class="fas fa-plus-circle"></i> Add Supplier
                    </button>
                    <button v-else @click="editSupplier()" type="button" class="btn btn-primary">
                        <i class="fas fa-plus-circle"></i> Edit Supplier
                    </button>
                </div>
                </div>
            </div>
        </div>


    </div>

</template>


<script setup lang="ts">
import type { CreateMeqsSupplierItemSubInput, CreateMeqsSupplierSubInput, Supplier } from '~/composables/warehouse/meqs/meqs.types';
import vueFilePond from "vue-filepond"
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import type { CanvassItem } from '~/composables/warehouse/canvass/canvass-item.types';
import { MAX_FILE_SIZE } from '~/utils/config';

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

const emits = defineEmits(['addSupplier', 'editSupplier', 'removeSupplier']);
    
const props = defineProps({
    // suppliers in the form
    meqs_suppliers: {
        type: Array as () => CreateMeqsSupplierSubInput[],
        default: () => [],
    },
    // supplier options
    suppliers: {
        type: Array as () => Supplier[],
        default: () => [],
    },
    canvass_items: {
        type: Array as () => CanvassItem[],
        default: () => [],
    }
});


const formIsAdd = ref(true)
const editingIndx = ref(0)

const closeSupplierModal = ref<HTMLButtonElement>()

const _formDataErrorsInitial = {
    supplier: false,
    paymentTerms: false,
    attachments: false
}

const _formDataInitial: CreateMeqsSupplierSubInput = {
    supplier: null,
    payment_terms: '',
    attachments: [],
    meqs_supplier_items: []
}

const formData = ref({..._formDataInitial})
const formDataErrors = ref({..._formDataErrorsInitial})
const filepond = ref()

const meqs_supplier_items = computed( (): CreateMeqsSupplierItemSubInput[] => {

    const clonedCanvassItems = props.canvass_items.map(i => ({ ...i }))

    const items: CreateMeqsSupplierItemSubInput[] = []

    for(let item of clonedCanvassItems) {
        items.push({
            canvass_item: item,
            price: 0.00,
            notes: '',
            is_awarded: false,
            vat_type: VAT_TYPE.NONE,
            invalidPrice: true // default is 2 since default price is 0.00
        })
    }

    return items

})

const availableSuppliers = computed( () => {

    const uniqueSuppliers = props.suppliers.filter(supplier1 => !props.meqs_suppliers.some(supplier2 => supplier1.id === supplier2.supplier?.id));

    return uniqueSuppliers

})

const unallowedFiles = computed((): File[] => {
    const _attachments = formData.value.attachments;
    return _attachments
        .map(attachment => attachment.file)
        .filter(file => file.size > MAX_FILE_SIZE)
});

const canAddSupplier = computed( () => unallowedFiles.value.length === 0)


function addSupplier() {

    if(!isValid()){
        return
    }
    
    formData.value.meqs_supplier_items = meqs_supplier_items.value.map(i => ({ ...i }))

    console.log('formData', formData.value)

    emits("addSupplier", formData.value)

    closeSupplierModal.value?.click()


}

function editSupplier() {

    if(!isValid()) {
        return 
    }

    console.log('formData', formData.value)

    emits("editSupplier", formData.value, editingIndx.value)

    closeSupplierModal.value?.click()

}

function isValid(): boolean {

    formDataErrors.value = {..._formDataErrorsInitial}

    if(!formData.value.supplier) {
        formDataErrors.value.supplier = true
    }

    if(formData.value.payment_terms.trim() === '') {
        formDataErrors.value.paymentTerms = true 
    }

    // if(formData.value.attachments.length === 0) {
    //     formDataErrors.value.attachments = true
    // }

    const hasError = Object.values(formDataErrors.value).includes(true);

    if(hasError) {
        return false
    }

    return true
}

function removeSupplier(indx: number) {

    emits('removeSupplier', indx)

}

function onClickEdit(indx: number) {

    formIsAdd.value = false
    editingIndx.value = indx

    const item = props.meqs_suppliers[indx]

    formData.value = {
        supplier: item.supplier,
        payment_terms: item.payment_terms,
        attachments: item.attachments,
        meqs_supplier_items: item.meqs_supplier_items
    }

    console.log('formData.value', formData.value)

}

function onClickAdd() {
    formIsAdd.value = true
}

function onCloseModal() {
    formData.value = {..._formDataInitial}
    formDataErrors.value = {..._formDataErrorsInitial}
    formData.value.attachments = []
}

function handleFileProcessing(_files: any[]) {

    console.log('_files', _files)

    formData.value.attachments = _files

}

function handleFileRemove(_files: any[]) {
    console.log('handleFileRemove', _files)
}


</script>