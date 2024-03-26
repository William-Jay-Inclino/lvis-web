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