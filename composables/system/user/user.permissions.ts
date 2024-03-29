import type { SystemPermissions, UserPermissions, WarehousePermissions } from "./user.types"





export const systemPermissions: SystemPermissions = {

    // ========= DATA MANAGEMENT ========= 
    canManageAccount: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageClassification: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageDepartment: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageEmployee: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
}


export const warehousePermissions: WarehousePermissions = {

    // ========= PURCHASING ========= 
    canManageCanvass: {
        create: false,
        search: false,
        viewDetails: false
    },
    canManageRV: {
        create: false,
        search: false,
        viewDetails: false
    },
    canManageSPR: {
        create: false,
        search: false,
        viewDetails: false
    },
    canManageJO: {
        create: false,
        search: false,
        viewDetails: false
    },
    canManageMEQS: {
        create: false,
        search: false,
        viewDetails: false
    },
    canManagePO: {
        create: false,
        search: false,
        viewDetails: false
    },
    canManageRR: {
        create: false,
        search: false,
        viewDetails: false
    },


    // ========= DATA MANAGEMENT ========= 
    canManageSupplier: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageUnit: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageVehicle: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },


    // ========= STOCK INVENTORY ========= 
    canManageItem: {
        create: false,
        search: false,
        viewDetails: false,
        update: false,
        delete: false,
    },
    canManageItemType: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageItemBrand: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
}

export const permissions: UserPermissions = {
    canViewSystem: false,
    canViewWarehouse: false,
    system: systemPermissions,
    warehouse: warehousePermissions
}


