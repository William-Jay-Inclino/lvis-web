
export enum USER_STATUS {
    ACTIVE = 1,
    INACTIVE = 2
}

export enum DEPARTMENT_STATUS {
    ACTIVE = 1,
    INACTIVE = 2
}

export enum ROLE {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface AuthUser {
    user: User
    access_token: string
}

export enum APPROVAL_STATUS {
    PENDING = 1,
    APPROVED = 2,
    DISAPPROVED = 3,
    CANCELLED = 4,
}

export enum VAT_TYPE {
    NONE = 1,
    INC = 2,
    EXC = 3
}

export enum ITEM_CLASS {
    STOCK = 1,
    NON_STOCK = 2
}

export enum ITEM_TRANSACTION_TYPE {
    STOCK_IN = 1,
    STOCK_OUT = 2
}

export interface Approver {
    id: string
    approver_id: string
    approver: Employee | null
    date_approval: string | null
    notes: string
    status: APPROVAL_STATUS,
    label: string
    order: number
}

export interface CreateApproverInput {
    approver: Employee | null
    label: string
    order: number
}

export interface UpdateApproverInput {
    id: string
    approver: Employee | null
    date_approval: string | null
    notes: string | null
    status: {
        id: APPROVAL_STATUS,
        label: string
    }
    label: string
    order: number
}



export interface Employee {
    id: string
    firstname: string
    middlename: string
    lastname: string
    fullname?: string
}

export interface ItemType {
    id: string;
    name: string;
}

export interface Brand {
    id: string
    name: string
}

export interface Unit {
    id: string
    name: string
}

export interface Classification {
    id: string
    name: string
}

export interface CancelResponse {
    success: boolean
    msg: string
    cancelled_at?: Date
    cancelled_by?: string
}


// export interface Supplier {
//     id: string;
//     name: string;
//     contact: string;
//     vat_type: VAT_TYPE,
// }


export interface Department {
    id: string
    code: string
    name: string
    status: number
}


export interface Vehicle {
    id: string
    name: string
    plate_number: string
}