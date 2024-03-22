<template>
    <div>

        <h2 class="text-warning">Warehouse Settings</h2>
        <hr>

        <div class="row">
            <div class="col">
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item" @click="activeHTab = H_TABS.PURCHASING">
                        <a class="nav-link" :class="{ 'active': activeHTab === H_TABS.PURCHASING }"
                            href="#">Purchasing</a>
                    </li>
                    <li class="nav-item" @click="activeHTab = H_TABS.WAREHOUSING">
                        <a class="nav-link" :class="{ 'active': activeHTab === H_TABS.WAREHOUSING }"
                            href="#">Warehousing</a>
                    </li>
                    <li class="nav-item" @click="activeHTab = H_TABS.MOTORPOOL">
                        <a class="nav-link" :class="{ 'active': activeHTab === H_TABS.MOTORPOOL }"
                            href="#">Motorpool</a>
                    </li>
                    <li class="nav-item" @click="activeHTab = H_TABS.PROJECT">
                        <a class="nav-link" :class="{ 'active': activeHTab === H_TABS.PROJECT }" href="#">Project</a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="row pt-3 justify-content-center">
            <div class="col-2">
                <ul class="nav nav-pills flex-column pt-3">
                    <li class="nav-item" @click="activeVTab = V_TABS.RV_APPROVERS">
                        <a class="nav-link" :class="{ 'active': activeVTab === V_TABS.RV_APPROVERS }" href="#">RV</a>
                    </li>
                    <li class="nav-item" @click="activeVTab = V_TABS.SPR_APPROVERS">
                        <a class="nav-link" :class="{ 'active': activeVTab === V_TABS.SPR_APPROVERS }" href="#">SPR</a>
                    </li>
                    <li class="nav-item" @click="activeVTab = V_TABS.JO_APPROVERS">
                        <a class="nav-link" :class="{ 'active': activeVTab === V_TABS.JO_APPROVERS }" href="#">JO</a>
                    </li>
                    <li class="nav-item" @click="activeVTab = V_TABS.MEQS_APPROVERS">
                        <a class="nav-link" :class="{ 'active': activeVTab === V_TABS.MEQS_APPROVERS }"
                            href="#">MEQS</a>
                    </li>
                    <li class="nav-item" @click="activeVTab = V_TABS.PO_APPROVERS">
                        <a class="nav-link" :class="{ 'active': activeVTab === V_TABS.PO_APPROVERS }" href="#">PO</a>
                    </li>
                    <li class="nav-item" @click="activeVTab = V_TABS.RR_APPROVERS">
                        <a class="nav-link" :class="{ 'active': activeVTab === V_TABS.RR_APPROVERS }" href="#">RR</a>
                    </li>
                </ul>
            </div>

            <div class="col-8">
                <div class="pt-3">
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

const enum H_TABS {
    PURCHASING,
    WAREHOUSING,
    MOTORPOOL,
    PROJECT,
}

const enum V_TABS {
    RV_APPROVERS,
    SPR_APPROVERS,
    JO_APPROVERS,
    MEQS_APPROVERS,
    PO_APPROVERS,
    RR_APPROVERS,
}

const activeHTab = ref<H_TABS>(H_TABS.PURCHASING)
const activeVTab = ref<V_TABS>(V_TABS.RV_APPROVERS)


</script>