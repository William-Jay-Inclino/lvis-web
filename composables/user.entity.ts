
import { USER_STATUS, ROLE } from '~/composables/common.types'

export interface User {
    id: string
    username: string
    status: USER_STATUS
    role: ROLE
    user_employee?: UserEmployee
    permissions?: UserPermissions
}


export interface UserEmployee {
    id: string
    user_id: string
    user: User
    employee_id: string
    employee: Employee
}


export interface UserPermissions {
    canViewSystem: boolean
    canViewWarehouse: boolean
    system: SystemPermissions
    warehouse: WarehousePermissions
}

export interface SystemPermissions {

    // ========= DATA MANAGEMENT ========= 
    canManageAccount?: {
        create?: boolean,
        read?: boolean,
        update?: boolean,
        delete?: boolean,
    },
    canManageClassification?: {
        create?: boolean,
        read?: boolean,
        update?: boolean,
        delete?: boolean,
    },
    canManageDepartment?: {
        create?: boolean,
        read?: boolean,
        update?: boolean,
        delete?: boolean,
    },
    canManageEmployee?: {
        create?: boolean,
        read?: boolean,
        update?: boolean,
        delete?: boolean,
    },

}

export interface WarehousePermissions {

    // ========= PURCHASING ========= 
    canManageCanvass?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageCanvassItem?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageRV?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageRVApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageSPR?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageSPRApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageJO?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageJOApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMEQS?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMEQSApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMEQSSupplier?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMEQSSupplierItem?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMEQSSupplierAttachment?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManagePO?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManagePOApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageRR?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageRRApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageRRItem?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },


    // ========= DATA MANAGEMENT ========= 
    canManageSupplier?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },
    canManageUnit?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },
    canManageVehicle?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },


    // ========= STOCK INVENTORY ========= 
    canManageItem?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },
    canManageItemType?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },
    canManageItemBrand?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },
}

