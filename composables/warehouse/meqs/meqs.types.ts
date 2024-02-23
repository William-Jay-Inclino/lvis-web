import type { REQUEST_TYPE, APPROVAL_STATUS, VAT_TYPE, Approver } from "~/composables/common.types";
import type { RV } from "../rv/rv.types";
import type { CanvassItem } from "../canvass/canvass-item.types";
import type { Canvass } from "../canvass/canvass.types";


export interface MEQS {
    id: string;
    rv: RV | null;
    meqs_number: string;
    request_type: REQUEST_TYPE;
    meqs_date: string;
    notes: string;
    meqs_approvers: Approver[];
    meqs_suppliers: MeqsSupplier[];
    is_deleted: boolean;
    is_cancelled: boolean;


    // set programmatically

    status: {
        value: APPROVAL_STATUS
        label: string 
        color: string 
    }
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

export interface FindAllResponse {
  data: MEQS[]
  totalItems: number
  currentPage: number
  totalPages: number
}

export interface CreateMeqsInput {
  jo: null;
  rv: RV | null;
  spr: null;
  notes: string;
  request_type: REQUEST_TYPE | null;
  meqs_date: string;
  approvers: Approver[];
  meqs_suppliers: CreateMeqsSupplierSubInput[];
}


export interface CreateMeqsSupplierSubInput {
  supplier: Supplier;
  payment_terms: string;
  meqs_supplier_items: CreateMeqsSupplierItemSubInput[]; 
  attachments: CreateMeqsSupplierAttachmentSubInput[]; 
}



export interface CreateMeqsSupplierItemSubInput {
  canvass: Canvass;
  price: number;
  notes: string;
  is_awarded: boolean;
  vat_type: VAT_TYPE;

}

export interface CreateMeqsSupplierAttachmentSubInput {
  src: string;
  filename: string
}