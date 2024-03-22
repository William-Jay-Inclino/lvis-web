<template>
    <div>

        <h2 class="text-warning">Warehouse Settings</h2>
        <hr>

        <div class="row">
            <div class="col">
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item" @click="rootTab = ROOT_TABS.PURCHASING">
                        <a class="nav-link" :class="{ 'active': rootTab === ROOT_TABS.PURCHASING }" href="#">
                            <i class="fas fa-shopping-cart"></i>
                            Purchasing
                        </a>
                    </li>
                    <li class="nav-item" @click="rootTab = ROOT_TABS.WAREHOUSING">
                        <a class="nav-link" :class="{ 'active': rootTab === ROOT_TABS.WAREHOUSING }" href="#">
                            <i class="fas fa-warehouse"></i>
                            Warehousing
                        </a>
                    </li>
                    <li class="nav-item" @click="rootTab = ROOT_TABS.MOTORPOOL">
                        <a class="nav-link" :class="{ 'active': rootTab === ROOT_TABS.MOTORPOOL }" href="#">

                            <i class="fas fa-car"></i>
                            Motorpool
                        </a>
                    </li>
                    <li class="nav-item" @click="rootTab = ROOT_TABS.PROJECT">
                        <a class="nav-link" :class="{ 'active': rootTab === ROOT_TABS.PROJECT }" href="#">
                            <i class="fas fa-folder-open"></i>
                            Project
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div v-if="rootTab === ROOT_TABS.PURCHASING" class="row pt-5 justify-content-center">
            <div class="col-3 border-end pe-5" style="height: 60vh">
                <ul class="nav nav-pills flex-column">
                    <li class="nav-item">
                        <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">
                            <i class="fas fa-users"></i>
                            Default Approvers
                        </a>
                    </li>
                    <li class="nav-item" @click="purchasingTab = PURCHASING_TABS.RV_APPROVERS">
                        <a class="nav-link" :class="{ 'active': purchasingTab === PURCHASING_TABS.RV_APPROVERS }"
                            href="#">RV</a>
                    </li>
                    <li class="nav-item" @click="purchasingTab = PURCHASING_TABS.SPR_APPROVERS">
                        <a class="nav-link" :class="{ 'active': purchasingTab === PURCHASING_TABS.SPR_APPROVERS }"
                            href="#">SPR</a>
                    </li>
                    <li class="nav-item" @click="purchasingTab = PURCHASING_TABS.JO_APPROVERS">
                        <a class="nav-link" :class="{ 'active': purchasingTab === PURCHASING_TABS.JO_APPROVERS }"
                            href="#">JO</a>
                    </li>
                    <li class="nav-item" @click="purchasingTab = PURCHASING_TABS.MEQS_APPROVERS">
                        <a class="nav-link" :class="{ 'active': purchasingTab === PURCHASING_TABS.MEQS_APPROVERS }"
                            href="#">MEQS</a>
                    </li>
                    <li class="nav-item" @click="purchasingTab = PURCHASING_TABS.PO_APPROVERS">
                        <a class="nav-link" :class="{ 'active': purchasingTab === PURCHASING_TABS.PO_APPROVERS }"
                            href="#">PO</a>
                    </li>
                    <li class="nav-item" @click="purchasingTab = PURCHASING_TABS.RR_APPROVERS">
                        <a class="nav-link" :class="{ 'active': purchasingTab === PURCHASING_TABS.RR_APPROVERS }"
                            href="#">RR</a>
                    </li>
                </ul>
            </div>

            <div class="col-1 vertical-line"></div>

            <div class="col-8">

                <div v-if="purchasingTab === PURCHASING_TABS.RV_APPROVERS">
                    <SystemSettingsApprover />
                </div>

            </div>

        </div>

    </div>
</template>

<script setup lang="ts">

definePageMeta({
    layout: "layout-system"
})

const enum ROOT_TABS {
    PURCHASING,
    WAREHOUSING,
    MOTORPOOL,
    PROJECT,
}

const enum PURCHASING_TABS {
    RV_APPROVERS,
    SPR_APPROVERS,
    JO_APPROVERS,
    MEQS_APPROVERS,
    PO_APPROVERS,
    RR_APPROVERS,
}

const rootTab = ref<ROOT_TABS>(ROOT_TABS.PURCHASING)
const purchasingTab = ref(PURCHASING_TABS.RV_APPROVERS)


</script>



<style scoped>
.vertical-line {
    border-left: 1px solid black;
    height: 100%;
}
</style>