import type { PO } from "../po/po.types";
import type { MeqsSupplierAttachment } from "./meqs-supplier-attachment";
import type { MeqsSupplierItem } from "./meqs-supplier-item";
import type { MEQS } from "./meqs.types";
import type { Supplier, VAT_TYPE } from "~/composables/common.types";

export interface MeqsSupplier {
  id: string;
  meqs?: MEQS;
  supplier: Supplier | null;
  payment_terms: string;
  meqs_supplier_items: MeqsSupplierItem[];
  attachments: MeqsSupplierAttachment[];
  po?: PO


  // set programmatically 
  files?: any[]
  is_referenced?: boolean;
}

export interface CreateMeqsSupplierInput {
  meqs_id: string
  supplier_id: string
  payment_terms: string
  meqs_supplier_items: CreateMeqsSupplierItemInput[]
  attachments: CreateMeqsSupplierAttachmentInput[]
}

export interface CreateMeqsSupplierItemInput {
  canvass_item_id: string
  price: number
  notes: string
  is_awarded: boolean
  vat_type: VAT_TYPE
}

export interface CreateMeqsSupplierAttachmentInput {
  src: string
  filename: string
}

export interface UpdateMeqsSupplierInput {
  payment_terms: string
  meqs_supplier_items: UpdateMeqsSupplierItemInput[]
  attachments: CreateMeqsSupplierAttachmentInput[]
}

export interface UpdateMeqsSupplierItemInput {
  id: string
  price: number
  notes: string
  is_awarded: boolean
  vat_type: VAT_TYPE
}

export interface MutationResponse {
  success: boolean
  msg: string
  data?: MeqsSupplier
}