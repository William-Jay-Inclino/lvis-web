

export enum USER_STATUS {
    ACTIVE = 1,
    INACTIVE = 2
}

export interface AuthUser {
    user: {
        id: string
        username: string 
        status: USER_STATUS
    }
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