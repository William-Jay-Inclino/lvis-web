import type { REQUEST_TYPE, APPROVAL_STATUS, VAT_TYPE } from "~/composables/common.types";
import type { RV } from "../rv/rv.types";
import type { CanvassItem } from "../canvass/canvass-item.types";


export interface MEQS {
    id: string;
    rv: RV | null;
    meqs_number: string;
    request_type: REQUEST_TYPE;
    meqs_date: string;
    notes: string;
    status: APPROVAL_STATUS;
    meqs_approvers: Approver[];
    meqs_suppliers: MeqsSupplier[];
    is_deleted: boolean;
    is_cancelled: boolean;
}



export interface MeqsSupplier {
  id: string;
  meqs: MEQS;
  supplier: Supplier;
  payment_terms: string;
  is_referenced: boolean;
  meqs_supplier_items: MeqsSupplierItem[];
  attachments: MeqsSupplierAttachment[];
}


export interface Supplier {
    id: string;
    name: string;
    contact: string;
    is_deleted: boolean;
}



export interface MeqsSupplierItem {
    id: string;
    meqs_supplier: MeqsSupplier;
    canvass_item: CanvassItem;
    price: number;
    notes?: string | null;
    is_awarded: boolean;
    vat_type: VAT_TYPE;
}



export interface MeqsSupplierAttachment {
    id: string;
    meqs_supplier_id: string;
    src: string;
  }