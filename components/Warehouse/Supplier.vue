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
                    <td class="text-muted"> {{ item.supplier.name }} </td>
                    <td class="text-muted"> {{ item.payment_terms }} </td>
                    <td class="text-muted">
                        <ul class="list-group list-group-flush">
                            <li v-for="attachment in item.attachments" class="list-group-item">
                                {{ attachment.filename }}
                            </li>
                        </ul>
                    </td>
                    <td>
                        <button @click="removeSupplier(i)" class="btn btn-sm btn-light w-50">
                            <i class="fas fa-trash text-danger"></i>
                        </button>
                        <button @click="editSupplier(i)" class="btn btn-sm btn-light w-50">
                            <i class="fas fa-edit text-primary"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" class="text-center">
                        <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addSupplierModal">
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
                    <h5 class="modal-title text-warning" id="exampleModalLabel">Add Supplier</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label"> Supplier </label> <span class="text-danger">*</span>
                        <client-only>
                            <v-select :options="suppliers" v-model="supplier" label="name"></v-select>
                        </client-only>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Payment Terms <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Attachments <span class="text-danger">*</span>
                        </label>
                        <client-only>
                            <file-pond
                                name="test"
                                ref="filepond"
                                label-idle="Drop files here..."
                                v-bind:allow-multiple="true"
                                accepted-file-types="image/jpeg, image/png"
                                @updatefiles="handleFileProcessing"
                            />
                        </client-only>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Attachments <span class="text-danger">*</span>
                        </label>
                        <input class="form-control" type="file" id="formFile" @change="handleFile">
                    </div>
                </div>
                <div class="modal-footer">
                    <button ref="closeItemModal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-close"></i> Close
                    </button>
                    <button @click="addSupplier()" type="button" class="btn btn-primary">
                        <i class="fas fa-plus-circle"></i> Add Supplier
                    </button>
                </div>
                </div>
            </div>
        </div>


    </div>

</template>


<script setup lang="ts">
import type { CreateMeqsSupplierSubInput, Supplier } from '~/composables/warehouse/meqs/meqs.types';
import vueFilePond from "vue-filepond"
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

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
    }
});


const supplier = ref<Supplier | null>(null)
const files  = ref<File[]>([])
const file  = ref<File>()
const filepond = ref()

function addSupplier() {

}

function editSupplier(indx: number) {

}

function removeSupplier(indx: number) {

}

function onCloseModal() {

}

function handleFileProcessing(_files: File[]) {
    console.log("FilePond succesfully processed file ", files);
    
    for(let file of _files) {
        // @ts-ignore
        console.log('file', file.file)

    }

}

function handleFile(e: Event) {
    console.log('handleFile', e)

    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        console.log('target.files[0]', target.files[0])
    }
}

</script>