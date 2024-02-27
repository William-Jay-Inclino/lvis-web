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