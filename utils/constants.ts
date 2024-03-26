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
    CANVASS = 'CANVASS',
    RV = 'RV',
    SPR = 'SPR',
    JO = 'JO',
    MEQS = 'MEQS',
    PO = 'PO',
    RR = 'RR',
}

export enum ROUTES {

    // =======================  CANVASS ======================= 
    CANVASS_INDEX = `${SERVICES.WAREHOUSE}_CANVASS_INDEX`,
    CANVASS_CREATE = `${SERVICES.WAREHOUSE}_CANVASS_CREATE`,
    CANVASS_UPDATE = `${SERVICES.WAREHOUSE}_CANVASS_UPDATE`,
    CANVASS_VIEW = `${SERVICES.WAREHOUSE}_CANVASS_VIEW`,

    // =======================  CANVASS ======================= 
    RV_INDEX = `${SERVICES.WAREHOUSE}_RV_INDEX`,
    RV_CREATE = `${SERVICES.WAREHOUSE}_RV_CREATE`,
    RV_UPDATE = `${SERVICES.WAREHOUSE}_RV_UPDATE`,
    RV_VIEW = `${SERVICES.WAREHOUSE}_RV_VIEW`,

    // =======================  JO ======================= 
    JO_INDEX = `${SERVICES.WAREHOUSE}_JO_INDEX`,
    JO_CREATE = `${SERVICES.WAREHOUSE}_JO_CREATE`,
    JO_UPDATE = `${SERVICES.WAREHOUSE}_JO_UPDATE`,
    JO_VIEW = `${SERVICES.WAREHOUSE}_JO_VIEW`,
}