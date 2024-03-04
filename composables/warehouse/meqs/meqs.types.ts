import type { APPROVAL_STATUS, Approver, VAT_TYPE } from "~/composables/common.types";
import type { RV } from "../rv/rv.types";
import type { CanvassItem } from "../canvass/canvass-item.types";
import type { MeqsSupplier, Supplier } from "./meqs-supplier";


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
    status: APPROVAL_STATUS

    // set programmatically
    hasAvailableSupplier?: boolean
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
  approvers: MeqsApproverSettings[];
  meqs_suppliers: CreateMeqsSupplierSubInput[];
}

export interface CreateMeqsSupplierSubInput {
  supplier: Supplier | null;
  payment_terms: string;
  meqs_supplier_items: CreateMeqsSupplierItemSubInput[]; 
  attachments: any[]; 
}

export interface CreateMeqsSupplierItemSubInput {
  canvass_item: CanvassItem;
  price: number;
  notes: string;
  vat: {
    value: VAT_TYPE,
    label: string
  }
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

export interface UpdateMeqsInput {
  notes: string
}