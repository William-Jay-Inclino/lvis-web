import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { MeqsSupplier } from "../meqs/meqs-supplier";
import type { PoApproverSettings } from "./po-approver.types";
import type { RR } from "../rr/rr.types";

export interface PO {
    id: string;
    meqs_supplier_id: string;
    po_number: string;
    po_date: string;
    notes: string



    // =============== audit fields =============== 

    cancelled_by: string
    created_by: string
    updated_by: string
    cancelled_at: Date
    created_at: Date
    updated_at: Date


    // =============== derived / resolvers =============== 

    meqs_supplier: MeqsSupplier
    rrs: RR[]
    po_approvers: Approver[];
    status: APPROVAL_STATUS;
    is_referenced: boolean
}

export interface CreatePoInput {
    meqs_supplier: MeqsSupplier | null
    approvers: PoApproverSettings[];
    notes: string
}

export interface UpdatePoInput {
    notes: string
}

export interface CreatePoApproverSubInput {
    approver_id: string;
    label: string;
    order: number;

}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: PO
}

export interface FindAllResponse {
    data: PO[]
    totalItems: number
    currentPage: number
    totalPages: number
}