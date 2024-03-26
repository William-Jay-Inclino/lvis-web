import { DEPARTMENT_STATUS } from "~/composables/common.types"

export const approvalStatus = {
    [APPROVAL_STATUS.PENDING]: {
        value: APPROVAL_STATUS.PENDING,
        label: 'Pending',
        color: 'orange',
    },
    [APPROVAL_STATUS.APPROVED]: {
        value: APPROVAL_STATUS.APPROVED,
        label: 'Approved',
        color: 'success',
    },
    [APPROVAL_STATUS.DISAPPROVED]: {
        value: APPROVAL_STATUS.DISAPPROVED,
        label: 'Disapproved',
        color: 'danger',
    },
    [APPROVAL_STATUS.CANCELLED]: {
        value: APPROVAL_STATUS.CANCELLED,
        label: 'Cancelled',
        color: 'warning',
    },
}

export const departmentStatus = {
    [DEPARTMENT_STATUS.ACTIVE]: {
        value: DEPARTMENT_STATUS.ACTIVE,
        label: 'Active',
        color: 'success',
    },
    [DEPARTMENT_STATUS.INACTIVE]: {
        value: DEPARTMENT_STATUS.INACTIVE,
        label: 'Inactive',
        color: 'danger',
    },
}

export const VAT = {
    [VAT_TYPE.NONE]: {
        value: VAT_TYPE.NONE,
        label: 'None'
    },
    [VAT_TYPE.INC]: {
        value: VAT_TYPE.INC,
        label: 'INC'
    },
    [VAT_TYPE.EXC]: {
        value: VAT_TYPE.EXC,
        label: 'EXC'
    }
}

export const itemClass = {
    [ITEM_CLASS.NON_STOCK]: {
        value: ITEM_CLASS.NON_STOCK,
        label: 'Non-Stock'
    },
    [ITEM_CLASS.STOCK]: {
        value: ITEM_CLASS.STOCK,
        label: 'Stock'
    }
}

export const itemTransaction = {
    [ITEM_TRANSACTION_TYPE.STOCK_IN]: {
        value: ITEM_TRANSACTION_TYPE.STOCK_IN,
        label: 'Stock In'
    },
    [ITEM_TRANSACTION_TYPE.STOCK_OUT]: {
        value: ITEM_TRANSACTION_TYPE.STOCK_OUT,
        label: 'Stock Out'
    }
}

export const NOTE_OPTIONS = [
    'Design',
    'Features',
    'Performance',
    'Brand',
    'Durability',
    'Reliability',
    'Convenience',
    'Comfort',
    'Tradition',
    'Proven and Tested'
]

export enum SERVICES {
    WAREHOUSE = 'WAREHOUSE',
    SYSTEM = 'SYSTEM'
}

export enum MODULES {

    // ==============================================   SYSTEM ============================================== 
    EMPLOYEE = 'EMPLOYEE',
    SETTINGS = 'SETTINGS',
    ACCOUNT = 'ACCOUNT',
    CLASSIFICATION = 'CLASSIFICATION',
    DEPARTMENT = 'DEPARTMENT',
    PENDINGS = 'PENDINGS',

    // ==============================================   WAREHOUSE ============================================== 

    // =======================  PURCHASING ======================= 
    CANVASS = 'CANVASS',
    RV = 'RV',
    SPR = 'SPR',
    JO = 'JO',
    MEQS = 'MEQS',
    PO = 'PO',
    RR = 'RR',

    // =======================  DATA MANAGEMENT ======================= 
    SUPPLIER = 'SUPPLIER',
    UNIT = 'UNIT',
    VEHICLE = 'VEHICLE',

    // =======================  STOCK INVENTORY ======================= 
    ITEM = 'ITEM',
    ITEM_BRAND = 'ITEM_BRAND',
    ITEM_TYPE = 'ITEM_TYPE',


}

export enum ROUTES {

    // ==============================================   WAREHOUSE ============================================== 

    // =======================  CANVASS ======================= 
    CANVASS_INDEX = `${SERVICES.WAREHOUSE}_CANVASS_INDEX`,
    CANVASS_CREATE = `${SERVICES.WAREHOUSE}_CANVASS_CREATE`,
    CANVASS_UPDATE = `${SERVICES.WAREHOUSE}_CANVASS_UPDATE`,
    CANVASS_VIEW = `${SERVICES.WAREHOUSE}_CANVASS_VIEW`,

    // =======================  RV ======================= 
    RV_INDEX = `${SERVICES.WAREHOUSE}_RV_INDEX`,
    RV_CREATE = `${SERVICES.WAREHOUSE}_RV_CREATE`,
    RV_UPDATE = `${SERVICES.WAREHOUSE}_RV_UPDATE`,
    RV_VIEW = `${SERVICES.WAREHOUSE}_RV_VIEW`,

    // =======================  JO ======================= 
    JO_INDEX = `${SERVICES.WAREHOUSE}_JO_INDEX`,
    JO_CREATE = `${SERVICES.WAREHOUSE}_JO_CREATE`,
    JO_UPDATE = `${SERVICES.WAREHOUSE}_JO_UPDATE`,
    JO_VIEW = `${SERVICES.WAREHOUSE}_JO_VIEW`,

    // =======================  SPR ======================= 
    SPR_INDEX = `${SERVICES.WAREHOUSE}_SPR_INDEX`,
    SPR_CREATE = `${SERVICES.WAREHOUSE}_SPR_CREATE`,
    SPR_UPDATE = `${SERVICES.WAREHOUSE}_SPR_UPDATE`,
    SPR_VIEW = `${SERVICES.WAREHOUSE}_SPR_VIEW`,

    // =======================  MEQS ======================= 
    MEQS_INDEX = `${SERVICES.WAREHOUSE}_MEQS_INDEX`,
    MEQS_CREATE = `${SERVICES.WAREHOUSE}_MEQS_CREATE`,
    MEQS_UPDATE = `${SERVICES.WAREHOUSE}_MEQS_UPDATE`,
    MEQS_VIEW = `${SERVICES.WAREHOUSE}_MEQS_VIEW`,

    // =======================  PO ======================= 
    PO_INDEX = `${SERVICES.WAREHOUSE}_PO_INDEX`,
    PO_CREATE = `${SERVICES.WAREHOUSE}_PO_CREATE`,
    PO_UPDATE = `${SERVICES.WAREHOUSE}_PO_UPDATE`,
    PO_VIEW = `${SERVICES.WAREHOUSE}_PO_VIEW`,

    // =======================  RR ======================= 
    RR_INDEX = `${SERVICES.WAREHOUSE}_RR_INDEX`,
    RR_CREATE = `${SERVICES.WAREHOUSE}_RR_CREATE`,
    RR_UPDATE = `${SERVICES.WAREHOUSE}_RR_UPDATE`,
    RR_VIEW = `${SERVICES.WAREHOUSE}_RR_VIEW`,

    // =======================  SUPPLIER ======================= 
    SUPPLIER_INDEX = `${SERVICES.WAREHOUSE}_SUPPLIER_INDEX`,
    SUPPLIER_CREATE = `${SERVICES.WAREHOUSE}_SUPPLIER_CREATE`,
    SUPPLIER_UPDATE = `${SERVICES.WAREHOUSE}_SUPPLIER_UPDATE`,
    SUPPLIER_VIEW = `${SERVICES.WAREHOUSE}_SUPPLIER_VIEW`,

    // =======================  UNIT ======================= 
    UNIT_INDEX = `${SERVICES.WAREHOUSE}_UNIT_INDEX`,
    UNIT_CREATE = `${SERVICES.WAREHOUSE}_UNIT_CREATE`,
    UNIT_UPDATE = `${SERVICES.WAREHOUSE}_UNIT_UPDATE`,
    UNIT_VIEW = `${SERVICES.WAREHOUSE}_UNIT_VIEW`,

    // =======================  VEHICLE ======================= 
    VEHICLE_INDEX = `${SERVICES.WAREHOUSE}_VEHICLE_INDEX`,
    VEHICLE_CREATE = `${SERVICES.WAREHOUSE}_VEHICLE_CREATE`,
    VEHICLE_UPDATE = `${SERVICES.WAREHOUSE}_VEHICLE_UPDATE`,
    VEHICLE_VIEW = `${SERVICES.WAREHOUSE}_VEHICLE_VIEW`,

    // =======================  ITEM ======================= 
    ITEM_INDEX = `${SERVICES.WAREHOUSE}_ITEM_INDEX`,
    ITEM_CREATE = `${SERVICES.WAREHOUSE}_ITEM_CREATE`,
    ITEM_UPDATE = `${SERVICES.WAREHOUSE}_ITEM_UPDATE`,
    ITEM_VIEW = `${SERVICES.WAREHOUSE}_ITEM_VIEW`,

    // =======================  ITEM BRAND ======================= 
    ITEM_BRAND_INDEX = `${SERVICES.WAREHOUSE}_ITEM_BRAND_INDEX`,
    ITEM_BRAND_CREATE = `${SERVICES.WAREHOUSE}_ITEM_BRAND_CREATE`,
    ITEM_BRAND_UPDATE = `${SERVICES.WAREHOUSE}_ITEM_BRAND_UPDATE`,
    ITEM_BRAND_VIEW = `${SERVICES.WAREHOUSE}_ITEM_BRAND_VIEW`,

    // =======================  ITEM ======================= 
    ITEM_TYPE_INDEX = `${SERVICES.WAREHOUSE}_ITEM_TYPE_INDEX`,
    ITEM_TYPE_CREATE = `${SERVICES.WAREHOUSE}_ITEM_TYPE_CREATE`,
    ITEM_TYPE_UPDATE = `${SERVICES.WAREHOUSE}_ITEM_TYPE_UPDATE`,
    ITEM_TYPE_VIEW = `${SERVICES.WAREHOUSE}_ITEM_TYPE_VIEW`,
}