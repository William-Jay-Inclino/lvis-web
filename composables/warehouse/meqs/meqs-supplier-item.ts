import type { VAT_TYPE } from "#imports";
import type { CanvassItem } from "../canvass/canvass-item.types";
import type { MeqsSupplier } from "./meqs-supplier";

export interface MeqsSupplierItem {
    id: string;
    meqs_supplier: MeqsSupplier;
    canvass_item: CanvassItem;
    price: number;
    notes?: string | null;
    is_awarded: boolean;
    vat_type: VAT_TYPE
}