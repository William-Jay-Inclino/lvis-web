import type { WarehousePermissions } from "~/composables/user.entity"
import { ROUTES } from "~/utils/constants"

export default defineNuxtRouteMiddleware((to, from) => {

    if (process.client) {

        const authUser = getAuthUser()

        if (isAdmin(authUser)) return

        if (!authUser.user.permissions) return redirectTo401Page()

        const isWarehouseService = to.name?.toString().includes(SERVICES.WAREHOUSE)

        if (isWarehouseService) {

            const permissions = authUser.user.permissions.warehouse
            if (!permissions) return redirectTo401Page()


            const isCanvassModule = to.name?.toString().includes(MODULES.CANVASS)
            const isRVModule = to.name?.toString().includes(MODULES.RV)
            const isJOModule = to.name?.toString().includes(MODULES.JO)


            if (isCanvassModule && !canAccessCanvass(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

            if (isRVModule && !canAccessRV(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

            if (isJOModule && !canAccessJO(to.name as ROUTES, permissions)) {
                return redirectTo401Page()
            }

        }


    }
})


function redirectTo401Page() {
    return window.location.href = '/error/401'
}


function canAccessCanvass(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessCanvass', route, permissions)

    if (!permissions.canManageCanvass) return false

    const canAccessIndex = (route === ROUTES.CANVASS_INDEX && permissions.canManageCanvass.search)
    const canAccessCreate = (route === ROUTES.CANVASS_CREATE && permissions.canManageCanvass.create)
    const canAccessView = true

    if (canAccessIndex) return true
    if (canAccessCreate) return true
    if (canAccessView) return true

    return false

}


function canAccessRV(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessRV', route, permissions)

    if (!permissions.canManageRV) return false

    const canAccessIndex = (route === ROUTES.RV_INDEX && permissions.canManageRV.search)
    const canAccessCreate = (route === ROUTES.RV_CREATE && permissions.canManageRV.create)
    const canAccessView = true

    if (canAccessIndex) return true
    if (canAccessCreate) return true
    if (canAccessView) return true

    return false

}



function canAccessJO(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessJO', route, permissions)

    if (!permissions.canManageJO) return false

    const canAccessIndex = (route === ROUTES.RV_INDEX && permissions.canManageJO.search)
    const canAccessCreate = (route === ROUTES.RV_CREATE && permissions.canManageJO.create)
    const canAccessView = true

    if (canAccessIndex) return true
    if (canAccessCreate) return true
    if (canAccessView) return true

    return false

}