import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { MeqsSupplier } from "../meqs/meqs-supplier";

export interface PO {
  id: string;
  meqs_supplier_id: string;
  po_number: string;
  po_date: string;
  status: APPROVAL_STATUS;
  canceller_id: string;
  meqs_supplier: MeqsSupplier
}




export interface CreatePoInput {
    meqs_supplier_id: string;
    approvers: CreatePoApproverSubInput[];
    notes: string
}

export interface UpdatePoInput {
    notes: string
}


export interface CreatePoApproverSubInput {
    approver_id: string;
    approver_proxy_id?: string | null;
    label: string;
    order: number;

}