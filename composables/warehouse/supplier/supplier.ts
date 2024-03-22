import type { VAT_TYPE } from "#imports";


export interface Supplier {
    id: string;
    name: string;
    contact: string;
    vat_type: VAT_TYPE;
}


export interface CreateSupplierInput {
    name: string;
    contact: string;
    vat_type: VAT_TYPE;
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Supplier
}