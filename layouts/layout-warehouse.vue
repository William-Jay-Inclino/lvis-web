<template>

    <div v-if="authUser" id="wrapper">
        <nav class="navbar sticky-top navbar-expand-lg navbar-dark" style="background-color: #1877F2;">
            <div class="container">
                <nuxt-link class="navbar-brand" to="/home">
                    <img style="max-height: 60px;" src="~/assets/img/leyeco-logo2.png" alt="Leyeco V - SYSTEM Logo" class="img-fluid">
                    Leyeco V - WAREHOUSE
                </nuxt-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <!-- Notification icon for small screen -->
                <div v-if="isApprover(authUser)" class="d-lg-none ms-auto me-3 position-relative">
                    <nuxt-link class="text-white position-relative" to="/e-forms/pendings">
                        <i class="fas fa-bell"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {{ totalPendings }}
                        </span>
                    </nuxt-link>
                </div>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <nuxt-link class="nav-link text-white" to="/home">Home</nuxt-link>
                        </li>
                        <li v-if="canViewPurchasing(authUser)" class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Purchasing
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li v-if="canView('canManageCanvass', authUser)"><nuxt-link class="dropdown-item"
                                        to="/warehouse/purchasing/canvass">Canvass</nuxt-link></li>
                                <li v-if="canView('canManageRV', authUser)"><nuxt-link class="dropdown-item"
                                        to="/warehouse/purchasing/rv">RV</nuxt-link>
                                </li>
                                <li v-if="canView('canManageJO', authUser)"><nuxt-link class="dropdown-item"
                                        to="/warehouse/purchasing/jo">JO</nuxt-link>
                                </li>
                                <li v-if="canView('canManageSPR', authUser)"><nuxt-link class="dropdown-item"
                                        to="/warehouse/purchasing/spr">SPR</nuxt-link>
                                </li>
                                <li v-if="canView('canManageMEQS', authUser)"><nuxt-link class="dropdown-item"
                                        to="/warehouse/purchasing/meqs">MEQS</nuxt-link></li>
                                <li v-if="canView('canManagePO', authUser)"><nuxt-link class="dropdown-item"
                                        to="/warehouse/purchasing/po">PO</nuxt-link>
                                </li>
                                <li v-if="canView('canManageRR', authUser)"><nuxt-link class="dropdown-item"
                                        to="/warehouse/purchasing/rr">RR</nuxt-link>
                                </li>
                            </ul>
                        </li>
                        <li v-if="canViewStockInventory(authUser)" class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Stock Inventory
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li v-if="canView('canManageItem', authUser)">
                                    <nuxt-link class="dropdown-item"
                                        to="/warehouse/stock-inventory/item">Item</nuxt-link>
                                </li>
                                <li v-if="canView('canManageItemType', authUser)">
                                    <nuxt-link class="dropdown-item" to="/warehouse/stock-inventory/item-type">Item
                                        Type</nuxt-link>
                                </li>
                            </ul>
                        </li>
                        <li v-if="canViewDataManagement(authUser)" class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Data Management
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li v-if="canView('canManageUnit', authUser)"><nuxt-link class="dropdown-item"
                                        to="/warehouse/data-management/unit">Unit</nuxt-link></li>
                                <li v-if="canView('canManageVehicle', authUser)">
                                    <nuxt-link class="dropdown-item"
                                        to="/warehouse/data-management/vehicle">Vehicle</nuxt-link>
                                </li>
                                <li v-if="canView('canManageSupplier', authUser)">
                                    <nuxt-link class="dropdown-item"
                                        to="/warehouse/data-management/supplier">Supplier</nuxt-link>
                                </li>
                            </ul>
                        </li>
                        <li v-if="isApprover(authUser)" class="nav-item">
                            <nuxt-link class="nav-link text-white position-relative" to="/e-forms/pendings">
                                <i class="fas fa-bell"></i>
                                <span
                                    class="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                                    {{ totalPendings }}
                                </span>
                            </nuxt-link>
                        </li>
                        <li class="nav-item dropdown">
                            <a style="color: #FFFF00;" class="nav-link dropdown-toggle" href="#" id="navbarDropdown"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-user-circle"></i>
                                <span class="fw-bold fst-italic ms-1">

                                    {{ authUser.user.username }}

                                </span>
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="#">Profile</a></li>
                                <li><a class="dropdown-item" href="#">Settings</a></li>
                                <li><a class="dropdown-item" href="#">Activity log</a></li>
                                <li><nuxt-link @click="logout" class="dropdown-item" to="/">Logout</nuxt-link></li>
                            </ul>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>

        <div class="container main-content">

            <div class="mt-3">
                <!-- <slot /> -->
                <NuxtPage />
            </div>

        </div>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Footer />


        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel">
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            <div class="offcanvas-header">
                <img src="/avatar.jpg" alt="Profile Picture" class="img-fluid">
            </div>
            <div class="offcanvas-body d-flex flex-column">
                <ul class="nav flex-column mb-3">
                    <!-- <li class="nav-item">
                        <a class="nav-link" href="#">User Account</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Activity Log</a>
                    </li> -->
                    <li class="nav-item">
                        <a href="javascript:void(0)" class="nav-link text-warning fst-italic fw-bold">
                            {{ authUser.user.username }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <nuxt-link class="nav-link" to="/home">Home</nuxt-link>
                    </li>
                    <li v-if="canViewPurchasing(authUser)" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Purchasing
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li v-if="canView('canManageCanvass', authUser)"><nuxt-link class="dropdown-item"
                                    to="/warehouse/purchasing/canvass">Canvass</nuxt-link>
                            </li>
                            <li v-if="canView('canManageRV', authUser)"><nuxt-link class="dropdown-item"
                                    to="/warehouse/purchasing/rv">RV</nuxt-link></li>
                            <li v-if="canView('canManageJO', authUser)"><nuxt-link class="dropdown-item"
                                    to="/warehouse/purchasing/jo">JO</nuxt-link></li>
                            <li v-if="canView('canManageSPR', authUser)"><nuxt-link class="dropdown-item"
                                    to="/warehouse/purchasing/spr">SPR</nuxt-link></li>
                            <li v-if="canView('canManageMEQS', authUser)"><nuxt-link class="dropdown-item"
                                    to="/warehouse/purchasing/meqs">MEQS</nuxt-link></li>
                            <li v-if="canView('canManagePO', authUser)"><nuxt-link class="dropdown-item"
                                    to="/warehouse/purchasing/po">PO</nuxt-link></li>
                            <li v-if="canView('canManageRR', authUser)"><nuxt-link class="dropdown-item"
                                    to="/warehouse/purchasing/rr">RR</nuxt-link></li>
                        </ul>
                    </li>
                    <li v-if="canViewStockInventory(authUser)" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Stock Inventory
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li v-if="canView('canManageItem', authUser)">
                                <nuxt-link class="dropdown-item" to="/warehouse/stock-inventory/item">Item</nuxt-link>
                            </li>
                            <li v-if="canView('canManageItemType', authUser)">
                                <nuxt-link class="dropdown-item" to="/warehouse/stock-inventory/item-type">Item
                                    Type</nuxt-link>
                            </li>
                        </ul>
                    </li>
                    <li v-if="canViewDataManagement(authUser)" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Data Management
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li v-if="canView('canManageUnit', authUser)"><nuxt-link class="dropdown-item"
                                    to="/warehouse/data-management/unit">Unit</nuxt-link>
                            </li>
                            <li v-if="canView('canManageVehicle', authUser)">
                                <nuxt-link class="dropdown-item"
                                    to="/warehouse/data-management/vehicle">Vehicle</nuxt-link>
                            </li>
                            <li v-if="canView('canManageSupplier', authUser)">
                                <nuxt-link class="dropdown-item"
                                    to="/warehouse/data-management/supplier">Supplier</nuxt-link>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div class="mt-auto d-grid">
                    <nuxt-link @click="logout" class="btn btn-outline-danger btn-block" to="/">Logout</nuxt-link>
                </div>
            </div>
        </div>
    </div>




</template>


<script setup lang="ts">

import { logout } from '~/utils/helpers';

const authUser = ref<AuthUser>()

const router = useRouter()

onMounted(() => {
    authUser.value = getAuthUser()

    console.log('authUser.value.user.permissions', authUser.value.user.permissions)
})

const totalPendings = computed(() => {
    if (!authUser.value) return
    if (authUser.value.user.user_employee?.employee.total_pending_approvals) {
        return authUser.value.user.user_employee?.employee.total_pending_approvals
    }
    return 0
})

const isApprover = (authUser: AuthUser) => {

    const total_pendings = authUser.user.user_employee?.employee.total_pending_approvals
    if (total_pendings && total_pendings > 0) {
        return true
    }

}

function canViewPurchasing(authUser: AuthUser) {

    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const warehousePermissions = authUser.user.permissions.warehouse


    return (
        (!!warehousePermissions.canManageCanvass && warehousePermissions.canManageCanvass.search) ||
        (!!warehousePermissions.canManageRV && warehousePermissions.canManageRV.search) ||
        (!!warehousePermissions.canManageSPR && warehousePermissions.canManageSPR.search) ||
        (!!warehousePermissions.canManageJO && warehousePermissions.canManageJO.search) ||
        (!!warehousePermissions.canManageMEQS && warehousePermissions.canManageMEQS.search) ||
        (!!warehousePermissions.canManagePO && warehousePermissions.canManagePO.search) ||
        (!!warehousePermissions.canManageRR && warehousePermissions.canManageRR.search)
    )
}

function canViewStockInventory(authUser: AuthUser) {

    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const warehousePermissions = authUser.user.permissions.warehouse

    return (
        (!!warehousePermissions.canManageItem && warehousePermissions.canManageItem.search) ||
        (!!warehousePermissions.canManageItemType && warehousePermissions.canManageItemType.read)
    )
}

function canViewDataManagement(authUser: AuthUser) {

    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const warehousePermissions = authUser.user.permissions.warehouse

    return (
        (!!warehousePermissions.canManageUnit && warehousePermissions.canManageUnit.read) ||
        (!!warehousePermissions.canManageVehicle && warehousePermissions.canManageVehicle.read) ||
        (!!warehousePermissions.canManageSupplier && warehousePermissions.canManageSupplier.read)
    )
}

// check first if has module
// check if user can read or search the specified module

function canView(module: string, authUser: AuthUser) {

    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    // @ts-ignore
    if (!authUser.user.permissions.warehouse[module]) return false

    // @ts-ignore
    if (authUser.user.permissions.warehouse[module].read) return true
    // @ts-ignore
    if (authUser.user.permissions.warehouse[module].search) return true

    return false
}

</script>



<style scoped>
.nav-item {
    padding: 0.5rem 1rem;
    transition: background-color 0.3s;
}

.nav-link {
    color: #343a40;
    /* Dark text color */
    transition: color 0.3s;
}

.dropdown-menu {
    background-color: #f8f9fa;
    /* Light grey background for dropdown menu */
}

.dropdown-item {
    color: #343a40;
    transition: color 0.3s;
}
</style>