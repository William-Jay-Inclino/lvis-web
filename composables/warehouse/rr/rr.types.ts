import type { Employee } from "~/composables/common.types";
import type { PO } from "../po/po.types";
import type { RrApproverSettings } from "./rr-approver.types";
import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { RrItem } from "./rr-item.types";

export interface RR {
  id: string;
  po_id: string;
  rr_number: string;
  rr_date: Date;
  received_by_id: string;
  canceller_id: string;
  date_cancelled: Date;
  invoice_number: string;
  delivery_number: string;
  notes: string;
  delivery_charge: number;
  created_at: Date;
  updated_at: Date;
  po: PO;
  is_deleted: boolean;
  is_cancelled: boolean;
  status: APPROVAL_STATUS;

  rr_approvers: Approver[];
  rr_items: RrItem[]

  received_by: Employee;
}



export interface CreateRrInput {
    po: PO | null;
    received_by: Employee | null;
    invoice_number: string;
    delivery_number: string;
    notes: string;
    delivery_charge: number;
    approvers: RrApproverSettings[];
    rr_items: RrItem[];
}

export interface UpdateRrInput {
    received_by: Employee | null;
    invoice_number: string;
    delivery_number: string;
    notes: string;
    delivery_charge: number;
}

// export interface CreateRRItemSubInput {
//     item: Item | null;
//     item_brand: Brand | null;
//     unit: Unit | null;
//     item_class: ITEM_CLASS
//     quantity_delivered: number;
//     quantity_accepted: number;
//     description: string;
//     vat: {
//         value: VAT_TYPE,
//         label: string
//     }
//     gross_price: number
//     net_price: number

// }



export interface MutationResponse {
    success: boolean 
    msg: string 
    data?: RR
}

export interface FindAllResponse {
    data: RR[]
    totalItems: number
    currentPage: number
    totalPages: number
}