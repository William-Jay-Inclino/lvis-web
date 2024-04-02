
export enum PENDING_APPROVAL_TYPE {
    RV = 'RV',
    SPR = 'SPR',
    JO = 'JO',
    MEQS = 'MEQS',
    PO = 'PO',
    RR = 'RR'
}

export enum PENDING_TRANSACTION {
    APPROVE = 'Approve',
    DISAPPROVE = 'Disapprove',
}

export interface PendingApproval {
    id: string
    type: PENDING_APPROVAL_TYPE
    description: string
    // id of either rv, meqs, po, rr
    reference_id: string
    transaction_date: Date
}