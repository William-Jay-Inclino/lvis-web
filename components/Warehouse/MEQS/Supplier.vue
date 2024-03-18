<template>

    <div>

        <small class="fst-italic text-muted">
            Note: Minimum of 3 and Maximum of 5 suppliers
        </small>

        <div class="table-responsive mt-2">
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
                            <div v-if="item.attachments.length === 0">
                                N/A
                            </div>
                            <div v-else>
                                <ul class="list-group">
                                    <li class="list-group-item" v-for="attachment in item.attachments"> {{ attachment.filename }} </li>
                                </ul>
                            </div>
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
                        <td colspan="5" class="text-center">
                            <button @click="onClickAdd()" type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addSupplierModal">
                                <i class="fas fa-plus-circle"></i> Add Supplier
                            </button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>


        <!-- Modal -->
        <div class="modal fade" id="addSupplierModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-warning" id="exampleModalLabel">{{ formIsAdd ? 'Add' : 'Edit' }} Supplier</h5>
                    <button @click="onCloseModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div class="row">
                        <div class="col">

                            <div class="mb-3">
                                <label class="form-label"> Supplier </label> <span class="text-danger">*</span>
                                <client-only>
                                    <v-select @option:selected="onChangeSupplier" :options="availableSuppliers" v-model="formData.supplier" label="name"></v-select>
                                </client-only>
                            </div>
                            <div class="mb-3">
                                <label class="form-label"> Vat </label>
                                <input type="text" class="form-control" :value="vat" disabled>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Payment Terms <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="formData.payment_terms">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Attachments <i class="text-muted"></i> 
                                </label>
                                <small class="text-muted fst-italic">(Max files: {{ maxFileLimit }} & Max size per file: 5mb)</small>
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
                            </div>

                            <div v-if="filesHasDuplicate" class="mb-1">

                                <small class="text-danger fst-italic"> Attachment has duplicates </small>

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
                    </div>

                    <div class="h5wrapper mb-3 mt-3" v-show="formData.supplier">
                        <hr class="result">
                            <h6 class="text-warning fst-italic">
                                <i class="fas fa-shopping-cart"></i> Items
                            </h6>
                        <hr class="result">
                    </div>

                    <div class="row" v-show="formData.supplier">
                        <div class="col">

                            <div class="alert alert-info" role="alert">
                                <i class="fas fa-info-circle"></i> 
                                <small class="fst-italic"> If the item is unavailable set the price to -1</small>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-hover table-sm">
                                    <thead>
                                        <tr>
                                            <th width="40%" class="bg-secondary text-white">Item</th>
                                            <th width="30%" class="bg-secondary text-white">
                                                Price <span class="text-danger"> * </span>
                                            </th>
                                            <th width="30%" class="bg-secondary text-white">Vat</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in formData.meqs_supplier_items">
                                            <td class="text-muted"> {{ item.canvass_item.description }} </td>
                                            <td class="text-muted">
                                                <input 
                                                    type="number" 
                                                    class="form-control border border-2"
                                                    @input="onUpdatePrice(item)"
                                                    :class="{ 'border-danger': item.invalidPrice, 'border-success': !item.invalidPrice }"
                                                    v-model="item.price"
                                                >
                                            </td>
                                            <td class="text-muted">
                                                <select class="form-select" v-model="item.vat" disabled>
                                                    <option :value="item" :key="item.value" v-for="item in vatArray">
                                                        {{ item.label }}
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button @click="onCloseModal()" ref="closeSupplierModal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-close"></i> Close
                    </button>
                    <button v-if="formIsAdd" @click="addSupplier()" type="button" class="btn btn-primary" :disabled="!canAddSupplier || isAddingSupplier">
                        <i class="fas fa-plus-circle"></i> {{ isAddingSupplier ? 'Adding' : 'Add' }} Supplier
                    </button>
                    <button v-else @click="editSupplier()" type="button" class="btn btn-primary" :disabled="!canAddSupplier || isEditingSupplier">
                        <i class="fas fa-edit"></i> {{ isEditingSupplier ? 'Editing' : 'Edit' }} Supplier
                    </button>
                </div>
                </div>
            </div>
        </div>


    </div>


</template>


<script setup lang="ts">
import Swal from 'sweetalert2'
import vueFilePond from "vue-filepond"
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import type { CanvassItem } from '~/composables/warehouse/canvass/canvass-item.types';
import { MAX_FILE_SIZE } from '~/utils/config';
import type { MeqsSupplier } from '~/composables/warehouse/meqs/meqs-supplier';
import { VAT } from '~/utils/constants'
import type { MeqsSupplierItem } from '~/composables/warehouse/meqs/meqs-supplier-item';
import type { Supplier } from '~/composables/common.types';

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

const emits = defineEmits(['addSupplier', 'editSupplier', 'removeSupplier']);
    
const props = defineProps({
    // suppliers in the form
    meqs_suppliers: {
        type: Array as () => MeqsSupplier[],
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
    },
    isAddingSupplier: {
        type: Boolean,
        default: false
    },
    isEditingSupplier: {
        type: Boolean,
        default: false
    },
});

const vatArray = ref([
    {
        value: VAT_TYPE.NONE,
        label: VAT[VAT_TYPE.NONE].label
    },
    {
        value: VAT_TYPE.INC,
        label: VAT[VAT_TYPE.INC].label
    },
    {
        value: VAT_TYPE.EXC,
        label: VAT[VAT_TYPE.EXC].label
    }
])


const formIsAdd = ref(true)
const editingIndx = ref(0)

const closeSupplierModal = ref<HTMLButtonElement>()

const _formDataErrorsInitial = {
    supplier: false,
    paymentTerms: false,
    // attachments: false,
    vat: false
}

const _formDataInitial: MeqsSupplier = {
    id: '',
    supplier: null,
    payment_terms: '',
    attachments: [],
    meqs_supplier_items: [],
    files: []
}

const formData = ref({..._formDataInitial})
const formDataErrors = ref({..._formDataErrorsInitial})
const filepond = ref()

const meqs_supplier_items = computed( (): MeqsSupplierItem[] => {

    const clonedCanvassItems = props.canvass_items.map(i => ({ ...i }))

    const items: MeqsSupplierItem[] = []

    const vat = {
        value: VAT_TYPE.NONE,
        label: VAT[VAT_TYPE.NONE].label
    }
    if(formData.value.supplier) {
        vat.value = formData.value.supplier.vat_type
        vat.label = VAT[formData.value.supplier.vat_type].label
    }

    for(let item of clonedCanvassItems) {
        items.push({
            id: '',
            canvass_item: item,
            price: 0.00,
            notes: '',
            is_awarded: false,
            invalidPrice: true, // default is 2 since default price is 0.00
            vat_type: VAT_TYPE.NONE,
            vat
        })
    }

    return items

})

const availableSuppliers = computed( () => {

    const uniqueSuppliers = props.suppliers.filter(supplier1 => !props.meqs_suppliers.some(supplier2 => supplier1.id === supplier2.supplier?.id));

    return uniqueSuppliers

})

const unallowedFiles = computed((): File[] => {
    const _files = formData.value.files;
    return _files!.map(file => file.file).filter(file => file.size > MAX_FILE_SIZE)
});

const canAddSupplier = computed( () => {

    if(!isValidForm()) return false 

    const hasUnallowedFiles = unallowedFiles.value.length !== 0

    if(hasUnallowedFiles) return false 

    if(filesHasDuplicate.value) return false 

    return true

})

const vat = computed( () => {

    if(!formData.value.supplier) return ''

    return VAT[formData.value.supplier.vat_type].label

})

const maxFileLimit = computed( () => props.canvass_items.length)


const filesHasDuplicate = computed( (): boolean => {

    if(!formData.value.files) return false 

    for(let file of formData.value.files) {

        console.log('filename', file.filename)

        console.log('formData.value.files', formData.value.files)

        const x = formData.value.files.filter(i => i.filename === file.filename)

        console.log('x', x)

        if(x.length > 1) {
            return true
        }

    }

    return false 

})


function addSupplier() {

    // if(!isValid()){
    //     return
    // }
    
    if(formData.value.files && formData.value.files.length > 0) {

        formData.value.attachments = formData.value.files.map(i => {
            return {
                id: '',
                meqs_supplier_id: '',
                src: '',
                filename: i.file.name,
            }
        })
    }

    
    console.log('formData', formData.value)

    emits("addSupplier", formData.value)

    closeSupplierModal.value?.click()


}

function editSupplier() {

    if(!isValidForm()) {
        return 
    }

    console.log('formData', formData.value)

    emits("editSupplier", formData.value, editingIndx.value)

    closeSupplierModal.value?.click()

}

function isValidForm(): boolean {

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

    const hasErrorForm = Object.values(formDataErrors.value).includes(true);

    const hasInvalidPrice = formData.value.meqs_supplier_items.find(i => i.invalidPrice) 

    if(hasErrorForm || hasInvalidPrice) {
        return false
    }

    return true
}

function removeSupplier(indx: number) {

    emits('removeSupplier', indx)

    // const item = props.meqs_suppliers[indx]

    // if(!item) return 

    // Swal.fire({
    //     title: "Confirm Deletion",
    //     text: `Are you sure you want to remove ${item.supplier?.name} and its associated items? This action cannot be undone.`,
    //     position: "top",
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonColor: "#e74a3b",
    //     cancelButtonColor: "#6c757d",
    //     confirmButtonText: "Yes, delete it!",
    //     reverseButtons: true,
    // }).then((result) => {
    //     if (result.isConfirmed) {
    //         emits('removeSupplier', indx)
    //     }
    // });

}

function onClickEdit(indx: number) {
    formIsAdd.value = false
    editingIndx.value = indx

    const item = props.meqs_suppliers[indx]

    formData.value = {
        id: item.id,
        supplier: item.supplier,
        payment_terms: item.payment_terms,
        attachments: item.attachments,
        meqs_supplier_items: item.meqs_supplier_items,
    }

    console.log('formData.value', formData.value)

}

function onClickAdd() {
    formIsAdd.value = true
    formData.value.meqs_supplier_items = meqs_supplier_items.value
}

function onCloseModal() {
    formData.value = {..._formDataInitial}
    formDataErrors.value = {..._formDataErrorsInitial}
    formData.value.attachments = []
}

function onUpdatePrice(item: MeqsSupplierItem) {

    if(isInvalidPrice(item.price)) {
        item.invalidPrice = true 
    }else {
        item.invalidPrice = false
    }

}

function handleFileProcessing(_files: any[]) {

    console.log('_files', _files)

    formData.value['files'] = _files

}

function handleFileRemove(_files: any[]) {
    console.log('handleFileRemove', _files)
}

function onChangeSupplier() {
    console.log('onChangeSupplier')

    const supplier = formData.value.supplier

    for(let item of formData.value.meqs_supplier_items) {
        item.vat = {
            value: supplier!.vat_type,
            label: VAT[supplier!.vat_type].label
        }
    }

}

const isInvalidPrice = (price: number): boolean => {

    if(!price) return true

    if(price < -1 || price === 0) {
        return true 
    } else {
        return false
    }
}

</script>