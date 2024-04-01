

export interface Employee {
    id: string
    firstname: string
    middlename: string
    lastname: string

    // derived / resolvers 

    // is_approver?: boolean
    pending_approvals?: PendingApproval[]
    total_pending_approvals?: number
}

export interface FindAllResponse {
    data: Employee[]
    totalItems: number
    currentPage: number
    totalPages: number
}

export interface CreateEmployeeInput {
    firstname: string
    middlename: string
    lastname: string
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Employee
}

export enum PENDING_APPROVAL_TYPE {
    RV = 'RV',
    SPR = 'SPR',
    JO = 'JO',
    MEQS = 'MEQS',
    PO = 'PO',
    RR = 'RR'
}

export interface PendingApproval {
    id: string
    type: PENDING_APPROVAL_TYPE
    description: string
    reference_id: string
    transaction_date: Date

}