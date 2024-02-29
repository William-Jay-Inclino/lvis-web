import type { PO } from "../po/po.types";
import type { MeqsSupplierAttachment } from "./meqs-supplier-attachment";
import type { MeqsSupplierItem } from "./meqs-supplier-item";
import type { MEQS } from "./meqs.types";
import type { VAT_TYPE } from "~/composables/common.types";

export interface MeqsSupplier {
    id: string;
    meqs: MEQS;
    supplier: Supplier;
    payment_terms: string;
    is_referenced: boolean;
    meqs_supplier_items: MeqsSupplierItem[];
    attachments: MeqsSupplierAttachment[];
    po?: PO
  }
  
export interface Supplier {
      id: string;
      name: string;
      contact: string;
      vat_type: VAT_TYPE,
      is_deleted: boolean;
}