import type { WarehousePermissions } from "~/composables/user.entity"
import { ROUTES } from "~/utils/constants"

const ROUTE_EXEMPTIONS = [
    ROUTES.CANVASS_UPDATE, ROUTES.CANVASS_VIEW,
    ROUTES.JO_UPDATE, ROUTES.JO_VIEW,
    ROUTES.RV_UPDATE, ROUTES.RV_VIEW,
    ROUTES.SPR_UPDATE, ROUTES.SPR_VIEW,
    ROUTES.MEQS_UPDATE, ROUTES.MEQS_VIEW,
    ROUTES.PO_UPDATE, ROUTES.PO_VIEW,
    ROUTES.RR_UPDATE, ROUTES.RR_VIEW,
]

export default defineNuxtRouteMiddleware((to, from) => {

    if (process.client) {

        const authUser = getAuthUser()

        if (isAdmin(authUser)) return

        if (ROUTE_EXEMPTIONS.includes(to.name as ROUTES)) return

        if (!authUser.user.permissions) return redirectTo401Page()

        const isWarehouseService = to.name?.toString().includes(SERVICES.WAREHOUSE)

        if (isWarehouseService) {

            const permissions = authUser.user.permissions.warehouse
            if (!permissions) return redirectTo401Page()


            const isCanvassModule = to.name?.toString().includes(MODULES.CANVASS)
            const isRVModule = to.name?.toString().includes(MODULES.RV)
            const isSPRModule = to.name?.toString().includes(MODULES.SPR)
            const isJOModule = to.name?.toString().includes(MODULES.JO)
            const isMEQSModule = to.name?.toString().includes(MODULES.MEQS)
            const isPOModule = to.name?.toString().includes(MODULES.PO)
            const isRRModule = to.name?.toString().includes(MODULES.RR)

            const isSupplierModule = to.name?.toString().includes(MODULES.SUPPLIER)
            const isUnitModule = to.name?.toString().includes(MODULES.UNIT)
            const isVehicleModule = to.name?.toString().includes(MODULES.VEHICLE)

            const isItemModule = to.name?.toString().includes(MODULES.ITEM)
            const isItemBrandModule = to.name?.toString().includes(MODULES.ITEM_BRAND)
            const isItemTypeModule = to.name?.toString().includes(MODULES.ITEM_TYPE)


            if (isCanvassModule && !canAccessCanvass(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

            if (isRVModule && !canAccessRV(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

            if (isSPRModule && !canAccessSPR(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

            if (isJOModule && !canAccessJO(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

            if (isMEQSModule && !canAccessMEQS(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

            if (isPOModule && !canAccessPO(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

            if (isRRModule && !canAccessRR(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

            if (isSupplierModule && !canAccessSupplier(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

            if (isUnitModule && !canAccessUnit(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

            if (isVehicleModule && !canAccessVehicle(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

            if (isItemModule && !canAccessItem(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

            if (isItemBrandModule && !canAccessItemBrand(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

            if (isItemTypeModule && !canAccessItemType(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

        }


    }
})


function redirectTo401Page() {
    console.log('redirectTo401Page()')
    return window.location.href = '/error/401'
}


function canAccessCanvass(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessCanvass', route, permissions)

    if (!permissions.canManageCanvass) return false

    if (route === ROUTES.CANVASS_INDEX) return !!permissions.canManageCanvass.search
    if (route === ROUTES.CANVASS_CREATE) return !!permissions.canManageCanvass.create


    return false

}

function canAccessRV(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessRV', route, permissions)

    if (!permissions.canManageRV) return false

    if (route === ROUTES.RV_INDEX) return !!permissions.canManageRV.search
    if (route === ROUTES.RV_CREATE) return !!permissions.canManageRV.create


    return true

}

function canAccessSPR(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessSPR', route, permissions)

    if (!permissions.canManageSPR) return false

    if (route === ROUTES.SPR_INDEX) return !!permissions.canManageSPR.search
    if (route === ROUTES.SPR_CREATE) return !!permissions.canManageSPR.create


    return true

}

function canAccessJO(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessJO', route, permissions)

    if (!permissions.canManageJO) return false

    if (route === ROUTES.JO_INDEX) return !!permissions.canManageJO.search
    if (route === ROUTES.JO_CREATE) return !!permissions.canManageJO.create


    return true

}

function canAccessMEQS(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessMEQS', route, permissions)

    if (!permissions.canManageMEQS) return false

    if (route === ROUTES.MEQS_INDEX) return !!permissions.canManageMEQS.search
    if (route === ROUTES.MEQS_CREATE) return !!permissions.canManageMEQS.create


    return true

}

function canAccessPO(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessPO', route, permissions)

    if (!permissions.canManagePO) return false

    if (route === ROUTES.PO_INDEX) return !!permissions.canManagePO.search
    if (route === ROUTES.PO_CREATE) return !!permissions.canManagePO.create


    return true

}

function canAccessRR(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessRR', route, permissions)

    if (!permissions.canManageRR) return false

    if (route === ROUTES.RR_INDEX) return !!permissions.canManageRR.search
    if (route === ROUTES.RR_CREATE) return !!permissions.canManageRR.create


    return true

}

function canAccessSupplier(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessSupplier', route, permissions)

    if (!permissions.canManageSupplier) return false

    if (route === ROUTES.SUPPLIER_INDEX) return !!permissions.canManageSupplier.search
    if (route === ROUTES.SUPPLIER_CREATE) return !!permissions.canManageSupplier.create
    if (route === ROUTES.SUPPLIER_UPDATE) return !!permissions.canManageSupplier.update
    if (route === ROUTES.SUPPLIER_VIEW) return !!permissions.canManageSupplier.viewDetails


    return true

}

function canAccessUnit(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessUnit', route, permissions)

    if (!permissions.canManageUnit) return false

    if (route === ROUTES.UNIT_INDEX) return !!permissions.canManageUnit.search
    if (route === ROUTES.UNIT_CREATE) return !!permissions.canManageUnit.create
    if (route === ROUTES.UNIT_UPDATE) return !!permissions.canManageUnit.update
    if (route === ROUTES.UNIT_VIEW) return !!permissions.canManageUnit.viewDetails


    return true

}

function canAccessVehicle(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessVehicle', route, permissions)

    if (!permissions.canManageVehicle) return false

    if (route === ROUTES.VEHICLE_INDEX) return !!permissions.canManageVehicle.search
    if (route === ROUTES.VEHICLE_CREATE) return !!permissions.canManageVehicle.create
    if (route === ROUTES.VEHICLE_UPDATE) return !!permissions.canManageVehicle.update
    if (route === ROUTES.VEHICLE_VIEW) return !!permissions.canManageVehicle.viewDetails


    return true

}

function canAccessItem(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessItem', route, permissions)

    if (!permissions.canManageItem) return false

    if (route === ROUTES.ITEM_INDEX) return !!permissions.canManageItem.search
    if (route === ROUTES.ITEM_CREATE) return !!permissions.canManageItem.create
    if (route === ROUTES.ITEM_UPDATE) return !!permissions.canManageItem.update
    if (route === ROUTES.ITEM_VIEW) return !!permissions.canManageItem.viewDetails


    return true

}

function canAccessItemBrand(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessItemBrand', route, permissions)

    if (!permissions.canManageItemBrand) return false

    if (route === ROUTES.ITEM_BRAND_INDEX) return !!permissions.canManageItemBrand.search
    if (route === ROUTES.ITEM_BRAND_CREATE) return !!permissions.canManageItemBrand.create
    if (route === ROUTES.ITEM_BRAND_UPDATE) return !!permissions.canManageItemBrand.update
    if (route === ROUTES.ITEM_BRAND_VIEW) return !!permissions.canManageItemBrand.viewDetails


    return true

}

function canAccessItemType(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessItemType', route, permissions)

    if (!permissions.canManageItemType) return false

    if (route === ROUTES.ITEM_TYPE_INDEX) return !!permissions.canManageItemType.search
    if (route === ROUTES.ITEM_TYPE_CREATE) return !!permissions.canManageItemType.create
    if (route === ROUTES.ITEM_TYPE_UPDATE) return !!permissions.canManageItemType.update
    if (route === ROUTES.ITEM_TYPE_VIEW) return !!permissions.canManageItemType.viewDetails


    return true

}