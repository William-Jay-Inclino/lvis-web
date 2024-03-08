
export enum PENDING_APPROVAL_TYPE {
    RV = 'RV',
    MEQS = 'MEQS',
    PO = 'PO',
    RR = 'RR'
}

export interface PendingApproval {
    id: string
    type: PENDING_APPROVAL_TYPE
    description: string
    // id of either rv, meqs, po, rr
    reference_id: string
    transaction_date: Date
}