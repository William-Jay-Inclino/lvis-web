<template>

    <div>

        <div class="table-responsive">
            
            <table class="table table-hover">

                <thead>
                    <tr>
                        <th class="bg-secondary text-white">No.</th>
                        <th class="bg-secondary text-white">Description</th>
                        <th class="bg-secondary text-white">Item Class</th>
                        <th class="bg-secondary text-white">Brand</th>
                        <th class="bg-secondary text-white">Unit</th>
                        <th class="bg-secondary text-white">Quantity </th>
                        <th class="bg-secondary text-white text-center">
                            <i class="fas fa-cog"></i>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item, i in canvassItems">
                        <td class="text-muted"> {{ i + 1 }} </td>
                        <td class="text-muted"> {{ item.item ? `${item.item.code} - ${item.item.name}` : item.description }} </td>
                        <td class="text-muted"> {{ item.item ? 'Stock' : 'Non-Stock' }} </td>
                        <td class="text-muted"> {{ item.brand ? item.brand.name : 'N/A' }} </td>
                        <td class="text-muted"> {{ item.unit ? item.unit.name : 'N/A' }} </td>
                        <td class="text-muted"> {{ item.quantity }} </td>
                        <td class="text-muted text-center">
                            <button @click="removeItem(i)" class="btn btn-sm btn-light w-50">
                                <i class="fas fa-trash text-danger"></i>
                            </button>
                            <button @click="onClickEdit(i)" class="btn btn-sm btn-light w-50" data-bs-toggle="modal" data-bs-target="#canvassItemModal">
                                <i class="fas fa-edit text-primary"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="7" class="text-center">
                            <button @click="onCLickAdd()" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#canvassItemModal">
                                <i class="fas fa-plus-circle"></i> Add Item
                            </button>
                        </td>
                    </tr>
                </tfoot>

            </table>

        </div>

                <!-- Modal -->
        <div class="modal fade" id="canvassItemModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-warning" id="exampleModalLabel">{{ formIsAdd ? 'Add' : 'Edit' }} Item</h5>
                    <button @click="closeModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div class="mb-3">
                        <label class="form-label">
                            Item Class
                        </label>
                        <div class="row">
                            <div class="col">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" :value="true" v-model="itemIsStock" @change="onChangeItemClass">
                                    <label class="form-check-label" for="inlineRadio1">Stock</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" :value="false" v-model="itemIsStock" @change="onChangeItemClass">
                                    <label class="form-check-label" for="inlineRadio2">Non-Stock</label>
                                </div>
                        </div>
                        </div>
                    </div>

                    <div class="mb-3" v-if="itemIsStock">
                        <label class="form-label">
                            Item <span class="text-danger">*</span>
                        </label>
                        <client-only>
                            <v-select :options="items" label="label" v-model="canvassItem.item" @option:selected="onChangeItem" :clearable="false"></v-select>
                        </client-only>
                        <small class="text-danger fst-italic" v-if="canvassItemErrors.item">
                            This field is required
                        </small>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">
                            Description
                        </label>
                        <textarea v-model="canvassItem.description" class="form-control" rows="3" :disabled="itemIsStock"></textarea>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Unit</label>
                        <div v-if="!itemIsStock">
                            <client-only>
                                <v-select :options="units" label="name" v-model="canvassItem.unit"></v-select>
                            </client-only>
                        </div>
                        <div v-else>
                            <input type="text" class="form-control" disabled :value="canvassItem.unit ? canvassItem.unit.name : ''">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Brand</label>
                        <client-only>
                            <v-select :options="brands" label="name" v-model="canvassItem.brand"></v-select>
                        </client-only>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">
                            Quantity <span class="text-danger">*</span>
                        </label>
                        <input type="number" class="form-control" v-model="canvassItem.quantity">
                        <small class="text-danger fst-italic" v-if="canvassItemErrors.quantity">
                            This field is required and quantity must be greater than 0
                        </small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button ref="closeBtnModal" @click="closeModal" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-close"></i> Close
                    </button>
                    <button v-if="formIsAdd" @click="addItem" class="btn btn-primary" :disabled="isAdding">
                        <i class="fas fa-plus-circle"></i> {{ isAdding ? 'Adding...' : 'Add' }} Item
                    </button>
                    <button v-else @click="editItem" class="btn btn-primary" :disabled="isEditing">
                        <i class="fas fa-edit"></i> {{ isEditing ? 'Editing...' : 'Edit' }} Item
                    </button>
                </div>
                </div>
            </div>
        </div>

    </div>

</template>




<script setup lang="ts">
    import type { CanvassItem } from '~/composables/warehouse/canvass/canvass-item.types';
    import { MOBILE_WIDTH } from '~/utils/config';


    const emits = defineEmits(['addItem', 'removeItem', 'editItem']);

    const props = defineProps({
        canvassItems: {
            type: Array as () => CanvassItem[],
            default: () => [],
        },
        brands: {
            type: Array as () => Brand[],
            default: () => [],
        },
        units: {
            type: Array as () => Unit[],
            default: () => [],
        },
        items: {
            type: Array as () => Item[],
            default: () => [],
        },
        isAdding: {
            type: Boolean,
            default: false
        },
        isEditing: {
            type: Boolean,
            default: false
        },
    });


    const isMobile = ref(false)
    const formIsAdd = ref(true)
    const itemIsStock = ref(true)
    const editItemIndx = ref()

    const closeBtnModal = ref<HTMLButtonElement>()

    const _canvassItemErrorsInitial = {
        item: false,
        description: false,
        quantity: false
    }

    const _canvassItemInitial: CanvassItem = {
        id: '',
        canvass_id: '',
        brand: null,
        unit: null,
        item: null,
        description: '',
        quantity: 0
    }
    const canvassItemErrors = ref({..._canvassItemErrorsInitial})

    const canvassItem = ref<CanvassItem>({..._canvassItemInitial})

    onMounted( () => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile)

    })

    function addItem() {

        if(!isValidCanvassItem()) {
            return 
        }

        console.log('adding')

        emits("addItem", canvassItem.value, closeBtnModal.value)

    }

    function removeItem(indx: number) {
        emits("removeItem", indx)
    }

    function editItem() {
        if(!isValidCanvassItem()) {
            return 
        }

        emits("editItem", canvassItem.value, closeBtnModal.value, editItemIndx.value)
    }

    function onCLickAdd() {
        formIsAdd.value = true
    }

    function onClickEdit(indx: number) {
        formIsAdd.value = false
        editItemIndx.value = indx

        const item = props.canvassItems[indx]

        if(item.item) {
            itemIsStock.value = true
        } else {
            itemIsStock.value = false
        }

        canvassItem.value = {...item}

    }

    function closeModal() {
        canvassItem.value = {..._canvassItemInitial}
        canvassItemErrors.value = {..._canvassItemErrorsInitial}
        formIsAdd.value = true
        itemIsStock.value = true 
        editItemIndx.value = undefined
    }

    function onChangeItemClass() {

        if(itemIsStock.value && canvassItem.value.item) {

            canvassItem.value.unit = canvassItem.value.item.unit || null
            canvassItem.value.description = canvassItem.value.item.description

            
        } else {
            canvassItem.value.item = null       
            canvassItem.value.description = ''
            canvassItem.value.unit = null     
        }

    }

    function onChangeItem() {

        if(!canvassItem.value.item) return

        canvassItem.value.description = canvassItem.value.item.description
        canvassItem.value.unit = canvassItem.value.item.unit || null 

    }


    // ======================== UTILS ======================== 

    function isValidCanvassItem(): boolean {

        canvassItemErrors.value = {..._canvassItemErrorsInitial}

        // description is required if class is non stock
        if(!itemIsStock.value && canvassItem.value.description.trim() === '') {
            canvassItemErrors.value.description = true
        }

        if(!canvassItem.value.quantity) {
            canvassItemErrors.value.quantity = true
        }else if(canvassItem.value.quantity <= 0) {
            canvassItemErrors.value.quantity = true
        }

        // item is required if class is stock
        if(itemIsStock.value && !canvassItem.value.item) {
            canvassItemErrors.value.item = true
        }

        const hasError = Object.values(canvassItemErrors.value).includes(true);

        if(hasError) {
            return false 
        }

        return true

    }

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }

</script>