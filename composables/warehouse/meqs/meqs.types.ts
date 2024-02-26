import type { APPROVAL_STATUS, VAT_TYPE, Approver } from "~/composables/common.types";
import type { RV } from "../rv/rv.types";
import type { CanvassItem } from "../canvass/canvass-item.types";
import type { Canvass } from "../canvass/canvass.types";


export interface MEQS {
    id: string;
    rv: RV | null;
    meqs_number: string;
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
  vat_type: VAT_TYPE,
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
  meqs_date: string;
  approvers: MeqsApproverSettings[];
  meqs_suppliers: CreateMeqsSupplierSubInput[];
}

export interface CreateMeqsSupplierSubInput {
  supplier: Supplier | null;
  payment_terms: string;
  meqs_supplier_items: CreateMeqsSupplierItemSubInput[]; 
  attachments: any[]; 
  vat: {
    value: VAT_TYPE,
    label: string
  } | null;
}

export interface CreateMeqsSupplierItemSubInput {
  canvass_item: CanvassItem;
  price: number;
  notes: string;
  is_awarded: boolean;

  // these fields are used in forms
  invalidPrice?: boolean 
  meqsSupplier?: CreateMeqsSupplierSubInput
}

export interface CreateMeqsSupplierAttachmentSubInput {
  file: File;
}

export interface CanvassItemWithSuppliers {
  canvassItem: CanvassItem;
  lowestPriceItem: CreateMeqsSupplierItemSubInput
  awardedItem: CreateMeqsSupplierItemSubInput
}

export interface MeqsApproverSettings {
  approver_id: string,
  approver: Employee | null
  approver_proxy_id?: string | null
  approver_proxy?: Employee | null
  label: string
  order: number
}

export interface MutationResponse {
  success: boolean 
  msg: string 
  data?: MEQS
}