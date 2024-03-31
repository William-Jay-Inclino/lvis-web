import { SERVICES } from "#imports";



export function getAuthUser(): AuthUser {
    const authUserJson = localStorage.getItem('authUser')

    if (!authUserJson) {
        throw console.error('authUser in localstorage not found');
    }

    const authUser = JSON.parse(authUserJson) as AuthUser

    return authUser
}

export function isAdmin(authUser: AuthUser): boolean {

    return authUser.user.role === ROLE.ADMIN

}

export function isAdminOrOwner(createdBy: string, authUser: AuthUser) {

    const isOwner = authUser.user.username === createdBy

    if (isAdmin(authUser) || isOwner) {
        return true
    }

    return false

}

export function canUpdate(authUser: AuthUser, created_by: string) {

    if (isAdmin(authUser)) return true

    return authUser.user.username === created_by
}

export function canCreate(authUser: AuthUser, permission: string, service?: SERVICES) {

    console.log('canCreate', authUser, permission)
    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const _service = (service || SERVICES.WAREHOUSE).toLowerCase()

    // @ts-ignore
    return !!authUser.user.permissions[_service][permission].create

}

export function canDelete(authUser: AuthUser, permission: string, service?: SERVICES) {
    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const _service = (service || SERVICES.WAREHOUSE).toLowerCase()

    // @ts-ignore
    return !!authUser.user.permissions[_service][permission].delete

}

export function canEdit(authUser: AuthUser, permission: string, service?: SERVICES) {
    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const _service = (service || SERVICES.WAREHOUSE).toLowerCase()


    // @ts-ignore
    return !!authUser.user.permissions[_service][permission].update

}

export function canRead(authUser: AuthUser, permission: string, service?: SERVICES) {
    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const _service = (service || SERVICES.WAREHOUSE).toLowerCase()

    // @ts-ignore
    return !!authUser.user.permissions[_service][permission].read

}

export function canViewDetails(authUser: AuthUser, permission: string, service?: SERVICES) {
    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const _service = (service || SERVICES.WAREHOUSE).toLowerCase()

    // @ts-ignore
    return !!authUser.user.permissions[_service][permission].viewDetails

}